import { Component, input, output } from '@angular/core';
import { WeatherDetails } from '../../models';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-my-favorite',
  imports: [
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    DecimalPipe,
  ],
  templateUrl: './my-favorite.html',
})
export class MyFavorite {
  data = input<WeatherDetails[]>();
  removed = output<{ lat: string; lon: string; }>();
}
