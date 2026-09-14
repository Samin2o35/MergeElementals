import { _decorator, Component, Node, Label, CCFloat } from 'cc';
import { EggSpeciesDatabase } from './EggSpeciesDatabase';
import { EggVariant } from './EggTypes';
import { CodexStore, Entry } from './CodexStore';
import { CodexCell } from './CodexCell';
import { CodexPanZoom } from './CodexPanZoom';
import { UiButton } from './UiButton';
import { BookAnim } from './BookAnim';

const { ccclass, property } = _decorator;

@ccclass('CodexView')
export class CodexView extends Component {

    @property(EggSpeciesDatabase) db: EggSpeciesDatabase = null!;
    @property(BookAnim) book: BookAnim = null!;
    @property(CodexPanZoom) view: CodexPanZoom = null!;

    @property({ type: [Node], tooltip: 'Page grid roots in reading order. Cells are read from their children in sibling order.' })
    pageRoots: Node[] = [];

    @property(Label) titleLabel: Label = null!;
    @property(Label) countLabel: Label = null!;
    @property(UiButton) closeButton: UiButton = null!;
    @property(UiButton) prevButton: UiButton = null!;
    @property(UiButton) nextButton: UiButton = null!;

    @property({ type: CCFloat, tooltip: 'Zoom level used while revealing a new egg.' })
    revealZoom: number = 2.6;
    @property({ type: CCFloat, tooltip: 'Seconds for each camera move during the tour.' })
    moveTime: number = 0.45;
    @property({ type: CCFloat, tooltip: 'Pause on a cell before its reveal fires.' })
    settleTime: number = 0.2;

    private _cells: CodexCell[] = [];
    private _page = 0;
    private _onClosed: (() => void) | null = null;

    onLoad() {
        this._cells = [];
        for (const root of this.pageRoots) {
            if (!root) continue;
            for (const child of root.children) {
                const c = child.getComponent(CodexCell);
                if (c) this._cells.push(c);
            }
        }
        if (!this._cells.length) console.warn('[CodexView] no cells found — set pageRoots.');
    }

    start() {
        this.closeButton?.onTap(() => this.close());
        this.prevButton?.onTap(() => this.turn(-1));
        this.nextButton?.onTap(() => this.turn(1));
    }

    private get perSpread(): number { return Math.max(this._cells.length, 1); }

    private get pageCount(): number {
        return Math.max(1, Math.ceil(this.db.allEntries().length / this.perSpread));
    }

    public show(onClosed: () => void) {
        this._onClosed = onClosed;
        this.node.active = true;
        this.view?.reset();
        this.paint();
        this.book?.open(() => this.runTour(CodexStore.pending));
    }

    // ── Reveal tour ──────────────────────────────────────────────────────

    /** Walks every unseen discovery: fly to it, dissolve it in, move on. */
    private runTour(queue: Entry[]) {
        const todo = queue.filter(e => this.db.get(e.id));
        if (!todo.length) return;

        this.view?.setLocked(true);
        this.step(todo, 0);
    }

    private step(queue: Entry[], i: number) {
        if (i >= queue.length) {
            this.view?.focusHome(this.moveTime, () => this.view?.setLocked(false));
            return;
        }

        const e = queue[i];
        this._page = this.pageOf(e.id, e.variant);
        this.paint();

        const cell = this._cells.find(c => c.matches(e.id, e.variant));
        if (!cell) { CodexStore.clearPending(e.id, e.variant); this.step(queue, i + 1); return; }

        const advance = () => {
            this.refreshCount();
            this.step(queue, i + 1);
        };

        if (!this.view) {
            cell.reveal(this.db, advance);
            return;
        }
        this.view.focusOn(cell.node, this.revealZoom, this.moveTime, () => {
            this.scheduleOnce(() => cell.reveal(this.db, advance), this.settleTime);
        });
    }

    // ── Paging ───────────────────────────────────────────────────────────

    private pageOf(id: string, v: EggVariant): number {
        const all = this.db.allEntries();
        const i = all.findIndex(e => e.species.id === id && e.variant === v);
        return i < 0 ? 0 : Math.floor(i / this.perSpread);
    }

    private turn(dir: number) {
        const next = this._page + dir;
        if (next < 0 || next >= this.pageCount) return;
        this._page = next;
        this.view?.reset();
        this.paint();
    }

    private paint() {
        const all = this.db.allEntries();
        const start = this._page * this.perSpread;
        for (let i = 0; i < this._cells.length; i++) {
            const e = all[start + i];
            this._cells[i].bind(this.db, e ? e.species : null, e ? e.variant : EggVariant.Normal);
        }
        if (this.titleLabel) this.titleLabel.string = `${this._page + 1} / ${this.pageCount}`;
        this.refreshCount();
    }

    private refreshCount() {
        if (this.countLabel) {
            this.countLabel.string = `${CodexStore.unlockedCount} / ${this.db.allEntries().length}`;
        }
    }

    private close() {
        this.view?.reset();
        this.book?.close(() => {
            this.node.active = false;
            const cb = this._onClosed;
            this._onClosed = null;
            cb?.();
        });
    }
}