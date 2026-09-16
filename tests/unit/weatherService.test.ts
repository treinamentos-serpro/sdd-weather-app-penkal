import { afterEach, describe, expect, it, vi } from 'vitest';

import { getWeatherReport } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';
import { buildForecastResponse, forecastFixtures } from '../fixtures/forecast';

const city: City = {
  id: 3448439,
  name: 'São Paulo',
  country: 'Brazil',
  latitude: -23.5489,
  longitude: -46.6388,
  timezone: 'America/Sao_Paulo',
};

describe('getWeatherReport', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests canonical Celsius data and adapts five forecast days', async () => {
    const fetchMock = vi.fn().mockResolvedValue(buildForecastResponse(forecastFixtures.success));
    vi.stubGlobal('fetch', fetchMock);

    const report = await getWeatherReport(city);
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));

    expect(url.searchParams.get('latitude')).toBe('-23.5489');
    expect(url.searchParams.get('longitude')).toBe('-46.6388');
    expect(url.searchParams.get('timezone')).toBe('auto');
    expect(url.searchParams.get('forecast_days')).toBe('5');
    expect(url.searchParams.get('temperature_unit')).toBe('celsius');
    expect(report.current).toMatchObject({
      temperatureCelsius: 22.4,
      condition: 'Parcialmente nublado',
    });
    expect(report.forecast).toHaveLength(5);
  });

  it('uses the WMO fallback without invalidating an otherwise valid report', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(buildForecastResponse(forecastFixtures.unknownWmo)),
    );

    await expect(getWeatherReport(city)).resolves.toMatchObject({
      current: { condition: 'Condição indisponível' },
    });
  });

  it('rejects incomplete or misaligned forecast data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(buildForecastResponse(forecastFixtures.misalignedArrays)),
    );
    await expect(getWeatherReport(city)).rejects.toMatchObject({
      code: 'invalid-data',
      operation: 'weather',
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(buildForecastResponse(forecastFixtures.partialData)),
    );
    await expect(getWeatherReport(city)).rejects.toMatchObject({
      code: 'invalid-data',
      operation: 'weather',
    });
  });

  it('rejects an invalid current local date and time', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        buildForecastResponse({
          ...forecastFixtures.success,
          current: {
            ...forecastFixtures.success.current,
            time: '2026-02-30T25:00',
          },
        }),
      ),
    );

    await expect(getWeatherReport(city)).rejects.toMatchObject({
      code: 'invalid-data',
      operation: 'weather',
    });
  });

  it('rejects a forecast that does not start on the current local date', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        buildForecastResponse({
          ...forecastFixtures.success,
          daily: {
            ...forecastFixtures.success.daily,
            time: ['2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20', '2026-09-21'],
          },
        }),
      ),
    );

    await expect(getWeatherReport(city)).rejects.toMatchObject({
      code: 'invalid-data',
      operation: 'weather',
    });
  });
});
