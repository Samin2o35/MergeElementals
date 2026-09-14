import { _decorator, Component, Label, director, CCFloat } from 'cc';
import { CodexStore } from './CodexStore';
import { OverlayStack } from './OverlayStack';
import { GlobalAudioManager } from './GlobalAudioManager';
import { UiButton } from './UiButton';

const { ccclass, property } = _decorator;

@ccclass('OptionsPanel')
export class OptionsPanel extends Component {

    @property(OverlayStack) overlays: OverlayStack = null!;

    @property(UiButton) closeButton: UiButton = null!;
    @property(UiButton) muteButton: UiButton = null!;
    @property(Label) muteLabel: Label = null!;

    @property({ type: UiButton, tooltip: 'Wipes all codex progress. Requires a second tap to confirm.' })
    resetButton: UiButton = null!;
    @property(Label) resetLabel: Label = null!;

    @property resetPrompt: string = 'Reset all progress';
    @property resetConfirm: string = 'Tap again to erase everything';
    @property({ type: CCFloat, tooltip: 'Seconds before the confirm lapses back.' })
    confirmWindow: number = 3;

    private _armed = false;
    private _muted = false;

    start() {
        this.closeButton?.onTap(() => this.overlays.closeOptions());
        this.muteButton?.onTap(() => this.toggleMute());
        this.resetButton?.onTap(() => this.onReset());
        this.paint();
    }

    onEnable() { this.disarm(); }

    private toggleMute() {
        this._muted = !this._muted;
        GlobalAudioManager.instance?.setVolume(this._muted ? 0 : 1);
        this.paint();
    }

    /** First tap arms, second wipes. Avoids a modal for a rare destructive action. */
    private onReset() {
        if (!this._armed) {
            this._armed = true;
            this.paint();
            this.scheduleOnce(() => this.disarm(), this.confirmWindow);
            return;
        }
        CodexStore.wipe();
        director.loadScene(director.getScene()!.name);
    }

    private disarm() {
        this.unscheduleAllCallbacks();
        this._armed = false;
        this.paint();
    }

    private paint() {
        if (this.muteLabel) this.muteLabel.string = this._muted ? 'Sound: off' : 'Sound: on';
        if (this.resetLabel) this.resetLabel.string = this._armed ? this.resetConfirm : this.resetPrompt;
    }
}