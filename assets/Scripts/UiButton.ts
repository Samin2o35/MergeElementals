import { _decorator, Component, Node, Input, EventTouch, tween, Tween, Vec3, CCFloat } from 'cc';
import { GlobalAudioManager } from './GlobalAudioManager';
import { AudioContent } from './AudioContent';

const { ccclass, property } = _decorator;

/** Tap feedback + sfx. Subscribe via onTap, not the Cocos Button component. */
@ccclass('UiButton')
export class UiButton extends Component {

    @property(Node) tapAudio: Node = null!;
    @property({ type: CCFloat }) pressScale: number = 0.92;

    private _base: Vec3 = new Vec3(1, 1, 1);
    private _cb: (() => void) | null = null;

    onLoad() {
        // onLoad, not start: a sibling's intro tween may have already shrunk the
        // node by the time start() runs, which would bake the shrunk value in.
        this._base = this.node.scale.clone();
    }

    start() {
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

    /** Point the press animation at a different rest scale. */
    public setBaseScale(v: Readonly<Vec3>) { this._base = v.clone(); }

    private onDown(_e: EventTouch) {
        Tween.stopAllByTarget(this.node);
        tween(this.node).to(0.08, { scale: this._base.clone().multiplyScalar(this.pressScale) }, { easing: 'sineOut' }).start();
    }

    private onCancel(_e: EventTouch) {
        Tween.stopAllByTarget(this.node);
        tween(this.node).to(0.1, { scale: this._base }, { easing: 'sineOut' }).start();
    }

    private onUp(_e: EventTouch) {
        Tween.stopAllByTarget(this.node);
        tween(this.node).to(0.14, { scale: this._base }, { easing: 'backOut' }).start();
        if (this.tapAudio && GlobalAudioManager.instance) {
            const ac = this.tapAudio.getComponent(AudioContent);
            if (ac) GlobalAudioManager.instance.playOneShot(ac);
        }
        this._cb?.();
    }
}