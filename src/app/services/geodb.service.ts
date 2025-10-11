import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CitySuggestion } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GeodbService {
  private http = inject(HttpClient);

  fetchCitySuggestions(query: string): Observable<CitySuggestion[]> {
    const url = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&namePrefix=${encodeURIComponent(query)}`;
    return this.http.get<any>(url, {}).pipe(
      map(res =>
        res.data.map((c: any) => ({
          name: c.city,
          country: c.country,
          lat: c.latitude,
          lon: c.longitude,
        }))
      )
    );
  }
}
