import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatForecastDate } from '../domain/dateTime';
import { celsiusToFahrenheit, roundTemperature } from '../domain/temperature';
import type { TemperatureUnit, WeatherReport } from '../types/weather';
import WeatherIcon from './WeatherIcon';

interface DailyForecastProps {
  report: WeatherReport;
  unit: TemperatureUnit;
}

function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === 'celsius' ? roundTemperature(celsius) : celsiusToFahrenheit(celsius);
  return `${value} ${unit === 'celsius' ? '°C' : '°F'}`;
}

export default function DailyForecast({ report, unit }: DailyForecastProps) {
  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      aria-label="Previsão diária"
    >
      {report.forecast.slice(0, 5).map((day, index) => (
        <li
          key={day.date}
          className="group min-w-0 rounded-lg border border-white/10 bg-night-900/45 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.08] sm:p-4"
        >
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-cyan-300">
            {index === 0 ? 'Hoje' : `Dia ${index + 1}`}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-white">
            {formatForecastDate(day.date)}
          </p>
          <WeatherIcon
            condition={day.condition}
            className="my-5 h-9 w-9 text-amber-300 transition-transform duration-200 group-hover:scale-110"
          />
          <p className="min-h-10 text-sm leading-5 text-slate-300">{day.condition}</p>
          <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3">
            <p className="flex items-center gap-1 text-sm text-slate-400">
              <ArrowDown aria-hidden="true" className="h-3.5 w-3.5 text-cyan-300" />
              <span>Mín. {formatTemperature(day.minimumCelsius, unit)}</span>
            </p>
            <p className="flex items-center gap-1 text-sm font-medium text-white">
              <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
              <span>Máx. {formatTemperature(day.maximumCelsius, unit)}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
