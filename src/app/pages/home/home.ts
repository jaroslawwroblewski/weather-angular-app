import { Component, computed, inject, signal } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CurrentWeather } from '../../components/current-weather/current-weather';
import { CacheService } from '../../services/cache.service';
import { CitySuggestion, WeatherDetails } from '../../models';
import { MyFavorite } from '../../components/my-favorite/my-favorite';

@Component({
  selector: 'app-home',
  imports: [
    SearchBar,
    CurrentWeather,
    MyFavorite
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  cacheService = inject(CacheService);
  selectedCity = signal<CitySuggestion | null>(null);
  weatherData = computed(() => this.cacheService.cache());
  currentWeather = computed<WeatherDetails | undefined>(() => {
    const city = this.selectedCity();
    const data = this.weatherData();
    const key = `${city?.lat}_${city?.lon}`;

    if (!city || !data[key]) return undefined;
    return data[key].data as WeatherDetails;
  });

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
}
