interface GameStatusProps {
  winner: 'X' | 'O' | null;
  xIsNext: boolean;
  isCPUMode: boolean;
  playerMana: number;
  cpuMana: number;
  squares: ('X' | 'O' | null)[];
  selectedMagic: any | null;
}

export function GameStatus({
  winner,
  xIsNext,
  isCPUMode,
  playerMana,
  cpuMana,
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

  const manaStatus = `Mana - X: ${playerMana} | O: ${cpuMana}`;

  return (
    <>
      <div className='text-xl font-semibold text-gray-700 mb-6'>{status}</div>
      <div className='text-lg text-blue-600 mb-4'>{manaStatus}</div>
    </>
  );
}
