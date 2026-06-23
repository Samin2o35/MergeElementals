import {
    _decorator, Component, Sprite, SpriteFrame,
    RigidBody2D, CircleCollider2D, Collider2D, Contact2DType,
    ERigidBody2DType, Vec2,
} from 'cc';

const { ccclass, property } = _decorator;

export interface EggInitOpts {
    tier: number;
    linearDamping: number;
    restitution: number;
    friction: number;
    density: number;
    /** Fired on ANY begin-contact. `other` is the Egg hit, or null for a wall. */
    contactCb: (self: Egg, other: Egg | null) => void;
}

/**
 * Lives on the SHADOW root node of each egg prefab (shadow = parent, art = child).
 * Reports contacts to the controller, which decides merge vs egg-hit vs wall-hit.
 */
@ccclass('Egg')
export class Egg extends Component {

    @property(Sprite) eggArt: Sprite = null!;

    @property({ tooltip: 'Spin speed (deg/sec) for tier 1, the slowest tier.' })
    spinBaseDeg: number = 30;

    @property({ tooltip: 'Extra deg/sec added per tier. tier spin = base + tierIndex * step.' })
    spinStepDeg: number = 30;

    public tier: number = 0;
    public mergeable: boolean = true;     // false while docked in the launcher
    public consumed: boolean = false;     // guards double-merge
    public launched: boolean = false;
    public enteredField: boolean = false; // crossed above the lose line once

    private _rb: RigidBody2D = null!;
    private _col: CircleCollider2D = null!;
    private _contactCb: ((a: Egg, b: Egg | null) => void) | null = null;

    onLoad() {
        this._rb  = this.getComponent(RigidBody2D)!;
        this._col = this.getComponent(CircleCollider2D)!;
        if (this._col) this._col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onDestroy() {
        if (this._col) this._col.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    update(dt: number) {
        // Visual-only spin on the art child; body has Fixed Rotation so physics is untouched.
        if (!this.eggArt) return;
        const speed = this.spinBaseDeg + this.tier * this.spinStepDeg;
        this.eggArt.node.angle = (this.eggArt.node.angle - speed * dt) % 360;
    }

    /** Swap the piece art (used on spawn and on theme change). Tier/physics unchanged. */
    public setArt(frame: SpriteFrame | null) {
        if (frame && this.eggArt) this.eggArt.spriteFrame = frame;
    }

    /** Call BEFORE addChild — sets serialized physics values read on fixture creation. */
    public init(o: EggInitOpts) {
        this.tier         = o.tier;
        this.consumed     = false;
        this.launched     = false;
        this.enteredField = false;
        this.mergeable    = true;
        this._contactCb   = o.contactCb;

        const col = this.getComponent(CircleCollider2D);
        if (col) {
            col.restitution = o.restitution;
            col.friction    = o.friction;
            col.density     = o.density;
        }
        const rb = this.getComponent(RigidBody2D);
        if (rb) rb.linearDamping = o.linearDamping;
    }

    public setBodyType(type: ERigidBody2DType) {
        const rb = this._rb ?? this.getComponent(RigidBody2D);
        if (rb) rb.type = type;
    }

    public launch(dir: Vec2, speed: number) {
        this.launched  = true;
        this.mergeable = true;
        if (!this._rb) return;
        this._rb.type = ERigidBody2DType.Dynamic;
        this._rb.linearVelocity = dir.clone().normalize().multiplyScalar(speed);
    }

    public stopMotion() {
        if (!this._rb) return;
        this._rb.linearVelocity = new Vec2(0, 0);
        this._rb.angularVelocity = 0;
    }

    public getSpeed(): number {
        return this._rb ? this._rb.linearVelocity.length() : 0;
    }

    public getVelocity(): Vec2 {
        return this._rb ? this._rb.linearVelocity.clone() : new Vec2(0, 0);
    }

    public setVelocity(v: Vec2) {
        if (this._rb) this._rb.linearVelocity = v;
    }

    private _mergeReadyAt: number = 0;

    /** Block this egg from merging for `seconds` (lets a fresh merge's pop-in finish). */
    public setMergeGrace(seconds: number) {
        this._mergeReadyAt = Date.now() / 1000 + seconds;
    }

    public get canMerge(): boolean {
        return Date.now() / 1000 >= this._mergeReadyAt;
    }

    private onBeginContact(_self: Collider2D, other: Collider2D) {
        if (this.consumed) return;
        const o = other.getComponent(Egg); // null => wall
        this._contactCb?.(this, o);
    }
}