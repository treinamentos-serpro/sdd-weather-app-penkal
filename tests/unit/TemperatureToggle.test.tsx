import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import TemperatureToggle from '../../src/components/TemperatureToggle';

describe('TemperatureToggle', () => {
  it('identifies the active unit and changes it by keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(<TemperatureToggle unit="celsius" onChange={onChange} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();

    const celsius = screen.getByRole('radio', { name: /celsius/i });
    const fahrenheit = screen.getByRole('radio', { name: /fahrenheit/i });

    expect(celsius).toBeChecked();
    expect(fahrenheit).not.toBeChecked();

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('fahrenheit');

    rerender(<TemperatureToggle unit="fahrenheit" onChange={onChange} />);
    await user.keyboard('{ArrowLeft}');

    expect(onChange).toHaveBeenLastCalledWith('celsius');
  });

  it('marks Fahrenheit as active when selected', () => {
    render(<TemperatureToggle unit="fahrenheit" onChange={vi.fn()} />);

    expect(screen.getByRole('radio', { name: /fahrenheit/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /celsius/i })).not.toBeChecked();
  });
});
