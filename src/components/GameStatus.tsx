import { Magic } from '@/types/game';

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
  playerHitPoints?: number;
  cpuHitPoints?: number;
}

const ManaIcons: React.FC<{ count: number; color: string }> = ({
  count,
  color,
}) => {
  return (
    <div className='flex gap-0.5'>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${color} shadow-inner`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}80 100%)`,
          }}
        />
      ))}
    </div>
  );
};

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
  playerHitPoints = 100,
  cpuHitPoints = 100,
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
    <div className='w-full max-w-2xl mb-4'>
      {/* ゲーム状態 */}
      <div className='bg-gray-800 rounded-lg p-2 mb-2 shadow-lg'>
        <p className='text-sm text-gray-300'>{status}</p>
      </div>

      {/* プレイヤー情報 */}
      <div className='grid grid-cols-2 gap-2'>
        {/* プレイヤー */}
        <div className='bg-blue-900/50 rounded-lg p-2 shadow-lg border border-blue-500'>
          <h3 className='text-sm font-bold text-blue-300 mb-1'>プレイヤー</h3>
          <div className='space-y-1'>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-blue-200'>HP</span>
              <div className='w-20 bg-gray-700 rounded-full h-1'>
                <div
                  className='bg-red-500 h-1 rounded-full'
                  style={{ width: `${(playerHitPoints / 80) * 100}%` }}
                />
              </div>
              <span className='text-xs text-blue-200'>{playerHitPoints}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-blue-200'>マナ</span>
              <div className='flex items-center gap-1'>
                <ManaIcons count={playerMana} color='bg-blue-500' />
              </div>
              <span className='text-xs text-blue-200'>{playerMana}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-blue-200'>デッキ</span>
              <span className='text-xs text-blue-200'>{playerDeckCount}枚</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-blue-200'>捨て札</span>
              <span className='text-xs text-blue-200'>
                {playerDiscardCount}枚
              </span>
            </div>
          </div>
        </div>

        {/* CPU */}
        <div className='bg-red-900/50 rounded-lg p-2 shadow-lg border border-red-500'>
          <h3 className='text-sm font-bold text-red-300 mb-1'>CPU</h3>
          <div className='space-y-1'>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-red-200'>HP</span>
              <div className='w-20 bg-gray-700 rounded-full h-1'>
                <div
                  className='bg-red-500 h-1 rounded-full'
                  style={{ width: `${(cpuHitPoints / 80) * 100}%` }}
                />
              </div>
              <span className='text-xs text-red-200'>{cpuHitPoints}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-red-200'>マナ</span>
              <div className='flex items-center gap-1'>
                <ManaIcons count={cpuMana} color='bg-blue-500' />
              </div>
              <span className='text-xs text-red-200'>{cpuMana}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-red-200'>デッキ</span>
              <span className='text-xs text-red-200'>{cpuDeckCount}枚</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-red-200'>捨て札</span>
              <span className='text-xs text-red-200'>{cpuDiscardCount}枚</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
