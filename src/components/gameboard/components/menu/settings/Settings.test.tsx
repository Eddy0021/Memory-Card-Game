import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsModal from './SettingsModal';

const mockOnApply = jest.fn();
const mockOnClose = jest.fn();

const mockSettings = {
  pairs: 8,
  time: 60,
  maxMistakes: 5,
};

const setup = (settings = mockSettings) => {
  render(
    <SettingsModal
      onApply={mockOnApply}
      onClose={mockOnClose}
      currentSettings={settings}
    />
  );
};

describe('SettingsModal', () => {
  beforeEach(() => {
    mockOnApply.mockClear();
    mockOnClose.mockClear();
  });

  it('renders all input fields with initial values', () => {
    setup();

    expect(screen.getByLabelText(/Number of pairs/i)).toHaveValue(mockSettings.pairs);
    expect(screen.getByLabelText(/Countdown time/i)).toHaveValue(mockSettings.time);
    expect(screen.getByLabelText(/Max bad guesses/i)).toHaveValue(mockSettings.maxMistakes);
  });

  it('calls onClose when Cancel is clicked', () => {
    setup();

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('validates empty pair count and shows error styling', () => {
    setup();

    const pairInput = screen.getByLabelText(/Number of pairs/i);
    fireEvent.change(pairInput, { target: { value: '' } });

    fireEvent.click(screen.getByText(/Save settings/i));

    expect(mockOnApply).not.toHaveBeenCalled();
    expect(pairInput.className).toContain('red_border');
  });

  it('validates invalid countdown time and shows error styling', () => {
    setup();

    const countdownInput = screen.getByLabelText(/Countdown time/i);
    fireEvent.change(countdownInput, { target: { value: '' } });

    fireEvent.click(screen.getByText(/Save settings/i));

    expect(mockOnApply).not.toHaveBeenCalled();
    expect(countdownInput.className).toContain('red_border');
  });

  it('submits correct values and closes modal', () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Number of pairs/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Countdown time/i), { target: { value: '90' } });
    fireEvent.change(screen.getByLabelText(/Max bad guesses/i), { target: { value: '3' } });

    fireEvent.click(screen.getByText(/Save settings/i));

    expect(mockOnApply).toHaveBeenCalledWith(10, 90, 3);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles null maxMistakes properly', () => {
    setup();

    const maxMistakesInput = screen.getByLabelText(/Max bad guesses/i);
    fireEvent.change(maxMistakesInput, { target: { value: '' } });

    fireEvent.click(screen.getByText(/Save settings/i));

    expect(mockOnApply).toHaveBeenCalledWith(mockSettings.pairs, mockSettings.time, 0);
  });

  it('prevents submission with non-numeric input', () => {
    setup();

    const pairInput = screen.getByLabelText(/Number of pairs/i);
    fireEvent.change(pairInput, { target: { value: 'abc' } });

    fireEvent.click(screen.getByText(/Save settings/i));

    expect(mockOnApply).not.toHaveBeenCalled();
  });
});