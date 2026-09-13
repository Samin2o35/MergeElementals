import {
    _decorator, Component, Node, Prefab, instantiate, Sprite,
    Vec2, Vec3, PhysicsSystem2D, tween, Tween, CCFloat,
} from 'cc';
import { Egg } from './Egg';
import { EggSpeciesDatabase } from './EggSpeciesDatabase';
import { EggSpecies, EggVariant } from './EggTypes';
import { RunManager, RunEvent } from './RunManager';
import { Launcher } from './Launcher';
import { GlobalAudioManager } from './GlobalAudioManager';
import { AudioContent } from './AudioContent';
import { EggFX } from './EggFX';
import { OverlayStack } from './OverlayStack';

const { ccclass, property } = _decorator;

interface PendingMerge {
    a: Egg; b: Egg; tier: number; variant: EggVariant;
    idA: string; idB: string;
    x: number; y: number; vx: number; vy: number;
}

@ccclass('ThrowMergeGame')
export class ThrowMergeGame extends Component {

    @property(EggSpeciesDatabase) db: EggSpeciesDatabase = null!;
    @property(RunManager) run: RunManager = null!;
    @property(Launcher) launcher: Launcher = null!;
    @property(Node) eggsContainer: Node = null!;
    @property(OverlayStack) overlays: OverlayStack = null!;

    @property(Sprite) nextEggSprite: Sprite = null!;

    @property(Prefab) fxPrefab: Prefab = null!;
    @property(Node) fxContainer: Node = null!;

    @property(Node) loseLineNode: Node = null!;
    @property({ tooltip: 'Speed below which a pile egg past the line counts as settled.' })
    settleSpeed: number = 12;

    @property linearDamping: number = 1.75;
    @property restitution: number = 0.025;
    @property friction: number = 0.15;
    @property density: number = 1.0;

    @property({ tooltip: 'Highest tier that can spawn from the launcher (0-based).' })
    maxSpawnTier: number = 2;
    @property relaunchDelay: number = 0.35;

    @property({ type: CCFloat, tooltip: 'Chance a launcher egg is gold (0-1).' })
    goldChance: number = 0.06;

    @property mergeInertia: number = 0.5;
    @property mergeGrace: number = 0.2;

    @property nextPopFrom: number = 0.4;
    @property nextPopDuration: number = 0.25;

    @property(Node) throwAudio: Node = null!;
    @property(Node) wallAudio: Node = null!;
    @property(Node) eggHitAudio: Node = null!;
    @property(Node) mergeAudio: Node = null!;
    @property(Node) ascendAudio: Node = null!;
    @property(Node) loseAudio: Node = null!;
    @property hitSpeedThreshold: number = 5;
    @property sfxCooldown: number = 0.06;

