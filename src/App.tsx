import './App.css';
import GameBoard from './components/gameboard/GameBoard';
import Navbar from './components/navbar/Navbar';

import { useEffect } from 'react';
import { loadUserFromLocalStorage } from './store/slices/userSlice';
import { loadGameConfigFromLocalStorage } from './store/slices/gameSlice';
import { useAppDispatch, useAppSelector } from './store/hooks'; 

function App() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const config = useAppSelector(state => state.game.config);

    useEffect(() => {
      const savedData = localStorage.getItem('userState');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          dispatch(loadUserFromLocalStorage(parsed));
          localStorage.removeItem('userState');
        } catch (e) {
          console.error('Failed to parse saved userState:', e);
        }
      }

      const savedGameConfig = localStorage.getItem('gameConfig');
      if (savedGameConfig) {
        try {
          console.log(savedGameConfig);
          
          const parsed = JSON.parse(savedGameConfig);
          dispatch(loadGameConfigFromLocalStorage(parsed));
          localStorage.removeItem('gameConfig');
        } catch (e) {
          console.error('Failed to parse saved gameConfig:', e);
        }
      }
    }, [dispatch]);

    useEffect(() => {
      const handleBeforeUnload = () => {
        localStorage.setItem('userState', JSON.stringify(user));
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [user]);

      useEffect(() => {
        const handleBeforeUnload = () => {
          localStorage.setItem('gameConfig', JSON.stringify(config));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [config]);

  return (
    <div className='app no-select'>
      <Navbar />
      <GameBoard />
    </div>
  );
}

export default App;