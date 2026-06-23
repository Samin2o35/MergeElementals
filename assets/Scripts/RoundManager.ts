import {
    _decorator, Component, Node, Prefab, instantiate, Label, director, CCInteger, CCFloat,
} from 'cc';
import { Monster, MonsterInit } from './Monster';
import { MonsterDatabase, MonsterData } from './MonsterDatabase';
import { ThemeManager } from './ThemeManager';

const { ccclass, property } = _decorator;

/** Fired when a monster attacks. ThrowMergeGame listens and destroys that many in-play pieces. */
export const DESTROY_PIECES = 'destroy-pieces';

/**
 * Drives the endless round loop: spawns waves on a budget, scales stats each round,
 * runs boss rounds, applies merge/burst damage to all monsters (type-scaled), and
 * tracks the score. One-way coupling: ThrowMergeGame imports this; this never imports
 * ThrowMergeGame (piece-destroy goes out via the DESTROY_PIECES event instead).
 */
@ccclass('RoundManager')
export class RoundManager extends Component {

    @property(MonsterDatabase) db: MonsterDatabase = null!;
    @property(ThemeManager)    themeManager: ThemeManager = null!;
    @property(Prefab)          monsterPrefab: Prefab = null!;

    @property({ type: [Node], tooltip: 'Empty slot nodes the monsters spawn onto. Slot count caps enemies-per-round.' })
    slots: Node[] = [];

    @property(Prefab) floatingTextPrefab: Prefab = null!;
    @property({ type: Node, tooltip: 'Layer the floating damage numbers are parented to.' })
    fxLayer: Node = null!;
    @property(Label) scoreLabel: Label = null!;

    // ── Spawn / difficulty ───────────────────────────────────────────────
    @property({ type: CCInteger, tooltip: 'Hard cap on monsters per round (also limited by slot count).' })
    maxEnemiesPerRound: number = 4;
    @property({ type: CCFloat, tooltip: 'Spend budget on round 1.' })
    budgetBase: number = 1;
    @property({ type: CCFloat, tooltip: 'Extra budget added each round. Higher = bigger/more waves sooner.' })
    budgetGrowthPerRound: number = 1;
    @property({ type: CCFloat, tooltip: 'HP multiplier applied per round (compounds). 1.12 = +12%/round.' })
    hpGrowthPerRound: number = 1.12;
    @property({ type: CCFloat, tooltip: 'Rage-fill-speed multiplier per round (compounds). Monsters attack sooner over time.' })
    rageGrowthPerRound: number = 1.06;
    @property({ type: CCInteger, tooltip: 'Every Nth round is a boss round (0 = never).' })
    bossInterval: number = 10;
    @property({ type: CCFloat, tooltip: 'Pause after the last monster dies before the next round spawns.' })
    nextRoundDelay: number = 0.8;

    // ── Monster behaviour ────────────────────────────────────────────────
    @property({ type: CCFloat, tooltip: 'Rage added per hit, as a fraction of maxRage. 0.1 = +10% per hit.' })
    rageFillOnHitFraction: number = 0.1;
    @property({ type: CCFloat, tooltip: 'Scale-up factor while a monster is attacking.' })
    attackScale: number = 1.15;

    // ── Combat ───────────────────────────────────────────────────────────
    @property({ type: CCFloat, tooltip: 'Damage of a tier-0 merge before type scaling.' })
    baseDamage: number = 5;
    @property({ type: CCFloat, tooltip: 'Damage multiplier per result tier (compounds). Bigger merges hit much harder.' })
    damageGrowthPerTier: number = 1.6;
    @property({ type: CCFloat, tooltip: 'Flat burst damage to ALL monsters when the top tier is created.' })
    burstDamage: number = 300;

    // ── Score weights ────────────────────────────────────────────────────
    @property({ type: CCFloat }) scoreRoundWeight: number = 100;
    @property({ type: CCFloat }) scoreKillWeight: number = 25;
    @property({ type: CCFloat }) scoreMergeWeight: number = 10;

    private _round = 0;
    private _kills = 0;
    private _biggestTier = 0;   // 1-based highest tier created (for score)
    private _alive: Monster[] = [];
    private _stopped = false;

    start() {
        this.startRound(1);
    }

    // ── Public score / lifecycle ─────────────────────────────────────────
    public get score(): number {
        return Math.round(
            this._round * this.scoreRoundWeight +
            this._kills * this.scoreKillWeight +
            this._biggestTier * this.scoreMergeWeight
        );
    }
    public get round(): number { return this._round; }

    /** Halt the loop (called by ThrowMergeGame on game over). */
    public stop() { this._stopped = true; }

