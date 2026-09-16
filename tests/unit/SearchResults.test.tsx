import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import SearchResults from '../../src/components/SearchResults';

const cities = [
  {
    id: 1,
    name: 'Recife',
    country: 'Brazil',
    region: 'Pernambuco',
    latitude: -8,
    longitude: -34,
    timezone: 'America/Recife',
  },
  {
    id: 2,
    name: 'Recife',
    country: 'Portugal',
    latitude: 40,
    longitude: -8,
    timezone: 'Europe/Lisbon',
  },
];

it('distinguishes homonymous cities and selects an option by keyboard', async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<SearchResults cities={cities} onSelect={onSelect} />);

  expect(screen.getByRole('button', { name: /recife.*brazil.*pernambuco/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /recife.*portugal.*indisponível/i })).toBeVisible();

  await user.tab();
  await user.keyboard('{Enter}');

  expect(onSelect).toHaveBeenCalledWith(cities[0]);
});
