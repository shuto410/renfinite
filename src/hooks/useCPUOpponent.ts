import { useEffect } from 'react';
import { calculateWinner } from '@/utils';

interface UseCPUOpponentProps {
  squares: ('X' | 'O' | null)[];
  blockedSquares: ('X' | 'O' | null)[];
  size: number;
  winLength: number;
  isCPUMode: boolean;
  cpuLevel: number;
  isPlayerTurn: boolean;
  winner: 'X' | 'O' | null;
  cpuMana: number;
  onMove: (position: number, spType: 'block' | 'replace' | null) => void;
}

function findLongestChain(
  squares: ('X' | 'O' | null)[],
  player: 'X' | 'O',
  size: number
): { length: number; positions: number[] } {
  let maxLength = 0;
  let positions: number[] = [];

  // 横、縦、斜めの方向をチェック
  const directions = [
    [1, 0],    // 横
    [0, 1],    // 縦
    [1, 1],    // 右下斜め
    [1, -1],   // 右上斜め
  ];

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] !== player) continue;
    
    const row = Math.floor(i / size);
    const col = i % size;

    for (const [dx, dy] of directions) {
      let length = 1;
      let chainPositions = [i];
      
      // 連続する石を数える
      let r = row + dy;
      let c = col + dx;
      let pos = r * size + c;
      
      while (
        r >= 0 && r < size && 
        c >= 0 && c < size && 
        squares[pos] === player
      ) {
        length++;
        chainPositions.push(pos);
        r += dy;
        c += dx;
        pos = r * size + c;
      }

      if (length > maxLength) {
        maxLength = length;
        positions = chainPositions;
      }
    }
  }

  return { length: maxLength, positions };
}

function findBestMove(
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  size: number,
  winLength: number
): number | null {
  // Try to win
  const winningMove = findWinningMove(squares, blockedSquares, 'O', 'O', size, winLength);
  if (winningMove !== null) return winningMove;

  // Try to block opponent
  const blockingMove = findWinningMove(squares, blockedSquares, 'X', 'O', size, winLength);
  if (blockingMove !== null) return blockingMove;

  // 最も長い連鎖を見つける
  const ownChain = findLongestChain(squares, 'O', size);
  const opponentChain = findLongestChain(squares, 'X', size);

  // 連鎖の周りの有効な位置を探す
  const findValidAdjacentPositions = (positions: number[], player: 'X' | 'O') => {
    const adjacent: { position: number; score: number }[] = [];
    
    // 連鎖の方向を特定
    const lastPos = positions[positions.length - 1];
    const firstPos = positions[0];
    const dx = Math.sign((lastPos % size) - (firstPos % size));
    const dy = Math.sign(Math.floor(lastPos / size) - Math.floor(firstPos / size));
    
    for (const pos of positions) {
      const row = Math.floor(pos / size);
      const col = pos % size;
      
      // 周囲8マスをチェック
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          
          const r = row + dr;
          const c = col + dc;
          const newPos = r * size + c;
          
          if (
            r >= 0 && r < size &&
            c >= 0 && c < size &&
            !squares[newPos] &&
            (!blockedSquares[newPos] || blockedSquares[newPos] === 'O') &&
            !adjacent.some(a => a.position === newPos)
          ) {
            let score = 1;
            
            // 連鎖の方向と同じ方向なら高スコア
            if (dr === dy && dc === dx) {
              score += 3;
            }
            
            // 周囲の石をチェック
            for (let checkDr = -1; checkDr <= 1; checkDr++) {
              for (let checkDc = -1; checkDc <= 1; checkDc++) {
                if (checkDr === 0 && checkDc === 0) continue;
                
                const checkR = r + checkDr;
                const checkC = c + checkDc;
                const checkPos = checkR * size + checkC;
                
                if (
                  checkR >= 0 && checkR < size &&
                  checkC >= 0 && checkC < size &&
                  squares[checkPos] === player
                ) {
                  score += 1;
                }
              }
            }
            
            adjacent.push({ position: newPos, score });
          }
        }
      }
    }
    
    return adjacent;
  };

  // 自分の連鎖か相手の連鎖、より長い方を優先
  const targetChain: { chain: typeof ownChain, player: 'X' | 'O' } = ownChain.length >= opponentChain.length 
    ? { chain: ownChain, player: 'O' }
    : { chain: opponentChain, player: 'X' };
    
  const adjacentPositions = findValidAdjacentPositions(targetChain.chain.positions, targetChain.player);
  
  if (adjacentPositions.length > 0) {
    // スコアでソート
    adjacentPositions.sort((a, b) => b.score - a.score);
    // 最高スコアの手の中からランダムに選択
    const maxScore = adjacentPositions[0].score;
    const bestMoves = adjacentPositions.filter(move => move.score === maxScore);
    return bestMoves[Math.floor(Math.random() * bestMoves.length)].position;
  }

  return null;
}

