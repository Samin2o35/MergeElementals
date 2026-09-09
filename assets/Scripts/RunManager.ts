import { _decorator, Component, CCInteger, EventTarget } from 'cc';
import { EggSpeciesDatabase } from './EggSpeciesDatabase';
import { EggSpecies, EggVariant } from './EggTypes';
import { CodexStore, Heirloom } from './CodexStore';

const { ccclass, property } = _decorator;

export const RunEvent = {
    LADDER_CHANGED: 'ladder-changed',
    ESSENCE_CHANGED: 'essence-changed',
    TIER_CHANGED: 'tier-changed',       // (highestTier)
    FORK_REQUESTED: 'fork-requested',   // (tier, EggSpecies[])
    DISCOVERED: 'discovered',           // (EggSpecies, EggVariant)
};

/** Owns everything that is true for the current run. Nothing else caches tier -> species. */
@ccclass('RunManager')
export class RunManager extends Component {

    @property(EggSpeciesDatabase) db: EggSpeciesDatabase = null!;

    @property({ type: CCInteger, tooltip: 'Fork cards offered per choice.' })
    forkOptions: number = 3;

    @property({ type: CCInteger, tooltip: 'Essence per gold merge, multiplied by tier.' })
    goldEssence: number = 5;

    @property({ type: CCInteger, tooltip: 'Essence for an ascension.' })
    ascendEssence: number = 50;

    @property({ type: CCInteger, tooltip: 'Shot number on which the heirloom is docked.' })
    heirloomShot: number = 5;

    public readonly events = new EventTarget();

    private _ladder: (EggSpecies | null)[] = [];
    private _family: string = '';
    private _used: Set<string> = new Set();
    private _paused: boolean = false;

    private _runEssence: number = 0;
    private _highestTier: number = 0;
    private _ascensions: number = 0;
    private _discoveries: { species: EggSpecies; variant: EggVariant }[] = [];

    private _heirloom: Heirloom | null = null;
    private _heirloomUsed: boolean = false;
    private _shots: number = 0;

    // ── Lifecycle ────────────────────────────────────────────────────────

    public beginRun() {
        this._ladder = new Array(this.db.ladderSize).fill(null);
        this._family = '';
        this._used.clear();
        this._paused = false;
        this._runEssence = 0;
        this._highestTier = 0;
        this._ascensions = 0;
        this._discoveries = [];
        this._heirloom = CodexStore.heirloom;
        this._heirloomUsed = false;
        this._shots = 0;

        for (let i = 0; i < this.db.baseLadder.length && i < this._ladder.length; i++) {
            const s = this.db.get(this.db.baseLadder[i]);
            if (s) { this._ladder[i] = s; this._used.add(s.id); }
        }
        this.autoFillUpTo(this.firstForkTier());
        this.events.emit(RunEvent.LADDER_CHANGED);
    }

    // ── Ladder ───────────────────────────────────────────────────────────

    public speciesAt(tier: number): EggSpecies | null {
        return (tier >= 0 && tier < this._ladder.length) ? this._ladder[tier] : null;
    }

    public get ladder(): ReadonlyArray<EggSpecies | null> { return this._ladder; }

    public get topTier(): number { return this.db.topTier; }

    public get paused(): boolean { return this._paused; }

    private firstForkTier(): number {
        for (let i = 0; i < this._ladder.length; i++) if (this.db.isForkTier(i)) return i;
        return this._ladder.length;
    }

    /** Fill every unassigned slot below `limit` from the running family. */
    private autoFillUpTo(limit: number) {
        for (let t = 0; t < limit && t < this._ladder.length; t++) {
            if (this._ladder[t]) continue;
            const pick = this.pickAuto(t);
            if (pick) { this._ladder[t] = pick; this._used.add(pick.id); }
        }
    }

    private pickAuto(tier: number): EggSpecies | null {
        let c = this.db.forkCandidates(tier, this._family, this._used);
        if (!c.length) c = this.db.forkCandidates(tier, '', this._used);
        if (!c.length) return null;
        return c[Math.floor(Math.random() * c.length)];
    }

    // ── Forks ────────────────────────────────────────────────────────────

