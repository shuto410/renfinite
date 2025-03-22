interface SquareProps {
  value: 'X' | 'O' | null;
  blockedBy?: 'X' | 'O' | null; // どちらのプレイヤーがブロックしたか
  currentPlayer: 'X' | 'O'; // 現在の手番
  isLastPlaced: boolean;
  onSquareClick: () => void;
}

export default function Square({
  value,
  blockedBy,
  currentPlayer,
  isLastPlaced,
  onSquareClick,
}: SquareProps) {
  // 自分がブロックしたマスは置ける
  const isBlocked = blockedBy !== null && blockedBy !== currentPlayer;
  const isBlockedSquare = blockedBy !== null;

  return (
    <button
      className={`w-16 h-16 border bg-white text-xl font-bold 
                 hover:bg-gray-100 transition-colors duration-200 relative
                 ${isBlockedSquare ? 'bg-red-50' : ''}
                 ${value === 'X' ? 'text-blue-600' : ''}
                 ${value === 'O' ? 'text-red-600' : ''}`}
      onClick={onSquareClick}
      disabled={isBlocked}
    >
      {value}
      {isLastPlaced && (
        <div className='absolute inset-0.5 rounded-sm animate-pulse ring-2 ring-orange-400 pointer-events-none'></div>
      )}
      {isBlockedSquare && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div
            className={`absolute inset-0 ${
              blockedBy === 'X' ? 'bg-blue-500' : 'bg-red-500'
            } opacity-10`}
          ></div>
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
    </button>
  );
}
