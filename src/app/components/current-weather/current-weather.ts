import { Component, input, output, signal } from '@angular/core';
import { WeatherDetails } from '../../models';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-current-weather',
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './current-weather.html',
})
export class CurrentWeather {
  data = input<WeatherDetails>();
  isFavorite = input<boolean>(false);
  today = signal<Date>(new Date());
  clickedFavorite = output<{ lat: string; lon: string; }>();
}
