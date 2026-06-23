import { _decorator, Component, Sprite, SpriteFrame, CCInteger, CCFloat, director } from 'cc';
const { ccclass, property } = _decorator;

export const THEME_CHANGED = 'theme-changed';

/**
 * One theme: the room image (bg, which already contains the board) + the
 * per-tier piece art + type-chart relations.
 *
 * `tierSprites` is a single set of 7 frames (index 0..6 = tier 1..7). The same
 * frames are used both ON the board piece and in the Next-Up UI, so you only
 * assign them once.
 */
@ccclass('ThemeData')
export class ThemeData {
    @property name: string = '';

    @property({ type: SpriteFrame, tooltip: 'Room image. Already includes the table/board.' })
    bg: SpriteFrame = null!;

    @property({ type: [SpriteFrame], tooltip: 'Piece art per tier (index 0..6 = tier 1..7).' })
    tierSprites: SpriteFrame[] = [];

    @property({ type: [CCInteger], tooltip: 'Monster theme indices this theme hits for 2x.' })
    strongVs: number[] = [];
    @property({ type: [CCInteger], tooltip: 'Monster theme indices this theme hits for 0.5x.' })
    weakVs: number[] = [];
}

/**
 * Owns the active theme, the switch-recharge bar, and the type chart.
 * On a successful switch it re-skins the BG and fires THEME_CHANGED;
 * ThrowMergeGame listens and re-skins every piece in play.
 */
@ccclass('ThemeManager')
export class ThemeManager extends Component {

    @property({ type: [ThemeData] }) themes: ThemeData[] = [];
    @property(Sprite) bgSprite: Sprite = null!;
    @property(Sprite) rechargeFill: Sprite = null!; // Type = FILLED

    @property({ type: CCFloat, tooltip: 'Seconds to refill the theme-switch bar after a swap.' })
    rechargeSeconds: number = 8;

    private _current: number = 0;
    private _recharge: number = 1; // 0..1, starts full

    get current(): number { return this._current; }
    get canSwitch(): boolean { return this._recharge >= 1; }

    start() {
        this.applyTheme(this._current);
        this._recharge = 1;
        this.updateBar();
    }

    update(dt: number) {
        if (this._recharge < 1) {
            this._recharge = Math.min(1, this._recharge + dt / this.rechargeSeconds);
            this.updateBar();
        }
    }

    /** Switch if the bar is full and it's a different theme. Returns success. */
    public trySwitchTo(index: number): boolean {
        if (!this.canSwitch || index === this._current || index < 0 || index >= this.themes.length) return false;
        this._current = index;
        this._recharge = 0;
        this.updateBar();
        this.applyTheme(index);
        return true;
    }

    private applyTheme(index: number) {
        const t = this.themes[index];
        if (!t) return;
        if (this.bgSprite && t.bg) this.bgSprite.spriteFrame = t.bg;
        director.emit(THEME_CHANGED);
    }

    /** Art for a tier in the current theme. Used on the board piece AND the UI. */
    public tierSprite(tier: number): SpriteFrame | null {
        const t = this.themes[this._current];
        return t ? (t.tierSprites[tier] ?? null) : null;
    }
    /** Alias kept so UI call sites read clearly; same frames as tierSprite. */
    public tierIcon(tier: number): SpriteFrame | null {
        return this.tierSprite(tier);
    }

    /** Current theme's multiplier vs a monster theme. Immunity handled by the caller. */
    public effectiveness(monsterTheme: number): number {
        const t = this.themes[this._current];
        if (!t) return 1;
        if (t.strongVs.indexOf(monsterTheme) >= 0) return 2;
        if (t.weakVs.indexOf(monsterTheme) >= 0) return 0.5;
        return 1;
    }

    private updateBar() {
        if (this.rechargeFill) this.rechargeFill.fillRange = this._recharge;
    }
}