import { Component, input } from '@angular/core';
import { Forecast } from '../../models';
import { DecimalPipe } from '@angular/common';
import { F } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-forecasts',
  imports: [
    DecimalPipe
  ],
  templateUrl: './forecasts.html',
})
export class Forecasts {
  data = input<Forecast[]>();
  protected readonly F = F;
}
