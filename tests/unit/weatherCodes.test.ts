import { describe, expect, it } from 'vitest';
import { weatherCodeToCondition } from '../../src/domain/weatherCodes';

describe('weatherCodeToCondition', () => {
  it.each([
    [[0], 'Céu limpo'],
    [[1, 2], 'Parcialmente nublado'],
    [[3], 'Nublado'],
    [[45, 48], 'Neblina'],
    [[51, 53, 55, 56, 57], 'Garoa'],
    [[61, 63, 65, 66, 67], 'Chuva'],
    [[71, 73, 75, 77], 'Neve'],
    [[80, 81, 82, 85, 86], 'Pancadas'],
    [[95, 96, 99], 'Tempestade'],
  ] as const)('maps WMO codes %j to %s', (codes, condition) => {
    for (const code of codes) {
      expect(weatherCodeToCondition(code)).toBe(condition);
    }
  });

  it.each([undefined, null, 999])('uses the fallback for %s', (code) => {
    expect(weatherCodeToCondition(code)).toBe('Condição indisponível');
  });
});
