import { _decorator, Component, Label } from 'cc';
import { RunManager, RunEvent } from './RunManager';
import { OverlayStack } from './OverlayStack';
import { UiButton } from './UiButton';

const { ccclass, property } = _decorator;

@ccclass('HudView')
export class HudView extends Component {

    @property(RunManager) run: RunManager = null!;
    @property(OverlayStack) overlays: OverlayStack = null!;

    @property(Label) essenceLabel: Label = null!;
    @property(Label) scoreLabel: Label = null!;

    @property(UiButton) codexButton: UiButton = null!;
    @property(UiButton) optionsButton: UiButton = null!;

    start() {
        this.codexButton?.onTap(() => this.overlays.showCodex());
        this.optionsButton?.onTap(() => this.overlays.showOptions());

        this.run.events.on(RunEvent.ESSENCE_CHANGED, this.onEssence, this);
        this.run.events.on(RunEvent.TIER_CHANGED, this.refresh, this);
        this.run.events.on(RunEvent.LADDER_CHANGED, this.refresh, this);
        this.refresh();
    }

    onDestroy() {
        this.run.events.off(RunEvent.ESSENCE_CHANGED, this.onEssence, this);
        this.run.events.off(RunEvent.TIER_CHANGED, this.refresh, this);
        this.run.events.off(RunEvent.LADDER_CHANGED, this.refresh, this);
    }

    private onEssence(n: number) {
        if (this.essenceLabel) this.essenceLabel.string = `${n}`;
    }

    private refresh() {
        if (this.essenceLabel) this.essenceLabel.string = `${this.run.runEssence}`;
        if (this.scoreLabel) this.scoreLabel.string = `${this.run.highestTier + 1}`;
    }
}