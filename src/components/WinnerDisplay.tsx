import React, { useEffect, useState, ReactNode } from 'react';
import { Player } from '@/context/GameContext';
import Fireworks from './Fireworks';

interface WinnerDisplayProps {
  winner: Player | null;
}

// Removed unused interface

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState<ReactNode[]>([]);
  
  // Generate confetti pieces
  useEffect(() => {
    if (visible) {
      const confettiPieces: ReactNode[] = [];
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
      
      for (let i = 0; i < 100; i++) {
        const left = Math.random() * 100;
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;
        
        confettiPieces.push(
          <div 
            key={`confetti-${i}`}
            className="absolute"
            style={{
              left: `${left}%`,
              top: '-20px',
              width: `${size}px`,
              height: `${size * 0.6}px`,
              backgroundColor: color,
              transform: `rotate(${rotation}deg)`,
              opacity: 0.8,
              animation: `confetti ${duration}s ease-in ${delay}s forwards`
            }}
          />
        );
      }
      
      setConfetti(confettiPieces);
    }
  }, [visible]);
  
  useEffect(() => {
    if (winner) {
      // Show the overlay with a slight delay
      const visibleTimer = setTimeout(() => {
        setVisible(true);
      }, 200);
      
      // Start the fireworks after the overlay appears
      const animationTimer = setTimeout(() => {
        setShowAnimation(true);
      }, 500);
      
      return () => {
        clearTimeout(visibleTimer);
        clearTimeout(animationTimer);
      };
    } else {
      setVisible(false);
      setShowAnimation(false);
    }
  }, [winner]);
  
  const handleClose = () => {
    setShowAnimation(false);
    setVisible(false);
  };
  
  if (!winner || !visible) return null;
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-40 bg-black/70 overflow-hidden"
      style={{ animation: 'fadeIn 0.8s ease-out' }}
    >
      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes trophy {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6);
          }
        }
      `}</style>
      
      {confetti}
      <Fireworks isVisible={showAnimation} />
      
      <div className="relative flex flex-col items-center">
        {/* Trophy icon */}
        <div className="text-yellow-400 text-5xl mb-4" style={{ animation: 'trophy 3s ease-in-out infinite' }}>
          🏆
        </div>
        
        {/* Winner symbol */}
        <div className="text-9xl font-bold winner-symbol">
          {winner === 'X' ? (
            <span className="text-blue-500">X</span>
          ) : (
            <span className="text-red-500">O</span>
          )}
        </div>
        
        {/* Winner text */}
        <div 
          className="text-4xl font-bold text-white mt-8"
          style={{ animation: 'glow 2s ease-in-out infinite' }}
        >
          WINNER!
        </div>
        
        {/* Continue button */}
        <div className="mt-12">
          <button 
            onClick={handleClose}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerDisplay; 