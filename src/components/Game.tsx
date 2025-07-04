import React from 'react';
import Board from '@/components/Board';
import GameInfo from '@/components/GameInfo';
import GameControls from '@/components/GameControls';
import WinnerDisplay from '@/components/WinnerDisplay';
import { useGame } from '@/context/GameContext';

const Game: React.FC = () => {
  const { gameState } = useGame();
  const { winner } = gameState;
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-16 pt-16">TIC TAC TOE</h1>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2 flex justify-center">
          <Board />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <GameInfo />
          <GameControls />
        </div>
      </div>
      
      {/* Show winner display only when there's a winner and it's not a draw */}
      {winner && winner !== 'draw' && <WinnerDisplay winner={winner} />}
    </div>
  );
};

export default Game; 