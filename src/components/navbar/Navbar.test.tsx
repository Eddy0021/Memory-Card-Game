import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetGame } from '../../store/slices/gameSlice';
import '@testing-library/jest-dom';

jest.mock('../../store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../../assets/images/logo.png', () => 'logo.png');

describe('Navbar', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  test('renders logo regardless of status', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      matches: 0,
      mistakes: 0,
      timeLeft: 60,
      status: 'idle',
    });

    render(<Navbar />);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  test('renders game stats and reset button when status is playing', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      matches: 3,
      mistakes: 2,
      timeLeft: 45,
      status: 'playing',
    });

    render(<Navbar />);
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('dispatches resetGame when reset icon is clicked', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      matches: 0,
      mistakes: 0,
      timeLeft: 30,
      status: 'playing',
    });

    render(<Navbar />);

    const resetButton = screen.getByRole('button');
    fireEvent.click(resetButton);
    expect(mockDispatch).toHaveBeenCalledWith(resetGame());
  });
});