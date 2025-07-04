'use client';

import { GameProvider } from '@/context/GameContext';
import Game from '@/components/Game';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-start pt-28 p-6 md:p-8">
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  );
}
