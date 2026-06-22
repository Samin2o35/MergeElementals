import {
    _decorator, Component, Node, CCString,
    director, input, Input, EventTouch,
} from 'cc';

import { GlobalAudioManager } from './GlobalAudioManager';
import { AudioContent }       from './AudioContent';
import { AdManager }          from './AdManager';
import { EndCard }            from './EndCard';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: CCString }) IosLink: string = '';
    @property({ type: CCString }) PlayStoreLink: string = '';

    @property(Node) BGM: Node = null!;
    @property      RedirectDelay: number = 1.0;

    @property(EndCard) EndCardComp: EndCard = null!;

    onLoad() {
        // Optional fallback: any system can director.emit('GameComplete')
        // to arm a "tap anywhere → store" redirect after RedirectDelay.
        director.on('GameComplete', this.onGameComplete, this);
    }

    start() {
        AdManager.gameReady();
        if (this.BGM && GlobalAudioManager.instance) {
            GlobalAudioManager.instance.playBGM(this.BGM.getComponent(AudioContent));
        }
    }

    onDestroy() {
        director.off('GameComplete', this.onGameComplete, this);
        input.off(Input.EventType.TOUCH_START, this.onTap, this);
    }

    /**
     * Call when the round ends. Notifies the ad network and shows the end card
     * in its win or lose variant; tapping it redirects to the store.
     */
    public showEndCard(won: boolean) {
        AdManager.gameEnd();
        this.EndCardComp.show(won, () => this.Redirect());
    }

    private onGameComplete() {
        this.scheduleOnce(() => {
            input.on(Input.EventType.TOUCH_START, this.onTap, this);
        }, this.RedirectDelay);
    }

    private onTap = (_e: EventTouch) => {
        input.off(Input.EventType.TOUCH_START, this.onTap, this);
        this.Redirect();
    };

    public Redirect() {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
            || navigator.userAgent.includes('Macintosh');
        AdManager.openStore(isIOS ? this.IosLink : this.PlayStoreLink);
    }
}