import { _decorator, Component, Label, Color, Vec3, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Damage number that pops, rises, and fades, then self-destructs.
 * Prefab: a node with a Label + this component (wire `label`).
 */
@ccclass('FloatingText')
export class FloatingText extends Component {

    @property(Label) label: Label = null!;
    @property riseDistance: number = 80;
    @property duration: number = 0.7;

    public show(text: string, color: Color) {
        if (this.label) {
            this.label.string = text;
            this.label.color = color;
        }
        const op = this.getComponent(UIOpacity) ?? this.addComponent(UIOpacity);
        op.opacity = 255;

        const p = this.node.position.clone();
        this.node.setScale(0.6, 0.6, 1);
        tween(this.node).to(0.12, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }).start();
        tween(this.node)
            .to(this.duration, { position: new Vec3(p.x, p.y + this.riseDistance, p.z) }, { easing: 'quadOut' })
            .start();
        tween(op)
            .delay(this.duration * 0.4)
            .to(this.duration * 0.6, { opacity: 0 })
            .call(() => { if (this.node.isValid) this.node.destroy(); })
            .start();
    }
}