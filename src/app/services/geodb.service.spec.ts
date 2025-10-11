import { TestBed } from '@angular/core/testing';

import { GeodbService } from './geodb.service';

describe('GeodbService', () => {
  let service: GeodbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeodbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
