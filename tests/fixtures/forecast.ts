export type ForecastCurrentFixture = {
  time?: string;
  temperature_2m?: number | string | null;
  weather_code?: number | string | null;
};

export type ForecastDailyFixture = {
  time?: Array<string | null>;
  temperature_2m_min?: Array<number | string | null>;
  temperature_2m_max?: Array<number | string | null>;
  weather_code?: Array<number | string | null>;
};

export type ForecastPayloadFixture = {
  timezone?: string | null;
  current?: ForecastCurrentFixture | null;
  daily?: ForecastDailyFixture | null;
  error?: string;
  reason?: string;
};

export type MockForecastResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<ForecastPayloadFixture>;
};

const forecastDates = ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'];

const validDaily = {
  time: forecastDates,
  temperature_2m_min: [14, 15, 16, 13, 12],
  temperature_2m_max: [25, 27, 28, 24, 23],
  weather_code: [1, 2, 3, 61, 95],
} satisfies ForecastDailyFixture;

const validCurrent = {
  time: '2026-09-16T14:00',
  temperature_2m: 22.4,
  weather_code: 2,
} satisfies ForecastCurrentFixture;

export const forecastFixtures = {
  success: {
    timezone: 'America/Sao_Paulo',
    current: validCurrent,
    daily: validDaily,
  } satisfies ForecastPayloadFixture,

  unknownWmo: {
    timezone: 'America/Sao_Paulo',
    current: {
      ...validCurrent,
      weather_code: 999,
    },
    daily: {
      ...validDaily,
      weather_code: [999, 2, 3, 61, 95],
    },
  } satisfies ForecastPayloadFixture,

  misalignedArrays: {
    timezone: 'America/Sao_Paulo',
    current: validCurrent,
    daily: {
      ...validDaily,
      temperature_2m_max: [25, 27, 28, 24],
    },
  } satisfies ForecastPayloadFixture,

  partialData: {
    timezone: 'America/Sao_Paulo',
    current: {
      time: validCurrent.time,
      temperature_2m: validCurrent.temperature_2m,
    },
    daily: {
      time: forecastDates,
      temperature_2m_min: [14, 15, 16, 13, 12],
    },
  } satisfies ForecastPayloadFixture,

  httpFailure: {
    ok: false,
    status: 503,
    statusText: 'Service Unavailable',
    json: async () => ({ error: 'service_unavailable', reason: 'Serviço indisponível' }),
  } satisfies MockForecastResponse,

  delayedSuccess: {
    delayMs: 1500,
    payload: {
      timezone: 'America/Sao_Paulo',
      current: validCurrent,
      daily: validDaily,
    },
  } satisfies {
    delayMs: number;
    payload: ForecastPayloadFixture;
  },
};

export const buildForecastResponse = (payload: ForecastPayloadFixture): Response =>
  new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const buildForecastHttpFailure = (status = 503): Response =>
  new Response(
    JSON.stringify({
      error: 'service_unavailable',
      reason: 'Serviço indisponível',
    }),
    {
      status,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
