export function roundTemperature(temperature: number): number {
  const rounded = Math.round(Math.abs(temperature));
  return temperature < 0 ? -rounded : rounded;
}

export function celsiusToFahrenheit(celsius: number): number {
  const fahrenheit = celsius * (9 / 5) + 32;
  return roundTemperature(fahrenheit);
}
