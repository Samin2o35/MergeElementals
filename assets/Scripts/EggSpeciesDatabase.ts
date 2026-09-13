import { _decorator, Component, Prefab, SpriteFrame, CCInteger, CCFloat, CCString } from 'cc';
import { EggSpecies, EggVariant } from './EggTypes';

const { ccclass, property } = _decorator;

/** Flat pool of every species plus the fixed opening tiers. Lives on the Database node. */
@ccclass('EggSpeciesDatabase')
export class EggSpeciesDatabase extends Component {

    @property({ type: Prefab, tooltip: 'The one board egg prefab. Art and size come from species data.' })
    eggPrefab: Prefab = null!;

    @property({ type: [CCFloat], tooltip: 'Node scale per tier, low to high. Scales the collider too.' })
    tierScale: number[] = [0.55, 0.66, 0.78, 0.92, 1.08, 1.26, 1.46, 1.70, 1.96];

    @property({ type: [EggSpecies] })
    species: EggSpecies[] = [];

    @property({ type: [CCString], tooltip: 'Species ids for the fixed opening tiers, in order. Length sets how many tiers are not forked.' })
    baseLadder: string[] = [];

    @property({ type: CCInteger, tooltip: 'Total rungs on the ladder. Top rung ascends instead of merging up.' })
    ladderSize: number = 9;

    @property({ type: [CCInteger], tooltip: '0-based tiers that trigger a fork choice.' })
    forkTiers: number[] = [3, 5, 7];

    @property(SpriteFrame) lockedIconNormal: SpriteFrame = null!;
    @property(SpriteFrame) lockedIconGold: SpriteFrame = null!;

    private _byId: Map<string, EggSpecies> = new Map();

    onLoad() {
        for (const s of this.species) {
            if (!s.id) { console.warn('[Database] species with empty id skipped'); continue; }
            if (this._byId.has(s.id)) console.warn(`[Database] duplicate species id "${s.id}"`);
            this._byId.set(s.id, s);
        }
        this.validate();
    }

    /** Surfaces the data mistakes that fail silently at runtime. */
    private validate() {
        for (const s of this.species) {
            const n = s.fuseParents.filter(p => !!p).length;
            if (n === 1 || n > 2) {
                console.warn(`[Database] "${s.id}" has ${n} fuseParents. Use 0 (forkable) or 2 (alt form).`);
            }
            if (n === 2) {
                for (const p of s.fuseParents) {
                    if (!this._byId.has(p)) console.warn(`[Database] "${s.id}" fuseParent "${p}" is not a species id.`);
                }
            }
            if (!s.iconNormal) console.warn(`[Database] "${s.id}" has no iconNormal.`);
        }
        for (const id of this.baseLadder) {
            if (!this._byId.has(id)) console.warn(`[Database] baseLadder id "${id}" is not a species id.`);
        }
        if (this.tierScale.length < this.ladderSize) {
            console.warn(`[Database] tierScale has ${this.tierScale.length} entries but ladderSize is ${this.ladderSize}.`);
        }
    }

    public get(id: string): EggSpecies | null {
        return this._byId.get(id) ?? null;
    }

    public get topTier(): number { return this.ladderSize - 1; }

    public scaleFor(tier: number): number {
        if (!this.tierScale.length) return 1;
        return this.tierScale[Math.min(Math.max(tier, 0), this.tierScale.length - 1)];
    }

    public isForkTier(tier: number): boolean { return this.forkTiers.indexOf(tier) >= 0; }

    /** Species eligible to be offered at a fork for this tier. */
    public forkCandidates(tier: number, family: string, exclude: Set<string>): EggSpecies[] {
        return this.species.filter(s =>
            !s.isAltForm &&
            !exclude.has(s.id) &&
            tier >= s.minTier && tier <= s.maxTier &&
            (family === '' || s.family === family)
        );
    }

    /** Alt form produced by fusing two different species, or null if no recipe exists. */
    public findFusion(idA: string, idB: string): EggSpecies | null {
        for (const s of this.species) {
            if (!s.isAltForm) continue;
            const [p, q] = s.fuseParents;
            if ((p === idA && q === idB) || (p === idB && q === idA)) return s;
        }
        return null;
    }

    public lockedIcon(v: EggVariant): SpriteFrame {
        return v === EggVariant.Gold ? this.lockedIconGold : this.lockedIconNormal;
    }

    /** Every (species, variant) pair, in inspector order. Codex cell order. */
    public allEntries(): { species: EggSpecies; variant: EggVariant }[] {
        const out: { species: EggSpecies; variant: EggVariant }[] = [];
        for (const s of this.species) {
            out.push({ species: s, variant: EggVariant.Normal });
            out.push({ species: s, variant: EggVariant.Gold });
        }
        return out;
    }
}