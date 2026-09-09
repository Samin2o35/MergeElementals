import { _decorator, Component, Node, Sprite, Label, Prefab, instantiate } from 'cc';
import { RunManager } from './RunManager';
import { CodexStore } from './CodexStore';
import { EggSpecies, EggVariant } from './EggTypes';
import { UiButton } from './UiButton';

const { ccclass, property } = _decorator;

/** Choose one egg discovered this run to enter the next run three tiers lower. */
@ccclass('HeirloomPicker')
export class HeirloomPicker extends Component {

    @property(Node) container: Node = null!;
    @property(Prefab) optionPrefab: Prefab = null!;
    @property(Label) hintLabel: Label = null!;

    private _selected: { species: EggSpecies; variant: EggVariant } | null = null;

    public build(run: RunManager) {
        this.container.removeAllChildren();
        this._selected = null;

        const seen = run.discoveries;
        if (this.hintLabel) {
            this.hintLabel.string = seen.length ? 'Carry one into your next run' : 'No new eggs this run';
        }

        for (const d of seen) {
            const n = instantiate(this.optionPrefab);
            this.container.addChild(n);
            const sp = n.getComponentInChildren(Sprite);
            if (sp) sp.spriteFrame = d.species.icon(d.variant);
            n.getComponent(UiButton)?.onTap(() => this.select(d));
        }
    }

    private select(d: { species: EggSpecies; variant: EggVariant }) {
        this._selected = d;
        if (this.hintLabel) this.hintLabel.string = `${d.species.displayName} will join your next run`;
    }

    public commit(run: RunManager) {
        if (!this._selected) return;
        CodexStore.setHeirloom({
            id: this._selected.species.id,
            variant: this._selected.variant,
            tier: run.highestTier,
        });
    }
}