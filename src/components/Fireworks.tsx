import React, { useEffect, useState, useRef } from 'react';

interface FireworksProps {
  isVisible: boolean;
}

interface Particle {
  key: string;
  left: string;
  top: string;
  size: string;
  color: string;
  duration: string;
  delay: string;
  opacity?: string;
  transform?: string;
  type?: string;
}

const Fireworks: React.FC<FireworksProps> = ({ isVisible }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to create a new burst of fireworks
  const createFireworksBurst = () => {
    if (!isVisible) return;
    
    const colors = [
      '#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#E040FB', '#69F0AE', '#FF9800', '#00BCD4',
      '#FF1744', '#F50057', '#D500F9', '#651FFF', '#3D5AFE', '#2979FF', '#00B0FF', '#1DE9B6',
      '#76FF03', '#FFEA00', '#FFC400', '#FF9100'
    ];
    const newParticles: Particle[] = [];
    const timestamp = Date.now();

    // Create multiple firework bursts
    for (let i = 0; i < 4; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 60 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 0.5;
      const burstType = Math.floor(Math.random() * 3); // 0: normal, 1: circular, 2: spiral

      // Create particles for each burst
      for (let j = 0; j < 40; j++) {
        let angle, distance, particleSize, duration;

        // Different burst patterns
        if (burstType === 1) {
          // Circular burst
          angle = (j / 40) * Math.PI * 2;
          distance = Math.random() * 20 + 60;
          particleSize = Math.random() * 5 + 3;
          duration = Math.random() * 1.5 + 2.5;
        } else if (burstType === 2) {
          // Spiral burst
          angle = (j / 40) * Math.PI * 8;
          distance = j * 1.5;
          particleSize = Math.random() * 4 + 2;
          duration = Math.random() * 2 + 2;
        } else {
          // Normal random burst
          angle = Math.random() * Math.PI * 2;
          distance = Math.random() * 70 + 30;
          particleSize = Math.random() * 6 + 3;
          duration = Math.random() * 2 + 2;
        }

        // Add some variation to colors
        const particleColor = j % 3 === 0 ? 
          colors[Math.floor(Math.random() * colors.length)] : color;

        newParticles.push({
          key: `${timestamp}-${i}-${j}`,
          left: `calc(${left}% + ${Math.cos(angle) * distance}px)`,
          top: `calc(${top}% + ${Math.sin(angle) * distance}px)`,
          size: `${particleSize}px`,
          color: particleColor,
          duration: `${duration}s`,
          delay: `${delay}s`,
          type: j % 5 === 0 ? 'star' : 'circle'
        });
      }

      // We've removed the central flash effect that was causing white circles
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Clean up old particles after they've faded out
    setTimeout(() => {
      setParticles(prev => 
        prev.filter(p => p.key.indexOf(timestamp.toString()) === -1)
      );
    }, 6000);
  };

  useEffect(() => {
    if (isVisible) {
      // Initial burst
      createFireworksBurst();
      
      // Set up interval for continuous fireworks
      intervalRef.current = setInterval(createFireworksBurst, 1800);
    } else {
      // Clear particles and interval when not visible
      setParticles([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <style jsx global>{`
        @keyframes firework {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--x, 0), var(--y, 0)) scale(0.1);
            opacity: 0;
          }
        }
        
        /* Flash animation removed */
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.7);
          }
        }
        
        .star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: twinkle 0.8s ease-in-out infinite;
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.key}
          className={`absolute ${particle.type === 'star' ? 'star' : 'rounded-full'}`}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity || 0,
            animation: `firework ${particle.duration} ease-out ${particle.delay} forwards`,
            transform: particle.transform,
            boxShadow: particle.type === 'star' ? `0 0 4px ${particle.color}` : 'none',
          }}
        />
      ))}
    </div>
  );
};

export default Fireworks; 