import { _decorator, Component, SpriteFrame, CCInteger, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

/** One monster definition. Color variants are separate entries with their own `theme`. */
@ccclass('MonsterData')
export class MonsterData {
    @property name: string = '';
    @property(SpriteFrame) sprite: SpriteFrame = null!;

    @property({ type: CCInteger, tooltip: 'Which of the 8 themes this monster is (0-7).' })
    theme: number = 0;

    @property({ type: CCInteger, tooltip: 'Spawn cost for the round budget: cheap=1, mid=2, expensive=4.' })
    cost: number = 1;

    @property({ type: CCFloat })
    baseHP: number = 10;

    @property({ type: CCFloat })
    maxRage: number = 10;

    @property({ type: CCFloat, tooltip: 'Rage units filled per second (passive).' })
    rageFillPerSec: number = 0.7;

    @property({ type: CCInteger, tooltip: 'Pieces destroyed per attack.' })
    piecesPerAttack: number = 1;

    @property({ type: [CCInteger], tooltip: 'Theme indices this monster takes 0 damage from.' })
    immuneThemes: number[] = [];

    @property isBoss: boolean = false;
}

/** Holds the full roster. Put on the RoundManager node. */
@ccclass('MonsterDatabase')
export class MonsterDatabase extends Component {

    @property({ type: [MonsterData] }) monsters: MonsterData[] = [];
    @property({ type: [MonsterData] }) bosses: MonsterData[] = [];

    /** All non-boss monsters affordable at or under `maxCost`. */
    public affordable(maxCost: number): MonsterData[] {
        return this.monsters.filter(m => m.cost <= maxCost);
    }

    public randomAffordable(maxCost: number): MonsterData | null {
        const pool = this.affordable(maxCost);
        if (!pool.length) return null;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    public boss(cycleIndex: number): MonsterData | null {
        if (!this.bosses.length) return null;
        return this.bosses[cycleIndex % this.bosses.length];
    }
}