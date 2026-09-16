import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadDateTime(timeZone: string) {
  vi.stubEnv('TZ', timeZone);
  vi.resetModules();
  return import('../../src/domain/dateTime');
}

describe('formatForecastDate', () => {
  it('preserva a data local de São Paulo (RF4)', async () => {
    const { formatForecastDate } = await loadDateTime('America/Sao_Paulo');

    expect(formatForecastDate('2026-09-16')).toBe('16 de setembro');
  });

  it('preserva a data local de Tóquio (RF4)', async () => {
    const { formatForecastDate } = await loadDateTime('Asia/Tokyo');

    expect(formatForecastDate('2026-09-17')).toBe('17 de setembro');
  });
});

describe('formatUpdatedAt', () => {
  it('preserva o horário local ao cruzar a meia-noite (RF3)', async () => {
    const { formatUpdatedAt } = await loadDateTime('America/Sao_Paulo');

    expect(formatUpdatedAt('2026-09-16T23:45')).toBe('Atualizado às 23:45');
    expect(formatUpdatedAt('2026-09-17T00:15')).toBe('Atualizado às 00:15');
  });
});
