import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { signal } from '@angular/core';
import { CacheService } from '../../services/cache.service';
import { OpenWeatherService } from '../../services/open-weather.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Forecast, WeatherDetails } from '../../models';

describe('Home Component', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let cacheService: CacheService;
  let openWeatherService: OpenWeatherService;
  let snackBar: MatSnackBar;

  const mockForecast: Forecast[] = [
    { date: '2025-10-13', description: 'sunny', tempMin: 10, tempMax: 20, icon: '01d' }
  ];

  const mockSnackBar = {
    open: jest.fn(),
  };

  const mockCacheService = {
    cache: signal<Record<string, any>>({}),
    toggleFavorite: jest.fn(),
  };

  const mockOpenWeatherService = {
    fetchCurrentWeather: jest.fn().mockReturnValue(of({})),
    fetchFiveDayForecast: jest.fn().mockReturnValue(of(mockForecast)),
  };

  const mockWeather: WeatherDetails = {
    cityName: 'London',
    lat: '51.5072',
    lon: '-0.1276',
    icon: '04d',
    description: 'cloudy',
    temp: 15.6,
    humidity: 70,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule, Home],
      providers: [
        { provide: CacheService, useValue: mockCacheService },
        { provide: OpenWeatherService, useValue: mockOpenWeatherService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;

    cacheService = TestBed.inject(CacheService);
    openWeatherService = TestBed.inject(OpenWeatherService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute currentWeather based on selectedCoord and cache', () => {
    const key = '51.5072_-0.1276';
    cacheService.cache = jest.fn().mockReturnValue({
      [key]: { data: mockWeather, isFavorite: true, timestamp: Date.now() }
    });

    component.selectedCoord.set({ lat: '51.5072', lon: '-0.1276' });

    expect(component.currentWeather()).toEqual(mockWeather);
  });

  it('should compute favoriteCities correctly', () => {
    const key1 = '51.5072_-0.1276';
    const key2 = '48.8566_2.3522';
    cacheService.cache = jest.fn().mockReturnValue({
      [key1]: { data: mockWeather, isFavorite: true, timestamp: Date.now() },
      [key2]: { data: { ...mockWeather, cityName: 'Paris' }, isFavorite: false, timestamp: Date.now() },
    });

    const favs = component.favoriteCities();
    expect(favs.length).toBe(1);
    expect(favs[0].cityName).toBe('London');
  });

  it('should compute isCurrentCityFavorite correctly', () => {
    const key = '51.5072_-0.1276';
    cacheService.cache = jest.fn().mockReturnValue({
      [key]: { data: mockWeather, isFavorite: true, timestamp: Date.now() }
    });

    component.selectedCoord.set({ lat: '51.5072', lon: '-0.1276' });
    expect(component.isCurrentCityFavorite()).toBe(true);

    component.selectedCoord.set({ lat: '48.8566', lon: '2.3522' });
    expect(component.isCurrentCityFavorite()).toBe(false);
  });

  it('should call toggleFavorite on onToggleFavorite', () => {
    component.onToggleFavorite({ lat: '51.5072', lon: '-0.1276' });
    expect(cacheService.toggleFavorite).toHaveBeenCalledWith('51.5072_-0.1276');
  });

  it('should fetch forecast when selectedCoord changes', async () => {
    component.selectedCoord.set({ lat: '51.5072', lon: '-0.1276' });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(openWeatherService.fetchCurrentWeather).toHaveBeenCalledWith('51.5072', '-0.1276');
    expect(openWeatherService.fetchFiveDayForecast).toHaveBeenCalledWith('51.5072', '-0.1276');
    expect(component.forecasts()).toEqual(mockForecast);
  });

  it('should show snackbar on forecast error', async () => {
    openWeatherService.fetchCurrentWeather.mockReturnValue(of({}));
    openWeatherService.fetchFiveDayForecast.mockReturnValue(
      throwError(() => new Error('fail'))
    );

    const snackSpy = jest.spyOn(snackBar, 'open');

    component.selectedCoord.set({ lat: '51.5072', lon: '-0.1276' });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(snackSpy).toHaveBeenCalledWith(
      'Error: Could not fetch forecast data!',
      'Close',
      expect.any(Object)
    );
  });
});
