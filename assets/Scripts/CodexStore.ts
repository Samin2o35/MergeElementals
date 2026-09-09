import { sys } from 'cc';
import { EggVariant } from './EggTypes';

export interface Heirloom { id: string; variant: EggVariant; tier: number; }

interface SaveData {
    unlocked: string[];      // "speciesId:variant"
    essence: number;
    pool: string[];          // species ids available at forks
    heirloom: Heirloom | null;
    best: number;            // best tier reached
}

const KEY = 'eggcodex.v1';

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
            this._data = raw ? JSON.parse(raw) : null;
        } catch { this._data = null; }
        if (!this._data) this._data = { unlocked: [], essence: 0, pool: [], heirloom: null, best: 0 };
        if (!this._data.unlocked) this._data.unlocked = [];
        if (!this._data.pool) this._data.pool = [];
    }

    private static save() {
        try { sys.localStorage.setItem(KEY, JSON.stringify(this.data)); }
        catch (e) { console.warn('[CodexStore] save failed', e); }
    }

    private static key(id: string, v: EggVariant): string { return `${id}:${v}`; }

    public static isUnlocked(id: string, v: EggVariant): boolean {
        return this.data.unlocked.indexOf(this.key(id, v)) >= 0;
    }

    /** Returns true only the first time this pair is seen. */
    public static unlock(id: string, v: EggVariant): boolean {
        const k = this.key(id, v);
        if (this.data.unlocked.indexOf(k) >= 0) return false;
        this.data.unlocked.push(k);
        this.save();
        return true;
    }

    public static get unlockedCount(): number { return this.data.unlocked.length; }

    public static get essence(): number { return this.data.essence; }

    public static addEssence(n: number) { this.data.essence += n; this.save(); }

    public static spendEssence(n: number): boolean {
        if (this.data.essence < n) return false;
        this.data.essence -= n;
        this.save();
        return true;
    }

    public static isInPool(id: string): boolean { return this.data.pool.indexOf(id) >= 0; }

    public static addToPool(id: string) {
        if (this.data.pool.indexOf(id) >= 0) return;
        this.data.pool.push(id);
        this.save();
    }

    public static get heirloom(): Heirloom | null { return this.data.heirloom; }

    public static setHeirloom(h: Heirloom | null) { this.data.heirloom = h; this.save(); }

    public static get best(): number { return this.data.best; }

    public static reportBest(tier: number) {
        if (tier > this.data.best) { this.data.best = tier; this.save(); }
    }

    public static wipe() {
        this._data = { unlocked: [], essence: 0, pool: [], heirloom: null, best: 0 };
        this.save();
    }
}