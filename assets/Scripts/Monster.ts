import {
    _decorator, Component, Sprite, Color, Vec3, Node, Prefab, instantiate,
    tween, Tween, UIOpacity,
} from 'cc';
import { FloatingText } from './FloatingText';
import { CameraShake } from './CameraShake';

const { ccclass, property } = _decorator;

export interface MonsterInit {
    theme: number;
    maxHP: number;
    maxRage: number;
    rageFillPerSec: number;
    rageFillOnHit: number;
    piecesPerAttack: number;
    immuneThemes: number[];
    isBoss: boolean;
    attackScale: number;
    floatingTextPrefab: Prefab | null;
    fxLayer: Node | null;
    attackCb: (m: Monster) => void;  // run at the peak of the attack (destroy pieces)
    deathCb: (m: Monster) => void;   // run when HP hits 0
}

@ccclass('Monster')
export class Monster extends Component {

    @property(Sprite) bodySprite: Sprite = null!;
    @property(Sprite) hpFill: Sprite = null!;    // Type = FILLED
    @property(Sprite) rageFill: Sprite = null!;  // Type = FILLED

    public theme: number = 0;
    public isBoss: boolean = false;
    public immuneThemes: number[] = [];

    private _maxHP = 10;  private _hp = 10;
    private _maxRage = 10; private _rage = 0;
    private _rageFillPerSec = 0.7; private _rageFillOnHit = 1;
    private _piecesPerAttack = 1;
    private _attackScale = 1.15;
    private _ftPrefab: Prefab | null = null;
    private _fxLayer: Node | null = null;
    private _attackCb: (m: Monster) => void = () => {};
    private _deathCb: (m: Monster) => void = () => {};
    private _baseScale: Vec3 = new Vec3(1, 1, 1);
    private _dead = false;
    private _attacking = false;

    public init(o: MonsterInit) {
        this.theme = o.theme;
        this.isBoss = o.isBoss;
        this.immuneThemes = o.immuneThemes.slice();
        this._maxHP = o.maxHP;  this._hp = o.maxHP;
        this._maxRage = o.maxRage; this._rage = 0;
        this._rageFillPerSec = o.rageFillPerSec;
        this._rageFillOnHit = o.rageFillOnHit;
        this._piecesPerAttack = o.piecesPerAttack;
        this._attackScale = o.attackScale;
        this._ftPrefab = o.floatingTextPrefab;
        this._fxLayer = o.fxLayer;
        this._attackCb = o.attackCb;
        this._deathCb = o.deathCb;
        this._baseScale = this.node.scale.clone();
        this.updateBars();
    }

    public get piecesPerAttack(): number { return this._piecesPerAttack; }
    public get isDead(): boolean { return this._dead; }
    public isImmuneTo(theme: number): boolean { return this.immuneThemes.indexOf(theme) >= 0; }

    update(dt: number) {
        if (this._dead) return;
        this._rage = Math.min(this._maxRage, this._rage + this._rageFillPerSec * dt);
        this.updateRageBar();
        if (this._rage >= this._maxRage && !this._attacking) this.attack();
    }

    /** `amount` is already type-scaled; `mult` is only for the floating-text colour. */
    public takeDamage(amount: number, mult: number) {
        if (this._dead) return;
        if (amount > 0) {
            this._hp = Math.max(0, this._hp - amount);
            this._rage = Math.min(this._maxRage, this._rage + this._rageFillOnHit);
        }
        this.spawnFloatingText(amount, mult);
        this.hitFeedback();
        this.updateBars();
        CameraShake.instance?.shake(8, 0.12);
        if (this._hp <= 0) this.die();
    }

    private attack() {
        this._attacking = true;
        this._rage = 0;
        this.updateRageBar();
        const up = this._baseScale.clone().multiplyScalar(this._attackScale);
        tween(this.node)
            .to(0.15, { scale: up }, { easing: 'backOut' })
            .call(() => { this._attackCb(this); CameraShake.instance?.shake(14, 0.2); })
            .to(0.15, { scale: this._baseScale.clone() }, { easing: 'sineOut' })
            .call(() => { this._attacking = false; })
            .start();
    }

    private die() {
        this._dead = true;
        Tween.stopAllByTarget(this.node);
        const op = this.getComponent(UIOpacity) ?? this.addComponent(UIOpacity);
        tween(this.node).to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' }).start();
        tween(op).to(0.2, { opacity: 0 }).call(() => {
            this._deathCb(this);
            if (this.node.isValid) this.node.destroy();
        }).start();
    }

    private hitFeedback() {
        const p = this.node.position.clone();
        tween(this.node)
            .to(0.03, { position: new Vec3(p.x + 6, p.y, p.z) })
            .to(0.03, { position: new Vec3(p.x - 6, p.y, p.z) })
            .to(0.03, { position: new Vec3(p.x + 4, p.y, p.z) })
            .to(0.03, { position: p.clone() })
            .start();

        if (this.bodySprite) {
            const c = this.bodySprite.color.clone();
            const white = new Color(255, 255, 255, 255);
            tween(this.bodySprite)
                .to(0.05, { color: white }).to(0.05, { color: c })
                .to(0.05, { color: white }).to(0.05, { color: c })
                .start();
        }
    }

    private spawnFloatingText(amount: number, mult: number) {
        if (!this._ftPrefab) return;
        const n = instantiate(this._ftPrefab);
        (this._fxLayer ?? this.node).addChild(n);
        n.setWorldPosition(this.node.worldPosition);
        const ft = n.getComponent(FloatingText);
        if (!ft) return;

        let col = new Color(255, 255, 255, 255);
        let txt = Math.round(amount).toString();
        if (amount <= 0)      { txt = 'IMMUNE'; col = new Color(150, 150, 150, 255); }
        else if (mult >= 2)   { col = new Color(255, 210, 60, 255); }   // super-effective = gold
        else if (mult <= 0.5) { col = new Color(140, 170, 255, 255); }  // resisted = blue
        ft.show(txt, col);
    }

    private updateBars() { this.updateHpBar(); this.updateRageBar(); }
    private updateHpBar()   { if (this.hpFill)   this.hpFill.fillRange   = this._maxHP   > 0 ? this._hp   / this._maxHP   : 0; }
    private updateRageBar() { if (this.rageFill) this.rageFill.fillRange = this._maxRage > 0 ? this._rage / this._maxRage : 0; }
}