import React, { useState, useEffect } from 'react';
import { Player } from '@/context/GameContext';

interface CellProps {
  value: Player | null;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  const [animate, setAnimate] = useState(false);
  
  // Trigger animation when value changes
  useEffect(() => {
    if (value) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <button
      className={`w-full aspect-square flex items-center justify-center text-5xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-md transition-all ${
        value ? 'cursor-default' : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md'
      }`}
      onClick={onClick}
      disabled={value !== null}
      aria-label={value ? `Cell marked with ${value}` : 'Empty cell'}
    >
      {value === 'X' && (
        <span className={`text-blue-500 ${animate ? 'cell-animation' : ''}`}>X</span>
      )}
      {value === 'O' && (
        <span className={`text-red-500 ${animate ? 'cell-animation' : ''}`}>O</span>
      )}
    </button>
  );
};

export default Cell; 