import { useEffect, useRef, useState } from 'react';

import { searchCities } from '../services/geocodingService';
import { getWeatherReport } from '../services/weatherService';
import type { AppError } from '../types/errors';
import type {
  City,
  OperationState,
  TemperatureUnit,
  WeatherAppState,
  WeatherReport,
} from '../types/weather';

const initialSearchState: OperationState<readonly City[]> = {
  status: 'idle',
  data: [],
  error: null,
};

const initialWeatherState: OperationState<WeatherReport | null> = {
  status: 'idle',
  data: null,
  error: null,
};

export interface UseWeatherAppResult extends WeatherAppState {
  setQuery: (query: string) => void;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
  submitSearch: () => Promise<void>;
  retrySearch: () => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retryWeather: () => Promise<void>;
}

const createInitialState = (): WeatherAppState => ({
  query: '',
  lastSubmittedQuery: null,
  search: initialSearchState,
  selectedCity: null,
  weather: initialWeatherState,
  unit: 'celsius',
});

export function useWeatherApp(): UseWeatherAppResult {
  const [state, setState] = useState<WeatherAppState>(createInitialState);
  const searchControllerRef = useRef<AbortController | null>(null);
  const weatherControllerRef = useRef<AbortController | null>(null);
  const searchOperationIdRef = useRef(0);
  const weatherOperationIdRef = useRef(0);

  useEffect(
    () => () => {
      searchControllerRef.current?.abort();
      weatherControllerRef.current?.abort();
    },
    [],
  );

  const setQuery = (query: string): void => {
    setState((currentState) => ({ ...currentState, query }));
  };

  const setUnit = (unit: TemperatureUnit): void => {
    setState((currentState) => ({ ...currentState, unit }));
  };

  const toggleUnit = (): void => {
    setState((currentState) => ({
      ...currentState,
      unit: currentState.unit === 'celsius' ? 'fahrenheit' : 'celsius',
    }));
  };

  const runSearch = async (query: string): Promise<void> => {
    const submittedQuery = query.trim();

    searchControllerRef.current?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;
    const operationId = ++searchOperationIdRef.current;

    if (!submittedQuery) {
      setState((currentState) => ({
        ...currentState,
        search: { status: 'empty', data: [], error: null },
      }));
      return;
    }

    setState((currentState) => ({
      ...currentState,
      lastSubmittedQuery: submittedQuery,
      search: { status: 'loading', data: [], error: null },
    }));

    try {
      const cities = await searchCities(submittedQuery, controller.signal);
      if (operationId !== searchOperationIdRef.current) {
        return;
      }
      setState((currentState) => ({
        ...currentState,
        search: {
          status: cities.length === 0 ? 'empty' : 'success',
          data: cities,
          error: null,
        },
      }));
    } catch (error: unknown) {
      if (operationId !== searchOperationIdRef.current || controller.signal.aborted) {
        return;
      }
      setState((currentState) => ({
        ...currentState,
        search: { status: 'error', data: [], error: toSearchError(error) },
      }));
    }
  };

  const submitSearch = (): Promise<void> => runSearch(state.query);

  const retrySearch = (): Promise<void> =>
    state.lastSubmittedQuery ? runSearch(state.lastSubmittedQuery) : Promise.resolve();

  const runWeather = async (city: City): Promise<void> => {
    weatherControllerRef.current?.abort();
    const controller = new AbortController();
    weatherControllerRef.current = controller;
    const operationId = ++weatherOperationIdRef.current;

    setState((currentState) => ({
      ...currentState,
      selectedCity: city,
      weather: { status: 'loading', data: null, error: null },
    }));

    try {
      const report = await getWeatherReport(city, controller.signal);
      if (operationId !== weatherOperationIdRef.current) {
        return;
      }
      setState((currentState) => ({
        ...currentState,
        weather: { status: 'success', data: report, error: null },
      }));
    } catch (error: unknown) {
      if (operationId !== weatherOperationIdRef.current || controller.signal.aborted) {
        return;
      }
      setState((currentState) => ({
        ...currentState,
        weather: { status: 'error', data: null, error: toWeatherError(error) },
      }));
    }
  };

  const selectCity = (city: City): Promise<void> => runWeather(city);

  const retryWeather = (): Promise<void> =>
    state.selectedCity ? runWeather(state.selectedCity) : Promise.resolve();

  return {
    ...state,
    setQuery,
    setUnit,
    toggleUnit,
    submitSearch,
    retrySearch,
    selectCity,
    retryWeather,
  };
}

function toSearchError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  return {
    operation: 'search',
    code: 'network',
    message: 'Não foi possível buscar localidades.',
    recoverable: true,
  };
}

function toWeatherError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  return {
    operation: 'weather',
    code: 'network',
    message: 'Não foi possível consultar o clima.',
    recoverable: true,
  };
}

function isAppError(error: unknown): error is AppError {
  return typeof error === 'object' && error !== null && 'code' in error && 'operation' in error;
}
