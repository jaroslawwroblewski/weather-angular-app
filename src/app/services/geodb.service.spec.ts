import { TestBed } from '@angular/core/testing';
import { GeodbService } from './geodb.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { CitySuggestion } from '../models';

describe('GeodbService', () => {
  let service: GeodbService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeodbService],
    });

    service = TestBed.inject(GeodbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and map city suggestions correctly', () => {
    const query = 'Lon';
    const mockApiResponse = {
      data: [
        { id: 1, city: 'London', country: 'UK', latitude: 51.5072, longitude: -0.1276 },
        { id: 2, city: 'Long Beach', country: 'USA', latitude: 33.7701, longitude: -118.1937 },
      ]
    };

    const expectedResult: CitySuggestion[] = [
      { id: 1, name: 'London', country: 'UK', lat: '51.5072', lon: '-0.1276' },
      { id: 2, name: 'Long Beach', country: 'USA', lat: '33.7701', lon: '-118.1937' },
    ];

    service.fetchCitySuggestions(query).subscribe((res) => {
      expect(res).toEqual(expectedResult);
    });

    const req = httpMock.expectOne(
      `${environment.geodbBaseUrl}/cities?limit=5&namePrefix=${encodeURIComponent(query)}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should return empty array if API returns empty data', () => {
    const query = 'XYZ';
    const mockApiResponse = { data: [] };

    service.fetchCitySuggestions(query).subscribe((res) => {
      expect(res).toEqual([]);
    });

    const req = httpMock.expectOne(
      `${environment.geodbBaseUrl}/cities?limit=5&namePrefix=${encodeURIComponent(query)}`
    );
    req.flush(mockApiResponse);
  });
});
