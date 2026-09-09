import {
    _decorator, Component, Sprite, SpriteFrame,
    RigidBody2D, CircleCollider2D, Collider2D, Contact2DType,
    ERigidBody2DType, Vec2,
} from 'cc';
import { EggVariant } from './EggTypes';

const { ccclass, property } = _decorator;

export interface EggInitOpts {
    tier: number;
    speciesId: string;
    variant: EggVariant;
    artFrame: SpriteFrame;
    scale: number;
    linearDamping: number;
    restitution: number;
    friction: number;
    density: number;
    contactCb: (self: Egg, other: Egg | null) => void;
}

/** Lives on the shadow root of each egg prefab. Reports contacts; the controller decides outcomes. */
@ccclass('Egg')
export class Egg extends Component {

    @property(Sprite) eggArt: Sprite = null!;

    public tier: number = 0;
    public speciesId: string = '';
    public variant: EggVariant = EggVariant.Normal;

    public mergeable: boolean = true;
    public consumed: boolean = false;
    public launched: boolean = false;
    public enteredField: boolean = false;

    private _rb: RigidBody2D = null!;
    private _col: CircleCollider2D = null!;
    private _contactCb: ((a: Egg, b: Egg | null) => void) | null = null;
    private _mergeReadyAt: number = 0;

    onLoad() {
        this._rb = this.getComponent(RigidBody2D)!;
        this._col = this.getComponent(CircleCollider2D)!;
        if (this._col) this._col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onDestroy() {
        if (this._col) this._col.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    /** Call BEFORE addChild — physics values are read when the fixture is created. */
    public init(o: EggInitOpts) {
        this.tier = o.tier;
        this.speciesId = o.speciesId;
        this.variant = o.variant;
        this.consumed = false;
        this.launched = false;
        this.enteredField = false;
        this.mergeable = true;
        this._contactCb = o.contactCb;

        if (this.eggArt && o.artFrame) this.eggArt.spriteFrame = o.artFrame;
        this.node.setScale(o.scale, o.scale, 1);

        const col = this.getComponent(CircleCollider2D);
        if (col) {
            col.restitution = o.restitution;
            col.friction = o.friction;
            col.density = o.density;
        }
        const rb = this.getComponent(RigidBody2D);
        if (rb) rb.linearDamping = o.linearDamping;
    }

    public get isGold(): boolean { return this.variant === EggVariant.Gold; }

    public setBodyType(type: ERigidBody2DType) {
        const rb = this._rb ?? this.getComponent(RigidBody2D);
        if (rb) rb.type = type;
    }

    public launch(dir: Vec2, speed: number) {
        this.launched = true;
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

    public getSpeed(): number { return this._rb ? this._rb.linearVelocity.length() : 0; }

    public getVelocity(): Vec2 { return this._rb ? this._rb.linearVelocity.clone() : new Vec2(0, 0); }

    public setVelocity(v: Vec2) { if (this._rb) this._rb.linearVelocity = v; }

    /** Blocks merging briefly so a fresh merge's pop-in can finish. */
    public setMergeGrace(seconds: number) { this._mergeReadyAt = Date.now() / 1000 + seconds; }

    public get canMerge(): boolean { return Date.now() / 1000 >= this._mergeReadyAt; }

    private onBeginContact(_self: Collider2D, other: Collider2D) {
        if (this.consumed) return;
        this._contactCb?.(this, other.getComponent(Egg));
    }
}