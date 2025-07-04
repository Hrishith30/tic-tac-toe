import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the game modes
export type GameMode = 'single' | 'multi';

// Define the player types
export type Player = 'X' | 'O';

// Define the game state
interface GameState {
  board: (Player | null)[];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameMode: GameMode;
  scores: {
    X: number;
    O: number;
    draws: number;
  };
}

// Define the context type
interface GameContextType {
  gameState: GameState;
  makeMove: (index: number) => void;
  startNewGame: () => void;
  resetAllScores: () => void;
  setGameMode: (mode: GameMode) => void;
}

// Create the context with default values
const GameContext = createContext<GameContextType | undefined>(undefined);

// Initial game state
const initialGameState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  gameMode: 'multi',
  scores: {
    X: 0,
    O: 0,
    draws: 0,
  },
};

// Check for a winner
const checkWinner = (board: (Player | null)[]): Player | 'draw' | null => {
  // Winning combinations
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Check for a winner
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }

  // Check for a draw
  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  // No winner yet
  return null;
};

// Improved AI move for single player mode
const getAIMove = (board: (Player | null)[]): number => {
  // 1. Check if AI can win in the next move
  const winningMove = findWinningMove(board, 'O');
  if (winningMove !== -1) {
    return winningMove;
  }

  // 2. Check if player can win in the next move and block it
  const blockingMove = findWinningMove(board, 'X');
  if (blockingMove !== -1) {
    return blockingMove;
  }

  // 3. Take the center if available
  if (board[4] === null) {
    return 4;
  }

  // 4. Take the corners if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(corner => board[corner] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // 5. Take the sides if available
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter(side => board[side] === null);
  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }

  // 6. Fallback: find any empty cell (should not reach here if the board checking is done properly)
  const emptyCells = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter(index => index !== -1);

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// Helper function to find a winning move for a player
const findWinningMove = (board: (Player | null)[], player: Player): number => {
  // Winning combinations
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Check each line for a potential winning move
  for (const [a, b, c] of lines) {
    // Check if we can win by placing in position a
    if (board[a] === null && board[b] === player && board[c] === player) {
      return a;
    }
    // Check if we can win by placing in position b
    if (board[a] === player && board[b] === null && board[c] === player) {
      return b;
    }
    // Check if we can win by placing in position c
    if (board[a] === player && board[b] === player && board[c] === null) {
      return c;
    }
  }

  // No winning move found
  return -1;
};

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Make a move
  const makeMove = (index: number) => {
    // If the game is over or the cell is already filled, do nothing
    if (gameState.winner || gameState.board[index] !== null) {
      return;
    }

    // Create a new board with the move
    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    // Check for a winner
    const winner = checkWinner(newBoard);

    // Update scores if there's a winner or draw
    const newScores = { ...gameState.scores };
    if (winner === 'X' || winner === 'O') {
      newScores[winner]++;
    } else if (winner === 'draw') {
      newScores.draws++;
    }

    // Update the game state with a small delay for the winner
    if (winner) {
      // First update the board
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
      }));
      
      // Then update the winner after a small delay
      setTimeout(() => {
        setGameState(prevState => ({
          ...prevState,
          currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X',
          winner,
          scores: newScores,
        }));
      }, 300);
    } else {
      // No winner, update immediately
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        scores: newScores,
      }));
    }

    // If it's single player mode and the player just moved (and there's no winner yet)
    if (gameState.gameMode === 'single' && gameState.currentPlayer === 'X' && !winner) {
      // Add a small delay for the AI move
      setTimeout(() => {
        // Using the latest board state
        const aiBoard = [...newBoard];
        const aiMoveIndex = getAIMove(aiBoard);
        
        if (aiMoveIndex !== undefined) {
          aiBoard[aiMoveIndex] = 'O';
          
          // Check for a winner after AI move
          const aiWinner = checkWinner(aiBoard);
          
          // Update scores if there's a winner or draw
          const aiScores = { ...newScores };
          if (aiWinner === 'X' || aiWinner === 'O') {
            aiScores[aiWinner]++;
          } else if (aiWinner === 'draw') {
            aiScores.draws++;
          }
          
          // Update the game state with a small delay for the winner
          if (aiWinner) {
            // First update the board
            setGameState(prevState => ({
              ...prevState,
              board: aiBoard,
            }));
            
            // Then update the winner after a small delay
            setTimeout(() => {
              setGameState(prevState => ({
                ...prevState,
                currentPlayer: 'X', // Player's turn again
                winner: aiWinner,
                scores: aiScores,
              }));
            }, 300);
          } else {
            // No winner, update immediately
            setGameState(prevState => ({
              ...prevState,
              board: aiBoard,
              currentPlayer: 'X', // Player's turn again
              winner: aiWinner,
              scores: aiScores,
            }));
          }
        }
      }, 500);
    }
  };

  // Start a new game
  const startNewGame = () => {
    // First clear the winner to remove the celebration display
    if (gameState.winner) {
      setGameState({
        ...gameState,
        winner: null,
      });
      
      // Then reset the board after a short delay
      setTimeout(() => {
        setGameState(prevState => ({
          ...prevState,
          board: Array(9).fill(null),
          currentPlayer: 'X',
        }));
      }, 100);
    } else {
      // No winner, just reset the board
      setGameState({
        ...gameState,
        board: Array(9).fill(null),
        currentPlayer: 'X',
        winner: null,
      });
    }
  };

  // Reset all scores
  const resetAllScores = () => {
    setGameState({
      ...gameState,
      scores: {
        X: 0,
        O: 0,
        draws: 0,
      },
    });
  };

  // Set game mode
  const setGameMode = (mode: GameMode) => {
    setGameState({
      ...initialGameState,
      gameMode: mode,
      scores: gameState.scores,
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        makeMove,
        startNewGame,
        resetAllScores,
        setGameMode,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 