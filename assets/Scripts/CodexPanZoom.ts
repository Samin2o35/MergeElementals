import {
    _decorator, Component, Node, Input, EventTouch, Vec2, Vec3,
    UITransform, tween, Tween, CCFloat, math,
} from 'cc';

const { ccclass, property } = _decorator;

/**
 * Pinch to zoom and drag to pan a viewport node. Also drives the reveal tour's
 * camera moves via focusOn.
 *
 * Input is taken on `inputArea` (the full-screen overlay root) rather than on
 * the viewport itself, so panning keeps working once the art is dragged
 * off-centre.
 */
@ccclass('CodexPanZoom')
export class CodexPanZoom extends Component {

    @property({ type: Node, tooltip: 'Node that is scaled and moved. Parent of Book and Pages.' })
    viewport: Node = null!;

    @property({ type: Node, tooltip: 'Node that receives touches. Usually the overlay root or its dim layer.' })
    inputArea: Node = null!;

    @property({ type: CCFloat }) minZoom: number = 1.0;
    @property({ type: CCFloat }) maxZoom: number = 3.5;

    @property({ type: CCFloat, tooltip: 'How far past the viewport edge panning may go, as a fraction of its size.' })
    panSlack: number = 0.35;

    private _base: Vec3 = new Vec3(1, 1, 1);
    private _home: Vec3 = new Vec3();
    private _zoom: number = 1;
    private _locked: boolean = false;

    private _dragging: boolean = false;
    private _last: Vec2 = new Vec2();
    private _pinchDist: number = 0;

    onLoad() {
        this._base = this.viewport.scale.clone();
        this._home = this.viewport.position.clone();

        const area = this.inputArea ?? this.node;
        area.on(Input.EventType.TOUCH_START, this.onStart, this);
        area.on(Input.EventType.TOUCH_MOVE, this.onMove, this);
        area.on(Input.EventType.TOUCH_END, this.onEnd, this);
        area.on(Input.EventType.TOUCH_CANCEL, this.onEnd, this);
    }

    onDestroy() {
        const area = this.inputArea ?? this.node;
        area.off(Input.EventType.TOUCH_START, this.onStart, this);
        area.off(Input.EventType.TOUCH_MOVE, this.onMove, this);
        area.off(Input.EventType.TOUCH_END, this.onEnd, this);
        area.off(Input.EventType.TOUCH_CANCEL, this.onEnd, this);
    }

    /** Snap back to the authored framing. Call when the book closes. */
    public reset() {
        Tween.stopAllByTarget(this.viewport);
        this._zoom = 1;
        this._dragging = false;
        this._pinchDist = 0;
        this.viewport.setScale(this._base);
        this.viewport.setPosition(this._home);
    }

    /** Blocks user input during the reveal tour. */
    public setLocked(v: boolean) {
        this._locked = v;
        if (v) { this._dragging = false; this._pinchDist = 0; }
    }

    /** Centre `target` in the viewport at `zoom`, animated. */
    public focusOn(target: Node, zoom: number, duration: number, onDone?: () => void) {
        Tween.stopAllByTarget(this.viewport);
        const z = math.clamp(zoom, this.minZoom, this.maxZoom);
        const pos = this.positionFor(target, z);
        this._zoom = z;

        tween(this.viewport)
            .to(duration, {
                scale: new Vec3(this._base.x * z, this._base.y * z, this._base.z),
                position: pos,
            }, { easing: 'quadInOut' })
            .call(() => onDone?.())
            .start();
    }

    /** Animate back to the authored framing. */
    public focusHome(duration: number, onDone?: () => void) {
        Tween.stopAllByTarget(this.viewport);
        this._zoom = 1;
        tween(this.viewport)
            .to(duration, { scale: this._base.clone(), position: this._home.clone() }, { easing: 'quadInOut' })
            .call(() => onDone?.())
            .start();
    }

    /** Viewport position that puts `target` at the centre of the overlay. */
    private positionFor(target: Node, zoom: number): Vec3 {
        const local = new Vec3();
        this.viewport.inverseTransformPoint(local, target.worldPosition);

        const centre = this.node.worldPosition;
        const world = new Vec3(
            centre.x - local.x * this._base.x * zoom,
            centre.y - local.y * this._base.y * zoom,
            this.viewport.worldPosition.z,
        );

        const parent = this.viewport.parent!;
        const out = new Vec3();
        parent.inverseTransformPoint(out, world);
        return out;
    }

    // ── Input ────────────────────────────────────────────────────────────

    private onStart(e: EventTouch) {
        if (this._locked) return;
        const t = e.getTouches();
        if (t.length >= 2) {
            this._pinchDist = Vec2.distance(t[0].getLocation(), t[1].getLocation());
            this._dragging = false;
        } else {
            this._dragging = true;
            this._last = e.getLocation().clone();
        }
    }

    private onMove(e: EventTouch) {
        if (this._locked) return;
        const t = e.getTouches();

        if (t.length >= 2) {
            const d = Vec2.distance(t[0].getLocation(), t[1].getLocation());
            if (this._pinchDist > 0.001) this.applyZoom(this._zoom * (d / this._pinchDist));
            this._pinchDist = d;
            this._dragging = false;
            return;
        }

        if (!this._dragging) return;
        const p = e.getLocation();
        this.pan(p.x - this._last.x, p.y - this._last.y);
        this._last = p.clone();
    }

    private onEnd(_e: EventTouch) {
        this._dragging = false;
        this._pinchDist = 0;
    }

    private applyZoom(z: number) {
        this._zoom = math.clamp(z, this.minZoom, this.maxZoom);
        this.viewport.setScale(this._base.x * this._zoom, this._base.y * this._zoom, this._base.z);
        this.pan(0, 0);   // re-clamp; zooming out can leave the art off-screen
    }

    private pan(dx: number, dy: number) {
        const ut = this.viewport.getComponent(UITransform);
        const p = this.viewport.position;

        let x = p.x + dx;
        let y = p.y + dy;

        if (ut) {
            const w = ut.width * this._base.x * this._zoom;
            const h = ut.height * this._base.y * this._zoom;
            const slackX = w * this.panSlack;
            const slackY = h * this.panSlack;
            x = math.clamp(x, this._home.x - w / 2 - slackX, this._home.x + w / 2 + slackX);
            y = math.clamp(y, this._home.y - h / 2 - slackY, this._home.y + h / 2 + slackY);
        }

        this.viewport.setPosition(x, y, p.z);
    }
}