
export type CacheEntry<T> = { value: T; expiresAt: number };
const DEFAULT_TTL_MS = 1000 * 60 * 5; // 5min

class SimpleCache {
  private store = new Map<string, CacheEntry<any>>();
  constructor(private defaultTtl = DEFAULT_TTL_MS) {}
  get<T>(key: string): T | undefined {
    const e = this.store.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) { this.store.delete(key); return undefined; }
    return e.value as T;
  }
  set<T>(key: string, value: T, ttlMs = this.defaultTtl) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
  has(key: string) { return this.get(key) !== undefined; }
  delete(key: string) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

export const globalCache = new SimpleCache();
export default SimpleCache;
