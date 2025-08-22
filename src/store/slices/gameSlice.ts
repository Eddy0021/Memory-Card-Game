import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface GameConfig {
  pairs: number;
  time: number;
  maxMistakes: number | null;
}

interface GameState {
  config: GameConfig;
  matches: number;
  mistakes: number;
  status: 'idle' | 'playing' | 'won' | 'lost';
  timeLeft: number;
  gameStarted: boolean;
}

const initialState: GameState = {
  config: { pairs: 6, time: 60, maxMistakes: null },
  matches: 0,
  mistakes: 0,
  status: 'idle',
  timeLeft: 60,
  gameStarted: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<GameConfig>) => {
      state.config = action.payload; 
    },
    incrementMatch: (state) => {
      state.matches += 1;
    },
    incrementMistake: (state) => {
      state.mistakes += 1;
    },
    setStatus: (state, action: PayloadAction<GameState['status']>) => {
      state.status = action.payload;
    },
    resetGame: (state) => {
      state.matches = 0;
      state.mistakes = 0;
      state.status = 'idle';
      state.gameStarted = false;
    },
    setTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
    },
    decrementTime: (state) => {
      state.timeLeft -= 1;
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload;
    },
    loadGameConfigFromLocalStorage(state, action: PayloadAction<Partial<GameConfig>>) {
      state.config = { ...state.config, ...action.payload };
    },
  },
});

export const {
  setConfig,
  incrementMatch,
  incrementMistake,
  setStatus,
  resetGame,
  setTimeLeft,
  decrementTime,
  setGameStarted,
  loadGameConfigFromLocalStorage
} = gameSlice.actions;

export default gameSlice.reducer;