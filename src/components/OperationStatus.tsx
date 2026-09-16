import { AlertTriangle, LoaderCircle, RotateCcw, SearchX } from 'lucide-react';
import type { OperationState } from '../types/weather';

type OperationKind = 'search' | 'weather';

interface OperationStatusProps {
  operation: OperationKind;
  state: OperationState<unknown>;
  cityName?: string;
  onRetry?: () => Promise<void> | void;
}

function getLoadingMessage(operation: OperationKind, cityName?: string): string {
  if (operation === 'search') {
    return 'Buscando localidades...';
  }

  return cityName ? `Consultando o clima de ${cityName}...` : 'Consultando o clima...';
}

function getEmptyMessage(operation: OperationKind): string {
  return operation === 'search'
    ? 'Nenhuma localidade foi encontrada para esta busca.'
    : 'Não há dados meteorológicos disponíveis.';
}

export default function OperationStatus({
  operation,
  state,
  cityName,
  onRetry,
}: OperationStatusProps) {
  if (state.status === 'loading') {
    return (
      <div role="status" className="flex items-center gap-3 rounded-lg bg-cyan-300/[0.06] p-4">
        <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin text-cyan-300" />
        <p className="text-sm text-slate-200">{getLoadingMessage(operation, cityName)}</p>
      </div>
    );
  }

  if (state.status === 'empty') {
    return (
      <div role="status" className="flex items-center gap-3 rounded-lg bg-white/[0.04] p-4">
        <SearchX aria-hidden="true" className="h-5 w-5 text-slate-400" />
        <p className="text-sm text-slate-300">{getEmptyMessage(operation)}</p>
      </div>
    );
  }

  if (state.status === 'error' && state.error) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-3 rounded-lg border border-amber-300/20 bg-amber-300/[0.07] p-4 text-sm text-slate-200 sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-start gap-3">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <p>{state.error.message}</p>
        </div>
        {state.error.recoverable && onRetry ? (
          <button
            type="button"
            onClick={() => void onRetry()}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-amber-300/40 px-3 py-2 font-medium text-white transition hover:bg-amber-300/10 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Tentar novamente
          </button>
        ) : null}
      </div>
    );
  }

  return null;
}
