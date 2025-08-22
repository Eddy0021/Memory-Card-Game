import React, { useState, useRef } from 'react';
import styles from './menu.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setUsername } from '../../../../store/slices/userSlice';
import { setConfig, setTimeLeft, resetGame, setStatus, setGameStarted } from '../../../../store/slices/gameSlice';
import SettingsModal from './settings/SettingsModal';
import { generateShuffledCards } from '../../../../utils/cardGenerator';

interface MenuProps {
  onStart: (cards: any[]) => void;
}

const Menu: React.FC<MenuProps> = ({ onStart }) => {
  const dispatch = useAppDispatch();
  const { username, score, time } = useAppSelector((state) => state.user);
  const config = useAppSelector((state) => state.game.config);
  const [showSettings, setShowSettings] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartGame = () => {
    const newCards = generateShuffledCards(config.pairs);
    dispatch(resetGame());
    dispatch(setTimeLeft(config.time));
    dispatch(setStatus('playing'));
    dispatch(setGameStarted(true));
    onStart(newCards);
  };

  return (
    <div className={styles.startScreen}>

      <div className="container">

          <p className={styles.greeting}>Welcome, {
          editingName ? (
            <input
              ref={inputRef}
              type="text"
              value={username}
              maxLength={10} 
              onChange={(e) => dispatch(setUsername(e.target.value))}
              // onBlur={() => setEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingName(false);
              }}
              autoFocus
              className={styles.nameInput}
            />
          ) : (
            <span className={` ${styles.username} ${styles.pulsingLabel}`} onClick={() => setEditingName(true)}>
              {username || 'guest'}
            </span>
          )
        }!</p>

        <div className={styles.buttons}>
          <i role='settings' onClick={() => setShowSettings(true)} className={`fa-solid fa-gear ${styles.startButton}`}></i>
          <i role='startGame' onClick={handleStartGame} className={`fa-solid fa-play ${styles.startButton}`}></i>
        </div>

        {score !== 0 && (
          <>
            <h1>Your personal best:</h1>
            <div className={styles.scoreBoard}>
              <span className={styles.row}><b>Score:</b> <p>{score}</p></span>
              <span className={styles.row}><b>Time:</b> <p>{time}</p></span>
            </div>
          </>
        )}

        {showSettings && (
          <SettingsModal
            currentSettings={config}
            onApply={(pairs, time, maxMistakes) =>
              dispatch(setConfig({ pairs, time, maxMistakes }))
            }
            onClose={() => setShowSettings(false)}
          />
        )}
        
      </div>

    </div>
  );
};

export default Menu;