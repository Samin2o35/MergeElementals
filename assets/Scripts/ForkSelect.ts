import { _decorator, Component, Label } from 'cc';
import { EggSpecies } from './EggTypes';
import { ForkCard } from './ForkCard';

const { ccclass, property } = _decorator;

@ccclass('ForkSelect')
export class ForkSelect extends Component {

    @property(Label) titleLabel: Label = null!;
    @property({ type: [ForkCard] }) cards: ForkCard[] = [];

    @property({ tooltip: 'Stagger between card deal-ins.' })
    dealStagger: number = 0.07;

    public show(tier: number, offer: EggSpecies[], onPick: (s: EggSpecies) => void) {
        this.node.active = true;
        if (this.titleLabel) this.titleLabel.string = `Choose your tier ${tier + 1} egg`;

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            if (i >= offer.length) { card.node.active = false; continue; }
            card.bind(offer[i], s => { this.hide(); onPick(s); });
            card.dealIn(i * this.dealStagger);
        }
    }

    private hide() { this.node.active = false; }
}