    private updateScoreLabel() {
        if (this.scoreLabel) this.scoreLabel.string = 'Score  ' + this.score;
    }

    // ── Rounds ───────────────────────────────────────────────────────────
    private startRound(n: number) {
        if (this._stopped) return;
        this._round = n;
        this.updateScoreLabel();

        const isBoss = this.bossInterval > 0 && n % this.bossInterval === 0;
        if (isBoss) this.spawnBoss(n);
        else this.spawnWave(n);
    }

    private spawnWave(n: number) {
        const cap = Math.min(this.maxEnemiesPerRound, this.slots.length);
        let budget = this.budgetBase + (n - 1) * this.budgetGrowthPerRound;

        const picks: MonsterData[] = [];
        let guard = 0;
        while (picks.length < cap && guard++ < 100) {
            const m = this.db.randomAffordable(budget);
            if (!m) break;            // can't afford anything cheaper
            picks.push(m);
            budget -= m.cost;
        }
        if (picks.length === 0) {     // safety: always spawn at least one
            const m = this.db.randomAffordable(Number.MAX_SAFE_INTEGER);
            if (m) picks.push(m);
        }

        for (let i = 0; i < picks.length; i++) this.spawnMonster(picks[i], this.slots[i], n);
    }

    private spawnBoss(n: number) {
        const cycle = Math.floor(n / Math.max(1, this.bossInterval)) - 1;
        const data = this.db.boss(cycle);
        if (!data) { this.spawnWave(n); return; }  // no bosses defined → normal wave
        const slot = this.slots[Math.floor(this.slots.length / 2)] ?? this.slots[0];
        this.spawnMonster(data, slot, n);
    }

    private spawnMonster(data: MonsterData, slot: Node, n: number) {
        if (!slot || !this.monsterPrefab) return;

        const node = instantiate(this.monsterPrefab);
        slot.addChild(node);
        node.setPosition(0, 0, 0);

        const m = node.getComponent(Monster)!;
        if (m.bodySprite && data.sprite) m.bodySprite.spriteFrame = data.sprite;

        const hp        = data.baseHP         * Math.pow(this.hpGrowthPerRound,   n - 1);
        const rageSpeed = data.rageFillPerSec * Math.pow(this.rageGrowthPerRound, n - 1);

        const init: MonsterInit = {
            theme: data.theme,
            maxHP: hp,
            maxRage: data.maxRage,
            rageFillPerSec: rageSpeed,
            rageFillOnHit: data.maxRage * this.rageFillOnHitFraction,
            piecesPerAttack: data.piecesPerAttack,
            immuneThemes: data.immuneThemes,
            isBoss: data.isBoss,
            attackScale: this.attackScale,
            floatingTextPrefab: this.floatingTextPrefab,
            fxLayer: this.fxLayer,
            attackCb: (mm) => this.onMonsterAttack(mm),
            deathCb: (mm) => this.onMonsterDead(mm),
        };
        m.init(init);
        this._alive.push(m);
    }

    private onMonsterAttack(m: Monster) {
        director.emit(DESTROY_PIECES, m.piecesPerAttack);
    }

    private onMonsterDead(m: Monster) {
        const i = this._alive.indexOf(m);
        if (i >= 0) this._alive.splice(i, 1);
        this._kills++;
        this.updateScoreLabel();

        if (this._alive.length === 0 && !this._stopped) {
            this.scheduleOnce(() => this.startRound(this._round + 1), this.nextRoundDelay);
        }
    }

    // ── Combat (called by ThrowMergeGame) ────────────────────────────────
    /** Normal merge: damage scales with the tier that was just created. */
    public dealMergeDamage(resultTier: number) {
        if (resultTier + 1 > this._biggestTier) {
            this._biggestTier = resultTier + 1;
            this.updateScoreLabel();
        }
        const dmg = this.baseDamage * Math.pow(this.damageGrowthPerTier, resultTier);
        this.applyToAll(dmg);
    }

    /** Top-tier merge: big flat burst to everything. */
    public dealBurst() {
        this._biggestTier = Math.max(this._biggestTier, 7);
        this.updateScoreLabel();
        this.applyToAll(this.burstDamage);
    }

    private applyToAll(baseDmg: number) {
        const theme = this.themeManager ? this.themeManager.current : 0;
        // iterate a snapshot — takeDamage can trigger death/removal
        const list = this._alive.slice();
        for (const m of list) {
            if (!m || m.isDead) continue;
            const mult = m.isImmuneTo(theme)
                ? 0
                : (this.themeManager ? this.themeManager.effectiveness(m.theme) : 1);
            m.takeDamage(baseDmg * mult, mult);
        }
    }
}