import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Forecast, WeatherResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherService {
  private http = inject(HttpClient);

  fetchCurrentWeather(lat: number, lon: number): Observable<WeatherResponse> {
    const url = `${environment.openWeatherBaseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${environment.openWeatherApiKey}`;
    return this.http.get<WeatherResponse>(url);
  }

  fetchFiveDayForecast(lat: number, lon: number): Observable<Forecast[]> {
    const url = `${environment.openWeatherBaseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${environment.openWeatherApiKey}`;
    return this.http.get<any>(url).pipe(map(response => this.mapForecastToDays(response)));
  }

  private mapForecastToDays(res: any): Forecast[] {
    const grouped: Record<string, any[]> = {};
    for (const item of res.list) {
      const date = item.dt_txt.split(' ')[0];
      grouped[date] = grouped[date] ? [...grouped[date], item] : [item];
    }

    return Object.entries(grouped).map(([date, items]) => {
      const middleKey = Math.floor(items.length / 2);
      return {
        date,
        tempMin: Math.min(...items.map(i => i.main.temp_min)),
        tempMax: Math.max(...items.map(i => i.main.temp_max)),
        description: items[middleKey].weather[0].description,
        icon: items[middleKey].weather[0].icon,
      };
    });
  }
}
