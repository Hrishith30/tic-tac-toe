import React from 'react';
import Cell from '@/components/Cell';
import { useGame } from '@/context/GameContext';

const Board: React.FC = () => {
  const { gameState, makeMove } = useGame();
  const { board } = gameState;

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[350px]">
      {board.map((value, index) => (
        <Cell 
          key={index} 
          value={value} 
          onClick={() => makeMove(index)} 
        />
      ))}
    </div>
  );
};

export default Board; 