import { _decorator, Component, Node, Label, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EndCard')
export class EndCard extends Component {

    @property(Label)  disclaimerLabel: Label = null!;
    @property(Sprite) ctaSprite: Sprite = null!;
    @property(Sprite) buttonSprite: Sprite = null!;

    @property(SpriteFrame) winCtaFrame: SpriteFrame = null!;
    @property(SpriteFrame) loseCtaFrame: SpriteFrame = null!;

    @property(SpriteFrame) winButtonFrame: SpriteFrame = null!;
    @property(SpriteFrame) loseButtonFrame: SpriteFrame = null!;

    @property winText: string = 'You created the wanted Egg';
    @property loseText: string = 'You ran out of room';

    private onRedirect: (() => void) | null = null;

    /** Show the end card in its win or lose variant. */
    public show(won: boolean, onRedirect: () => void) {
        this.onRedirect = onRedirect;
        this.node.active = true;

        if (this.disclaimerLabel) {
            this.disclaimerLabel.string = won ? this.winText : this.loseText;
        }
        if (this.ctaSprite) {
            const frame = won ? this.winCtaFrame : this.loseCtaFrame;
            if (frame) this.ctaSprite.spriteFrame = frame;
        }
        if (this.buttonSprite) {
            const frame = won ? this.winButtonFrame : this.loseButtonFrame;
            if (frame) this.buttonSprite.spriteFrame = frame;
        }

        this.node.on(Node.EventType.TOUCH_END, this.onTapped, this);
    }

    private onTapped() {
        this.node.off(Node.EventType.TOUCH_END, this.onTapped, this);
        const cb = this.onRedirect;
        this.onRedirect = null;
        cb?.();
    }
}