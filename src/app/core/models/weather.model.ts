export interface WeatherResponse {
  name: string;
  weather: { id: number; main: string; description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  wind: { speed: number };
  sys: { country: string };
}

export interface ForecastResponse {
  list: {
    dt: number;
    dt_txt: string;
    main: { temp: number; feels_like: number; temp_min: number; temp_max: number; humidity: number };
    weather: { id: number; main: string; description: string; icon: string }[];
  }[];
  city: { name: string; country: string };
}

export interface GeoSuggestion {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface OpenMeteoResponse {
  results?: GeoSuggestion[];
}
