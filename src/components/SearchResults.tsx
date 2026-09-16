import { ArrowUpRight, MapPin } from 'lucide-react';
import type { City } from '../types/weather';

interface SearchResultsProps {
  cities: readonly City[];
  onSelect: (city: City) => Promise<void> | void;
}

export default function SearchResults({ cities, onSelect }: SearchResultsProps) {
  if (cities.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Localidades encontradas">
      {cities.map((city) => (
        <li key={city.id}>
          <button
            type="button"
            onClick={() => void onSelect(city)}
            className="group flex h-full w-full items-center gap-3 rounded-lg border border-white/10 bg-night-900/45 px-4 py-3 text-left transition duration-200 hover:border-cyan-300/40 hover:bg-cyan-300/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-cyan-300">
              <MapPin aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-white">{city.name}</span>
              <span className="mt-0.5 block truncate text-sm text-slate-400">
                {city.country} - {city.region ?? 'Indisponível'}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-cyan-300"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
