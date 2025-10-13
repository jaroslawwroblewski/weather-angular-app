import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';
import { GeodbService } from '../../services/geodb.service';
import { of } from 'rxjs';
import { CitySuggestion } from '../../models';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('SearchBar Component', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;
  let geodbService: jest.Mocked<GeodbService>;

  const mockCities: CitySuggestion[] = [
    { id: 1, name: 'London', country: 'UK', lat: '51.5072', lon: '-0.1276' },
    { id: 2, name: 'Paris', country: 'France', lat: '48.8566', lon: '2.3522' },
  ];

  beforeEach(async () => {
    const geodbServiceMock = {
      fetchCitySuggestions: jest.fn().mockReturnValue(of(mockCities)),
    };

    await TestBed.configureTestingModule({
      imports: [
        SearchBar,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: GeodbService, useValue: geodbServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    geodbService = TestBed.inject(GeodbService) as jest.Mocked<GeodbService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchCitySuggestions when typing a city name', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(geodbService, 'fetchCitySuggestions').mockReturnValue(of([]));
    component.cityCtrl.setValue('Lon');
    jest.advanceTimersByTime(400);
    await Promise.resolve();

    expect(spy).toHaveBeenCalledWith('Lon');
    jest.useRealTimers();
  });

  it('should emit selected city coordinates', () => {
    const spy = jest.fn();
    component.selected.subscribe(spy);

    const city = mockCities[0];
    component.onSelect(city);

    expect(spy).toHaveBeenCalledWith({ lat: city.lat, lon: city.lon });
  });

  it('should display only city name in autocomplete', () => {
    const city = mockCities[1];
    const display = component.displayCity(city);
    expect(display).toBe('Paris');
  });

  it('should emit selected city coordinates', () => {
    const spy = jest.fn();
    component.selected.subscribe(spy);

    const city = { id: 1, name: 'London', country: 'UK', lat: '51.5072', lon: '-0.1276' };
    component.onSelect(city);

    expect(spy).toHaveBeenCalledWith({ lat: city.lat, lon: city.lon });
  });

  it('should return empty string if city is null in displayCity', () => {
    expect(component.displayCity(null as any)).toBe('');
  });
});
