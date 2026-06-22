import { _decorator, Component, Node, CCString, Input, EventTouch, tween, Vec3 } from 'cc';
import { AdManager } from './AdManager';
const { ccclass, property } = _decorator;

@ccclass('ClickRedirect')
export class ClickRedirect extends Component {
    @property(CCString)
    IosLink: string = "";

    @property(CCString)
    PlayStoreLink: string = "";

    private originalScale: Vec3 = new Vec3();

    start() {
        // Store the original scale
        this.originalScale = this.node.scale.clone();
        
        // Make the node clickable by listening to touch events
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDestroy() {
        // Clean up event listeners
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onTouchStart(event: EventTouch) {
        // Scale down effect when pressed
        tween(this.node)
            .to(0.1, { scale: this.originalScale.clone().multiplyScalar(0.9) }, { easing: 'sineOut' })
            .start();
    }

    private onTouchCancel(event: EventTouch) {
        // Return to original scale if touch is cancelled
        tween(this.node)
            .to(0.1, { scale: this.originalScale }, { easing: 'sineOut' })
            .start();
    }

    private onTouchEnd(event: EventTouch) {
        // Return to original scale with a bounce effect
        tween(this.node)
            .to(0.15, { scale: this.originalScale }, { easing: 'backOut' })
            .start();

        // Proceed with the redirect
        this.onClick();
    }

    public onClick() {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.userAgent.includes("Macintosh");
        const isAndroid = /Android/i.test(navigator.userAgent);

        const appStoreURL = this.IosLink;
        const playStoreURL = this.PlayStoreLink;

        const targetURL = isIOS ? appStoreURL : playStoreURL;

        AdManager.openStore(targetURL);
    }
}