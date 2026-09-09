import {
    _decorator, Prefab, SpriteFrame, Texture2D, Color, Node, CCInteger, CCFloat, CCString,
} from 'cc';

const { ccclass, property } = _decorator;

export enum EggVariant { Normal = 0, Gold = 1 }

/** Per-species look + sound. Drives the shared EggFX shader; no per-species shader needed. */
@ccclass('EggFxProfile')
export class EggFxProfile {
    @property({ type: Texture2D, tooltip: 'Greyscale pattern that shapes the dissolve (flakes, spiral, cracks...).' })
    mask: Texture2D = null!;

    @property({ tooltip: 'Burn edge colour at the leading edge.' })
    colorA: Color = new Color(255, 255, 255, 255);

    @property({ tooltip: 'Burn edge colour trailing behind colorA.' })
    colorB: Color = new Color(255, 210, 90, 255);

    @property({ type: CCFloat, tooltip: 'Mask tiling. Higher = finer detail.' })
    maskScale: number = 2.0;

    @property({ type: CCFloat, tooltip: 'Mask scroll speed.' })
    scrollSpeed: number = 0.4;

    @property({ type: CCFloat, tooltip: 'Dissolve edge width. Lower = harder edge.' })
    edgeSoftness: number = 0.18;

    @property({ type: CCFloat, tooltip: 'UV twist at the centre, radians. 0 = no swirl.' })
    twist: number = 0;

    @property({ type: CCFloat, tooltip: 'Radial push outward as progress runs.' })
    distortion: number = 0.12;

    @property({ type: CCFloat, tooltip: 'Additive glow strength.' })
    glow: number = 0.7;

    @property({ type: Prefab, tooltip: 'Optional ParticleSystem2D prefab layered on top.' })
    particles: Prefab = null!;

    @property({ type: Node, tooltip: 'Node holding this species AudioContent.' })
    sfx: Node = null!;
}

/** One entry in the species pool. Ladder position is decided per run, not here. */
@ccclass('EggSpecies')
export class EggSpecies {
    @property({ tooltip: 'Stable unique key. Used in save data — never rename after release.' })
    id: string = '';

    @property
    displayName: string = '';

    @property({ tooltip: 'Lineage group. A fork offers species from the running family.' })
    family: string = '';

    @property({ type: SpriteFrame, tooltip: 'UI icon (Next Up, chart, codex).' })
    iconNormal: SpriteFrame = null!;
    @property(SpriteFrame) iconGold: SpriteFrame = null!;

    @property({ type: SpriteFrame, tooltip: 'Board art. Falls back to the icon when empty.' })
    boardNormal: SpriteFrame = null!;
    @property(SpriteFrame) boardGold: SpriteFrame = null!;

    @property({ type: CCInteger, tooltip: 'Lowest ladder slot this may occupy (0-based).' })
    minTier: number = 3;

    @property({ type: CCInteger, tooltip: 'Highest ladder slot this may occupy (0-based).' })
    maxTier: number = 8;

    @property({ type: [CCString], tooltip: 'Two species ids. Non-empty = alt form, reachable only by cross-fusion and never offered at a fork.' })
    fuseParents: string[] = [];

    @property(EggFxProfile)
    fx: EggFxProfile = new EggFxProfile();

    public get isAltForm(): boolean { return this.fuseParents.length === 2; }

    public icon(v: EggVariant): SpriteFrame {
        return v === EggVariant.Gold && this.iconGold ? this.iconGold : this.iconNormal;
    }

    public boardArt(v: EggVariant): SpriteFrame {
        const a = v === EggVariant.Gold ? (this.boardGold ?? this.iconGold) : (this.boardNormal ?? this.iconNormal);
        return a ?? this.icon(v);
    }
}