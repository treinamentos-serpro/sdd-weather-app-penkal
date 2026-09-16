import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import OperationStatus from '../../src/components/OperationStatus';

it('announces loading and empty search states', () => {
  const { rerender } = render(
    <OperationStatus operation="search" state={{ status: 'loading', data: [], error: null }} />,
  );

  expect(screen.getByRole('status')).toHaveTextContent('Buscando localidades...');

  rerender(
    <OperationStatus operation="search" state={{ status: 'empty', data: [], error: null }} />,
  );

  expect(screen.getByRole('status')).toHaveTextContent(
    'Nenhuma localidade foi encontrada para esta busca.',
  );
});

it('announces weather loading with the selected city', () => {
  render(
    <OperationStatus
      operation="weather"
      cityName="Recife"
      state={{ status: 'loading', data: null, error: null }}
    />,
  );

  expect(screen.getByRole('status')).toHaveTextContent('Consultando o clima de Recife...');
});

it('shows a named retry only for a recoverable error', async () => {
  const user = userEvent.setup();
  const onRetry = vi.fn();
  render(
    <OperationStatus
      operation="weather"
      onRetry={onRetry}
      state={{
        status: 'error',
        data: null,
        error: {
          operation: 'weather',
          code: 'timeout',
          message: 'A consulta do clima excedeu o tempo limite.',
          recoverable: true,
        },
      }}
    />,
  );

  expect(screen.getByRole('alert')).toHaveTextContent(
    'A consulta do clima excedeu o tempo limite.',
  );
  await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

  expect(onRetry).toHaveBeenCalledOnce();
});
