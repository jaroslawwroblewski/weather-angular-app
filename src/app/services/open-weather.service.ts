import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Forecast, WeatherResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherService {
  private http = inject(HttpClient);

  fetchCurrentWeather(lat: string, lon: string): Observable<WeatherResponse> {
    const url = `${environment.openWeatherBaseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${environment.openWeatherApiKey}`;
    return this.http.get<WeatherResponse>(url);
  }

  fetchFiveDayForecast(lat: string, lon: string): Observable<Forecast[]> {
    const url = `${environment.openWeatherBaseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${environment.openWeatherApiKey}`;
    return this.http.get<any>(url);
  }
}