function findWinningMove(
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  winningPlayer: 'X' | 'O',
  currentPlayer: 'X' | 'O',
  size: number,
  winLength: number
): number | null {
  // Check each empty position
  for (let i = 0; i < squares.length; i++) {
    // ブロックされているマスはスキップ
    console.log('blockedSquares:', blockedSquares);
    if (squares[i]) continue;
    if (currentPlayer === winningPlayer && (blockedSquares[i] && blockedSquares[i] !== winningPlayer)) continue;
    if (currentPlayer !== winningPlayer && (blockedSquares[i] && blockedSquares[i] == winningPlayer)) continue;
    
    // Try this move
    const testSquares = squares.slice();
    testSquares[i] = winningPlayer;
    
    // Check if this move would win
    const winner = calculateWinner(testSquares, size, winLength);
    console.log(`Checking winning move for player ${winningPlayer} at position ${i}:`, winner === winningPlayer);
    if (winner === winningPlayer) {
      return i;
    }
  }
  return null;
}

function getRandomMove(
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  player: 'X' | 'O'
): number | null {
  const emptySquares = squares.reduce<number[]>((empty, square, index) => {
    // ブロックされていないマスのみを追加
    if (!square && (!blockedSquares[index] || blockedSquares[index] === player)) {
      empty.push(index);
    }
    return empty;
  }, []);

  if (emptySquares.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
}

function getRandomReplaceMove(
    squares: ('X' | 'O' | null)[],
    blockedSquares: ('X' | 'O' | null)[],
    opponent: 'X' | 'O'
  ): number | null {
    const candidatePositions = squares.reduce<number[]>((acc, square, idx) => {
      // opponentの石が置かれていて、ブロック効果が無いか自分のものなら候補にする
      if (square === opponent && (!blockedSquares[idx] || blockedSquares[idx] === 'O')) {
        acc.push(idx);
      }
      return acc;
    }, []);
    
    if (candidatePositions.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * candidatePositions.length);
    return candidatePositions[randomIndex];
  }

export function useCPUOpponent({
  squares,
  blockedSquares,
  size,
  winLength,
  isCPUMode,
  cpuLevel,
  isPlayerTurn,
  winner,
  onMove,
  cpuMana,
}: UseCPUOpponentProps & { cpuMana: number }) {
  useEffect(() => {
    if (isCPUMode && !isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        if (cpuMana >= 2 && Math.random() < (cpuLevel === 0 ? 0.2 : 1)) {
          const movePosition = getRandomReplaceMove(squares, blockedSquares, 'X');
          if (movePosition !== null) {
            onMove(movePosition, 'replace');
            return;
          }
        }

        if (cpuMana >= 1 && Math.random() < (cpuLevel === 0 ? 0.2 : 0.4)) {
          const movePosition = findBestMove(squares, blockedSquares, size, winLength);
          if (movePosition !== null) {
            onMove(movePosition, 'block');
            return;
          }
        }

        if (cpuLevel >= 1) {
          const movePosition = findBestMove(squares, blockedSquares, size, winLength);
          if (movePosition !== null) {
            onMove(movePosition, null);
            return;
          }
        }
        
        const movePosition = getRandomMove(squares, blockedSquares, 'O');
        if (movePosition === null) {
            alert('No valid move found');
            return;
        }
        onMove(movePosition, null);

      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [squares, blockedSquares, size, winLength, isCPUMode, cpuLevel, isPlayerTurn, winner, cpuMana, onMove]);
} 