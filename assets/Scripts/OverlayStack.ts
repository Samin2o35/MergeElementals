import { _decorator, Component, Node, UIOpacity, tween } from 'cc';
import { EggSpecies, EggVariant } from './EggTypes';
import { RunManager, RunEvent } from './RunManager';
import { ForkSelect } from './ForkSelect';
import { CodexView } from './CodexView';
import { DiscoveryBanner } from './DiscoveryBanner';
import { RunEndView } from './RunEndView';

const { ccclass, property } = _decorator;

type Job = () => void;

/** Serialises overlay requests. A fork, a discovery and a lose can all land in one frame. */
@ccclass('OverlayStack')
export class OverlayStack extends Component {

    @property(RunManager) run: RunManager = null!;
    @property(Node) hud: Node = null!;

    @property(ForkSelect) fork: ForkSelect = null!;
    @property(CodexView) codex: CodexView = null!;
    @property(DiscoveryBanner) banner: DiscoveryBanner = null!;
    @property(RunEndView) runEnd: RunEndView = null!;
    @property(Node) options: Node = null!;

    @property({ tooltip: 'Seconds for the HUD fade when an overlay takes the screen.' })
    hudFade: number = 0.18;

    private _queue: Job[] = [];
    private _busy = false;

    onLoad() {
        this.hideAll();
        this.run.events.on(RunEvent.FORK_REQUESTED, this.onForkRequested, this);
        this.run.events.on(RunEvent.DISCOVERED, this.onDiscovered, this);
    }

    onDestroy() {
        this.run.events.off(RunEvent.FORK_REQUESTED, this.onForkRequested, this);
        this.run.events.off(RunEvent.DISCOVERED, this.onDiscovered, this);
    }

    private hideAll() {
        for (const n of [this.fork?.node, this.codex?.node, this.banner?.node, this.runEnd?.node, this.options]) {
            if (n) n.active = false;
        }
    }

    // ── Queue ────────────────────────────────────────────────────────────

    private enqueue(job: Job) {
        this._queue.push(job);
        this.pump();
    }

    private pump() {
        if (this._busy || !this._queue.length) return;
        this._busy = true;
        this._queue.shift()!();
    }

    private release() {
        this._busy = false;
        this.pump();
        if (!this._busy) this.fadeHud(255);
    }

    private fadeHud(to: number) {
        if (!this.hud) return;
        const op = this.hud.getComponent(UIOpacity) ?? this.hud.addComponent(UIOpacity);
        tween(op).to(this.hudFade, { opacity: to }).start();
    }

    // ── Entry points ─────────────────────────────────────────────────────

    private onForkRequested(tier: number, offer: EggSpecies[]) {
        this.enqueue(() => {
            this.fadeHud(0);
            this.fork.show(tier, offer, s => {
                this.run.chooseFork(tier, s);
                this.release();
            });
        });
    }

    private onDiscovered(species: EggSpecies, variant: EggVariant) {
        this.enqueue(() => this.banner.show(species, variant, () => this.release()));
    }

    public showCodex(revealFocus: { species: EggSpecies; variant: EggVariant } | null = null) {
        this.enqueue(() => {
            this.fadeHud(0);
            this.codex.show(revealFocus, () => this.release());
        });
    }

    public showRunEnd() {
        this.enqueue(() => {
            this.fadeHud(0);
            this.runEnd.show(() => this.release());
        });
    }

    public showOptions() {
        this.enqueue(() => { if (this.options) this.options.active = true; });
    }

    public closeOptions() {
        if (this.options) this.options.active = false;
        this.release();
    }
}