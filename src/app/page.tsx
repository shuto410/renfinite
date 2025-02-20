'use client';
import { useGameState } from '@/hooks/useGameState';
import Board from './board';
import SettingButtons from './setting-buttons';
import { EffectButtons } from '@/components/EffectButtons';
import { GameStatus } from '@/components/GameStatus';

export default function Home() {
  const game = useGameState();

  return (
    <div className="flex flex-col items-center p-5 font-sans min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tic Tac Toe</h1>
      
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
      />

      <EffectButtons
        isBlockEffectActive={game.isBlockEffectActive}
        isReplaceStoneActive={game.isReplaceStoneActive}
        xIsNext={game.xIsNext}
        playerMana={game.playerMana}
        cpuMana={game.cpuMana}
        onBlockEffect={game.activateBlockEffect}
        onReplaceStone={game.activateReplaceSt}
      />

      <Board 
        size={game.size}
        squares={game.squares}
        blockedSquares={game.blockedSquares}
        currentPlayer={game.xIsNext ? 'X' : 'O'}
        onSquareClick={game.handleClick}
      />

      <button 
        className="mt-6 px-6 py-3 text-lg bg-green-500 text-white rounded-md
                   hover:bg-green-600 transition-colors duration-200"
        onClick={game.resetGame}
      >
        Reset Game
      </button>
    </div>
  );
}

