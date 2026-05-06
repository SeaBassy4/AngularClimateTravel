import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { WeatherResponse, ForecastResponse, GeoSuggestion, OpenMeteoResponse } from '../../models/weather.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  
  // Note: We are not passing units=metric as we will use a custom pipe to convert from Kelvin to Celsius
  getWeather(city: string): Observable<WeatherResponse> {
    const url = `${environment.openWeatherApiUrl}/weather?q=${city}&appid=${environment.openWeatherKey}&lang=en`;
    return this.http.get<WeatherResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getForecast(city: string): Observable<ForecastResponse> {
    const url = `${environment.openWeatherApiUrl}/forecast?q=${city}&appid=${environment.openWeatherKey}&lang=en`;
    return this.http.get<ForecastResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getCitySuggestions(query: string): Observable<GeoSuggestion[]> {
    if (!query) return new Observable<GeoSuggestion[]>(subscriber => subscriber.next([]));
    const url = `${environment.openMeteoGeoUrl}/search?name=${query}&count=5&language=en&format=json`;
    return this.http.get<OpenMeteoResponse>(url).pipe(
      map(res => res.results || []),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      if (error.status === 404) {
        errorMessage = 'City not found.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid API key.';
      } else if (error.status === 0) {
        errorMessage = 'No connection. Check your network.';
      } else {
        errorMessage = `Error code: ${error.status}, message: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
