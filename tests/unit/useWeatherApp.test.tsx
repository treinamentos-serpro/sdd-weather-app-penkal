import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useWeatherApp } from '../../src/hooks/useWeatherApp';
import { searchCities } from '../../src/services/geocodingService';
import { getWeatherReport } from '../../src/services/weatherService';

vi.mock('../../src/services/geocodingService', () => ({
  searchCities: vi.fn(),
}));

vi.mock('../../src/services/weatherService', () => ({
  getWeatherReport: vi.fn(),
}));

const mockedSearchCities = vi.mocked(searchCities);
const mockedGetWeatherReport = vi.mocked(getWeatherReport);

const recife = {
  id: 1,
  name: 'Recife',
  country: 'Brazil',
  latitude: -8,
  longitude: -34,
  timezone: 'America/Recife',
};

describe('useWeatherApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with an empty idle state and Celsius', () => {
    const { result } = renderHook(() => useWeatherApp());

    expect(result.current.query).toBe('');
    expect(result.current.lastSubmittedQuery).toBeNull();
    expect(result.current.unit).toBe('celsius');
    expect(result.current.search).toEqual({
      status: 'idle',
      data: [],
      error: null,
    });
    expect(result.current.selectedCity).toBeNull();
    expect(result.current.weather).toEqual({
      status: 'idle',
      data: null,
      error: null,
    });
  });

  it('updates query and toggles the unit without fetching', () => {
    const { result } = renderHook(() => useWeatherApp());

    act(() => {
      result.current.setQuery('Recife');
      result.current.toggleUnit();
    });

    expect(result.current.query).toBe('Recife');
    expect(result.current.unit).toBe('fahrenheit');
    expect(mockedSearchCities).not.toHaveBeenCalled();
  });

  it('rejects blank searches locally without calling the service', async () => {
    const { result } = renderHook(() => useWeatherApp());

    await act(async () => {
      await result.current.submitSearch();
    });

    expect(mockedSearchCities).not.toHaveBeenCalled();
    expect(result.current.search).toEqual({ status: 'empty', data: [], error: null });
  });

  it('publishes search loading and success states', async () => {
    mockedSearchCities.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Recife',
        country: 'Brazil',
        latitude: -8,
        longitude: -34,
        timezone: 'America/Recife',
      },
    ]);
    const { result } = renderHook(() => useWeatherApp());

    act(() => result.current.setQuery(' Recife '));
    let search: Promise<void> | undefined;
    act(() => {
      search = result.current.submitSearch();
    });

    expect(result.current.search.status).toBe('loading');
    await act(async () => await search);

    expect(mockedSearchCities).toHaveBeenCalledWith('Recife', expect.any(AbortSignal));
    expect(result.current.lastSubmittedQuery).toBe('Recife');
    expect(result.current.search.status).toBe('success');
  });

  it('retries a failed search with the preserved term', async () => {
    const error = {
      operation: 'search' as const,
      code: 'network' as const,
      message: 'Não foi possível conectar ao serviço.',
      recoverable: true as const,
    };
    mockedSearchCities.mockRejectedValueOnce(error).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useWeatherApp());

    act(() => result.current.setQuery('Recife'));
    await act(async () => await result.current.submitSearch());
    expect(result.current.search.status).toBe('error');

    await act(async () => await result.current.retrySearch());

    expect(mockedSearchCities).toHaveBeenLastCalledWith('Recife', expect.any(AbortSignal));
    expect(mockedSearchCities).toHaveBeenCalledTimes(2);
    expect(result.current.search.status).toBe('empty');
  });

  it('discards a previous search response and aborts pending work on unmount', async () => {
    let resolveFirstSearch: ((cities: readonly (typeof recife)[]) => void) | undefined;
    const firstSearch = new Promise<readonly (typeof recife)[]>((resolve) => {
      resolveFirstSearch = resolve;
    });
    mockedSearchCities.mockReturnValueOnce(firstSearch).mockResolvedValueOnce([]);
    const { result, unmount } = renderHook(() => useWeatherApp());

    act(() => {
      result.current.setQuery('Recife');
    });
    act(() => {
      void result.current.submitSearch();
    });
    const firstSignal = mockedSearchCities.mock.calls[0]?.[1];
    act(() => {
      result.current.setQuery('Olinda');
      void result.current.submitSearch();
    });
    await act(async () => undefined);
    resolveFirstSearch?.([recife]);
    await act(async () => undefined);

    expect(firstSignal?.aborted).toBe(true);
    expect(result.current.search).toEqual({ status: 'empty', data: [], error: null });

    unmount();
    expect(mockedSearchCities.mock.calls[1]?.[1]?.aborted).toBe(true);
  });

  it('loads weather for the selected city and retries the preserved city', async () => {
    const error = {
      operation: 'weather' as const,
      code: 'network' as const,
      message: 'Não foi possível conectar ao serviço.',
      recoverable: true as const,
    };
    const report = {
      city: recife,
      current: {
        observedAt: '2026-09-16T14:00',
        temperatureCelsius: 22,
        condition: 'Parcialmente nublado' as const,
      },
      forecast: [],
    };
    mockedGetWeatherReport.mockRejectedValueOnce(error).mockResolvedValueOnce(report);
    const { result } = renderHook(() => useWeatherApp());

    await act(async () => await result.current.selectCity(recife));
    expect(result.current.selectedCity).toBe(recife);
    expect(result.current.weather.status).toBe('error');

    await act(async () => await result.current.retryWeather());

    expect(mockedGetWeatherReport).toHaveBeenLastCalledWith(recife, expect.any(AbortSignal));
    expect(result.current.weather).toEqual({ status: 'success', data: report, error: null });
  });

  it('discards a weather response from a previously selected city', async () => {
    let resolveFirstReport:
      | ((report: {
          city: typeof recife;
          current: { observedAt: string; temperatureCelsius: number; condition: 'Céu limpo' };
          forecast: [];
        }) => void)
      | undefined;
    const firstReport = new Promise<{
      city: typeof recife;
      current: { observedAt: string; temperatureCelsius: number; condition: 'Céu limpo' };
      forecast: [];
    }>((resolve) => {
      resolveFirstReport = resolve;
    });
    const olinda = { ...recife, id: 2, name: 'Olinda' };
    const latestReport = {
      city: olinda,
      current: {
        observedAt: '2026-09-16T14:00',
        temperatureCelsius: 25,
        condition: 'Céu limpo' as const,
      },
      forecast: [],
    };
    mockedGetWeatherReport.mockReturnValueOnce(firstReport).mockResolvedValueOnce(latestReport);
    const { result } = renderHook(() => useWeatherApp());

    act(() => {
      void result.current.selectCity(recife);
      void result.current.selectCity(olinda);
    });
    await act(async () => undefined);
    resolveFirstReport?.({
      city: recife,
      current: { observedAt: '2026-09-16T14:00', temperatureCelsius: 22, condition: 'Céu limpo' },
      forecast: [],
    });
    await act(async () => undefined);

    expect(result.current.weather.data).toEqual(latestReport);
    expect(result.current.selectedCity).toEqual(olinda);
  });
});
