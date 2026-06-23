import { _decorator, Component, Sprite, SpriteFrame, CCInteger, CCFloat, director } from 'cc';
const { ccclass, property } = _decorator;

export const THEME_CHANGED = 'theme-changed';

/** One theme: skins (bg/board/per-tier piece art) + type-chart relations. */
@ccclass('ThemeData')
export class ThemeData {
    @property name: string = '';
    @property(SpriteFrame) bg: SpriteFrame = null!;
    @property(SpriteFrame) board: SpriteFrame = null!;

    @property({ type: [SpriteFrame], tooltip: 'Piece art per tier (index 0..6).' })
    tierSprites: SpriteFrame[] = [];
    @property({ type: [SpriteFrame], tooltip: 'Preview/next icon per tier (index 0..6).' })
    tierIcons: SpriteFrame[] = [];

    @property({ type: [CCInteger], tooltip: 'Monster theme indices this theme hits for 2x.' })
    strongVs: number[] = [];
    @property({ type: [CCInteger], tooltip: 'Monster theme indices this theme hits for 0.5x.' })
    weakVs: number[] = [];
}

/**
 * Owns the active theme, the switch-recharge bar, and the type chart.
 * On a successful switch it re-skins BG/Board and fires THEME_CHANGED;
 * ThrowMergeGame listens and re-skins every piece in play.
 */
@ccclass('ThemeManager')
export class ThemeManager extends Component {

    @property({ type: [ThemeData] }) themes: ThemeData[] = [];
    @property(Sprite) bgSprite: Sprite = null!;
    @property(Sprite) boardSprite: Sprite = null!;
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
        if (this.boardSprite && t.board) this.boardSprite.spriteFrame = t.board;
        director.emit(THEME_CHANGED);
    }

    public tierSprite(tier: number): SpriteFrame | null {
        const t = this.themes[this._current];
        return t ? (t.tierSprites[tier] ?? null) : null;
    }
    public tierIcon(tier: number): SpriteFrame | null {
        const t = this.themes[this._current];
        return t ? (t.tierIcons[tier] ?? null) : null;
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