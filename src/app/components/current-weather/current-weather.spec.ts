import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurrentWeather } from './current-weather';
import { WeatherDetails } from '../../models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, DecimalPipe } from '@angular/common';

describe('CurrentWeather Component', () => {
  let component: CurrentWeather;
  let fixture: ComponentFixture<CurrentWeather>;

  const mockWeather: WeatherDetails = {
    cityName: 'London',
    lat: '51.5072',
    lon: '-0.1276',
    icon: '04d',
    description: 'cloudy',
    temp: 15.6,
    humidity: 70,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CurrentWeather,
        MatIconModule,
        MatButtonModule,
        DecimalPipe,
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentWeather);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render city name and description', () => {
    fixture.componentRef.setInput('data', mockWeather);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('London');
    expect(compiled.textContent?.toLowerCase()).toContain('cloudy');
  });

  it('should render rounded temperature', () => {
    fixture.componentRef.setInput('data', mockWeather);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('16');
  });

  it('should show favorite icon correctly', () => {
    fixture.componentRef.setInput('data', mockWeather);
    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('favorite');
  });

  it('should emit clickedFavorite when button clicked', () => {
    fixture.componentRef.setInput('data', mockWeather);
    fixture.detectChanges();

    const spy = jest.fn();
    component.clickedFavorite.subscribe(spy);

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalledWith({ lat: '51.5072', lon: '-0.1276' });
  });
});
