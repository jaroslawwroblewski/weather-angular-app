import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forecasts } from './forecasts';

describe('Forecasts', () => {
  let component: Forecasts;
  let fixture: ComponentFixture<Forecasts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forecasts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forecasts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
