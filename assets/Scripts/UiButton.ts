import { _decorator, Component, Node, Input, EventTouch, tween, Vec3, CCFloat } from 'cc';
import { GlobalAudioManager } from './GlobalAudioManager';
import { AudioContent } from './AudioContent';

const { ccclass, property } = _decorator;

/** Tap feedback + sfx. Subscribe via onTap, not the Cocos Button component. */
@ccclass('UiButton')
export class UiButton extends Component {

    @property(Node) tapAudio: Node = null!;
    @property({ type: CCFloat }) pressScale: number = 0.92;

    private _base: Vec3 = new Vec3();
    private _cb: (() => void) | null = null;

    start() {
        this._base = this.node.scale.clone();
        this.node.on(Input.EventType.TOUCH_START, this.onDown, this);
        this.node.on(Input.EventType.TOUCH_END, this.onUp, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onCancel, this);
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onDown, this);
        this.node.off(Input.EventType.TOUCH_END, this.onUp, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onCancel, this);
    }

    public onTap(cb: () => void) { this._cb = cb; }

    private onDown(_e: EventTouch) {
        tween(this.node).to(0.08, { scale: this._base.clone().multiplyScalar(this.pressScale) }, { easing: 'sineOut' }).start();
    }

    private onCancel(_e: EventTouch) {
        tween(this.node).to(0.1, { scale: this._base }, { easing: 'sineOut' }).start();
    }

    private onUp(_e: EventTouch) {
        tween(this.node).to(0.14, { scale: this._base }, { easing: 'backOut' }).start();
        if (this.tapAudio && GlobalAudioManager.instance) {
            const ac = this.tapAudio.getComponent(AudioContent);
            if (ac) GlobalAudioManager.instance.playOneShot(ac);
        }
        this._cb?.();
    }
}