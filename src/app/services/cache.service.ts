import { Injectable, signal } from '@angular/core';
import { CacheEntry } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_KEY = 'weatherAppCache';
  private readonly ttl = 60 * 60 * 1000;
  cache = signal<Record<string, CacheEntry>>({});

  constructor() {
    this.loadFromStorage();
  }

  get(key: string): any | null {
    const entry = this.cache()[key];
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.ttl;
    if (isExpired) {
      this.remove(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any): void {
    const updated = {
      ...this.cache(),
      [key]: { data, isFavorite: false, timestamp: Date.now() },
    };
    this.cache.set(updated);
    this.saveToStorage();
  }

  toggleFavorite(key: string): void {
    const entry = this.cache()[key];
    if (!entry) return;

    const updated = {
      ...this.cache(),
      [key]: {
        ...entry,
        isFavorite: !entry.isFavorite,
      },
    };

    this.cache.set(updated);
    this.saveToStorage();
  }

  remove(key: string): void {
    const updated = { ...this.cache() };
    delete updated[key];
    this.cache.set(updated);
    this.saveToStorage();
  }

  clear(): void {
    this.cache.set({});
    localStorage.removeItem(this.CACHE_KEY);
  }

  private loadFromStorage(): void {
    const raw = localStorage.getItem(this.CACHE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, CacheEntry>;
        this.cache.set(parsed);
      } catch {
        this.cache.set({});
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache()));
  }
}
