import { _decorator, Component, Node, Sprite, tween } from 'cc';
import { RunManager, RunEvent } from './RunManager';
import { EggSpeciesDatabase } from './EggSpeciesDatabase';
import { EggVariant } from './EggTypes';

const { ccclass, property } = _decorator;

/** Shows the run's ladder. Unreached slots hold the `?` icon. */
@ccclass('EvolutionChart')
export class EvolutionChart extends Component {

    @property(RunManager) run: RunManager = null!;
    @property(EggSpeciesDatabase) db: EggSpeciesDatabase = null!;

    @property({ type: [Sprite], tooltip: 'Egg1..Egg9 sprites, in ladder order.' })
    slots: Sprite[] = [];

    start() {
        this.run.events.on(RunEvent.LADDER_CHANGED, this.refresh, this);
        this.refresh();
    }

    onDestroy() {
        this.run.events.off(RunEvent.LADDER_CHANGED, this.refresh, this);
    }

    private refresh() {
        for (let i = 0; i < this.slots.length; i++) {
            const sp = this.slots[i];
            if (!sp) continue;
            const species = this.run.speciesAt(i);
            const next = species ? species.icon(EggVariant.Normal) : this.db.lockedIcon(EggVariant.Normal);
            if (sp.spriteFrame === next) continue;
            sp.spriteFrame = next;
            if (species) this.pop(sp.node);
        }
    }

    private pop(n: Node) {
        const base = n.scale.clone();
        n.setScale(base.x * 0.5, base.y * 0.5, base.z);
        tween(n).to(0.22, { scale: base }, { easing: 'backOut' }).start();
    }
}