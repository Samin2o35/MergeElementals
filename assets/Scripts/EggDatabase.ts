import { _decorator, Component, Prefab, SpriteFrame, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

/**
 * One step in the merge ladder. Now that each egg is its own prefab, the
 * shape/art/shadow/collider all live in `prefab`. `icon` is the egg-art
 * SpriteFrame used purely for UI (Next Up panel + Create This Egg panel).
 */
@ccclass('EggTier')
export class EggTier {
    /** Board prefab for this tier (Egg1..Egg9). */
    @property(Prefab)
    public prefab: Prefab = null!;

    /** Egg-art SpriteFrame for the Next Up + Target UI panels. */
    @property(SpriteFrame)
    public icon: SpriteFrame = null!;

    @property
    public displayName: string = '';
}

/**
 * Ordered merge chain + the win-target tier. Lives on GameController.
 * Drag the prefabs in tier order: index 0 = tier 1 (lowest), last = final egg.
 */
@ccclass('EggDatabase')
export class EggDatabase extends Component {

    @property({ type: [EggTier] })
    public tiers: EggTier[] = [];

    /** 0-based winning index. For 9 eggs the final egg is index 8. */
    @property({ type: CCInteger })
    public targetTierIndex: number = 0;

    public get count(): number { return this.tiers.length; }

    public getTier(index: number): EggTier | null {
        if (index < 0 || index >= this.tiers.length) return null;
        return this.tiers[index];
    }

    /** Clamped target so an out-of-range value can't break the win check. */
    public get effectiveTarget(): number {
        return Math.min(Math.max(this.targetTierIndex, 0), this.count - 1);
    }
}