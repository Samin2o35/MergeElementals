import {
    _decorator, Component, Node, Input, EventTouch,
    Vec2, Vec3, Camera, UITransform, CircleCollider2D, ERigidBody2DType, math,
} from 'cc';
import { Egg } from './Egg';

const { ccclass, property } = _decorator;

/**
 * Tasty-Travels style launcher. Press + drag slides the launcher along X
 * (clamped to the table), release shoots the egg. Because the board is in
 * perspective, the shot tilts with position: left edge -maxAimAngleDeg,
 * centre 0, right edge +maxAimAngleDeg.
 *
 * The held egg is reparented UNDER the launcher while docked (so it renders
 * above the aim line and follows the slide), then reparented back to its
 * original container on launch.
 */
@ccclass('Launcher')
export class Launcher extends Component {

    /** Node that receives touch input — usually the Board play surface. */
    @property(Node) inputArea: Node = null!;
    /** Camera used to convert screen touches to world space. REQUIRED. */
    @property(Camera) gameCamera: Camera = null!;
    /** Table/board node — its world bounds define the X slide range. */
    @property(Node) boundsNode: Node = null!;

    @property({ tooltip: 'How far inside the table edges the launcher can slide (px). Higher = stays more central, off the rails.' })
    wallInset: number = 40;

    /** Aim guide (the Line sprite). Keep it a child of Launcher; set its anchor Y to 0 so it pivots from the base. */
    @property(Node) aimGuide: Node = null!;

    @property({ tooltip: 'Initial speed straight up the table. Higher = flies faster/further (hits back wall harder).' })
    launchSpeed: number = 30;

    @property({ tooltip: 'Shot tilt at the table edges (deg) for the perspective lane. Left edge = -this, centre = 0, right edge = +this. Negate to converge inward.' })
    maxAimAngleDeg: number = 10;

    @property({ tooltip: 'ON = aim line always shown while an egg is docked. OFF = only while dragging.' })
    aimAlwaysVisible: boolean = false;

    private _minX: number = 0;
    private _maxX: number = 0;
    private _currentEgg: Egg | null = null;
    private _dockParent: Node | null = null;
    private _aiming: boolean = false;
    private _onLaunched: (() => void) | null = null;
    private _locked: boolean = true;

    start() {
        this.computeBounds();
        const area = this.inputArea ?? this.node;
        area.on(Input.EventType.TOUCH_START,  this.onTouchStart, this);
        area.on(Input.EventType.TOUCH_MOVE,   this.onTouchMove,  this);
        area.on(Input.EventType.TOUCH_END,    this.onTouchEnd,   this);
        area.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd,   this);
        this.updateAimVisibility();
    }

    onDestroy() {
        const area = this.inputArea ?? this.node;
        area.off(Input.EventType.TOUCH_START,  this.onTouchStart, this);
        area.off(Input.EventType.TOUCH_MOVE,   this.onTouchMove,  this);
        area.off(Input.EventType.TOUCH_END,    this.onTouchEnd,   this);
        area.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd,   this);
    }

    /** Dock an egg in the launcher; onLaunched fires on throw. */
    public loadEgg(egg: Egg, onLaunched: () => void) {
        this._currentEgg = egg;
        this._onLaunched = onLaunched;
        this._dockParent = egg.node.parent;            // remember the Eggs container

        egg.setBodyType(ERigidBody2DType.Kinematic);   // manually-moved while held
        egg.stopMotion();
        egg.mergeable = false;

        egg.node.setParent(this.node, false);          // dock under launcher (renders above the Line child)
        egg.node.setPosition(0, 0, 0);                 // sit at the launcher origin

        this._locked = false;
        this.updateAimVisibility();
        this.updateAim();
    }

    /** Stop accepting input (win/lose). */
    public disable() {
        this._locked = true;
        this._aiming = false;
        if (this.aimGuide) this.aimGuide.active = false;
    }

    private onTouchStart(_e: EventTouch) {
        if (this._locked || !this._currentEgg) return;
        this._aiming = true;
        this.updateAimVisibility();
        this.updateAim();
    }

    private onTouchMove(e: EventTouch) {
        if (!this._aiming) return;
        const p = e.getLocation(); // screen pixels
        this.slideTo(p.x, p.y);
    }

    private onTouchEnd(_e: EventTouch) {
        if (!this._aiming || this._locked || !this._currentEgg) {
            this._aiming = false;
            return;
        }
        this._aiming = false;
        this._locked = true;

        const egg = this._currentEgg;
        const dir = this.currentAimDir();              // capture before clearing
        egg.node.setParent(this._dockParent, true);    // back to Eggs container, keep world pos
        this._currentEgg = null;
        this.updateAimVisibility();                    // no egg => hidden
        egg.launch(dir, this.launchSpeed);
        this._onLaunched?.();
    }

    /** Move launcher (and its docked egg + aim line children) to a clamped world X. */
    private slideTo(screenX: number, screenY: number) {
        const r = this.heldRadiusWorld(); // keep the whole egg inside, not just its center
        const wx = math.clamp(this.screenToWorldX(screenX, screenY), this._minX + r, this._maxX - r);
        const wp = this.node.worldPosition;
        this.node.setWorldPosition(wx, wp.y, wp.z);
        this.updateAim();
    }

    /** Rotate the aim line to preview the (position-based) shot tilt. */
    private updateAim() {
        if (this.aimGuide) this.aimGuide.angle = -this.currentAimAngleDeg();
    }

    /** Aim line shown when an egg is docked and (always-visible OR actively aiming). */
    private updateAimVisibility() {
        if (!this.aimGuide) return;
        this.aimGuide.active = !!this._currentEgg && (this.aimAlwaysVisible || this._aiming);
    }

    /** Tilt in degrees from the launcher's X: -max at left edge, 0 centre, +max at right edge. */
    private currentAimAngleDeg(): number {
        const r = this.heldRadiusWorld();
        const lo = this._minX + r;
        const hi = this._maxX - r;
        const half = (hi - lo) / 2;
        if (half <= 0.0001) return 0;
        const center = (lo + hi) / 2;
        const t = math.clamp((this.node.worldPosition.x - center) / half, -1, 1);
        return -t * this.maxAimAngleDeg; // left edge => lean right, right edge => lean left
    }

    /** Launch direction matching the current tilt (straight up = (0,1)). */
    private currentAimDir(): Vec2 {
        const a = math.toRadian(this.currentAimAngleDeg());
        return new Vec2(Math.sin(a), Math.cos(a));
    }

    private heldRadiusWorld(): number {
        if (!this._currentEgg) return 0;
        const col = this._currentEgg.getComponent(CircleCollider2D);
        if (!col) return 0;
        return col.radius * Math.abs(this._currentEgg.node.worldScale.x);
    }

    private screenToWorldX(screenX: number, screenY: number): number {
        if (this.gameCamera) {
            const out = new Vec3();
            this.gameCamera.screenToWorld(new Vec3(screenX, screenY, 0), out);
            return out.x;
        }
        return screenX;
    }

    private computeBounds() {
        const ref = this.boundsNode ?? this.inputArea;
        const uit = ref ? ref.getComponent(UITransform) : null;
        if (!uit) { this._minX = -300; this._maxX = 300; return; }
        const bb = uit.getBoundingBoxToWorld();
        this._minX = bb.xMin + this.wallInset;
        this._maxX = bb.xMax - this.wallInset;
    }
}