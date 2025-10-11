import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CitySuggestion } from '../../models';
import { debounceTime, of, switchMap } from 'rxjs';
import { GeodbService } from '../../services/geodb.service';

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
  cityCtrl = new FormControl('');
  citySuggestions = signal<CitySuggestion[]>([]);
  selectedCity = signal<CitySuggestion | null>(null);

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
      console.log(this.selectedCity());
      // ToDo: add request logic to the OpenWeather API
    });
  }

  onSelect(city: CitySuggestion): void {
    this.selectedCity.set(city);
  }
}
