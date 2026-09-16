import { CloudSun } from 'lucide-react';
import CitySearch from './components/CitySearch';
import CurrentWeather from './components/CurrentWeather';
import DailyForecast from './components/DailyForecast';
import OperationStatus from './components/OperationStatus';
import SearchResults from './components/SearchResults';
import TemperatureToggle from './components/TemperatureToggle';
import { useWeatherApp } from './hooks/useWeatherApp';

export default function App() {
  const weatherApp = useWeatherApp();
  const report = weatherApp.weather.status === 'success' ? weatherApp.weather.data : null;
  const showSearchFeedback = weatherApp.search.status !== 'idle';
  const showWeatherWorkspace = weatherApp.selectedCity !== null || report !== null;

  return (
    <main className="min-h-screen overflow-hidden px-4 py-4 text-slate-100 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-cyan-200/20 bg-cyan-300/10 text-cyan-200">
              <CloudSun aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Previsão local
              </p>
              <h1 className="truncate text-xl font-semibold text-white sm:text-2xl">Weather App</h1>
            </div>
          </div>
          <TemperatureToggle unit={weatherApp.unit} onChange={weatherApp.setUnit} />
        </header>

        <section className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-glass backdrop-blur-md sm:p-6 lg:p-8">
          <CloudSun
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-10 hidden h-56 w-56 text-cyan-100/[0.06] md:block"
            strokeWidth={0.7}
          />
          <div className="relative max-w-3xl">
            <p className="mb-2 text-sm font-medium text-cyan-300">Agora, perto de você</p>
            <h2 className="max-w-2xl text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              Como está o tempo na sua próxima parada?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
              Condições atuais e previsão dos próximos cinco dias.
            </p>
            <div className="mt-5">
              <CitySearch
                query={weatherApp.query}
                onQueryChange={weatherApp.setQuery}
                onSubmit={weatherApp.submitSearch}
              />
            </div>
          </div>
        </section>

        {showSearchFeedback ? (
          <section
            aria-labelledby="results-title"
            className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-glass backdrop-blur-md sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="results-title" className="text-lg font-semibold text-white">
                Localidades encontradas
              </h2>
              {weatherApp.search.status === 'success' ? (
                <span className="text-xs font-medium text-slate-400">
                  {weatherApp.search.data.length} opções
                </span>
              ) : null}
            </div>
            <OperationStatus
              operation="search"
              state={weatherApp.search}
              onRetry={weatherApp.retrySearch}
            />
            {weatherApp.search.status === 'success' ? (
              <SearchResults cities={weatherApp.search.data} onSelect={weatherApp.selectCity} />
            ) : null}
          </section>
        ) : null}

        {showWeatherWorkspace ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,2fr)]">
            <section
              aria-labelledby="current-weather-title"
              className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-glass backdrop-blur-md sm:p-6"
            >
              <h2 id="current-weather-title" className="text-sm font-semibold text-slate-300">
                Clima agora
              </h2>
              <div className="mt-5">
                <OperationStatus
                  operation="weather"
                  state={weatherApp.weather}
                  cityName={weatherApp.selectedCity?.name}
                  onRetry={weatherApp.retryWeather}
                />
                {report ? <CurrentWeather report={report} unit={weatherApp.unit} /> : null}
              </div>
            </section>

            <section
              aria-labelledby="forecast-title"
              className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-glass backdrop-blur-md sm:p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="forecast-title" className="text-lg font-semibold text-white">
                  Próximos 5 dias
                </h2>
                <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-slate-500 sm:block">
                  Previsão diária
                </span>
              </div>
              <div className="mt-5">
                {report ? <DailyForecast report={report} unit={weatherApp.unit} /> : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
