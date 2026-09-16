import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import CitySearch from '../../src/components/CitySearch';

it('submits a city by Enter and explains blank input without blocking focus', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  const onQueryChange = vi.fn();
  const { rerender } = render(
    <CitySearch query="Recife" onQueryChange={onQueryChange} onSubmit={onSubmit} />,
  );

  const input = screen.getByRole('textbox', { name: 'Nome da cidade' });
  await user.click(input);
  await user.keyboard('{Enter}');

  expect(onSubmit).toHaveBeenCalledTimes(1);

  rerender(<CitySearch query="   " onQueryChange={onQueryChange} onSubmit={onSubmit} />);
  await user.click(screen.getByRole('button', { name: 'Buscar' }));

  expect(screen.getByText('Informe o nome de uma cidade para buscar.')).toBeVisible();
  expect(onSubmit).toHaveBeenCalledTimes(2);
});
