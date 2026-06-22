import {
    _decorator, Component, Node, Prefab, instantiate, Sprite, Label,
    Vec2, Vec3, PhysicsSystem2D, tween, Tween,
} from 'cc';
import { Egg } from './Egg';
import { EggDatabase } from './EggDatabase';
import { Launcher } from './Launcher';
import { GameManager } from './GameManager';
import { GlobalAudioManager } from './GlobalAudioManager';
import { AudioContent } from './AudioContent';
import { MergeEffect } from './MergeEffect';

const { ccclass, property } = _decorator;

interface PendingMerge { a: Egg; b: Egg; tier: number; x: number; y: number; vx: number; vy: number; }

@ccclass('ThrowMergeGame')
export class ThrowMergeGame extends Component {

    @property(EggDatabase) db: EggDatabase = null!;
    @property(Launcher)    launcher: Launcher = null!;
    @property(Node)        eggsContainer: Node = null!;
    @property(GameManager) gameManager: GameManager = null!;

    /** The single Next Up egg (the one that will spawn next). Pulses + sits larger. */
    @property(Sprite) nextEggSprite: Sprite = null!;

    @property(Sprite) targetEggSprite: Sprite = null!;
    @property(Label)  targetStarLabel: Label = null!;

    // ── Merge effect ─────────────────────────────────────────────────────
    @property(Prefab) mergeEffectPrefab: Prefab = null!;
    @property({ type: Node, tooltip: 'Layer for merge FX, rendered above the eggs. Falls back to Eggs container.' })
    fxContainer: Node = null!;

    // ── Lose line ────────────────────────────────────────────────────────
    @property(Node) loseLineNode: Node = null!;
    @property loseLineYValue: number = 0;
    @property({ tooltip: 'Lose-check only: speed below which a pile egg counts as settled. Higher = triggers loss while still drifting; lower = must be near-stopped.' })
    settleSpeed: number = 12;

    // ── Physics feel ─────────────────────────────────────────────────────
    @property({ tooltip: 'Passive drag while moving. Higher = slows/stops sooner (heavy); lower = glides longer. Fights launchSpeed for reach.' })
    linearDamping: number = 0.6;
    @property({ tooltip: 'Bounciness on impact (0-1). Higher = pings off walls/eggs; lower (~0) = dead stop on contact.' })
    restitution: number = 0.45;
    @property({ tooltip: 'Surface friction on glancing/sliding contact. Higher = scrubs speed along walls; keep low with Fixed Rotation.' })
    friction: number = 0.15;
    @property({ tooltip: 'Mass per area = collision weight. Higher = shoves the pile harder, pushed less. Does NOT affect launch reach.' })
    density: number = 1.0;

    @property maxSpawnTier: number = 2;
    @property relaunchDelay: number = 0.35;

    @property({ tooltip: 'Fraction of the two parents combined velocity the merged egg keeps. 0 = stops dead, 1 = full momentum.' })
    mergeInertia: number = 0.5;
    @property({ tooltip: 'Seconds a freshly merged egg cannot merge again (lets its pop-in finish, avoids instant chain-merges).' })
    mergeGrace: number = 0.2;

    // ── Next Up highlight ────────────────────────────────────────────────
    @property({ tooltip: 'Pop-in start scale as a fraction of the authored scale when the next egg changes.' })
    nextPopFrom: number = 0.4;
    @property({ tooltip: 'Seconds for the next-egg pop-in animation.' })
    nextPopDuration: number = 0.25;

    // ── Audio (each is a Node with an AudioContent) ──────────────────────
    @property(Node) throwAudio: Node = null!;   // egg launched
    @property(Node) wallAudio: Node = null!;    // egg hits table edge
    @property(Node) eggHitAudio: Node = null!;  // egg hits a non-mergeable egg
    @property(Node) mergeAudio: Node = null!;   // two eggs merge
    @property(Node) winAudio: Node = null!;
    @property(Node) loseAudio: Node = null!;
    @property({ tooltip: 'Min impact speed to play a hit/wall sound — filters gentle settling contacts.' })
    hitSpeedThreshold: number = 5;
    @property({ tooltip: 'Min seconds between repeats of the same SFX (anti machine-gun).' })
    sfxCooldown: number = 0.06;

