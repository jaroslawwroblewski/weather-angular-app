import { Component, input } from '@angular/core';
import { WeatherDetails } from '../../models';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-my-favorite',
  imports: [
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './my-favorite.html',
  styleUrl: './my-favorite.scss'
})
export class MyFavorite {
  data = input<WeatherDetails[]>();
}
