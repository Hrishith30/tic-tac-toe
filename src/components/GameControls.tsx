import React from 'react';
import { useGame, GameMode } from '@/context/GameContext';

const GameControls: React.FC = () => {
  const { gameState, startNewGame, resetAllScores, setGameMode } = useGame();

  const handleModeChange = (mode: GameMode) => {
    if (mode !== gameState.gameMode) {
      setGameMode(mode);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Game mode selection */}
      <div className="flex gap-4">
        <button
          className={`flex-1 py-3 px-4 rounded-md transition-colors ${
            gameState.gameMode === 'single'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          onClick={() => handleModeChange('single')}
        >
          Single Player
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-md transition-colors ${
            gameState.gameMode === 'multi'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
          onClick={() => handleModeChange('multi')}
        >
          Multiplayer
        </button>
      </div>

      {/* Game controls */}
      <div className="flex gap-4">
        <button
          className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors font-medium"
          onClick={startNewGame}
        >
          New Game
        </button>
        <button
          className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors font-medium"
          onClick={resetAllScores}
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default GameControls; 