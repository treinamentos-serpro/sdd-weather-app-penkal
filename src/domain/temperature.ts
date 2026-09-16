export function celsiusToFahrenheit(celsius: number): number {
  const fahrenheit = celsius * (9 / 5) + 32;
  return Math.sign(fahrenheit) * Math.round(Math.abs(fahrenheit));
}
