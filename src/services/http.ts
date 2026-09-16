import type { AppError, OperationKind } from '../types/errors';

const REQUEST_TIMEOUT_MS = 10_000;

interface HttpRequestOptions {
  url: string;
  operation: OperationKind;
  signal?: AbortSignal;
}

const createError = (
  operation: OperationKind,
  code: AppError['code'],
  message: string,
): AppError => ({
  operation,
  code,
  message,
  recoverable: true,
});

export async function requestJson<T>({ url, operation, signal }: HttpRequestOptions): Promise<T> {
  if (signal?.aborted) {
    throw new DOMException('A requisição foi cancelada.', 'AbortError');
  }

  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);
  const abortRequest = (): void => timeoutController.abort();
  signal?.addEventListener('abort', abortRequest, { once: true });

  try {
    const response = await fetch(url, { signal: timeoutController.signal });

    if (!response.ok) {
      throw createError(
        operation,
        'service',
        operation === 'search'
          ? 'Não foi possível buscar localidades.'
          : 'Não foi possível consultar o clima.',
      );
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      if (signal?.aborted) {
        throw error;
      }

      throw createError(operation, 'timeout', 'A requisição demorou mais que o esperado.');
    }

    if (isAppError(error)) {
      throw error;
    }

    throw createError(operation, 'network', 'Não foi possível conectar ao serviço.');
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortRequest);
  }
}

function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'operation' in error &&
    'recoverable' in error
  );
}
