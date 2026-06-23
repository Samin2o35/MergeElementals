import { _decorator, Component, Prefab } from 'cc';
const { ccclass, property } = _decorator;

/**
 * One step in the merge ladder. `prefab` is the PHYSICS body for this tier
 * (Egg1..Egg7): shadow root + RigidBody2D + CircleCollider2D + Egg.ts + an
 * "Egg Art" child sprite. The art baked into the prefab is only a placeholder;
 * at spawn the game overwrites it with the current theme's art via
 * egg.setArt(themeManager.tierSprite(tier)). So all this needs is the prefab.
 */
@ccclass('EggTier')
export class EggTier {
    /** Physics prefab for this tier. Index order = merge order (0 = lowest). */
    @property(Prefab)
    public prefab: Prefab = null!;
}

/**
 * Ordered merge chain. Lives on GameController.
 * Drag the prefabs in tier order: index 0 = tier 1 (lowest), last = top tier.
 * Endless game: there is no win target.
 */
@ccclass('EggDatabase')
export class EggDatabase extends Component {

    @property({ type: [EggTier] })
    public tiers: EggTier[] = [];

    public get count(): number { return this.tiers.length; }

    public getTier(index: number): EggTier | null {
        if (index < 0 || index >= this.tiers.length) return null;
        return this.tiers[index];
    }
}