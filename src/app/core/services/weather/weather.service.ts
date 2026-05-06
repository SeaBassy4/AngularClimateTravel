import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { WeatherResponse, ForecastResponse, GeoSuggestion } from '../../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  
  // Note: We are not passing units=metric as we will use a custom pipe to convert from Kelvin to Celsius
  getWeather(city: string): Observable<WeatherResponse> {
    const url = `${environment.openWeatherApiUrl}/weather?q=${city}&appid=${environment.openWeatherKey}&lang=es`;
    return this.http.get<WeatherResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getForecast(city: string): Observable<ForecastResponse> {
    const url = `${environment.openWeatherApiUrl}/forecast?q=${city}&appid=${environment.openWeatherKey}&lang=es`;
    return this.http.get<ForecastResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getCitySuggestions(query: string): Observable<GeoSuggestion[]> {
    if (!query) return new Observable<GeoSuggestion[]>(subscriber => subscriber.next([]));
    const url = `${environment.openWeatherGeoUrl}/direct?q=${query}&limit=5&appid=${environment.openWeatherKey}`;
    return this.http.get<GeoSuggestion[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.status === 404) {
        errorMessage = 'Ciudad no encontrada.';
      } else if (error.status === 401) {
        errorMessage = 'Clave de API inválida.';
      } else if (error.status === 0) {
        errorMessage = 'Sin conexión. Verifica tu red.';
      } else {
        errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