    /** Called when a tier is first reached. True if a fork overlay was raised. */
    public onTierReached(tier: number): boolean {
        if (tier > this._highestTier) {
            this._highestTier = tier;
            this.events.emit(RunEvent.TIER_CHANGED, this._highestTier);
        }
        if (!this.db.isForkTier(tier) || this._ladder[tier]) return false;

        const pool = this.db.forkCandidates(tier, this._family, this._used)
            .filter(s => CodexStore.isInPool(s.id) || s.family === this._family || this._family === '');
        const src = pool.length >= this.forkOptions ? pool : this.db.forkCandidates(tier, '', this._used);
        if (!src.length) { this.autoFillUpTo(tier + 1); return false; }

        const offer = this.shuffle(src.slice()).slice(0, this.forkOptions);
        this._paused = true;
        this.events.emit(RunEvent.FORK_REQUESTED, tier, offer);
        return true;
    }

    public chooseFork(tier: number, species: EggSpecies) {
        this._ladder[tier] = species;
        this._used.add(species.id);
        this._family = species.family;
        const next = this.nextForkTierAfter(tier);
        this.autoFillUpTo(next);
        this._paused = false;
        this.events.emit(RunEvent.LADDER_CHANGED);
    }

    private nextForkTierAfter(tier: number): number {
        for (let i = tier + 1; i < this._ladder.length; i++) if (this.db.isForkTier(i)) return i;
        return this._ladder.length;
    }

    // ── Merge resolution ─────────────────────────────────────────────────

    /**
     * What two same-tier, same-variant eggs produce.
     * Returns null for an ascension (both parents clear, nothing spawns).
     */
    public resolveMerge(tier: number, idA: string, idB: string): { species: EggSpecies; tier: number } | null {
        if (idA !== idB) {
            const fused = this.db.findFusion(idA, idB);
            if (fused) return { species: fused, tier };
        }
        if (tier >= this.db.topTier) return null;
        const next = this._ladder[tier + 1] ?? this.pickAuto(tier + 1);
        if (next && !this._ladder[tier + 1]) { this._ladder[tier + 1] = next; this._used.add(next.id); }
        return next ? { species: next, tier: tier + 1 } : null;
    }

    // ── Scoring ──────────────────────────────────────────────────────────

    public addMergeEssence(tier: number, variant: EggVariant) {
        if (variant !== EggVariant.Gold) return;
        this.grant((tier + 1) * this.goldEssence);
    }

    public addAscension() {
        this._ascensions++;
        this.grant(this.ascendEssence);
    }

    private grant(n: number) {
        this._runEssence += n;
        this.events.emit(RunEvent.ESSENCE_CHANGED, this._runEssence);
    }

    /** Records a first sighting. Returns true if it was new. */
    public reportCreated(species: EggSpecies, variant: EggVariant): boolean {
        if (!CodexStore.unlock(species.id, variant)) return false;
        this._discoveries.push({ species, variant });
        this.events.emit(RunEvent.DISCOVERED, species, variant);
        return true;
    }

    // ── Heirloom ─────────────────────────────────────────────────────────

    public noteShot(): { species: EggSpecies; variant: EggVariant; tier: number } | null {
        this._shots++;
        if (this._heirloomUsed || !this._heirloom) return null;
        if (this._shots < this.heirloomShot) return null;
        const s = this.db.get(this._heirloom.id);
        if (!s) { this._heirloomUsed = true; return null; }
        this._heirloomUsed = true;
        return { species: s, variant: this._heirloom.variant, tier: Math.max(0, this._heirloom.tier - 3) };
    }

    // ── Run end ──────────────────────────────────────────────────────────

    public endRun() {
        CodexStore.addEssence(this._runEssence);
        CodexStore.reportBest(this._highestTier);
    }

    public get runEssence(): number { return this._runEssence; }
    public get highestTier(): number { return this._highestTier; }
    public get ascensions(): number { return this._ascensions; }
    public get discoveries(): ReadonlyArray<{ species: EggSpecies; variant: EggVariant }> { return this._discoveries; }

    private shuffle<T>(a: T[]): T[] {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}