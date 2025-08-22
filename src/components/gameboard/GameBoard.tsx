import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import Menu from './components/menu/Menu';
import Playfield from './components/playfield/Playfield';

interface GameCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const GameBoard: React.FC = () => {
  const gameStarted = useAppSelector((state) => state.game.gameStarted);
  const [cards, setCards] = useState<GameCard[]>([]);

  return gameStarted ? (
    <Playfield cards={cards} setCards={setCards} />
  ) : (
    <Menu onStart={setCards} />
  );
};

export default GameBoard;