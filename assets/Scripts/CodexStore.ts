import { sys } from 'cc';
import { EggVariant } from './EggTypes';

export interface Heirloom { id: string; variant: EggVariant; tier: number; }
export interface Entry { id: string; variant: EggVariant; }

interface SaveData {
    unlocked: string[];      // "speciesId:variant"
    pending: string[];       // unlocked but not yet revealed in the book
    essence: number;
    heirloom: Heirloom | null;
    best: number;
}

const KEY = 'eggcodex.v1';
const EMPTY: SaveData = { unlocked: [], pending: [], essence: 0, heirloom: null, best: 0 };

/** Static save layer. Everything persistent goes through here. */
export class CodexStore {

    private static _data: SaveData | null = null;

    private static get data(): SaveData {
        if (!this._data) this.load();
        return this._data!;
    }

    private static load() {
        try {
            const raw = sys.localStorage.getItem(KEY);
            this._data = raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY, unlocked: [], pending: [] };
        } catch {
            this._data = { ...EMPTY, unlocked: [], pending: [] };
        }
        if (!this._data!.unlocked) this._data!.unlocked = [];
        if (!this._data!.pending) this._data!.pending = [];
    }

    private static save() {
        try { sys.localStorage.setItem(KEY, JSON.stringify(this.data)); }
        catch (e) { console.warn('[CodexStore] save failed', e); }
    }

    private static key(id: string, v: EggVariant): string { return `${id}:${v}`; }

    private static parse(k: string): Entry {
        const i = k.lastIndexOf(':');
        return { id: k.slice(0, i), variant: Number(k.slice(i + 1)) as EggVariant };
    }

    public static isUnlocked(id: string, v: EggVariant): boolean {
        return this.data.unlocked.indexOf(this.key(id, v)) >= 0;
    }

    /** Unlocked but still owed a reveal animation in the book. */
    public static isPending(id: string, v: EggVariant): boolean {
        return this.data.pending.indexOf(this.key(id, v)) >= 0;
    }

    /** Returns true only the first time this pair is seen. */
    public static unlock(id: string, v: EggVariant): boolean {
        const k = this.key(id, v);
        if (this.data.unlocked.indexOf(k) >= 0) return false;
        this.data.unlocked.push(k);
        this.data.pending.push(k);
        this.save();
        return true;
    }

    public static get pending(): Entry[] {
        return this.data.pending.map(k => this.parse(k));
    }

    /** Called once the book has animated a reveal. */
    public static clearPending(id: string, v: EggVariant) {
        const i = this.data.pending.indexOf(this.key(id, v));
        if (i < 0) return;
        this.data.pending.splice(i, 1);
        this.save();
    }

    public static get unlockedCount(): number { return this.data.unlocked.length; }

    public static get essence(): number { return this.data.essence; }
    public static addEssence(n: number) { this.data.essence += n; this.save(); }

    public static get heirloom(): Heirloom | null { return this.data.heirloom; }
    public static setHeirloom(h: Heirloom | null) { this.data.heirloom = h; this.save(); }

    public static get best(): number { return this.data.best; }
    public static reportBest(tier: number) {
        if (tier > this.data.best) { this.data.best = tier; this.save(); }
    }

    /** Wipes every unlock, the heirloom and all progress. */
    public static wipe() {
        this._data = { ...EMPTY, unlocked: [], pending: [] };
        this.save();
    }
}