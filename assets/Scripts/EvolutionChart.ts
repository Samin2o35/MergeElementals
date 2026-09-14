import { _decorator, Component, Sprite, CCFloat } from 'cc';
import { RunManager, RunEvent } from './RunManager';
import { EggSpeciesDatabase } from './EggSpeciesDatabase';
import { EggSpecies, EggVariant } from './EggTypes';
import { EggFX } from './EggFX';

const { ccclass, property } = _decorator;

/**
 * Shows only what the player has actually made this run. Slots ahead of the
 * player stay `?` even once the ladder has assigned them, so the chart is a
 * record rather than a spoiler.
 */
@ccclass('EvolutionChart')
export class EvolutionChart extends Component {

    @property(RunManager) run: RunManager = null!;
    @property(EggSpeciesDatabase) db: EggSpeciesDatabase = null!;

    @property({ type: [Sprite], tooltip: 'Egg1..Egg9 sprites, in ladder order.' })
    slots: Sprite[] = [];

    @property({ type: [EggFX], tooltip: 'EggFX on the same nodes as slots, same order. Optional.' })
    slotFx: EggFX[] = [];

    @property({ type: CCFloat, tooltip: 'Delay before the reveal plays, so the merge burst lands first.' })
    revealDelay: number = 0.18;

    onLoad() {
        this.run.events.on(RunEvent.DISCOVERED, this.onDiscovered, this);
        this.run.events.on(RunEvent.LADDER_CHANGED, this.refresh, this);
    }

    onDestroy() {
        this.run.events.off(RunEvent.DISCOVERED, this.onDiscovered, this);
        this.run.events.off(RunEvent.LADDER_CHANGED, this.refresh, this);
    }

    start() { this.refresh(); }

    /** Repaints without animation. Used on load and after a fork reshuffles slots. */
    private refresh() {
        for (let i = 0; i < this.slots.length; i++) {
            const sp = this.slots[i];
            if (!sp) continue;
            const s = this.run.speciesAt(i);
            const shown = s && this.run.isSeen(s.id);
            sp.spriteFrame = shown ? s!.icon(EggVariant.Normal) : this.db.lockedIcon(EggVariant.Normal);
        }
    }

    private onDiscovered(species: EggSpecies, _variant: EggVariant) {
        const tier = this.tierOf(species);
        if (tier < 0) return;

        const sp = this.slots[tier];
        const fx = this.slotFx[tier];
        if (!sp) return;

        const target = species.icon(EggVariant.Normal);
        if (!fx) { sp.spriteFrame = target; return; }

        this.scheduleOnce(() => {
            fx.playReveal(species.fx, this.db.lockedIcon(EggVariant.Normal), target, false);
        }, this.revealDelay);
    }

    private tierOf(species: EggSpecies): number {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.run.speciesAt(i)?.id === species.id) return i;
        }
        return -1;
    }
}