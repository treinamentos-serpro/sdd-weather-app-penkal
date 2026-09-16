import { Clock3, MapPin } from 'lucide-react';
import { formatUpdatedAt } from '../domain/dateTime';
import { celsiusToFahrenheit } from '../domain/temperature';
import type { TemperatureUnit, WeatherReport } from '../types/weather';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  report: WeatherReport;
  unit: TemperatureUnit;
}

function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === 'celsius' ? Math.round(celsius) : celsiusToFahrenheit(celsius);
  return `${value} ${unit === 'celsius' ? '°C' : '°F'}`;
}

export default function CurrentWeather({ report, unit }: CurrentWeatherProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <MapPin aria-hidden="true" className="h-4 w-4 text-cyan-300" />
        <p>
          {report.city.name}, {report.city.country}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-5xl font-semibold text-white sm:text-6xl">
          {formatTemperature(report.current.temperatureCelsius, unit)}
        </p>
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-amber-200/20 bg-amber-300/10 text-amber-300 sm:h-24 sm:w-24">
          <WeatherIcon condition={report.current.condition} className="h-11 w-11 sm:h-14 sm:w-14" />
        </div>
      </div>

      <p className="mt-5 text-lg font-medium text-amber-200">{report.current.condition}</p>
      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-slate-400">
        <Clock3 aria-hidden="true" className="h-4 w-4" />
        <p>{formatUpdatedAt(report.current.observedAt)}</p>
      </div>
    </div>
  );
}
