import { Component } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CurrentWeather } from '../../components/current-weather/current-weather';

@Component({
  selector: 'app-home',
  imports: [
    SearchBar,
    CurrentWeather
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {}
