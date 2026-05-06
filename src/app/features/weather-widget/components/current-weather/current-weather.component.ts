import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherResponse } from '../../../../core/models/weather.model';
import { KelvinToCelsiusPipe } from '../../../../shared/pipes/kelvin-to-celsius/kelvin-to-celsius.pipe';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, KelvinToCelsiusPipe],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.css'
})
export class CurrentWeatherComponent {
  @Input({ required: true }) weather!: WeatherResponse;
}
