import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

export const weatherCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);

  if (req.method !== 'GET' || !req.url.includes('/weather')) {
    return next(req);
  }

  const lat = getParam(req.url, 'lat');
  const lon = getParam(req.url, 'lon');

  if (!lat || !lon) {
    return next(req);
  }

  const cacheKey = `${lat}-${lon}`;
  const cached = cacheService.get(cacheKey);

  if (cached) {
    return of(new HttpResponse({ body: cached, status: 200 }));
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheService.set(cacheKey, event.body);
      }
    })
  );
};

function getParam(url: string, key: string): string | null {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}
