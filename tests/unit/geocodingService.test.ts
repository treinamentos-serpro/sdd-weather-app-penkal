import { afterEach, describe, expect, it, vi } from 'vitest';

import { searchCities } from '../../src/services/geocodingService';
import {
  buildGeocodingHttpFailure,
  buildGeocodingResponse,
  geocodingFixtures,
} from '../fixtures/geocoding';

describe('searchCities', () => {
  afterEach(() => vi.restoreAllMocks());

  it('uses the expected API parameters and preserves valid result order', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(buildGeocodingResponse(geocodingFixtures.successWithHomonyms));
    vi.stubGlobal('fetch', fetchMock);

    const cities = await searchCities('  São Paulo  ');
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));

    expect(url.searchParams.get('name')).toBe('São Paulo');
    expect(url.searchParams.get('count')).toBe('10');
    expect(url.searchParams.get('language')).toBe('pt');
    expect(url.searchParams.get('format')).toBe('json');
    expect(cities.map((city) => city.id)).toEqual([3448439, 3455971, 3456937]);
    expect(cities[0]).toMatchObject({ region: 'São Paulo' });
  });

  it('returns an empty list for absent results and rejects unusable results', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(buildGeocodingResponse({})));
    await expect(searchCities('Recife')).resolves.toEqual([]);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(buildGeocodingResponse(geocodingFixtures.invalidData)),
    );
    await expect(searchCities('Recife')).rejects.toMatchObject({
      code: 'invalid-data',
      operation: 'search',
    });
  });

  it('propagates transport errors from the HTTP boundary', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(buildGeocodingHttpFailure()));

    await expect(searchCities('Recife')).rejects.toMatchObject({
      code: 'service',
      operation: 'search',
    });
  });
});
