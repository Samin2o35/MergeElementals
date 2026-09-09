import { _decorator, Component, Node, CCString, game } from 'cc';
import { GlobalAudioManager } from './GlobalAudioManager';
import { AudioContent } from './AudioContent';
import { AdManager } from './AdManager';

const { ccclass, property } = _decorator;

/** App-level bootstrap. Store links stay for playable-ad builds; harmless standalone. */
@ccclass('AppRoot')
export class AppRoot extends Component {

    @property({ type: CCString }) IosLink: string = '';
    @property({ type: CCString }) PlayStoreLink: string = '';

    @property(Node) BGM: Node = null!;

    onLoad() {
        game.addPersistRootNode(this.node);
    }

    start() {
        AdManager.gameReady();
        if (this.BGM && GlobalAudioManager.instance) {
            const ac = this.BGM.getComponent(AudioContent);
            if (ac) GlobalAudioManager.instance.playBGM(ac);
        }
    }

    public openStore() {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
            || navigator.userAgent.includes('Macintosh');
        AdManager.openStore(isIOS ? this.IosLink : this.PlayStoreLink);
    }
}