    private _nextTier: number = 0;
    private _nextVariant: EggVariant = EggVariant.Normal;
    private _nextBaseScale: number = 1;
    private _dockedEgg: Egg | null = null;
    private _gameOver: boolean = false;
    private _pending: PendingMerge[] = [];
    private _lastSfx: Record<string, number> = {};

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.gravity = new Vec2(0, 0);
    }

    start() {
        this._nextBaseScale = this.nextEggSprite ? this.nextEggSprite.node.scale.x : 1;
        this.run.beginRun();
        this.rollNext();
        this.updateNextDisplay();
        this.loadLauncher();
    }

    update(_dt: number) {
        if (this._gameOver || this.run.paused) return;

        if (this._pending.length) this.processMerges();
        if (this._gameOver) return;

        this.sortEggDepth();

        const lineY = this.loseLineNode ? this.loseLineNode.worldPosition.y : 0;
        const kids = this.eggsContainer.children;
        for (let i = 0; i < kids.length; i++) {
            const egg = kids[i].getComponent(Egg);
            if (!egg || egg.consumed || egg === this._dockedEgg) continue;

            const y = egg.node.worldPosition.y;
            if (!egg.enteredField) { if (y > lineY) egg.enteredField = true; continue; }
            if (y <= lineY && egg.getSpeed() < this.settleSpeed) { this.triggerLose(); break; }
        }
    }

    /** 2.5D depth sort: lower Y renders on top. */
    private sortEggDepth() {
        const sorted = this.eggsContainer.children.slice()
            .sort((a, b) => b.worldPosition.y - a.worldPosition.y);
        for (let i = 0; i < sorted.length; i++) sorted[i].setSiblingIndex(i);
    }

    // ── Launcher feed ────────────────────────────────────────────────────

    private rollNext() {
        const max = Math.min(this.maxSpawnTier, this.db.topTier);
        this._nextTier = Math.floor(Math.random() * (max + 1));
        this._nextVariant = Math.random() < this.goldChance ? EggVariant.Gold : EggVariant.Normal;
    }

    private updateNextDisplay() {
        const s = this.run.speciesAt(this._nextTier);
        if (!s || !this.nextEggSprite) return;
        this.nextEggSprite.spriteFrame = s.icon(this._nextVariant);
        this.popNextEgg();
    }

    private popNextEgg() {
        const n = this.nextEggSprite.node;
        const base = this._nextBaseScale;
        Tween.stopAllByTarget(n);
        n.setScale(base * this.nextPopFrom, base * this.nextPopFrom, 1);
        tween(n).to(this.nextPopDuration, { scale: new Vec3(base, base, 1) }, { easing: 'backOut' }).start();
    }

    private loadLauncher() {
        const heir = this.run.noteShot();
        const tier = heir ? heir.tier : this._nextTier;
        const variant = heir ? heir.variant : this._nextVariant;
        const species = heir ? heir.species : this.run.speciesAt(tier);
        if (!species) return;

        if (!heir) { this.rollNext(); this.updateNextDisplay(); }

        const egg = this.spawnEgg(species, tier, variant, this.launcher.node.worldPosition);
        if (!egg) return;
        this.run.reportCreated(species, variant);
        this._dockedEgg = egg;
        this.launcher.loadEgg(egg, () => this.onShotFired());
    }

    private onShotFired() {
        this._dockedEgg = null;
        this.playAudio(this.throwAudio);
        this.scheduleOnce(() => { if (!this._gameOver) this.loadLauncher(); }, this.relaunchDelay);
    }

    private spawnEgg(species: EggSpecies, tier: number, variant: EggVariant, worldPos: Readonly<Vec3>): Egg | null {
        if (!this.db.eggPrefab) { console.warn('[Game] Database.eggPrefab not set'); return null; }

        const node = instantiate(this.db.eggPrefab);
        const egg = node.getComponent(Egg)!;
        egg.init({
            tier, speciesId: species.id, variant,
            artFrame: species.boardArt(variant),
            scale: this.db.scaleFor(tier),
            linearDamping: this.linearDamping,
            restitution: this.restitution,
            friction: this.friction,
            density: this.density,
            contactCb: (a, b) => this.onContact(a, b),
        });

        this.eggsContainer.addChild(node);
        node.setWorldPosition(worldPos.x, worldPos.y, worldPos.z);
        return egg;
    }

    // ── Contacts ─────────────────────────────────────────────────────────

    private onContact(a: Egg, b: Egg | null) {
        const speed = a.getSpeed();

        if (!b) {
            if (speed > this.hitSpeedThreshold) this.playSfx(this.wallAudio, 'wall');
            return;
        }
        if (!a.mergeable || !b.mergeable) return;

        if (a.tier === b.tier && a.variant === b.variant) {
            if (a.consumed || b.consumed) return;
            if (!a.canMerge || !b.canMerge) return;
            a.consumed = true;
            b.consumed = true;
            const va = a.getVelocity();
            const vb = b.getVelocity();
            this._pending.push({
                a, b, tier: a.tier, variant: a.variant,
                idA: a.speciesId, idB: b.speciesId,
                x: (a.node.worldPosition.x + b.node.worldPosition.x) / 2,
                y: (a.node.worldPosition.y + b.node.worldPosition.y) / 2,
                vx: (va.x + vb.x) / 2,
                vy: (va.y + vb.y) / 2,
            });
        } else if (speed > this.hitSpeedThreshold) {
            this.playSfx(this.eggHitAudio, 'egghit');
        }
    }

    private processMerges() {
        const list = this._pending;
        this._pending = [];

        for (const m of list) {
            if (m.a?.node?.isValid) m.a.node.destroy();
            if (m.b?.node?.isValid) m.b.node.destroy();

            const result = this.run.resolveMerge(m.tier, m.idA, m.idB);

            if (!result) {
                this.run.addAscension();
                this.playAudio(this.ascendAudio);
                const top = this.run.speciesAt(this.db.topTier);
                if (top) this.spawnFx(m.x, m.y, top, m.variant, 1.6);
                continue;
            }

            // Unassigned fork tier: park the rest of the queue, ask, then finish.
            if (!result.species) {
                this._pending = list.slice(list.indexOf(m) + 1).concat(this._pending);
                this.run.requestFork(result.tier, s => this.completeMerge(m, s, result.tier));
                return;
            }

            this.completeMerge(m, result.species, result.tier);
        }
    }

    private completeMerge(m: PendingMerge, species: EggSpecies, tier: number) {
        this.run.addMergeEssence(m.tier, m.variant);
        this.playAudio(this.mergeAudio);
        this.spawnFx(m.x, m.y, species, m.variant, 1.0);

        const merged = this.spawnEgg(species, tier, m.variant, new Vec3(m.x, m.y, 0));
        if (merged) {
            merged.setVelocity(new Vec2(m.vx * this.mergeInertia, m.vy * this.mergeInertia));
            merged.setMergeGrace(this.mergeGrace);
            const authored = merged.node.scale.clone();
            merged.node.setScale(authored.x * 0.2, authored.y * 0.2, authored.z);
            tween(merged.node).to(0.18, { scale: authored }, { easing: 'backOut' }).start();
        }

        this.run.reportCreated(species, m.variant);
        this.run.noteTier(tier);
    }

    private spawnFx(x: number, y: number, species: EggSpecies, variant: EggVariant, scale: number) {
        if (!this.fxPrefab) return;
        const parent = this.fxContainer ?? this.eggsContainer;
        const node = instantiate(this.fxPrefab);
        parent.addChild(node);
        node.setWorldPosition(x, y, 0);
        node.setScale(scale, scale, 1);
        node.getComponent(EggFX)?.playBurst(species.fx, variant === EggVariant.Gold);
    }

    // ── End ──────────────────────────────────────────────────────────────

    private triggerLose() {
        if (this._gameOver) return;
        this._gameOver = true;
        this.launcher.disable();
        this.run.endRun();
        this.playAudio(this.loseAudio);
        this.scheduleOnce(() => this.overlays.showRunEnd(), 0.6);
    }

    // ── Audio ────────────────────────────────────────────────────────────

    private playSfx(n: Node, key: string) {
        const now = Date.now() / 1000;
        if (now - (this._lastSfx[key] ?? 0) < this.sfxCooldown) return;
        this._lastSfx[key] = now;
        this.playAudio(n);
    }

    private playAudio(n: Node) {
        if (!n || !GlobalAudioManager.instance) return;
        const ac = n.getComponent(AudioContent);
        if (ac) GlobalAudioManager.instance.playOneShot(ac);
    }
}