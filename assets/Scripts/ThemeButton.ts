import { _decorator, Component, CCInteger, Node, EventTouch } from 'cc';
import { ThemeManager } from './ThemeManager';

const { ccclass, property } = _decorator;

/**
 * One per theme-switch wedge. On tap, asks the ThemeManager to switch to
 * `themeIndex`. The switch only goes through if the recharge bar is full —
 * the manager handles that gate, so this stays dumb.
 *
 * Listens for touches directly on its own node, so the node only needs a
 * UITransform (size = the tappable area). No cc.Button or Sprite required.
 */
@ccclass('ThemeButton')
export class ThemeButton extends Component {

    @property(ThemeManager) themeManager: ThemeManager = null!;

    @property({ type: CCInteger, tooltip: 'Which theme (0-7) this wedge selects.' })
    themeIndex: number = 0;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_END, this.onTap, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this.onTap, this);
    }

    public onTap(_e?: EventTouch) {
        if (this.themeManager) this.themeManager.trySwitchTo(this.themeIndex);
    }
}