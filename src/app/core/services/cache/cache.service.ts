import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_KEY = 'weather_recent_searches';
  private readonly MAX_ITEMS = 5;

  getRecentSearches(): string[] {
    const data = localStorage.getItem(this.CACHE_KEY);
    return data ? JSON.parse(data) : [];
  }

  addSearch(city: string): void {
    if (!city) return;
    
    let searches = this.getRecentSearches();
    
    // Remove if already exists to move it to the top
    searches = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    
    // Add to the beginning
    searches.unshift(city);
    
    // Keep only the last 5
    if (searches.length > this.MAX_ITEMS) {
      searches = searches.slice(0, this.MAX_ITEMS);
    }
    
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(searches));
  }

  clearSearches(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }
}
