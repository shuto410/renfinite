'use client';
import { useBattleState } from '@/hooks/useBattleState';
import Board from '../../components/board';
import { MagicButtons } from '@/components/MagicButtons';
import { GameStatus } from '@/components/GameStatus';
import { useEffect, useState } from 'react';
import MoveHistory from '@/components/MoveHistory';
import { DeckButton } from '@/components/DeckButton';
import { SettingButton } from '@/components/SettingButton';

export default function Battle() {
  const game = useBattleState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='flex flex-col items-center p-5 font-sans min-h-screen'>
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
        playerDeckCount={game.playerDeckCount}
        cpuDeckCount={game.cpuDeckCount}
        playerDiscardCount={game.playerDiscardCount}
        cpuDiscardCount={game.cpuDiscardCount}
        playerHitPoints={game.playerHitPoints}
        cpuHitPoints={game.cpuHitPoints}
      />

      <div className='m-4'>
        <button
          className='px-4 py-2 rounded-md transition-colors duration-200 bg-red-400 text-white'
          onClick={game.endTurn}
        >
          End Turn
        </button>
      </div>

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

      <div className='flex flex-row '>
        <Board
          size={game.size}
          squares={game.squares}
          blockedSquares={game.blockedSquares}
          squaresMetaInfo={game.squaresMetaInfo}
          onSquareClick={game.handleClick}
          lastPlacedPosition={game.lastPlacedPosition}
        />
        <div className='pl-8 lg:w-80'>
          <MoveHistory boardSize={game.size} maxDisplayed={15} />
        </div>
      </div>
      <button
        className='mt-6 px-6 py-3 text-lg bg-green-500 text-white rounded-md
                   hover:bg-green-600 transition-colors duration-200'
        onClick={game.resetBattle}
      >
        Reset Game
      </button>
      <DeckButton />
      <SettingButton />
    </div>
  );
}