    private _nextTier: number = 0;
    private _nextBaseScale: number = 1;
    private _dockedEgg: Egg | null = null;
    private _gameOver: boolean = false;
    private _pending: PendingMerge[] = [];
    private _lastSfx: Record<string, number> = {};

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.gravity = new Vec2(0, 0); // top-down table
    }

    start() {
        this.refreshTarget();
        this._nextBaseScale = this.nextEggSprite ? this.nextEggSprite.node.scale.x : 1;
        this._nextTier = this.randomStartTier();
        this.updateNextDisplay();
        this.loadLauncher();
    }

    update(_dt: number) {
        if (this._gameOver) return;

        if (this._pending.length) this.processMerges();
        if (this._gameOver) return;

        this.sortEggDepth();

        const lineY = this.getLoseLineY();
        const kids = this.eggsContainer.children;
        for (let i = 0; i < kids.length; i++) {
            const egg = kids[i].getComponent(Egg);
            if (!egg || egg.consumed || egg === this._dockedEgg) continue;

            const y = egg.node.worldPosition.y;
            if (!egg.enteredField) {
                if (y > lineY) egg.enteredField = true;
                continue;
            }
            if (y <= lineY && egg.getSpeed() < this.settleSpeed) {
                this.triggerLose();
                break;
            }
        }
    }

    private getLoseLineY(): number {
        return this.loseLineNode ? this.loseLineNode.worldPosition.y : this.loseLineYValue;
    }

    /** 2.5D depth sort: nearer (lower Y) eggs render on top. Keep ONLY eggs in this container. */
    private sortEggDepth() {
        const sorted = this.eggsContainer.children.slice()
            .sort((a, b) => b.worldPosition.y - a.worldPosition.y);
        for (let i = 0; i < sorted.length; i++) sorted[i].setSiblingIndex(i);
    }

    private randomStartTier(): number {
        const max = Math.min(this.maxSpawnTier, this.db.count - 1);
        return Math.floor(Math.random() * (max + 1));
    }

    private refreshTarget() {
        const t = this.db.getTier(this.db.effectiveTarget);
        if (t && this.targetEggSprite) this.targetEggSprite.spriteFrame = t.icon;
    }

    private updateNextDisplay() {
        const t = this.db.getTier(this._nextTier);
        if (!t || !this.nextEggSprite) return;
        this.nextEggSprite.spriteFrame = t.icon;
        this.popNextEgg();
    }

    /** One-shot pop when the next egg changes — appears with a little punch. */
    private popNextEgg() {
        const n = this.nextEggSprite.node;
        const base = this._nextBaseScale;
        Tween.stopAllByTarget(n);
        n.setScale(base * this.nextPopFrom, base * this.nextPopFrom, 1);
        tween(n)
            .to(this.nextPopDuration, { scale: new Vec3(base, base, 1) }, { easing: 'backOut' })
            .start();
    }

    private loadLauncher() {
        const tier = this._nextTier;              // the shown next egg becomes the docked one
        this._nextTier = this.randomStartTier();  // roll a new next
        this.updateNextDisplay();

        const egg = this.spawnEgg(tier, this.launcher.node.worldPosition);
        if (!egg) return;
        this._dockedEgg = egg;
        this.launcher.loadEgg(egg, () => this.onShotFired());
    }

    private onShotFired() {
        this._dockedEgg = null;
        this.playAudio(this.throwAudio); // egg launched
        this.scheduleOnce(() => { if (!this._gameOver) this.loadLauncher(); }, this.relaunchDelay);
    }

    private spawnEgg(tier: number, worldPos: Readonly<Vec3>): Egg | null {
        const def = this.db.getTier(tier);
        if (!def || !def.prefab) {
            console.warn(`[ThrowMergeGame] No prefab for tier ${tier}`);
            return null;
        }
        const node = instantiate(def.prefab);
        const egg = node.getComponent(Egg)!;

        egg.init({
            tier,
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

    /** Runs inside the contact callback. Queue merges; play hit/wall SFX (gated). */
    private onContact(a: Egg, b: Egg | null) {
        const speed = a.getSpeed();

        if (!b) { // wall
            if (speed > this.hitSpeedThreshold) this.playSfx(this.wallAudio, 'wall');
            return;
        }
        if (!a.mergeable || !b.mergeable) return; // docked egg — ignore

        if (a.tier === b.tier) {
            if (a.consumed || b.consumed) return;
            if (!a.canMerge || !b.canMerge) return; // a fresh merge is still in its grace window
            a.consumed = true;
            b.consumed = true;
            const va = a.getVelocity();
            const vb = b.getVelocity();
            this._pending.push({
                a, b, tier: a.tier,
                x: (a.node.worldPosition.x + b.node.worldPosition.x) / 2,
                y: (a.node.worldPosition.y + b.node.worldPosition.y) / 2,
                vx: (va.x + vb.x) / 2,
                vy: (va.y + vb.y) / 2,
            });
        } else { // different tier — bounce
            if (speed > this.hitSpeedThreshold) this.playSfx(this.eggHitAudio, 'egghit');
        }
    }

    private processMerges() {
        const list = this._pending;
        this._pending = [];
        for (const m of list) {
            if (m.a && m.a.node && m.a.node.isValid) m.a.node.destroy();
            if (m.b && m.b.node && m.b.node.isValid) m.b.node.destroy();

            this.playAudio(this.mergeAudio);
            const resultTier = Math.min(m.tier + 1, this.db.count - 1);
            this.spawnMergeFx(m.x, m.y, resultTier);

            if (m.tier >= this.db.count - 1) continue; // already top of ladder

            const nextTier = m.tier + 1;
            const merged = this.spawnEgg(nextTier, new Vec3(m.x, m.y, 0));
            if (merged) {
                merged.setVelocity(new Vec2(m.vx * this.mergeInertia, m.vy * this.mergeInertia));
                merged.setMergeGrace(this.mergeGrace);
                const authored = merged.node.scale.clone();
                merged.node.setScale(authored.x * 0.2, authored.y * 0.2, authored.z);
                tween(merged.node).to(0.18, { scale: authored }, { easing: 'backOut' }).start();
            }

            if (nextTier >= this.db.effectiveTarget) { this.triggerWin(); break; }
        }
    }

    private spawnMergeFx(x: number, y: number, resultTier: number) {
        if (!this.mergeEffectPrefab) return;
        const parent = this.fxContainer ?? this.eggsContainer;
        const node = instantiate(this.mergeEffectPrefab);
        parent.addChild(node);
        node.setWorldPosition(x, y, 0);
        const fx = node.getComponent(MergeEffect);
        if (fx) fx.play(MergeEffect.TIER_COLORS[resultTier] ?? MergeEffect.DEFAULT_COLORS);
    }

    private triggerWin() {
        if (this._gameOver) return;
        this._gameOver = true;
        this.launcher.disable();
        this.playAudio(this.winAudio);
        this.scheduleOnce(() => this.gameManager.showEndCard(true), 0.6);
    }

    private triggerLose() {
        if (this._gameOver) return;
        this._gameOver = true;
        this.launcher.disable();
        this.playAudio(this.loseAudio);
        this.scheduleOnce(() => this.gameManager.showEndCard(false), 0.6);
    }

    /** Cooldown-gated one-shot to avoid duplicate/rapid-fire contact sounds. */
    private playSfx(n: Node, key: string) {
        const now = Date.now() / 1000;
        const last = this._lastSfx[key] ?? 0;
        if (now - last < this.sfxCooldown) return;
        this._lastSfx[key] = now;
        this.playAudio(n);
    }

    private playAudio(n: Node) {
        if (!n || !GlobalAudioManager.instance) return;
        const ac = n.getComponent(AudioContent);
        if (ac) GlobalAudioManager.instance.playOneShot(ac);
    }
}