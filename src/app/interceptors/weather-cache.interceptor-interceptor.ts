import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';
import { Forecast, WeatherDetails, WeatherResponse } from '../models';

export const weatherCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);

  const lat = getParam(req.url, 'lat');
  const lon = getParam(req.url, 'lon');

  if (!lat || !lon) {
    return next(req);
  }

  const cacheKey = `${lat}_${lon}`;

  if (req.url.includes('/weather')) {
    const cachedWeather = cacheService.get(cacheKey);
    if (cachedWeather) {
      // Return data from cache
      return of(new HttpResponse({ body: cachedWeather, status: 200 }));
    }

    // Not in cache → make a request and save it in cache
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const data = mapToWeatherDetails(event.body as WeatherResponse, lat, lon);
          cacheService.set(cacheKey, data);
        }
      })
    );
  }

  if (req.url.includes('/forecast')) {
    const cachedForecast = cacheService.getForecast(cacheKey);
    if (cachedForecast.length) {
      // Return data from cache
      return of(new HttpResponse({ body: cachedForecast, status: 200 }));
    }

    // Not in cache → make request and update cache
    return next(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          const mapped = mapForecastToDays(event.body);
          cacheService.setForecast(cacheKey, mapped);
          return event.clone({ body: mapped });
        }
        return event;
      })
    );
  }

  return next(req);
};

function getParam(url: string, key: string): string | null {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function mapToWeatherDetails(response: WeatherResponse, lat: string, lon: string): WeatherDetails {
  return {
    cityName: response.name,
    lat,
    lon,
    icon: response.weather[0].icon,
    description: response.weather[0].description,
    temp: response.main.temp,
    humidity: response.main.humidity,
  };
}

function mapForecastToDays(res: any): Forecast[] {
  const grouped: Record<string, any[]> = {};
  for (const item of res.list) {
    const date = item.dt_txt.split(' ')[0];
    grouped[date] = grouped[date] ? [...grouped[date], item] : [item];
  }

  return Object.entries(grouped).map(([date, items]) => {
    // We need an average of the day
    const middleKey = Math.floor(items.length / 2);
    return {
      date,
      tempMin: Math.min(...items.map(i => i.main.temp_min)),
      tempMax: Math.max(...items.map(i => i.main.temp_max)),
      description: items[middleKey].weather[0].description,
      icon: items[middleKey].weather[0].icon,
    };
  });
}
