/**
 * MergeEffect.ts
 * Attach to: MergeFX prefab (empty node, anchor 0.5/0.5)
 *
 * Tasty-Travels style merge burst, fully code-driven (no assets):
 *   1. A quick central white flash that pops and fades
 *   2. An expanding soft glow RING (shockwave) that fades as it grows
 *   3. A ring of twinkling 4-point SPARKLE stars (gold + white) that fly
 *      outward, scale up then shrink, rotate slightly, and fade
 *
 * Self-destructs when complete. The merged egg's own scale-bounce is handled
 * by the controller; this is the sparkle layer on top.
 */

import {
    _decorator, Component, Node, Vec3, Color,
    tween, UIOpacity, Graphics, UITransform,
    CCInteger, CCFloat,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MergeEffect')
export class MergeEffect extends Component {

    // ======================================================
    // INSPECTOR (fine-tuning)
    // ======================================================

    @property({ type: CCFloat, tooltip: 'Radius of the central white flash.' })
    public flashRadius: number = 26;

    @property({ type: CCFloat, tooltip: 'How far the glow ring expands (px).' })
    public ringRadius: number = 60;

    @property({ type: CCInteger, tooltip: 'Number of sparkle stars in the burst.' })
    public sparkleCount: number = 7;

    @property({ type: CCFloat, tooltip: 'How far the sparkles fly from centre (px).' })
    public sparkleDistance: number = 55;

    @property({ type: CCFloat, tooltip: 'Size of each sparkle star (px).' })
    public sparkleSize: number = 13;

    @property({ type: CCFloat, tooltip: 'Total duration before the node self-destructs.' })
    public duration: number = 0.5;

    // ======================================================
    // COLOUR PALETTES  (gold + white — the merge-game sparkle look)
    // ======================================================

    static readonly GOLD       = new Color(255, 210, 90,  255);
    static readonly LIGHT_GOLD = new Color(255, 236, 160, 255);
    static readonly WHITE      = new Color(255, 255, 255, 255);

    static readonly DEFAULT_COLORS: Color[] = [
        MergeEffect.GOLD,
        MergeEffect.WHITE,
        MergeEffect.LIGHT_GOLD,
    ];

    // Kept for controller compatibility. Identical gold/white per tier so the
    // burst reads the same all the way up the ladder (like the reference).
    static readonly TIER_COLORS: Color[][] = [
        [MergeEffect.GOLD, MergeEffect.WHITE],
        [MergeEffect.GOLD, MergeEffect.WHITE],
        [MergeEffect.GOLD, MergeEffect.WHITE],
        [MergeEffect.GOLD, MergeEffect.WHITE],
        [MergeEffect.GOLD, MergeEffect.WHITE],
        [MergeEffect.GOLD, MergeEffect.WHITE],
        [MergeEffect.GOLD, MergeEffect.WHITE],
        [MergeEffect.GOLD, MergeEffect.WHITE],
        [MergeEffect.GOLD, MergeEffect.WHITE],
    ];

    // ======================================================
    // PUBLIC API
    // ======================================================

    /** Trigger the effect. Call immediately after addChild + setWorldPosition. */
    public play(colors: Color[] = MergeEffect.DEFAULT_COLORS): void {
        const accent = colors[0] ?? MergeEffect.GOLD;

        this.spawnFlash();
        this.spawnRing(accent);

        for (let i = 0; i < this.sparkleCount; i++) {
            const baseAngle = (i / this.sparkleCount) * Math.PI * 2;
            const jitter    = (Math.random() - 0.5) * 0.4;
            const col       = (i % 2 === 0) ? MergeEffect.WHITE : accent;
            this.spawnSparkle(baseAngle + jitter, col);
        }

        this.scheduleOnce(() => {
            if (this.node.isValid) this.node.destroy();
        }, this.duration);
    }

    // ======================================================
    // CENTRAL FLASH
    // ======================================================

    private spawnFlash(): void {
        const node = new Node('flash');
        node.addComponent(UITransform);
        this.node.addChild(node);

        const g = node.addComponent(Graphics);
        g.fillColor = new Color(255, 255, 235, 255);
        g.circle(0, 0, this.flashRadius);
        g.fill();

        const op = node.addComponent(UIOpacity);
        node.setScale(new Vec3(0.3, 0.3, 1));

        tween(node)
            .to(0.16, { scale: new Vec3(1.6, 1.6, 1) }, { easing: 'quadOut' })
            .start();
        tween(op)
            .to(0.20, { opacity: 0 }, { easing: 'sineIn' })
            .start();
    }

    // ======================================================
    // GLOW RING (shockwave)
    // ======================================================

    private spawnRing(color: Color): void {
        const node = new Node('ring');
        node.addComponent(UITransform);
        this.node.addChild(node);

        const g = node.addComponent(Graphics);
        g.lineWidth   = 7;
        g.strokeColor = new Color(color.r, color.g, color.b, 255);
        g.circle(0, 0, this.ringRadius);
        g.stroke();

        const op = node.addComponent(UIOpacity);
        node.setScale(new Vec3(0.25, 0.25, 1));

        tween(node)
            .to(0.34, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .start();
        tween(op)
            .to(0.34, { opacity: 0 }, { easing: 'quadOut' })
            .start();
    }

    // ======================================================
    // SPARKLE STARS
    // ======================================================

    /** Twinkling 4-point star that flies outward, peaks, then shrinks + fades. */
    private spawnSparkle(angle: number, color: Color): void {
        const node = new Node('sparkle');
        node.addComponent(UITransform);
        this.node.addChild(node);

        const g = node.addComponent(Graphics);
        g.fillColor = color;
        this.drawSparkle(g, this.sparkleSize);

        const op = node.addComponent(UIOpacity);
        node.setScale(new Vec3(0, 0, 1));
        const startAngle = Math.random() * 90;
        node.angle = startAngle;

        const dist = this.sparkleDistance * (0.7 + Math.random() * 0.5);
        const tx   = Math.cos(angle) * dist;
        const ty   = Math.sin(angle) * dist;

        tween(node)
            .to(0.14, { position: new Vec3(tx, ty, 0), scale: new Vec3(1.1, 1.1, 1), angle: startAngle + 35 }, { easing: 'quadOut' })
            .to(0.22, { scale: new Vec3(0.35, 0.35, 1), angle: startAngle + 60 }, { easing: 'quadIn' })
            .start();
        tween(op)
            .delay(0.16)
            .to(0.20, { opacity: 0 }, { easing: 'sineIn' })
            .start();
    }

    /** Draw a 4-point sparkle (8-vertex star) centred at the origin. */
    private drawSparkle(g: Graphics, size: number): void {
        const outer = size;
        const inner = size * 0.32;
        const pts   = 4;
        for (let i = 0; i < pts * 2; i++) {
            const r = (i % 2 === 0) ? outer : inner;
            const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (i === 0) g.moveTo(x, y);
            else         g.lineTo(x, y);
        }
        g.close();
        g.fill();
    }
}