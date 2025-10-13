import { Forecast } from './forecast';
import { WeatherDetails } from './weather-details';

export interface CacheEntry {
  timestamp: number;
  isFavorite: boolean;
  data: WeatherDetails;
  forecast?: Forecast[];
}
