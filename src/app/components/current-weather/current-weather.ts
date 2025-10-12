import { Component, inject, input, signal } from '@angular/core';
import { WeatherDetails } from '../../models';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-current-weather',
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './current-weather.html',
  styleUrl: './current-weather.scss'
})
export class CurrentWeather {
  cacheService = inject(CacheService);

  data = input<WeatherDetails>();
  isFavorite = input<boolean>(false);
  today = signal<Date>(new Date());

  onToggleFavorite(): void {
    const { lat, lon } = this.data()!;
    this.cacheService.toggleFavorite(`${lat}_${lon}`);
  }

}
