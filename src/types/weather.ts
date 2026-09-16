export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export type WeatherCondition =
  | 'Céu limpo'
  | 'Parcialmente nublado'
  | 'Nublado'
  | 'Neblina'
  | 'Garoa'
  | 'Chuva'
  | 'Neve'
  | 'Pancadas'
  | 'Tempestade'
  | 'Condição indisponível';

export interface CurrentWeather {
  observedAt: string;
  temperatureCelsius: number;
  condition: WeatherCondition;
}

export interface ForecastDay {
  date: string;
  minimumCelsius: number;
  maximumCelsius: number;
  condition: WeatherCondition;
}

export interface WeatherReport {
  city: City;
  current: CurrentWeather;
  forecast: readonly ForecastDay[];
}

export type OperationStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';
export type { AppError, AppErrorCode, OperationKind } from './errors';

import type { AppError } from './errors';

export interface OperationState<T> {
  status: OperationStatus;
  data: T;
  error: AppError | null;
}

export interface WeatherAppState {
  query: string;
  lastSubmittedQuery: string | null;
  search: OperationState<readonly City[]>;
  selectedCity: City | null;
  weather: OperationState<WeatherReport | null>;
  unit: TemperatureUnit;
}
