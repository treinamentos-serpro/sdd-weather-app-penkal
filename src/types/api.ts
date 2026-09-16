export interface GeocodingResultDto {
  id?: number | string;
  name?: string;
  country?: string;
  admin1?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  timezone?: string | null;
}

export interface GeocodingResponseDto {
  results?: readonly GeocodingResultDto[];
  error?: string;
  message?: string;
}

export interface ForecastCurrentDto {
  time?: string;
  temperature_2m?: number | string | null;
  weather_code?: number | string | null;
}

export interface ForecastDailyDto {
  time?: readonly (string | null)[];
  temperature_2m_min?: readonly (number | string | null)[];
  temperature_2m_max?: readonly (number | string | null)[];
  weather_code?: readonly (number | string | null)[];
}

export interface ForecastResponseDto {
  timezone?: string | null;
  current?: ForecastCurrentDto | null;
  daily?: ForecastDailyDto | null;
  error?: string;
  reason?: string;
}
