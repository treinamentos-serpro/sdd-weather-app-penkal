import { describe, expect, it } from 'vitest';
import {
  buildGeocodingHttpFailure,
  buildGeocodingResponse,
  geocodingFixtures,
} from '../fixtures/geocoding';

describe('geocoding fixtures', () => {
  it('exposes success, empty and invalid payload fixtures', () => {
    expect(geocodingFixtures.successWithHomonyms.results).toHaveLength(3);
    expect(geocodingFixtures.emptyResults.results).toEqual([]);
    expect(geocodingFixtures.invalidData.results?.[0]).toMatchObject({
      name: 'São Paulo',
      latitude: 'not-a-number',
    });
  });

  it('builds http and json responses consistent with transport errors', async () => {
    const okResponse = buildGeocodingResponse(geocodingFixtures.successWithHomonyms);
    await expect(okResponse.json()).resolves.toMatchObject({
      results: expect.arrayContaining([expect.objectContaining({ name: 'São Paulo' })]),
    });

    const httpFailure = buildGeocodingHttpFailure(503);
    expect(httpFailure.status).toBe(503);
    await expect(httpFailure.json()).resolves.toMatchObject({
      error: 'service_unavailable',
    });
  });
});
