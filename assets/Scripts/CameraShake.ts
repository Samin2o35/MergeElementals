import { _decorator, Component, Vec3, tween, Tween } from 'cc';
const { ccclass } = _decorator;

/**
 * Put on the Camera node. Call CameraShake.instance?.shake() from anywhere
 * (monster hit, piece destroyed) for a quick positional shake.
 */
@ccclass('CameraShake')
export class CameraShake extends Component {

    public static instance: CameraShake | null = null;
    private _base: Vec3 = new Vec3();

    onLoad() {
        CameraShake.instance = this;
        this._base = this.node.position.clone();
    }
    onDestroy() {
        if (CameraShake.instance === this) CameraShake.instance = null;
    }

    /** strength in px, duration in seconds. */
    public shake(strength: number = 12, duration: number = 0.18) {
        Tween.stopAllByTarget(this.node);
        const steps = 6;
        const step = duration / steps;
        const seq = tween(this.node);
        for (let i = 0; i < steps; i++) {
            const f = 1 - i / steps; // decay
            const dx = (Math.random() * 2 - 1) * strength * f;
            const dy = (Math.random() * 2 - 1) * strength * f;
            seq.to(step, { position: new Vec3(this._base.x + dx, this._base.y + dy, this._base.z) });
        }
        seq.to(step, { position: this._base.clone() }).start();
    }
}