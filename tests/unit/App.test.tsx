import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import App from '../../src/App';
import { useWeatherApp } from '../../src/hooks/useWeatherApp';

vi.mock('../../src/hooks/useWeatherApp', () => ({ useWeatherApp: vi.fn() }));

const mockedUseWeatherApp = vi.mocked(useWeatherApp);
const recife = {
  id: 1,
  name: 'Recife',
  country: 'Brazil',
  latitude: -8,
  longitude: -34,
  timezone: 'America/Recife',
};

it('connects search, selection, weather display, and temperature unit through one app state', async () => {
  const user = userEvent.setup();
  const selectCity = vi.fn();
  const setUnit = vi.fn();
  mockedUseWeatherApp.mockReturnValue({
    query: 'Recife',
    lastSubmittedQuery: 'Recife',
    search: { status: 'success', data: [recife], error: null },
    selectedCity: recife,
    weather: {
      status: 'success',
      data: {
        city: recife,
        current: { observedAt: '2026-09-16T14:00', temperatureCelsius: 22, condition: 'Céu limpo' },
        forecast: [
          { date: '2026-09-16', minimumCelsius: 18, maximumCelsius: 25, condition: 'Céu limpo' },
          { date: '2026-09-17', minimumCelsius: 19, maximumCelsius: 26, condition: 'Nublado' },
          { date: '2026-09-18', minimumCelsius: 20, maximumCelsius: 27, condition: 'Chuva' },
          { date: '2026-09-19', minimumCelsius: 21, maximumCelsius: 28, condition: 'Garoa' },
          { date: '2026-09-20', minimumCelsius: 22, maximumCelsius: 29, condition: 'Pancadas' },
        ],
      },
      error: null,
    },
    unit: 'celsius',
    setQuery: vi.fn(),
    setUnit,
    toggleUnit: vi.fn(),
    submitSearch: vi.fn(),
    retrySearch: vi.fn(),
    selectCity,
    retryWeather: vi.fn(),
  });

  render(<App />);

  expect(screen.getByText('22 °C')).toBeVisible();
  expect(screen.getAllByRole('listitem')).toHaveLength(6);

  await user.click(screen.getByRole('button', { name: /recife.*brazil/i }));
  await user.click(screen.getByRole('radio', { name: /fahrenheit/i }));

  expect(selectCity).toHaveBeenCalledWith(recife);
  expect(setUnit).toHaveBeenCalledWith('fahrenheit');
});
