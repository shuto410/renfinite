interface GameStatusProps {
  winner: 'X' | 'O' | null;
  xIsNext: boolean;
  isCPUMode: boolean;
  playerMana: number;
  cpuMana: number;
  squares: ('X' | 'O' | null)[];
  selectedMagic: Magic | null;
  playerRenCount?: number;
  cpuRenCount?: number;
  requiredRenToWin?: number;
  playerDeckCount?: number;
  cpuDeckCount?: number;
  playerDiscardCount?: number;
  cpuDiscardCount?: number;
}

import { Magic } from '@/types/game';

export function GameStatus({
  winner,
  xIsNext,
  isCPUMode,
  playerMana,
  cpuMana,
  squares,
  selectedMagic,
  playerRenCount = 0,
  cpuRenCount = 0,
  requiredRenToWin = 3,
  playerDeckCount = 0,
  cpuDeckCount = 0,
  playerDiscardCount = 0,
  cpuDiscardCount = 0,
}: GameStatusProps) {
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every((square) => square !== null)) {
    status = 'Game is a draw!';
  } else if (!selectedMagic && xIsNext) {
    status = 'Please select a magic card first';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}${
      !xIsNext && isCPUMode ? ' (CPU thinking...)' : ''
    }`;
  }

  const manaStatus = `Mana - X: ${playerMana} | O: ${cpuMana}`;
  const renStatus = `Ren - X: ${playerRenCount}/${requiredRenToWin} | O: ${cpuRenCount}/${requiredRenToWin}`;
  const deckStatus = `Deck - X: ${playerDeckCount} | O: ${cpuDeckCount}`;
  const discardStatus = `Discard - X: ${playerDiscardCount} | O: ${cpuDiscardCount}`;

  return (
    <>
      <div className='text-xl font-semibold text-gray-700 mb-6'>{status}</div>
      <div className='text-lg text-blue-600 mb-4'>{manaStatus}</div>
      <div className='text-lg text-green-600 mb-4'>{renStatus}</div>
      <div className='text-lg text-purple-600 mb-4'>{deckStatus}</div>
      <div className='text-lg text-orange-600 mb-4'>{discardStatus}</div>
    </>
  );
}
