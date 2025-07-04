import React from 'react';
import { useGame } from '@/context/GameContext';

const GameInfo: React.FC = () => {
  const { gameState } = useGame();
  const { currentPlayer, winner, scores, gameMode } = gameState;

  return (
    <div className="w-full">
      {/* Game status */}
      <div className="text-center text-xl font-bold mb-4">
        {winner ? (
          winner === 'draw' ? (
            <span>It's a draw!</span>
          ) : (
            <span>Player {winner} wins!</span>
          )
        ) : (
          <span>
            {gameMode === 'single' && currentPlayer === 'O' ? (
              "AI's turn"
            ) : (
              `Player ${currentPlayer}'s turn`
            )}
          </span>
        )}
      </div>

      {/* Scoreboard */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-center font-bold mb-4">Scoreboard</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-blue-500 font-bold">X</span>
            <span className="text-3xl">{scores.X}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Draws</span>
            <span className="text-3xl">{scores.draws}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-red-500 font-bold">O</span>
            <span className="text-3xl">{scores.O}</span>
          </div>
        </div>
      </div>

      {/* Game mode indicator */}
      <div className="text-center text-sm mt-4">
        Mode: {gameMode === 'single' ? 'Single Player (vs AI)' : 'Multiplayer'}
      </div>
    </div>
  );
};

export default GameInfo; 