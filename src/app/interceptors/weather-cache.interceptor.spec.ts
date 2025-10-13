import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  getForecast: jest.fn().mockReturnValue([]),
  setForecast: jest.fn(),
};

jest.mock('@angular/core', () => {
  const actualCore = jest.requireActual('@angular/core');
  return {
    ...actualCore,
    inject: jest.fn(() => mockCacheService), // nadpisz tylko inject
  };
});

import { weatherCacheInterceptor } from './weather-cache.interceptor';

describe('weatherCacheInterceptor', () => {
  const createMockNext = (responseBody: any) =>
    jest.fn(() => of(new HttpResponse({ body: responseBody, status: 200 })));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached weather if available', (done) => {
    const cachedWeather = { cityName: 'London' };
    mockCacheService.get.mockReturnValue(cachedWeather);

    const req = new HttpRequest('GET', 'https://api/weather?lat=1&lon=2');
    const next = createMockNext({});

    weatherCacheInterceptor(req, next).subscribe((res: any) => {
      expect(res.body).toEqual(cachedWeather);
      expect(next).not.toHaveBeenCalled();
      done();
    });
  });

  it('should call next and cache result if weather not cached', (done) => {
    mockCacheService.get.mockReturnValue(undefined);

    const apiResponse = {
      name: 'Paris',
      weather: [{ description: 'sunny', icon: '01d' }],
      main: { temp: 20, humidity: 50 },
    };

    const req = new HttpRequest('GET', 'https://api/weather?lat=48.8&lon=2.3');
    const next = createMockNext(apiResponse);

    weatherCacheInterceptor(req, next).subscribe(() => {
      expect(next).toHaveBeenCalled();
      expect(mockCacheService.set).toHaveBeenCalled();
      done();
    });
  });

  it('should return cached forecast if available', (done) => {
    const cachedForecast = [{ date: '2025-10-13', tempMin: 10, tempMax: 20 }];
    mockCacheService.getForecast.mockReturnValue(cachedForecast);

    const req = new HttpRequest('GET', 'https://api/forecast?lat=1&lon=2');
    const next = createMockNext({});

    weatherCacheInterceptor(req, next).subscribe((res: any) => {
      expect(res.body).toEqual(cachedForecast);
      expect(next).not.toHaveBeenCalled();
      done();
    });
  });

  it('should call next and update forecast cache if not cached', (done) => {
    mockCacheService.getForecast.mockReturnValue([]);

    const mockForecastApiResponse = {
      list: [
        {
          dt_txt: '2025-10-13 12:00:00',
          main: { temp_min: 10, temp_max: 15 },
          weather: [{ description: 'clear', icon: '01d' }],
        },
      ],
    };

    const req = new HttpRequest('GET', 'https://api/forecast?lat=1&lon=2');
    const next = createMockNext(mockForecastApiResponse);

    weatherCacheInterceptor(req, next).subscribe(() => {
      expect(next).toHaveBeenCalled();
      expect(mockCacheService.setForecast).toHaveBeenCalled();
      done();
    });
  });

  it('should pass through unrelated URLs', (done) => {
    const req = new HttpRequest('GET', 'https://api/other');
    const next = createMockNext({ ok: true });

    weatherCacheInterceptor(req, next).subscribe((res: any) => {
      expect(next).toHaveBeenCalled();
      expect(res.body).toEqual({ ok: true });
      done();
    });
  });
});
