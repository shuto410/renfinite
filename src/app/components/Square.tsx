interface SquareProps {
  value: 'X' | 'O' | null;
  blockedBy?: 'X' | 'O' | null;  // どちらのプレイヤーがブロックしたか
  currentPlayer: 'X' | 'O';  // 現在の手番
  onSquareClick: () => void;
}

export default function Square({ value, blockedBy, currentPlayer, onSquareClick }: SquareProps) {
  // 自分がブロックしたマスは置ける
  const isBlocked = blockedBy !== null && blockedBy !== currentPlayer;
  const isBlockedSquare = blockedBy !== null;

  return (
    <button 
      className={`w-16 h-16 border border-gray-400 bg-white text-xl font-bold 
                 hover:bg-gray-100 transition-colors duration-200 relative
                 ${isBlockedSquare ? 'bg-red-50' : ''}`}
      onClick={onSquareClick}
      disabled={isBlocked}
    >
      {value}
      {isBlockedSquare && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`absolute inset-0 ${isBlocked ? 'bg-red-500' : 'bg-orange-500'} opacity-10`}></div>
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            <span className={`text-xs px-1 rounded-b-sm
              ${isBlocked ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
              {isBlocked ? `Blocked` : `Block`}
            </span>
          </div>
          {/* ブロックのパターンを表示 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 5px,
                ${isBlocked ? 'rgba(255,0,0,0.1)' : 'rgba(255,165,0,0.1)'} 5px,
                ${isBlocked ? 'rgba(255,0,0,0.1)' : 'rgba(255,165,0,0.1)'} 10px
              )`
            }}></div>
          </div>
        </div>
      )}
    </button>
  );
} 