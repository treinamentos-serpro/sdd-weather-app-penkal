export type GeocodingResultFixture = {
  id?: number | string;
  name?: string;
  country?: string;
  admin1?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  timezone?: string | null;
};

export type GeocodingPayloadFixture = {
  results?: GeocodingResultFixture[];
  error?: string;
  message?: string;
};

export type MockGeocodingResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<GeocodingPayloadFixture>;
};

export const geocodingFixtures = {
  successWithHomonyms: {
    results: [
      {
        id: 3448439,
        name: 'São Paulo',
        country: 'Brazil',
        admin1: 'São Paulo',
        latitude: -23.5489,
        longitude: -46.6388,
        timezone: 'America/Sao_Paulo',
      },
      {
        id: 3455971,
        name: 'São Paulo',
        country: 'Brazil',
        admin1: 'Minas Gerais',
        latitude: -20.6607,
        longitude: -46.6292,
        timezone: 'America/Sao_Paulo',
      },
      {
        id: 3456937,
        name: 'São Paulo',
        country: 'Argentina',
        admin1: 'Santa Fe',
        latitude: -31.784,
        longitude: -60.8224,
        timezone: 'America/Argentina/Cordoba',
      },
    ],
  } satisfies GeocodingPayloadFixture,

  emptyResults: {
    results: [],
  } satisfies GeocodingPayloadFixture,

  invalidData: {
    results: [
      {
        id: 'not-a-valid-id',
        name: 'São Paulo',
        country: 'Brazil',
        admin1: 'São Paulo',
        latitude: 'not-a-number',
        longitude: null,
        timezone: null,
      },
    ],
  } satisfies GeocodingPayloadFixture,

  networkFailure: {
    ok: false,
    status: 0,
    statusText: 'Network Error',
    json: async () => ({ error: 'network_error', message: 'Falha de rede' }),
  } satisfies MockGeocodingResponse,

  httpFailure: {
    ok: false,
    status: 503,
    statusText: 'Service Unavailable',
    json: async () => ({ error: 'service_unavailable', message: 'Serviço indisponível' }),
  } satisfies MockGeocodingResponse,

  delayedSuccess: {
    delayMs: 1500,
    payload: {
      results: [
        {
          id: 3448439,
          name: 'Rio de Janeiro',
          country: 'Brazil',
          admin1: 'Rio de Janeiro',
          latitude: -22.9068,
          longitude: -43.1729,
          timezone: 'America/Sao_Paulo',
        },
      ],
    },
  } satisfies {
    delayMs: number;
    payload: GeocodingPayloadFixture;
  },
};

export const buildGeocodingResponse = (payload: GeocodingPayloadFixture): Response =>
  new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const buildGeocodingHttpFailure = (status = 503): Response =>
  new Response(
    JSON.stringify({
      error: 'service_unavailable',
      message: 'Serviço indisponível',
    }),
    {
      status,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
