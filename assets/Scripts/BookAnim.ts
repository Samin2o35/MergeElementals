import { _decorator, Component, Sprite, SpriteFrame, tween, Vec3, CCFloat } from 'cc';

const { ccclass, property } = _decorator;

/** Three-frame flipbook plus a scale squash. A shape change reads as "opening"; a crossfade doesn't. */
@ccclass('BookAnim')
export class BookAnim extends Component {

    @property(SpriteFrame) closedFrame: SpriteFrame = null!;
    @property(SpriteFrame) halfFrame: SpriteFrame = null!;
    @property(SpriteFrame) openFrame: SpriteFrame = null!;

    @property({ type: CCFloat, tooltip: 'Seconds per frame.' })
    frameTime: number = 0.09;

    @property({ type: CCFloat, tooltip: 'Horizontal squash on the closed frame.' })
    closedSquashX: number = 0.72;

    @property({ type: CCFloat, tooltip: 'Overall scale on the closed frame.' })
    closedScale: number = 0.86;

    private _sprite: Sprite = null!;
    private _base: Vec3 = new Vec3(1, 1, 1);

    onLoad() {
        this._sprite = this.getComponent(Sprite)!;
        this._base = this.node.scale.clone();
    }

    public snapOpen() {
        this._sprite.spriteFrame = this.openFrame;
        this.node.setScale(this._base);
    }

    public open(onDone?: () => void) {
        this._sprite.spriteFrame = this.closedFrame;
        this.node.setScale(this._base.x * this.closedScale * this.closedSquashX,
                           this._base.y * this.closedScale, this._base.z);

        this.scheduleOnce(() => { this._sprite.spriteFrame = this.halfFrame; }, this.frameTime);
        this.scheduleOnce(() => { this._sprite.spriteFrame = this.openFrame; }, this.frameTime * 2);

        tween(this.node)
            .to(this.frameTime * 3, { scale: this._base }, { easing: 'backOut' })
            .call(() => onDone?.())
            .start();
    }

    public close(onDone?: () => void) {
        this.scheduleOnce(() => { this._sprite.spriteFrame = this.halfFrame; }, this.frameTime);
        this.scheduleOnce(() => { this._sprite.spriteFrame = this.closedFrame; }, this.frameTime * 2);

        const target = new Vec3(this._base.x * this.closedScale * this.closedSquashX,
                                this._base.y * this.closedScale, this._base.z);
        tween(this.node)
            .to(this.frameTime * 3, { scale: target }, { easing: 'sineIn' })
            .call(() => onDone?.())
            .start();
    }
}