import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CurrentWeather } from '../../components/current-weather/current-weather';
import { CacheService } from '../../services/cache.service';
import { CitySuggestion, Forecast, WeatherDetails } from '../../models';
import { MyFavorite } from '../../components/my-favorite/my-favorite';
import { OpenWeatherService } from '../../services/open-weather.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Forecasts } from '../../components/forecasts/forecasts';

@Component({
  selector: 'app-home',
  imports: [
    SearchBar,
    CurrentWeather,
    MyFavorite,
    Forecasts
  ],
  templateUrl: './home.html',
})
export class Home {
  cacheService = inject(CacheService);
  openWeatherService = inject(OpenWeatherService);
  snackBar = inject(MatSnackBar);

  selectedCity = signal<CitySuggestion | null>(null);
  weatherData = computed(() => this.cacheService.cache());
  currentWeather = computed<WeatherDetails | undefined>(() => {
    const city = this.selectedCity();
    const data = this.weatherData();
    const key = `${city?.lat}_${city?.lon}`;

    if (!city || !data[key]) return undefined;
    return data[key].data as WeatherDetails;
  });
  forecasts = signal<Forecast[]>([]);

  favoriteCities = computed(() => this.weatherData()
    ? Object.values(this.weatherData()).filter(entry => entry.isFavorite).map(entry => entry.data)
    : []);

  isCurrentCityFavorite = computed(() => {
    const city = this.selectedCity();
    if (!city) return false;
    return this.favoriteCities().some(fav =>
      fav.lat === city.lat.toString() && fav.lon === city.lon.toString()
    );
  });

  constructor() {
    effect(() => {
      const city = this.selectedCity();
      if (!city) return;

      untracked(() => {
        this.openWeatherService.fetchCurrentWeather(city.lat, city.lon).pipe(
          switchMap(() =>
            this.openWeatherService.fetchFiveDayForecast(city.lat, city.lon).pipe(
              tap((forecast) => {
                console.log(forecast);
                this.forecasts.set(forecast);
              }),
              catchError(() => {
                this.showErrorNotification('Error: Could not fetch forecast data!');
                return of(null);
              })
            )
          ),
          catchError(() => {
            this.showErrorNotification('Error: Could not fetch current weather data!');
            return of(null);
          })
        ).subscribe();
      });
    });
  }

  showErrorNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['mat-mdc-snack-bar-error']
    });
  }

  onToggleFavorite(coord: { lat: string; lon: string; }): void {
    this.cacheService.toggleFavorite(`${coord.lat}_${coord.lon}`);
  }
}
