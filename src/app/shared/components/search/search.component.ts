import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { WeatherService } from '../../../core/services/weather/weather.service';
import { CacheService } from '../../../core/services/cache/cache.service';
import { GeoSuggestion } from '../../../core/models/weather.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>();
  
  private weatherService = inject(WeatherService);
  private cacheService = inject(CacheService);

  searchControl = new FormControl('');
  suggestions: GeoSuggestion[] = [];
  recentSearches: string[] = [];
  showDropdown = false;
  
  ngOnInit() {
    this.loadRecentSearches();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length < 3) {
          return of([]);
        }
        return this.weatherService.getCitySuggestions(query).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(results => {
      this.suggestions = results;
      this.showDropdown = true;
    });
  }

  loadRecentSearches() {
    this.recentSearches = this.cacheService.getRecentSearches();
  }

  onSubmit() {
    const val = this.searchControl.value;
    if (val && val.trim()) {
      this.doSearch(val.trim());
    }
  }

  onSelectSuggestion(city: string) {
    this.searchControl.setValue(city, { emitEvent: false });
    this.doSearch(city);
  }

  private doSearch(city: string) {
    this.showDropdown = false;
    this.searchEvent.emit(city);
    // Add to cache locally to show immediately next time
    setTimeout(() => this.loadRecentSearches(), 500); 
  }

  onFocus() {
    this.loadRecentSearches();
    this.showDropdown = true;
  }
  
  // Need to use timeout for blur to allow click event on suggestions to fire
  onBlur() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}
