import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CitySuggestion } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeodbService {
  private http = inject(HttpClient);

  fetchCitySuggestions(query: string): Observable<CitySuggestion[]> {
    const url = `${environment.geodbBaseUrl}/cities?limit=5&namePrefix=${encodeURIComponent(query)}`;
    // ToDo: create an interface for the response
    return this.http.get<any>(url, {}).pipe(
      map(res =>
        res.data.map((c: any) => ({
          id: c.id,
          name: c.city,
          country: c.country,
          lat: c.latitude,
          lon: c.longitude,
        }))
      )
    );
  }
}
