import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('test environment', () => {
  it('provides Testing Library, jest-dom, and a mockable global fetch', () => {
    render(<p>Weather App</p>);

    expect(screen.getByText('Weather App')).toBeInTheDocument();

    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    expect(fetch).toBe(fetchMock);
  });
});
