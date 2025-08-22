import { render, fireEvent, screen } from '@testing-library/react';
import Menu from './Menu';

jest.mock('../../../../store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn((selector) =>
    selector({
      user: { username: 'TestUser', score: 42, time: 88 },
      game: { config: { pairs: 6, time: 60, maxMistakes: 3 } }
    })
  ),
}));

jest.mock('../../../../store/slices/userSlice', () => ({
  setUsername: jest.fn((name) => ({ type: 'mock/setUsername', payload: name })),
}));

jest.mock('../../../../store/slices/gameSlice', () => ({
  setConfig: jest.fn(),
  setTimeLeft: jest.fn(),
  resetGame: jest.fn(),
  setStatus: jest.fn(),
  setGameStarted: jest.fn(),
}));

jest.mock('../../../../utils/cardGenerator', () => ({
  generateShuffledCards: jest.fn(() => ['card1', 'card2']),
}));

jest.mock('./menu.module.scss', () => ({}));

jest.mock('./settings/SettingsModal', () => () => <div data-testid="settings-modal">MockSettingsModal</div>);

describe('<Menu />', () => {
  const mockOnStart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders username and score', () => {
    render(<Menu onStart={mockOnStart} />);
    expect(
        screen.getByText((...[, element]) =>
            element?.textContent === 'Welcome, TestUser!'
        )
    ).toBeInTheDocument();
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText(/Time:/)).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('enters name edit mode on click', () => {
    render(<Menu onStart={mockOnStart} />);
    fireEvent.click(screen.getByText('TestUser'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('starts game when start button clicked', () => {
    render(<Menu onStart={mockOnStart} />);
    fireEvent.click(screen.getByRole('startGame'));
    expect(mockOnStart).toHaveBeenCalledWith(['card1', 'card2']);
  });

  it('shows settings modal when settings clicked', () => {
    render(<Menu onStart={mockOnStart} />);
    fireEvent.click(screen.getByRole('settings'));
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
  });
});