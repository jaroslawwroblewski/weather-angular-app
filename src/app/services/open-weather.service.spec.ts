import { of } from 'rxjs';
import { OpenWeatherService } from './open-weather.service';
import { environment } from '../../environments/environment';
import { Forecast, WeatherResponse } from '../models';

const mockHttpClient = {
  get: jest.fn(),
};

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    inject: jest.fn(() => mockHttpClient),
  };
});

describe('OpenWeatherService', () => {
  let service: OpenWeatherService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OpenWeatherService();
  });

  describe('fetchCurrentWeather', () => {
    it('should call with correct URL', (done) => {
      mockHttpClient.get.mockReturnValue(of({}));
      const lat = '51.5072';
      const lon = '-0.1276';

      service.fetchCurrentWeather(lat, lon).subscribe(() => {
        const expectedUrl = `${environment.openWeatherBaseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${environment.openWeatherApiKey}`;
        expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);
        done();
      });
    });

    it('should return current weather response', (done) => {
      const mockResponse: WeatherResponse = {
        name: 'London',
        weather: [{ description: 'clear', icon: '01d' }],
        main: { temp: 15, humidity: 60 },
      } as any;

      mockHttpClient.get.mockReturnValue(of(mockResponse));

      service.fetchCurrentWeather('51.5072', '-0.1276').subscribe((res) => {
        expect(res).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('fetchFiveDayForecast', () => {
    it('should call with correct URL', (done) => {
      mockHttpClient.get.mockReturnValue(of({}));

      const lat = '40.7128';
      const lon = '-74.0060';

      service.fetchFiveDayForecast(lat, lon).subscribe(() => {
        const expectedUrl = `${environment.openWeatherBaseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${environment.openWeatherApiKey}`;
        expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);
        done();
      });
    });
    it('should return forecast response', (done) => {
      const mockForecast: Forecast[] = [
        { date: '2025-10-13', tempMin: 10, tempMax: 18, icon: '02d', description: 'sunny' },
      ];
      const lat = '40.7128';
      const lon = '-74.0060';

      mockHttpClient.get.mockReturnValue(of(mockForecast));

      service.fetchFiveDayForecast('51.5072', '-0.1276').subscribe((res) => {
        expect(res).toEqual(mockForecast);
        done();
      });
    });
  });
});
