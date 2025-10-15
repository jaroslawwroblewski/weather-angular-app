// -----------------------------------------------------
// Concept - an alternative version for the cache service
// -----------------------------------------------------

// import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
// import { patchState, withEntities } from '@ngrx/signals/entities';
// import { Injectable, computed } from '@angular/core';
// import { CacheEntry, Forecast, WeatherDetails } from '../models';
//
// type WeatherId = string;
//
// @Injectable({ providedIn: 'root' })
// export class WeatherStore extends signalStore(
//   withEntities<CacheEntry, WeatherId>(),
//   withComputed(({ entities }) => ({
//     favorites: computed(() =>
//       Object.values(entities()).filter((e) => e.isFavorite)
//     ),
//   })),
//   withMethods((store) => {
//     const TTL = 60 * 60 * 1000; // 1h
//     const STORAGE_KEY = 'weatherAppCache';
//
//     function saveToStorage() {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(store.entities()));
//     }
//
//     function loadFromStorage() {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (!raw) return;
//       try {
//         const parsed = JSON.parse(raw) as Record<WeatherId, CacheEntry>;
//         patchState(store, (s) => ({ ...s, entities: parsed }));
//       } catch {
//         console.error('Invalid cache data');
//       }
//     }
//
//     function isExpired(entry: CacheEntry): boolean {
//       return Date.now() - entry.timestamp > TTL;
//     }
//
//     return {
//       init() {
//         loadFromStorage();
//       },
//
//       setWeather(id: WeatherId, data: WeatherDetails) {
//         patchState(store, (s) => ({
//           entities: {
//             ...s.entities,
//             [id]: { data, isFavorite: false, timestamp: Date.now() },
//           },
//         }));
//         saveToStorage();
//       },
//
//       getWeather(id: WeatherId): WeatherDetails | null {
//         const entry = store.entities()[id];
//         if (!entry) return null;
//         if (isExpired(entry)) {
//           store.removeWeather(id);
//           return null;
//         }
//         return entry.data;
//       },
//
//       setForecast(id: WeatherId, forecast: Forecast[]) {
//         const entry = store.entities()[id];
//         if (!entry) return;
//         patchState(store, (s) => ({
//           entities: {
//             ...s.entities,
//             [id]: { ...entry, forecast, timestamp: Date.now() },
//           },
//         }));
//         saveToStorage();
//       },
//
//       getForecast(id: WeatherId): Forecast[] {
//         const entry = store.entities()[id];
//         if (!entry) return [];
//         if (isExpired(entry)) {
//           store.removeWeather(id);
//           return [];
//         }
//         return entry.forecast ?? [];
//       },
//
//       toggleFavorite(id: WeatherId) {
//         const entry = store.entities()[id];
//         if (!entry) return;
//         patchState(store, (s) => ({
//           entities: {
//             ...s.entities,
//             [id]: { ...entry, isFavorite: !entry.isFavorite },
//           },
//         }));
//         saveToStorage();
//       },
//
//       removeWeather(id: WeatherId) {
//         const updated = { ...store.entities() };
//         delete updated[id];
//         patchState(store, (s) => ({ entities: updated }));
//         saveToStorage();
//       },
//     };
//   })
// ) {}
