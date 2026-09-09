import {
    _decorator, Component, Sprite, SpriteFrame, UITransform, Material,
    Vec4, Node, instantiate, Color,
} from 'cc';
import { EggFxProfile } from './EggTypes';
import { GlobalAudioManager } from './GlobalAudioManager';
import { AudioContent } from './AudioContent';

const { ccclass, property } = _decorator;

const GOLD_A = new Color(255, 236, 160, 255);
const GOLD_B = new Color(255, 186, 40, 255);

/**
 * Drives EggFX.effect. One shader, one material, many looks — identity comes from
 * the EggFxProfile, not from a per-species shader.
 */
@ccclass('EggFX')
export class EggFX extends Component {

    @property({ type: SpriteFrame, tooltip: 'Soft radial gradient used as the burst body.' })
    burstFrame: SpriteFrame = null!;

    @property({ tooltip: 'Seconds for a merge burst.' })
    burstDuration: number = 0.45;

    @property({ tooltip: 'Seconds for a codex reveal.' })
    revealDuration: number = 1.1;

    @property({ tooltip: 'Normalised point in a reveal where the frame swap happens.' })
    revealSwapAt: number = 0.5;

    private _sprite: Sprite = null!;
    private _mat: Material | null = null;

    private _mode: 0 | 1 | 2 = 0;   // 0 idle, 1 burst, 2 reveal
    private _t = 0;
    private _dur = 0;
    private _swapped = false;
    private _revealTo: SpriteFrame | null = null;
    private _onDone: (() => void) | null = null;
    private _destroyOnDone = true;

    private _params = new Vec4();
    private _shape = new Vec4();
    private _distort = new Vec4();
    private _colA = new Vec4();
    private _colB = new Vec4();
    private _aspect = 1;

    // ── Public ───────────────────────────────────────────────────────────

    /** Merge burst. Destroys the node when finished. */
    public playBurst(profile: EggFxProfile, gold: boolean = false) {
        this._sprite = this.getComponent(Sprite)!;
        if (this.burstFrame) this._sprite.spriteFrame = this.burstFrame;
        this.apply(profile, gold);
        this.spawnParticles(profile);
        this.playSfx(profile);

        this._mode = 1;
        this._t = 0;
        this._dur = Math.max(this.burstDuration, 0.0001);
        this._destroyOnDone = true;
        this.push(0, 0);
    }

    /** Codex reveal: `?` icon dissolves into the real icon. Keeps the node alive. */
    public playReveal(profile: EggFxProfile, from: SpriteFrame, to: SpriteFrame, gold: boolean, onDone?: () => void) {
        this._sprite = this.getComponent(Sprite)!;
        this._sprite.spriteFrame = from;
        this.apply(profile, gold);
        this.setNext(to);
        this.playSfx(profile);

        this._revealTo = to;
        this._swapped = false;
        this._onDone = onDone ?? null;
        this._mode = 2;
        this._t = 0;
        this._dur = Math.max(this.revealDuration, 0.0001);
        this._destroyOnDone = false;
        this.push(0, 0);
    }

    // ── Loop ─────────────────────────────────────────────────────────────

    update(dt: number) {
        if (this._mode === 0) return;
        this._t += dt;
        const k = Math.min(this._t / this._dur, 1);

        if (this._mode === 1) {
            this.push(k, 0);
            if (k >= 1) this.finish();
            return;
        }

        // Reveal: blend peaks at the swap point, where both samples land on the same uv.
        const blend = k < this.revealSwapAt ? 0 : 1;
        const wave = k < this.revealSwapAt
            ? k / this.revealSwapAt
            : 1 - (k - this.revealSwapAt) / (1 - this.revealSwapAt);
        this.push(wave * 0.85, blend);

        if (!this._swapped && k >= this.revealSwapAt) {
            this._swapped = true;
            if (this._revealTo) this._sprite.spriteFrame = this._revealTo;
            this.grabMaterial();
        }
        if (k >= 1) this.finish();
    }

    private finish() {
        this._mode = 0;
        this.push(0, this._swapped ? 1 : 0);
        const cb = this._onDone;
        this._onDone = null;
        cb?.();
        if (this._destroyOnDone && this.node.isValid) this.node.destroy();
    }

    // ── Material ─────────────────────────────────────────────────────────

    private apply(p: EggFxProfile, gold: boolean) {
        this.grabMaterial();
        if (this._mat && p.mask) this._mat.setProperty('maskTexture', p.mask);

        const a = gold ? GOLD_A : p.colorA;
        const b = gold ? GOLD_B : p.colorB;
        this._colA.set(a.r / 255, a.g / 255, a.b / 255, 1);
        this._colB.set(b.r / 255, b.g / 255, b.b / 255, 1);
        this._shape.set(p.maskScale, p.scrollSpeed, p.edgeSoftness, p.twist);
        this._distort.set(p.distortion, p.glow, 0, 0);

        if (!this._mat) return;
        this._mat.setProperty('fxShape', this._shape);
        this._mat.setProperty('fxDistort', this._distort);
        this._mat.setProperty('fxColorA', this._colA);
        this._mat.setProperty('fxColorB', this._colB);
    }

    /** Re-fetch after any spriteFrame change — that can rebuild the material defines. */
    private grabMaterial() {
        const sp = this._sprite ?? this.getComponent(Sprite)!;
        this._mat = sp?.getMaterialInstance(0) ?? null;
        if (!this._mat) { console.warn('[EggFX] no material instance — set Custom Material on the Sprite.'); return; }

        const ut = this.getComponent(UITransform);
        this._aspect = (ut && ut.height > 0.0001) ? ut.width / ut.height : 1;
    }

    private setNext(frame: SpriteFrame | null) {
        if (this._mat && frame?.texture) this._mat.setProperty('nextTexture', frame.texture);
    }

    private push(progress: number, blend: number) {
        if (!this._mat) return;
        this._params.set(progress, 1.0, blend, this._aspect);
        this._mat.setProperty('fxParams', this._params);
    }

    // ── Extras ───────────────────────────────────────────────────────────

    private spawnParticles(p: EggFxProfile) {
        if (!p.particles) return;
        const n: Node = instantiate(p.particles);
        this.node.addChild(n);
        n.setPosition(0, 0, 0);
    }

    private playSfx(p: EggFxProfile) {
        if (!p.sfx || !GlobalAudioManager.instance) return;
        const ac = p.sfx.getComponent(AudioContent);
        if (ac) GlobalAudioManager.instance.playOneShot(ac);
    }
}