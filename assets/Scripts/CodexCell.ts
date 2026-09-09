import { _decorator, Component, Sprite, tween } from 'cc';
import { EggSpeciesDatabase } from './EggSpeciesDatabase';
import { EggSpecies, EggVariant } from './EggTypes';
import { CodexStore } from './CodexStore';
import { EggFX } from './EggFX';

const { ccclass, property } = _decorator;

/** One grid slot. Shows the `?` icon until its pair is unlocked. */
@ccclass('CodexCell')
export class CodexCell extends Component {

    @property(Sprite) icon: Sprite = null!;
    @property(EggFX) fx: EggFX = null!;

    private _species: EggSpecies | null = null;
    private _variant: EggVariant = EggVariant.Normal;

    public get species(): EggSpecies | null { return this._species; }
    public get variant(): EggVariant { return this._variant; }

    public bind(db: EggSpeciesDatabase, s: EggSpecies | null, v: EggVariant) {
        this._species = s;
        this._variant = v;
        this.node.active = !!s;
        if (!s || !this.icon) return;
        this.icon.spriteFrame = CodexStore.isUnlocked(s.id, v) ? s.icon(v) : db.lockedIcon(v);
    }

    public matches(s: EggSpecies, v: EggVariant): boolean {
        return this._species?.id === s.id && this._variant === v;
    }

    /** Dissolves the `?` into the real icon using the species' own profile. */
    public reveal(db: EggSpeciesDatabase, onDone?: () => void) {
        if (!this._species || !this.fx) { onDone?.(); return; }
        const s = this._species;
        this.fx.playReveal(s.fx, db.lockedIcon(this._variant), s.icon(this._variant),
            this._variant === EggVariant.Gold, () => {
                const base = this.node.scale.clone();
                tween(this.node)
                    .to(0.12, { scale: base.clone().multiplyScalar(1.25) }, { easing: 'quadOut' })
                    .to(0.16, { scale: base }, { easing: 'backOut' })
                    .call(() => onDone?.())
                    .start();
            });
    }
}