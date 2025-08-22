import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  score: number;
  time: number;
}

const initialState: UserState = {
  username: '',
  score: 0,
  time: 0
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setScore: (
      state,
      action: PayloadAction<{ score: number; time: number }>
    ) => {
      state.score = action.payload.score;
      state.time = action.payload.time;
    },
    loadUserFromLocalStorage: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
   },
});

export const { setUsername, setScore, loadUserFromLocalStorage } = userSlice.actions;
export default userSlice.reducer;