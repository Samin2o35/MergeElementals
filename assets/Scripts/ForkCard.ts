import { _decorator, Component, Sprite, Label, tween, UIOpacity } from 'cc';
import { EggSpecies, EggVariant } from './EggTypes';
import { UiButton } from './UiButton';

const { ccclass, property } = _decorator;

/** One fork option. Lives on Card0..Card2. */
@ccclass('ForkCard')
export class ForkCard extends Component {

    @property(Sprite) icon: Sprite = null!;
    @property(Label) nameLabel: Label = null!;
    @property(Label) familyLabel: Label = null!;
    @property(UiButton) button: UiButton = null!;

    private _species: EggSpecies | null = null;

    public bind(s: EggSpecies, onPick: (s: EggSpecies) => void) {
        this._species = s;
        this.node.active = true;
        if (this.icon) this.icon.spriteFrame = s.icon(EggVariant.Normal);
        if (this.nameLabel) this.nameLabel.string = s.displayName;
        if (this.familyLabel) this.familyLabel.string = s.family;
        this.button?.onTap(() => { if (this._species) onPick(this._species); });
    }

    public dealIn(delay: number) {
        const base = this.node.scale.clone();
        this.node.setScale(base.x * 0.7, base.y * 0.7, base.z);
        const op = this.node.getComponent(UIOpacity) ?? this.node.addComponent(UIOpacity);
        op.opacity = 0;
        tween(this.node).delay(delay).to(0.26, { scale: base }, { easing: 'backOut' }).start();
        tween(op).delay(delay).to(0.2, { opacity: 255 }).start();
    }
}