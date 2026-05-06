import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../shared/components/search/search.component';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { ForecastComponent } from './components/forecast/forecast.component';
import { WeatherService } from '../../core/services/weather/weather.service';
import { CacheService } from '../../core/services/cache/cache.service';
import { WeatherResponse, ForecastResponse } from '../../core/models/weather.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule, SearchComponent, CurrentWeatherComponent, ForecastComponent],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.css'
})
export class WeatherWidgetComponent {
  private weatherService = inject(WeatherService);
  private cacheService = inject(CacheService);

  currentWeather: WeatherResponse | null = null;
  forecast: ForecastResponse | null = null;
  
  isLoading = false;
  errorMessage: string | null = null;

  onSearch(city: string) {
    if (!city) return;
    
    this.isLoading = true;
    this.errorMessage = null;
    this.currentWeather = null;
    this.forecast = null;

    this.weatherService.getWeather(city)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (weatherData) => {
          this.currentWeather = weatherData;
          this.cacheService.addSearch(weatherData.name);
          this.loadForecast(weatherData.name);
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
  }

  private loadForecast(city: string) {
    this.weatherService.getForecast(city).subscribe({
      next: (forecastData) => {
        this.forecast = forecastData;
      },
      error: (err) => {
        console.error('Error loading forecast', err);
        // We might not want to show a full error if only the forecast fails, but we can log it.
      }
    });
  }
}
