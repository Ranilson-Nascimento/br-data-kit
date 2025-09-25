
export type CacheEntry<T> = { value: T; expiresAt: number };

export class TTLCache {
  private store = new Map<string, CacheEntry<any>>();
  constructor(private defaultTtlMs = 5 * 60 * 1000) {}

  get<T>(key: string): T | undefined {
    const e = this.store.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return e.value as T;
  }

  set<T>(key: string, value: T, ttlMs?: number) {
    this.store.set(key, { value, expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs) });
  }

  clear() { this.store.clear(); }
}

export const globalCache = new TTLCache();
