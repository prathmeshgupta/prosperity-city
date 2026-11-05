import { ExpansionPack } from '../types/game';

export interface ExpansionRegistryState {
  packs: Record<string, ExpansionPack>;
  activeIds: string[];
}

export class ExpansionManager {
  private packs: Map<string, ExpansionPack> = new Map();
  private activePackIds: Set<string> = new Set();
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  public registerPack(pack: ExpansionPack, defaultActive: boolean = true) {
    this.packs.set(pack.id, pack);
    if (defaultActive && !this.activePackIds.has(pack.id)) {
      this.activePackIds.add(pack.id);
    }
    this.notify();
  }

  public unregisterPack(packId: string) {
    this.packs.delete(packId);
    this.activePackIds.delete(packId);
    this.saveToLocalStorage();
    this.notify();
  }

  public togglePack(packId: string): boolean {
    if (this.activePackIds.has(packId)) {
      this.activePackIds.delete(packId);
    } else if (this.packs.has(packId)) {
      this.activePackIds.add(packId);
    }
    this.saveToLocalStorage();
    this.notify();
    return this.activePackIds.has(packId);
  }

  public isPackActive(packId: string): boolean {
    return this.activePackIds.has(packId);
  }

  public getAllPacks(): ExpansionPack[] {
    return Array.from(this.packs.values());
  }

  public getActivePacks(): ExpansionPack[] {
    return Array.from(this.packs.values()).filter((p) => this.activePackIds.has(p.id));
  }

  public getActivePackIds(): string[] {
    return Array.from(this.activePackIds);
  }

  public exportPack(packId: string): string | null {
    const pack = this.packs.get(packId);
    if (!pack) return null;
    return JSON.stringify(pack, null, 2);
  }

  public importPackJson(jsonStr: string): { success: boolean; error?: string; pack?: ExpansionPack } {
    try {
      const parsed = JSON.parse(jsonStr) as ExpansionPack;
      if (!parsed.id || !parsed.name || !parsed.description) {
        return { success: false, error: 'Invalid pack format: id, name, and description are required.' };
      }
      parsed.isBuiltIn = false;
      this.registerPack(parsed, true);
      this.saveToLocalStorage();
      return { success: true, pack: parsed };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Failed to parse JSON' };
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  private saveToLocalStorage() {
    try {
      if (typeof window === 'undefined') return;
      const customPacks = Array.from(this.packs.values()).filter((p) => !p.isBuiltIn);
      localStorage.setItem('fintwist_custom_packs', JSON.stringify(customPacks));
      localStorage.setItem('fintwist_active_packs', JSON.stringify(Array.from(this.activePackIds)));
    } catch {
      // localStorage may fail in restricted sandboxes
    }
  }

  private loadFromLocalStorage() {
    try {
      if (typeof window === 'undefined') return;
      const savedActive = localStorage.getItem('fintwist_active_packs');
      if (savedActive) {
        const arr = JSON.parse(savedActive);
        if (Array.isArray(arr)) {
          this.activePackIds = new Set(arr);
        }
      }
      const savedCustom = localStorage.getItem('fintwist_custom_packs');
      if (savedCustom) {
        const list = JSON.parse(savedCustom) as ExpansionPack[];
        if (Array.isArray(list)) {
          list.forEach((p) => this.packs.set(p.id, p));
        }
      }
    } catch {
      // ignore
    }
  }
}

export const expansionManager = new ExpansionManager();
