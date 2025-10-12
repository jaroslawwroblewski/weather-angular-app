import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFavorite } from './my-favorite';

describe('MyFavorite', () => {
  let component: MyFavorite;
  let fixture: ComponentFixture<MyFavorite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFavorite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFavorite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
