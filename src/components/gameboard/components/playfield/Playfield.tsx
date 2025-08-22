import React, { useEffect, useRef, useState } from 'react';
import Card from '../card/Card';
import styles from './playfield.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { incrementMatch, incrementMistake, setStatus, decrementTime, setGameStarted } from '../../../../store/slices/gameSlice';
import { setScore } from '../../../../store/slices/userSlice';

interface GameCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface PlayfieldProps {
  cards: GameCard[];
  setCards: (cards: GameCard[]) => void;
}

const Playfield: React.FC<PlayfieldProps> = ({ cards, setCards }) => {
  const dispatch = useAppDispatch();
  const { matches, mistakes, config, status, timeLeft } = useAppSelector((state) => state.game);
  const { score, time } = useAppSelector((state) => state.user);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerRef.current!);
      dispatch(setStatus('lost'));
    }
  }, [timeLeft]);

  useEffect(() => {
    timerRef.current = setInterval(() => dispatch(decrementTime()), 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const handleCardClick = (index: number) => {
    if (status !== 'playing' || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    const newFlipped = [...flippedIndices, index];

    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      const isMatch = newCards[i1].value === newCards[i2].value;

      if (!isMatch) {
        dispatch(incrementMistake());
        setTimeout(() => setWrongPair([i1, i2]), 600);
        if(mistakes + 1 === config.maxMistakes) {
          clearInterval(timerRef.current!);
          setTimeout(() => {
            dispatch(setStatus('lost'));
          }, 900);
        }
      }

      setTimeout(() => {
        const updatedCards = [...newCards];

        if (isMatch) {
          updatedCards[i1].isMatched = true;
          updatedCards[i2].isMatched = true;
          dispatch(incrementMatch());

          if (matches + 1 === config.pairs) {       
            clearInterval(timerRef.current!);
            dispatch(setStatus('won'));
            if((score < matches && time < timeLeft) || score === 0) dispatch(setScore({ score: matches, time: timeLeft }))        
          }
        } else {
          updatedCards[i1].isFlipped = false;
          updatedCards[i2].isFlipped = false;
        }

        setCards(updatedCards);
        setFlippedIndices([]);
        setWrongPair([]);
      }, 800);
    }
  };

  const handleBackClick = () => {
    dispatch(setStatus('idle'));
    dispatch(setGameStarted(false));
  };

  return (
    <div data-testid="playfield-component">
      {status === 'won' && (
        <div className={styles.gameOver}>
          <div className="container">
            <h2>🎉 You Won!</h2>
            <button onClick={handleBackClick}>
              <i className="fa-solid fa-backward"></i>
              Back to main menu
            </button>
          </div>
        </div>
      )}
      {status === 'lost' && (
        <div className={styles.gameOver}>
          <div className="container">
            <h2>💀 Game Over!</h2>
            <button onClick={handleBackClick}>
              <i className="fa-solid fa-backward"></i>
              Back to main menu
            </button>
          </div>
        </div>
      )}
      {status === 'playing' && (
        <div className={styles.grid_container}>
          <div className={styles.grid}>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                value={card.value}
                isFlipped={card.isFlipped || card.isMatched}
                isWrong={wrongPair.includes(index)}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Playfield;