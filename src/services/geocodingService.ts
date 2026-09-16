import type { GeocodingResponseDto, GeocodingResultDto } from '../types/api';
import type { AppError } from '../types/errors';
import type { City } from '../types/weather';
import { requestJson } from './http';

const endpoint = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchCities(query: string, signal?: AbortSignal): Promise<readonly City[]> {
  const name = query.trim();
  const url = new URL(endpoint);
  url.search = new URLSearchParams({
    name,
    count: '10',
    language: 'pt',
    format: 'json',
  }).toString();

  const payload = await requestJson<GeocodingResponseDto>({
    url: url.toString(),
    operation: 'search',
    signal,
  });

  if (payload.results === undefined) {
    return [];
  }

  if (!Array.isArray(payload.results)) {
    throw invalidDataError();
  }

  const cities = payload.results
    .map(toCity)
    .filter((city): city is City => city !== null)
    .slice(0, 10);

  if (payload.results.length > 0 && cities.length === 0) {
    throw invalidDataError();
  }

  return cities;
}

function toCity(result: GeocodingResultDto): City | null {
  if (
    !isNonEmptyString(result.name) ||
    !isNonEmptyString(result.country) ||
    !isNonEmptyString(result.timezone) ||
    !isFiniteNumber(result.id) ||
    !isFiniteNumber(result.latitude) ||
    !isFiniteNumber(result.longitude)
  ) {
    return null;
  }

  return {
    id: result.id,
    name: result.name,
    country: result.country,
    ...(isNonEmptyString(result.admin1) ? { region: result.admin1 } : {}),
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function invalidDataError(): AppError {
  return {
    operation: 'search',
    code: 'invalid-data',
    message: 'Os dados de localidades recebidos são inválidos.',
    recoverable: true,
  };
}
