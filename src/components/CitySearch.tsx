import { Search } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';

interface CitySearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => Promise<void> | void;
}

export default function CitySearch({ query, onQueryChange, onSubmit }: CitySearchProps) {
  const [showGuidance, setShowGuidance] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const isEmpty = query.trim().length === 0;
    setShowGuidance(isEmpty);
    if (isEmpty) {
      inputRef.current?.focus();
    }
    void onSubmit();
  };

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit} noValidate>
      <div className="min-w-0 flex-1">
        <label htmlFor="city-search" className="sr-only">
          Nome da cidade
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          />
          <input
            ref={inputRef}
            id="city-search"
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value);
              setShowGuidance(false);
            }}
            placeholder="Busque por cidade ou localidade"
            className="h-14 w-full rounded-lg border border-white/10 bg-night-900/70 pl-12 pr-16 text-base text-white shadow-inner placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
            aria-describedby={showGuidance ? 'city-search-guidance' : undefined}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-500 sm:block">
            Enter
          </kbd>
        </div>
        {showGuidance ? (
          <p id="city-search-guidance" className="mt-2 text-sm font-medium text-amber-300">
            Informe o nome de uma cidade para buscar.
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 font-semibold text-night-900 transition duration-200 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-night-900 active:translate-y-px"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
        Buscar
      </button>
    </form>
  );
}
