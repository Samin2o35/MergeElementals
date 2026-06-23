import { _decorator, Component, CCInteger, Button } from 'cc';
import { ThemeManager } from './ThemeManager';

const { ccclass, property } = _decorator;

/**
 * One per theme-switch button. On tap, asks the ThemeManager to switch to
 * `themeIndex`. The switch only goes through if the recharge bar is full —
 * the manager handles that gate, so this stays dumb.
 *
 * Wire either: (a) a cc.Button's click event to onTap, or
 * (b) nothing — this auto-binds to a Button on the same node if present.
 */
@ccclass('ThemeButton')
export class ThemeButton extends Component {

    @property(ThemeManager) themeManager: ThemeManager = null!;

    @property({ type: CCInteger, tooltip: 'Which theme (0-7) this button selects.' })
    themeIndex: number = 0;

    onLoad() {
        const btn = this.getComponent(Button);
        if (btn) this.node.on(Button.EventType.CLICK, this.onTap, this);
    }

    onDestroy() {
        this.node.off(Button.EventType.CLICK, this.onTap, this);
    }

    public onTap() {
        if (this.themeManager) this.themeManager.trySwitchTo(this.themeIndex);
    }
}