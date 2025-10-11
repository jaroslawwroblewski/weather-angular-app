import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherService {
  private http = inject(HttpClient);

  fetchCurrentWeather(lat: number, lon: number): Observable<any> {
    const url = `${environment.openWeatherBaseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${environment.openWeatherApiKey}`;
    return this.http.get<any>(url);
  }
}
