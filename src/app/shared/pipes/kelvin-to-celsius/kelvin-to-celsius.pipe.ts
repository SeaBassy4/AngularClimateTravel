import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kelvinToCelsius',
  standalone: true
})
export class KelvinToCelsiusPipe implements PipeTransform {

  transform(value: number | undefined | null): number | null {
    if (value == null) return null;
    return Math.round(value - 273.15);
  }

}
