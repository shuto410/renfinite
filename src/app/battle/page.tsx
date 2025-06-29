'use client';
import { useBattleState } from '@/hooks/useBattleState';
import Board from '../../components/board';
import { HandCards } from '@/components/HandCards';
import { GameStatusMessage } from '@/components/GameStatusMessage';
import { useEffect, useState } from 'react';
import { DeckButton } from '@/components/DeckButton';
import { SettingButton } from '@/components/SettingButton';
import { PlayerInfo } from '@/components/PlayerInfo';

export default function Battle() {
  const game = useBattleState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='flex flex-col items-center p-5 font-sans min-h-screen'>
      <GameStatusMessage
        winner={game.winner}
        xIsNext={game.xIsNext}
        isCPUMode={game.isCPUMode}
        squares={game.squares}
        selectedMagic={game.selectedMagic}
      />
      <div className='flex flex-row gap-4'>
        <PlayerInfo
          name='You'
          imageSrc='/images/player.jpg'
          hp={game.playerHitPoints}
          mana={game.playerMana}
          maxMana={6}
          isActive={game.xIsNext}
        />
        <Board
          size={game.size}
          squares={game.squares}
          blockedSquares={game.blockedSquares}
          squaresMetaInfo={game.squaresMetaInfo}
          onSquareClick={game.handleClick}
          lastPlacedPosition={game.lastPlacedPosition}
        />
        <PlayerInfo
          name='Enemy'
          imageSrc='/images/enemy.jpg'
          hp={game.cpuHitPoints}
          mana={game.cpuMana}
          maxMana={6}
          isActive={!game.xIsNext}
        />
      </div>

      <div className='flex flex-row gap-2 mt-2'>
        {mounted && (
          <HandCards
            hand={game.playerHand}
            selectedMagic={game.selectedMagic}
            xIsNext={game.xIsNext}
            playerMana={game.playerMana}
            cpuMana={game.cpuMana}
            onSelectMagic={game.setSelectedMagic}
          />
        )}
        {/* <button
          className='p-1 text-lg bg-green-500 text-white rounded-md
                   hover:bg-green-600 transition-colors duration-200'
          onClick={game.resetBattle}
        >
          Reset Game
        </button> */}
        <div className='m-10'>
          <button
            className='p-1 rounded-md bg-cyan-800 hover:bg-cyan-900 active:bg-cyan-600 text-white'
            onClick={game.endTurn}
          >
            <span className='flex items-center gap-1'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 5l7 7-7 7M5 5l7 7-7 7'
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <DeckButton />
      <SettingButton />
    </div>
  );
}
