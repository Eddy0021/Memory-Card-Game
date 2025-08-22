import reducer, {
  setUsername,
  setScore,
  loadUserFromLocalStorage,
} from './userSlice';

describe('userSlice reducer', () => {
  const initialState = {
    username: '',
    score: 0,
    time: 0,
  };

  it('should return the initial state when passed an empty action', () => {
    const nextState = reducer(undefined, { type: '' });
    expect(nextState).toEqual(initialState);
  });

  it('should handle setUsername', () => {
    const username = 'testUser';
    const nextState = reducer(initialState, setUsername(username));
    expect(nextState.username).toBe(username);
    expect(nextState.score).toBe(0);
    expect(nextState.time).toBe(0);
  });

  it('should handle setScore', () => {
    const scorePayload = { score: 100, time: 30 };
    const nextState = reducer(initialState, setScore(scorePayload));
    expect(nextState.score).toBe(scorePayload.score);
    expect(nextState.time).toBe(scorePayload.time);
    expect(nextState.username).toBe('');
  });

  it('should handle loadUserFromLocalStorage', () => {
    const storedUser = { username: 'localUser', score: 200, time: 50 };
    const nextState = reducer(initialState, loadUserFromLocalStorage(storedUser));
    expect(nextState).toEqual(storedUser);
  });

  it('should merge loadUserFromLocalStorage payload with existing state', () => {
    const currentState = { username: 'current', score: 10, time: 5 };
    const payload = { username: 'newUser', score: 20, time: 10 };
    const nextState = reducer(currentState, loadUserFromLocalStorage(payload));
    expect(nextState).toEqual(payload);
  });
});