import { afterEach, describe, expect, it, vi } from 'vitest';

import { requestJson } from '../../src/services/http';

describe('requestJson', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('returns the parsed JSON for a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ city: 'Recife' }))),
    );

    await expect(
      requestJson<{ city: string }>({ url: 'https://example.test', operation: 'search' }),
    ).resolves.toEqual({
      city: 'Recife',
    });
  });

  it('classifies HTTP and network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    await expect(
      requestJson({ url: 'https://example.test', operation: 'search' }),
    ).rejects.toMatchObject({
      code: 'service',
    });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')));

    await expect(
      requestJson({ url: 'https://example.test', operation: 'weather' }),
    ).rejects.toMatchObject({
      code: 'network',
    });
  });

  it('classifies an abort triggered by the ten-second timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        (_url: string, options: RequestInit) =>
          new Promise((_resolve, reject) => {
            options.signal?.addEventListener('abort', () =>
              reject(new DOMException('', 'AbortError')),
            );
          }),
      ),
    );

    const request = expect(
      requestJson({ url: 'https://example.test', operation: 'weather' }),
    ).rejects.toMatchObject({ code: 'timeout' });
    await vi.advanceTimersByTimeAsync(10_000);

    await request;
  });

  it('preserves an external cancellation as AbortError', async () => {
    const controller = new AbortController();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        (_url: string, options: RequestInit) =>
          new Promise((_resolve, reject) => {
            options.signal?.addEventListener('abort', () =>
              reject(new DOMException('', 'AbortError')),
            );
          }),
      ),
    );

    const request = requestJson({
      url: 'https://example.test',
      operation: 'search',
      signal: controller.signal,
    });
    controller.abort();

    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  });
});
