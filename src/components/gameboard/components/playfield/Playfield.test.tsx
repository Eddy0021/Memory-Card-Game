import { render, screen, fireEvent, act } from '@testing-library/react';
import Playfield from './Playfield';

jest.mock('./playfield.module.scss', () => ({}));

jest.mock('../card/Card', () => (props: any) => {
  const { value, isFlipped, isWrong, onClick } = props;
  return (
    <button
      data-testid={`card-${value}`}
      aria-pressed={isFlipped}
      data-wrong={isWrong}
      onClick={onClick}
    >
      {isFlipped ? value : 'X'}
    </button>
  );
});

const mockDispatch = jest.fn();

let mockState = {
  game: {
    matches: 1,
    mistakes: 0,
    config: { maxMistakes: 3, pairs: 2 },
    status: 'playing',
    timeLeft: 10,
  },
  user: {
    score: 0,
    time: 0,
  },
};

jest.mock('../../../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => selector(mockState),
}));

beforeEach(() => {
  jest.useFakeTimers();
  mockDispatch.mockClear();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const createCards = () => [
  { id: 1, value: 'A', isFlipped: false, isMatched: false },
  { id: 2, value: 'A', isFlipped: false, isMatched: false },
  { id: 3, value: 'B', isFlipped: false, isMatched: false },
  { id: 4, value: 'B', isFlipped: false, isMatched: false },
];

describe('Playfield Component', () => {
  test('renders cards and handles flipping and matching', () => {
    let cards = createCards();
    const setCards = jest.fn((newCards) => {
      cards = newCards;
    });

    render(<Playfield cards={cards} setCards={setCards} />);

    const cardA1 = screen.getAllByTestId('card-A')[0];
    expect(cardA1).toHaveTextContent('X');

    fireEvent.click(cardA1);

    expect(setCards).toHaveBeenCalled();

    const cardA2 = screen.getAllByTestId('card-A')[1];
    fireEvent.click(cardA2);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'game/incrementMatch' }));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'game/setStatus' }));

    const matchedCall = setCards.mock.calls.find(call =>
      call[0].some((c: any) => c.isMatched === true)
    );
    expect(matchedCall).toBeDefined();
  });

  test('handles mismatch and increments mistake', () => {
    let cards = createCards();
    const setCards = jest.fn((newCards) => {
      cards = newCards;
    });

    render(<Playfield cards={cards} setCards={setCards} />);

    fireEvent.click(screen.getAllByTestId('card-A')[0]);
    fireEvent.click(screen.getAllByTestId('card-B')[0]);

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'game/incrementMistake' }));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const flippedBackCall = setCards.mock.calls.find(call =>
      call[0].every((c: any) => c.isFlipped === false)
    );
    expect(flippedBackCall).toBeDefined();
  });

  test('handles timeLeft 0 triggers lost status', () => {
    mockState = {
      ...mockState,
      game: {
        ...mockState.game,
        timeLeft: 0,
      },
    };

    let cards = createCards();
    const setCards = jest.fn();

    render(<Playfield cards={cards} setCards={setCards} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'game/setStatus', payload: 'lost' }));

    mockState = {
      ...mockState,
      game: {
        ...mockState.game,
        timeLeft: 10,
      },
    };
  });

  test('clicking back button dispatches reset actions', () => {
    mockState = {
      ...mockState,
      game: {
        ...mockState.game,
        status: 'won',
      },
    };

    let cards = createCards();
    const setCards = jest.fn();

    render(<Playfield cards={cards} setCards={setCards} />);

    const backBtn = screen.getByRole('button', { name: /Back to main menu/i });
    fireEvent.click(backBtn);

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'game/setStatus', payload: 'idle' }));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'game/setGameStarted', payload: false }));

    mockState = {
      ...mockState,
      game: {
        ...mockState.game,
        status: 'playing',
      },
    };
  });
});