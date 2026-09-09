import { _decorator, Component, Sprite, Label, UIOpacity, tween, CCFloat } from 'cc';
import { EggSpecies, EggVariant } from './EggTypes';

const { ccclass, property } = _decorator;

@ccclass('DiscoveryBanner')
export class DiscoveryBanner extends Component {

    @property(Sprite) icon: Sprite = null!;
    @property(Label) nameLabel: Label = null!;
    @property(Label) tagLabel: Label = null!;

    @property({ type: CCFloat }) holdTime: number = 1.1;

    public show(species: EggSpecies, variant: EggVariant, onDone: () => void) {
        this.node.active = true;
        if (this.icon) this.icon.spriteFrame = species.icon(variant);
        if (this.nameLabel) this.nameLabel.string = species.displayName;
        if (this.tagLabel) this.tagLabel.string = variant === EggVariant.Gold ? 'New — golden' : 'New';

        const base = this.node.scale.clone();
        const op = this.node.getComponent(UIOpacity) ?? this.node.addComponent(UIOpacity);
        op.opacity = 0;
        this.node.setScale(base.x * 0.6, base.y * 0.6, base.z);

        tween(this.node).to(0.24, { scale: base }, { easing: 'backOut' }).start();
        tween(op)
            .to(0.16, { opacity: 255 })
            .delay(this.holdTime)
            .to(0.22, { opacity: 0 })
            .call(() => { this.node.active = false; onDone(); })
            .start();
    }
}