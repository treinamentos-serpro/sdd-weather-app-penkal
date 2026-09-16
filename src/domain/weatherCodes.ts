import type { WeatherCondition } from '../types/weather';

const weatherConditions: Readonly<Record<number, WeatherCondition>> = {
  0: 'Céu limpo',
  1: 'Parcialmente nublado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina',
  51: 'Garoa',
  53: 'Garoa',
  55: 'Garoa',
  56: 'Garoa',
  57: 'Garoa',
  61: 'Chuva',
  63: 'Chuva',
  65: 'Chuva',
  66: 'Chuva',
  67: 'Chuva',
  71: 'Neve',
  73: 'Neve',
  75: 'Neve',
  77: 'Neve',
  80: 'Pancadas',
  81: 'Pancadas',
  82: 'Pancadas',
  85: 'Pancadas',
  86: 'Pancadas',
  95: 'Tempestade',
  96: 'Tempestade',
  99: 'Tempestade',
};

export function weatherCodeToCondition(code: number | null | undefined): WeatherCondition {
  return code === null || code === undefined
    ? 'Condição indisponível'
    : (weatherConditions[code] ?? 'Condição indisponível');
}
