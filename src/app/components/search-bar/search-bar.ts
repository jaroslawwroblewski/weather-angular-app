import { Component, effect, inject, model, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CitySuggestion } from '../../models';
import { debounceTime, of, switchMap } from 'rxjs';
import { GeodbService } from '../../services/geodb.service';
import { OpenWeatherService } from '../../services/open-weather.service';

@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBar {
  geodbService = inject(GeodbService);
  openWeatherService = inject(OpenWeatherService);

  cityCtrl = new FormControl('');
  citySuggestions = signal<CitySuggestion[]>([]);
  selectedCity = model<CitySuggestion | null>();

  constructor() {
    this.cityCtrl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(value =>
          typeof value === 'string' && value.length > 1
            ? this.geodbService.fetchCitySuggestions(value)
            : of([])
        )
      )
      .subscribe(results => this.citySuggestions.set(results));

    effect(() => {
      const city = this.selectedCity();
      if (city) {
        this.openWeatherService.fetchCurrentWeather(city.lat, city.lon).subscribe();
        // ToDo: handle loading, success, and failure... then render the data
      }
    });
  }

  onSelect(city: CitySuggestion): void {
    this.selectedCity.set(city);
  }

  displayCity(city: CitySuggestion): string {
    return city ? city.name : '';
  }
}
