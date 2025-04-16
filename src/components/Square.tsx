interface SquareProps {
  value: 'X' | 'O' | null;
  blockedBy?: 'X' | 'O' | null; // どちらのプレイヤーがブロックしたか
  isLastPlaced: boolean;
  attackPower: number | null;
  onSquareClick: () => void;
}

export default function Square({
  value,
  blockedBy,
  isLastPlaced,
  attackPower,
  onSquareClick,
}: SquareProps) {
  // 自分がブロックしたマスは置ける
  const isBlockedSquare = blockedBy !== null;

  return (
    <button
      className={`w-16 h-16 border bg-slate-900 text-xl font-bold border-slate-700 
                 hover:bg-gray-700 transition-colors duration-200 relative
                 ${isBlockedSquare ? 'bg-red-50' : ''}
                 ${value === 'X' ? 'text-blue-600' : ''}
                 ${value === 'O' ? 'text-red-600' : ''}`}
      onClick={onSquareClick}
      // disabled={isBlocked}
    >
      {isBlockedSquare && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div
            className={`absolute inset-0 ${
              blockedBy === 'X' ? 'bg-blue-500' : 'bg-red-500'
            } opacity-10`}
          ></div>

          {/* ブロックのパターンを表示 */}
          <div className='absolute inset-0 pointer-events-none'>
            <div
              className='w-full h-full'
              style={{
                backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 5px,
                ${
                  blockedBy === 'X'
                    ? 'rgba(0,165,255,0.1)'
                    : 'rgba(255,0,0,0.1)'
                } 5px,
                ${
                  blockedBy === 'X'
                    ? 'rgba(0,165,255,0.1)'
                    : 'rgba(255,0,0,0.1)'
                } 10px
              )`,
              }}
            ></div>
          </div>
        </div>
      )}
      {
        <div
          className={`absolute inset-2 rounded-full
                          ${value === 'X' ? 'bg-blue-400' : ''}
                          ${value === 'O' ? 'bg-red-400' : ''}
          `}
        >
          <div className='absolute inset-2 text-white'>
            {value && attackPower && attackPower > 0 && attackPower}
          </div>
        </div>
      }
      {isLastPlaced && (
        <div className='absolute inset-0.5 rounded-sm animate-pulse ring-2 ring-orange-400 pointer-events-none'></div>
      )}
      {blockedBy && (
        <div className='absolute top-0 left-0 right-0 flex justify-center'>
          <span
            className={`text-xs px-1 rounded-b-sm
              ${
                blockedBy === 'X'
                  ? 'bg-blue-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
          >
            Blocked
          </span>
        </div>
      )}
    </button>
  );
}
