import { _decorator, Component, Label, CCFloat } from 'cc';
import { EggSpeciesDatabase } from './EggSpeciesDatabase';
import { EggSpecies, EggVariant } from './EggTypes';
import { CodexStore } from './CodexStore';
import { CodexCell } from './CodexCell';
import { UiButton } from './UiButton';
import { BookAnim } from './BookAnim';

const { ccclass, property } = _decorator;

@ccclass('CodexView')
export class CodexView extends Component {

    @property(EggSpeciesDatabase) db: EggSpeciesDatabase = null!;
    @property(BookAnim) book: BookAnim = null!;

    @property({ type: [CodexCell], tooltip: 'PageLeft slots then PageRight slots, in reading order.' })
    cells: CodexCell[] = [];

    @property(Label) titleLabel: Label = null!;
    @property(Label) countLabel: Label = null!;
    @property(UiButton) closeButton: UiButton = null!;
    @property(UiButton) prevButton: UiButton = null!;
    @property(UiButton) nextButton: UiButton = null!;

    @property({ type: CCFloat, tooltip: 'Pause before an auto-reveal starts.' })
    revealDelay: number = 0.35;

    private _page = 0;
    private _onClosed: (() => void) | null = null;

    start() {
        this.closeButton?.onTap(() => this.close());
        this.prevButton?.onTap(() => this.turn(-1));
        this.nextButton?.onTap(() => this.turn(1));
    }

    private get perSpread(): number { return this.cells.length; }

    private get pageCount(): number {
        return Math.max(1, Math.ceil(this.db.allEntries().length / this.perSpread));
    }

    public show(focus: { species: EggSpecies; variant: EggVariant } | null, onClosed: () => void) {
        this._onClosed = onClosed;
        this.node.active = true;

        if (focus) this._page = this.pageOf(focus.species, focus.variant);
        this.paint();

        this.book?.open(() => {
            if (!focus) return;
            const cell = this.cells.find(c => c.matches(focus.species, focus.variant));
            if (cell) this.scheduleOnce(() => cell.reveal(this.db), this.revealDelay);
        });
    }

    private pageOf(s: EggSpecies, v: EggVariant): number {
        const all = this.db.allEntries();
        const i = all.findIndex(e => e.species.id === s.id && e.variant === v);
        return i < 0 ? 0 : Math.floor(i / this.perSpread);
    }

    private turn(dir: number) {
        const next = this._page + dir;
        if (next < 0 || next >= this.pageCount) return;
        this._page = next;
        this.paint();
    }

    private paint() {
        const all = this.db.allEntries();
        const start = this._page * this.perSpread;
        for (let i = 0; i < this.cells.length; i++) {
            const e = all[start + i];
            this.cells[i].bind(this.db, e ? e.species : null, e ? e.variant : EggVariant.Normal);
        }
        if (this.titleLabel) this.titleLabel.string = `${this._page + 1} / ${this.pageCount}`;
        if (this.countLabel) this.countLabel.string = `${CodexStore.unlockedCount} / ${all.length}`;
    }

    private close() {
        this.book?.close(() => {
            this.node.active = false;
            const cb = this._onClosed;
            this._onClosed = null;
            cb?.();
        });
    }
}