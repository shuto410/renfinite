import { Card } from '@/types';

interface GameStatusProps {
  winner: 'X' | 'O' | null;
  xIsNext: boolean;
  isCPUMode: boolean;
  squares: ('X' | 'O' | null)[];
  selectedMagic: Card | null;
}

export function GameStatusMessage({
  winner,
  xIsNext,
  isCPUMode,
  squares,
  selectedMagic,
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

  return (
    <div className='max-w-2xl'>
      {/* ゲーム状態 */}
      <div className='bg-gray-800 rounded-lg p-2 mb-2 shadow-lg'>
        <p className='text-sm text-gray-300'>{status}</p>
      </div>
    </div>
  );
}
