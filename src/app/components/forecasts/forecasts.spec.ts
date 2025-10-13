import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Forecasts } from './forecasts';
import { DecimalPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Forecast } from '../../models';

describe('Forecasts Component', () => {
  let component: Forecasts;
  let fixture: ComponentFixture<Forecasts>;

  const mockForecasts: Forecast[] = [
    {
      date: '2025-10-13',
      icon: '10d',
      description: 'light rain',
      tempMin: 12.3,
      tempMax: 18.7,
    },
    {
      date: '2025-10-14',
      icon: '04d',
      description: 'cloudy',
      tempMin: 10.2,
      tempMax: 17.1,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forecasts, DecimalPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(Forecasts);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display forecast date and description', () => {
    fixture.componentRef.setInput('data', mockForecasts);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('2025-10-13');
    expect(compiled.textContent?.toLowerCase()).toContain('light rain');
  });

  it('should render icons for forecasts', () => {
    fixture.componentRef.setInput('data', mockForecasts);
    fixture.detectChanges();

    const images = fixture.debugElement.queryAll(By.css('img'));
    expect(images.length).toBe(2);
    expect(images[0].nativeElement.src).toContain('10d.png');
  });

  it('should render and format temperature', () => {
    fixture.componentRef.setInput('data', mockForecasts);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('12°C');
    expect(compiled.textContent).toContain('19°C');
  });
});
