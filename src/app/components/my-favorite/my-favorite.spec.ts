import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyFavorite } from './my-favorite';
import { WeatherDetails } from '../../models';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

describe('MyFavorite Component', () => {
  let component: MyFavorite;
  let fixture: ComponentFixture<MyFavorite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyFavorite,
        MatDividerModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [DecimalPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(MyFavorite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit removed event', () => {
    const spy = jest.fn();
    component.removed.subscribe(spy);

    const coord = { lat: '51.5072', lon: '-0.1276' };
    component.removed.emit(coord);

    expect(spy).toHaveBeenCalledWith(coord);
  });

  it('should emit selected event', () => {
    const spy = jest.fn();
    component.selected.subscribe(spy);

    const coord = { lat: '51.5072', lon: '-0.1276' };
    component.selected.emit(coord);

    expect(spy).toHaveBeenCalledWith(coord);
  });
});
