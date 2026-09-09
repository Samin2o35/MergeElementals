import { _decorator, Component, Label, director } from 'cc';
import { RunManager } from './RunManager';
import { HeirloomPicker } from './HeirloomPicker';
import { UiButton } from './UiButton';

const { ccclass, property } = _decorator;

@ccclass('RunEndView')
export class RunEndView extends Component {

    @property(RunManager) run: RunManager = null!;
    @property(HeirloomPicker) picker: HeirloomPicker = null!;

    @property(Label) tierLabel: Label = null!;
    @property(Label) essenceLabel: Label = null!;
    @property(Label) discoveryLabel: Label = null!;
    @property(Label) ascendLabel: Label = null!;

    @property(UiButton) retryButton: UiButton = null!;
    @property(UiButton) homeButton: UiButton = null!;

    @property({ tooltip: 'Scene loaded by the home button. Blank reloads the current scene.' })
    homeScene: string = '';

    start() {
        this.retryButton?.onTap(() => this.finish(true));
        this.homeButton?.onTap(() => this.finish(false));
    }

    public show(_onClosed: () => void) {
        this.node.active = true;
        if (this.tierLabel) this.tierLabel.string = `${this.run.highestTier + 1}`;
        if (this.essenceLabel) this.essenceLabel.string = `${this.run.runEssence}`;
        if (this.discoveryLabel) this.discoveryLabel.string = `${this.run.discoveries.length}`;
        if (this.ascendLabel) this.ascendLabel.string = `${this.run.ascensions}`;
        this.picker?.build(this.run);
    }

    private finish(retry: boolean) {
        this.picker?.commit(this.run);
        if (retry || !this.homeScene) director.loadScene(director.getScene()!.name);
        else director.loadScene(this.homeScene);
    }
}