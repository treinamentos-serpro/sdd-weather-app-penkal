import { describe, expect, it } from 'vitest';
import { celsiusToFahrenheit } from '../../src/domain/temperature';

describe('celsiusToFahrenheit', () => {
  it('converts Celsius to Fahrenheit and rounds the result', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(1)).toBe(34);
  });

  it('rounds half values away from zero', () => {
    expect(celsiusToFahrenheit((-33.5 * 5) / 9)).toBe(-2);
    expect(celsiusToFahrenheit((-30.5 * 5) / 9)).toBe(2);
  });
});
