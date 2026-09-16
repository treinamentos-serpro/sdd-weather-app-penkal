import { describe, expect, it } from 'vitest';
import {
  buildForecastHttpFailure,
  buildForecastResponse,
  forecastFixtures,
} from '../fixtures/forecast';

describe('forecast fixtures', () => {
  it('exposes valid, unknown-code, misaligned and partial payloads', () => {
    expect(forecastFixtures.success.daily?.time).toHaveLength(5);
    expect(forecastFixtures.unknownWmo.current?.weather_code).toBe(999);
    expect(forecastFixtures.misalignedArrays.daily?.temperature_2m_max).toHaveLength(4);
    expect(forecastFixtures.partialData.daily).not.toHaveProperty('temperature_2m_max');
  });

  it('exposes delayed and failed transport responses', async () => {
    expect(forecastFixtures.delayedSuccess.delayMs).toBeGreaterThan(0);

    const okResponse = buildForecastResponse(forecastFixtures.success);
    await expect(okResponse.json()).resolves.toMatchObject({
      timezone: 'America/Sao_Paulo',
      daily: { time: expect.arrayContaining(['2026-09-16']) },
    });

    const httpFailure = buildForecastHttpFailure(503);
    expect(httpFailure.status).toBe(503);
    await expect(httpFailure.json()).resolves.toMatchObject({
      error: 'service_unavailable',
    });
  });
});
