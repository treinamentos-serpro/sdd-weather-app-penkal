import { weatherCodeToCondition } from '../domain/weatherCodes';
import type { ForecastDailyDto, ForecastResponseDto } from '../types/api';
import type { AppError } from '../types/errors';
import type { City, ForecastDay, WeatherReport } from '../types/weather';
import { requestJson } from './http';

const endpoint = 'https://api.open-meteo.com/v1/forecast';

export async function getWeatherReport(city: City, signal?: AbortSignal): Promise<WeatherReport> {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '5',
    temperature_unit: 'celsius',
  }).toString();

  const payload = await requestJson<ForecastResponseDto>({
    url: url.toString(),
    operation: 'weather',
    signal,
  });
  const timezone = validateTimezone(payload.timezone);
  const current = payload.current;

  if (!current || !isLocalDateTime(current.time) || !isFiniteNumber(current.temperature_2m)) {
    throw invalidDataError();
  }

  return {
    city: { ...city, timezone },
    current: {
      observedAt: current.time,
      temperatureCelsius: current.temperature_2m,
      condition: weatherCodeToCondition(toWeatherCode(current.weather_code)),
    },
    forecast: toForecast(payload.daily),
  };
}

function toForecast(daily: ForecastDailyDto | null | undefined): readonly ForecastDay[] {
  if (
    !daily ||
    !Array.isArray(daily.time) ||
    !Array.isArray(daily.temperature_2m_min) ||
    !Array.isArray(daily.temperature_2m_max) ||
    (daily.weather_code !== undefined &&
      (!Array.isArray(daily.weather_code) || daily.weather_code.length !== 5))
  ) {
    throw invalidDataError();
  }

  const forecast = daily.time.map((date, index) => {
    const minimum = daily.temperature_2m_min?.[index];
    const maximum = daily.temperature_2m_max?.[index];

    if (!isIsoDate(date) || !isFiniteNumber(minimum) || !isFiniteNumber(maximum)) {
      throw invalidDataError();
    }

    return {
      date,
      minimumCelsius: minimum,
      maximumCelsius: maximum,
      condition: weatherCodeToCondition(toWeatherCode(daily.weather_code?.[index])),
    };
  });

  if (
    !forecast.every((day, index) => index === 0 || isNextDate(forecast[index - 1]?.date, day.date))
  ) {
    throw invalidDataError();
  }

  return forecast;
}

function validateTimezone(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw invalidDataError();
  }

  try {
    Intl.DateTimeFormat('pt-BR', { timeZone: value });
    return value;
  } catch {
    throw invalidDataError();
  }
}

function isLocalDateTime(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function toWeatherCode(value: unknown): number | undefined {
  return isFiniteNumber(value) ? value : undefined;
}

function isNextDate(previousDate: string | undefined, date: string): boolean {
  if (!previousDate) {
    return false;
  }

  const next = new Date(`${previousDate}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10) === date;
}

function invalidDataError(): AppError {
  return {
    operation: 'weather',
    code: 'invalid-data',
    message: 'Os dados meteorológicos recebidos são inválidos.',
    recoverable: true,
  };
}
