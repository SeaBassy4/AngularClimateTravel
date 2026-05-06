import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ForecastResponse } from '../../../../core/models/weather.model';
import { KelvinToCelsiusPipe } from '../../../../shared/pipes/kelvin-to-celsius/kelvin-to-celsius.pipe';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule, KelvinToCelsiusPipe, DatePipe],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css'
})
export class ForecastComponent implements OnChanges {
  @Input({ required: true }) forecast!: ForecastResponse;
  
  dailyForecasts: any[] = [];

  ngOnChanges() {
    this.processForecast();
  }

  private processForecast() {
    if (!this.forecast || !this.forecast.list) return;

    // Filter to get 1 reading per day (e.g. around noon)
    // OWM returns data every 3 hours.
    const filtered = this.forecast.list.filter(item => {
      return item.dt_txt.includes('12:00:00') || item.dt_txt.includes('15:00:00');
    });

    // Just in case, ensure we only take unique days and limit to 5
    const uniqueDays = new Map();
    for (const item of filtered) {
      const dateStr = item.dt_txt.split(' ')[0];
      if (!uniqueDays.has(dateStr)) {
        uniqueDays.set(dateStr, item);
      }
    }

    this.dailyForecasts = Array.from(uniqueDays.values()).slice(0, 5);
  }
}
