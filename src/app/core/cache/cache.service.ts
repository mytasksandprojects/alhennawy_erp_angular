import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Two-level cache: in-memory (fast, per-session) plus sessionStorage
 * (survives reloads, cleared when the browser tab closes — a deliberate
 * security choice so business data never persists on shared machines).
 */
@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly memory = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const memHit = this.memory.get(key);
    if (memHit) {
      if (memHit.expiresAt > Date.now()) return memHit.value as T;
      this.memory.delete(key);
    }
    const raw = this.safeStorageGet(key);
    if (!raw) return undefined;
    try {
      const entry = JSON.parse(raw) as CacheEntry<T>;
      if (entry.expiresAt > Date.now()) {
        this.memory.set(key, entry);
        return entry.value;
      }
      this.safeStorageRemove(key);
    } catch {
      this.safeStorageRemove(key);
    }
    return undefined;
  }

  set<T>(key: string, value: T, ttlSeconds: number, persist = false): void {
    const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlSeconds * 1000 };
    this.memory.set(key, entry);
    if (persist) {
      try {
        sessionStorage.setItem(key, JSON.stringify(entry));
      } catch {
        /* storage full or unavailable — memory cache still works */
      }
    }
  }

  /** Remove every entry whose key starts with the given prefix. */
  invalidateByPrefix(prefix: string): void {
    for (const key of [...this.memory.keys()]) {
      if (key.startsWith(prefix)) this.memory.delete(key);
    }
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(prefix)) this.safeStorageRemove(key);
    }
  }

  clear(): void {
    this.memory.clear();
    try {
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
  }

  private safeStorageGet(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeStorageRemove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}
