import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CurrentWeather } from '../../components/current-weather/current-weather';
import { CacheService } from '../../services/cache.service';
import { Forecast, WeatherDetails } from '../../models';
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
  selectedCoord = signal<{ lat: string; lon: string } | null>(null);
  weatherData = computed(() => this.cacheService.cache());
  currentWeather = computed<WeatherDetails | undefined>(() => {
    const coord = this.selectedCoord();
    const data = this.weatherData();
    const key = `${coord?.lat}_${coord?.lon}`;

    if (!coord || !data[key]) return undefined;
    return data[key].data as WeatherDetails;
  });
  forecasts = signal<Forecast[]>([]);

  favoriteCities = computed(() => this.weatherData()
    ? Object.values(this.weatherData()).filter(entry => entry.isFavorite).map(entry => entry.data)
    : []);

  isCurrentCityFavorite = computed(() => {
    const coord = this.selectedCoord();
    if (!coord) return false;
    return this.favoriteCities().some(fav => fav.lat === coord.lat && fav.lon === coord.lon);
  });

  constructor() {
    effect(() => {
      const coord = this.selectedCoord();
      if (!coord) return;

      untracked(() => {
        this.openWeatherService.fetchCurrentWeather(coord.lat, coord.lon).pipe(
          switchMap(() =>
            this.openWeatherService.fetchFiveDayForecast(coord.lat, coord.lon).pipe(
              tap((forecast) => {
                this.forecasts.set(forecast);
              }),
              catchError(() => {
                this.showErrorNotification('Error: Could not fetch forecast data!');
                return of([]);
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
