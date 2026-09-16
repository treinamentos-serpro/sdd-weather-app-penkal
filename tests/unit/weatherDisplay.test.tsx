import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';

import CurrentWeather from '../../src/components/CurrentWeather';
import DailyForecast from '../../src/components/DailyForecast';
import type { WeatherReport } from '../../src/types/weather';

const report: WeatherReport = {
  city: {
    id: 1,
    name: 'Recife',
    country: 'Brazil',
    latitude: -8,
    longitude: -34,
    timezone: 'America/Recife',
  },
  current: {
    observedAt: '2026-09-16T23:45',
    temperatureCelsius: 22.4,
    condition: 'Parcialmente nublado',
  },
  forecast: [
    { date: '2026-09-16', minimumCelsius: 14, maximumCelsius: 25, condition: 'Céu limpo' },
    { date: '2026-09-17', minimumCelsius: 15, maximumCelsius: 27, condition: 'Nublado' },
    { date: '2026-09-18', minimumCelsius: 16, maximumCelsius: 28, condition: 'Chuva' },
    { date: '2026-09-19', minimumCelsius: 13, maximumCelsius: 24, condition: 'Garoa' },
    { date: '2026-09-20', minimumCelsius: 12, maximumCelsius: 23, condition: 'Tempestade' },
  ],
};

it('displays current conditions with explicit active unit and local update time', () => {
  render(<CurrentWeather report={report} unit="fahrenheit" />);

  expect(screen.getByText('Recife, Brazil')).toBeVisible();
  expect(screen.getByText('72 °F')).toBeVisible();
  expect(screen.getByText('Atualizado às 23:45')).toBeVisible();
});

it('rounds a negative Celsius half value away from zero', () => {
  render(
    <CurrentWeather
      report={{
        ...report,
        current: { ...report.current, temperatureCelsius: -1.5 },
      }}
      unit="celsius"
    />,
  );

  expect(screen.getByText('-2 °C')).toBeVisible();
});

it('displays exactly five localized daily forecasts in the active unit', () => {
  render(<DailyForecast report={report} unit="celsius" />);

  expect(screen.getAllByRole('listitem')).toHaveLength(5);
  expect(screen.getByText('16 de setembro')).toBeVisible();
  expect(screen.getByText('Mín. 14 °C')).toBeVisible();
  expect(screen.getByText('Máx. 25 °C')).toBeVisible();
});
