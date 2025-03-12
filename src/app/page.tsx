'use client';
import { useGameState } from '@/hooks/useGameState';
import Board from './board';
import SettingButtons from './setting-buttons';
import { MagicButtons } from '@/components/MagicButtons';
import { GameStatus } from '@/components/GameStatus';
import { DebugOverlay } from '@/components/DebugOverlay';
import { useEffect, useState } from 'react';
import { evaluateCell } from '@/hooks/useCPUOpponent';

export default function Home() {
  const game = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='flex flex-col items-center p-5 font-sans min-h-screen'>
      <SettingButtons
        size={game.size}
        winLength={game.winLength}
        isCPUMode={game.isCPUMode}
        cpuLevel={game.cpuLevel}
        onSizeChange={game.handleSizeChange}
        onWinLengthChange={game.handleWinLengthChange}
        onCPUModeToggle={game.toggleCPUMode}
        onCPULevelChange={game.handleCPULevelChange}
      />

      <GameStatus
        winner={game.winner}
        xIsNext={game.xIsNext}
        isCPUMode={game.isCPUMode}
        playerMana={game.playerMana}
        cpuMana={game.cpuMana}
        squares={game.squares}
        selectedMagic={game.selectedMagic}
        playerRenCount={game.playerRenCount}
        cpuRenCount={game.cpuRenCount}
        requiredRenToWin={game.requiredRenToWin}
      />

      {mounted && (
        <MagicButtons
          hand={game.playerHand}
          selectedMagic={game.selectedMagic}
          xIsNext={game.xIsNext}
          playerMana={game.playerMana}
          cpuMana={game.cpuMana}
          onSelectMagic={game.setSelectedMagic}
        />
      )}

      <Board
        size={game.size}
        squares={game.squares}
        blockedSquares={game.blockedSquares}
        currentPlayer={game.xIsNext ? 'X' : 'O'}
        onSquareClick={game.handleClick}
        lastPlacedPosition={game.lastPlacedPosition}
      />

      <button
        className='mt-6 px-6 py-3 text-lg bg-green-500 text-white rounded-md
                   hover:bg-green-600 transition-colors duration-200'
        onClick={game.resetGame}
      >
        Reset Game
      </button>

      {game.isCPUMode && (
        <DebugOverlay
          size={game.size}
          squares={game.squares}
          blockedSquares={game.blockedSquares}
          evaluateCell={(squares, blockedSquares, position) =>
            evaluateCell(
              squares,
              blockedSquares,
              position,
              game.size,
              game.winLength,
            )
          }
        />
      )}
    </div>
  );
}
