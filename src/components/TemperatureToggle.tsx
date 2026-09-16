import type { TemperatureUnit } from '../types/weather';

interface TemperatureToggleProps {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

const units: ReadonlyArray<{ value: TemperatureUnit; label: string; shortLabel: string }> = [
  { value: 'celsius', label: 'Celsius (C)', shortLabel: '°C' },
  { value: 'fahrenheit', label: 'Fahrenheit (F)', shortLabel: '°F' },
];

export default function TemperatureToggle({ unit, onChange }: TemperatureToggleProps) {
  return (
    <fieldset className="w-fit" aria-label="Unidade de temperatura">
      <legend className="sr-only">Unidade</legend>
      <div className="flex rounded-lg border border-white/10 bg-night-900/70 p-1" role="radiogroup">
        {units.map((temperatureUnit) => (
          <label
            key={temperatureUnit.value}
            className="cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-slate-400 transition-colors has-[:checked]:bg-white has-[:checked]:text-night-900 focus-within:ring-2 focus-within:ring-cyan-300 focus-within:ring-offset-2 focus-within:ring-offset-night-900"
          >
            <input
              className="sr-only"
              type="radio"
              name="temperature-unit"
              value={temperatureUnit.value}
              aria-label={temperatureUnit.label}
              checked={unit === temperatureUnit.value}
              onChange={() => onChange(temperatureUnit.value)}
            />
            {temperatureUnit.shortLabel}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
