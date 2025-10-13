import { Component, inject, output, signal } from '@angular/core';
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
})
export class SearchBar {
  geodbService = inject(GeodbService);
  cityCtrl = new FormControl('');
  selected = output<{ lat: string; lon: string; }>();
  citySuggestions = signal<CitySuggestion[]>([]);

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
  }

  onSelect(city: CitySuggestion): void {
    const { lat, lon } = city;
    this.selected.emit({ lat, lon });
  }

  displayCity(city: CitySuggestion): string {
    return city ? city.name : '';
  }
}
