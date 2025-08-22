import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../../store/slices/gameSlice';
import userReducer from '../../store/slices/userSlice';
import gameInitialState from '../../store/slices/gameSlice';
import userInitialState from '../../store/slices/userSlice';

import GameBoard from './GameBoard';

const renderWithStore = (preloadedState: any) => {

    const mockStore = configureStore({
        reducer: {
            game: gameReducer,
            user: userReducer,
        },
        preloadedState: {
            game: { ...gameInitialState, ...(preloadedState.game || {}) },
            user: { ...userInitialState, ...(preloadedState.user || {}) },
        },
    });

    return render(
        <Provider store={mockStore}>
            <GameBoard />
        </Provider>
    );
};

describe('GameBoard', () => {
    it('renders Menu when gameStarted is false', () => {
        renderWithStore({
        game: { gameStarted: false },
        user: { username: 'testuser', score: 0, time: 0 },
        });

        expect(screen.getByRole('startGame')).toBeInTheDocument();
    });

    it('renders Playfield when gameStarted is true', () => {
        renderWithStore({
        game: { gameStarted: true },
        user: { username: 'testuser', score: 0, time: 0 },
        });

        expect(screen.getByTestId('playfield-component')).toBeInTheDocument();
    });
});