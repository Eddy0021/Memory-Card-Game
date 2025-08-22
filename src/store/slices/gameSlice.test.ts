import reducer, {
  setConfig,
  incrementMatch,
  incrementMistake,
  setStatus,
  resetGame,
  setTimeLeft,
  decrementTime,
  setGameStarted
} from './gameSlice';

const initialState = {
  config: { pairs: 6, time: 60, maxMistakes: null },
  matches: 0,
  mistakes: 0,
  status: 'idle' as const,
  timeLeft: 60,
  gameStarted: false,
};

describe('gameSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: "" })).toEqual(initialState);
  });

  it('should handle setConfig', () => {
    const config = { pairs: 10, time: 90, maxMistakes: 3 };
    const nextState = reducer(initialState, setConfig(config));
    expect(nextState.config).toEqual(config);
  });

  it('should handle incrementMatch', () => {
    const prevState = { ...initialState, matches: 1 };
    const nextState = reducer(prevState, incrementMatch());
    expect(nextState.matches).toBe(2);
  });

  it('should handle incrementMistake', () => {
    const prevState = { ...initialState, mistakes: 1 };
    const nextState = reducer(prevState, incrementMistake());
    expect(nextState.mistakes).toBe(2);
  });

  it('should handle setStatus', () => {
    const nextState = reducer(initialState, setStatus('playing'));
    expect(nextState.status).toBe('playing');
  });

  it('should handle resetGame', () => {
    const prevState = {
      ...initialState,
      matches: 5,
      mistakes: 2,
      status: 'lost' as const,
      gameStarted: true
    };
    const nextState = reducer(prevState, resetGame());
    expect(nextState.matches).toBe(0);
    expect(nextState.mistakes).toBe(0);
    expect(nextState.status).toBe('idle');
    expect(nextState.gameStarted).toBe(false);
  });

  it('should handle setTimeLeft', () => {
    const nextState = reducer(initialState, setTimeLeft(42));
    expect(nextState.timeLeft).toBe(42);
  });

  it('should handle decrementTime', () => {
    const prevState = { ...initialState, timeLeft: 10 };
    const nextState = reducer(prevState, decrementTime());
    expect(nextState.timeLeft).toBe(9);
  });

  it('should handle setGameStarted', () => {
    const nextState = reducer(initialState, setGameStarted(true));
    expect(nextState.gameStarted).toBe(true);
  });
});