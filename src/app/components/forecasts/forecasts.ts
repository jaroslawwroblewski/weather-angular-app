import { Component, input } from '@angular/core';
import { Forecast } from '../../models';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-forecasts',
  imports: [
    DecimalPipe
  ],
  templateUrl: './forecasts.html',
})
export class Forecasts {
  data = input<Forecast[]>();
}
