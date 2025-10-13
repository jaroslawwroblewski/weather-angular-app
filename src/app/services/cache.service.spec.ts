import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';
import { WeatherDetails, Forecast, CacheEntry } from '../models';

describe('CacheService', () => {
  let service: CacheService;

  const mockKey = '51.5072_-0.1276';

  const mockWeather: WeatherDetails = {
    cityName: 'London',
    lat: '51.5072',
    lon: '-0.1276',
    temp: 15,
    humidity: 60,
    description: 'cloudy',
    icon: '04d',
  };

  const mockForecast: Forecast[] = [
    { date: '2025-10-13', tempMin: 10, tempMax: 18, description: 'sunny', icon: '01d' },
  ];

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  it('should initialize with empty cache if localStorage is empty', () => {
    expect(service.cache()).toEqual({});
  });

  it('should save and retrieve weather data', () => {
    service.set(mockKey, mockWeather);
    const result = service.get(mockKey);
    expect(result).toEqual(mockWeather);
  });

  it('should return null for expired data', () => {
    const pastTimestamp = Date.now() - (2 * 60 * 60 * 1000);
    (service.cache as any).set({
      [mockKey]: { data: mockWeather, isFavorite: false, timestamp: pastTimestamp },
    });
    expect(service.get(mockKey)).toBeNull();
  });

  it('should save and retrieve forecast data', () => {
    service.set(mockKey, mockWeather);
    service.setForecast(mockKey, mockForecast);
    expect(service.getForecast(mockKey)).toEqual(mockForecast);
  });

  it('should return empty array for expired forecast', () => {
    const pastTimestamp = Date.now() - (2 * 60 * 60 * 1000);
    (service.cache as any).set({
      [mockKey]: { data: mockWeather, isFavorite: false, forecast: mockForecast, timestamp: pastTimestamp },
    });
    expect(service.getForecast(mockKey)).toEqual([]);
  });

  it('should toggle favorite', () => {
    service.set(mockKey, mockWeather);
    service.toggleFavorite(mockKey);
    expect(service.cache()[mockKey].isFavorite).toBe(true);
    service.toggleFavorite(mockKey);
    expect(service.cache()[mockKey].isFavorite).toBe(false);
  });

  it('should remove an entry', () => {
    service.set(mockKey, mockWeather);
    service.remove(mockKey);
    expect(service.cache()[mockKey]).toBeUndefined();
  });

  it('should persist cache to localStorage', () => {
    service.set(mockKey, mockWeather);
    const stored = JSON.parse(localStorage.getItem('weatherAppCache')!);
    expect(stored[mockKey].data).toEqual(mockWeather);
  });

  it('should load cache from localStorage', () => {
    const cacheData: Record<string, CacheEntry> = {
      [mockKey]: { data: mockWeather, isFavorite: false, timestamp: Date.now() },
    };
    localStorage.setItem('weatherAppCache', JSON.stringify(cacheData));
    const newService = new CacheService();
    expect(newService.cache()).toEqual(cacheData);
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('weatherAppCache', 'invalid-json');
    const newService = new CacheService();
    expect(newService.cache()).toEqual({});
  });
});
