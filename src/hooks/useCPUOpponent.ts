import { useEffect } from 'react';
import { calculateWinner } from '@/utils';
import { Magic } from '@/types/game';
import { applyCrossDestroy } from '../utils/effects';
import { MAGIC_CARDS } from '@/constants/decks';

// 常に使用可能な汎用魔法カード
const GENERIC_MAGIC: Magic = {
  ...MAGIC_CARDS.normal,
  cost: 1, // 通常の石より少し高いコスト
  name: 'Basic Stone',
  description: 'Place a stone without any special effect',
  id: 'generic-stone',
};

interface UseCPUOpponentProps {
  squares: ('X' | 'O' | null)[];
  blockedSquares: ('X' | 'O' | null)[];
  size: number;
  winLength: number;
  isCPUMode: boolean;
  cpuLevel: number;
  isPlayerTurn: boolean;
  winner: 'X' | 'O' | null;
  cpuHand: Magic[];
  cpuMana: number;
  onMove: (position: number, magic: Magic | null) => void;
}

// 盤面内かどうかチェック
function isValid(row: number, col: number, size: number): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

// 方向を定義
const DIRECTIONS = [
  { dr: 0, dc: 1 }, // 横方向
  { dr: 1, dc: 0 }, // 縦方向
  { dr: 1, dc: 1 }, // 右下斜め
  { dr: 1, dc: -1 }, // 左下斜め
];

// セルの評価
export function evaluateCell(
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  position: number,
  size: number,
  winLength: number,
): {
  totalScore: number;
  myScore: number;
  oppScore: number;
  centerBonus: number;
} {
  const row = Math.floor(position / size);
  const col = position % size;

  if (squares[position] !== null)
    return { totalScore: -1, myScore: 0, oppScore: 0, centerBonus: 0 }; // 既に埋まっているセルは無視
  if (blockedSquares[position] && blockedSquares[position] !== 'O')
    return { totalScore: -1, myScore: 0, oppScore: 0, centerBonus: 0 }; // 置けないセルは無視

  const player = 'O';
  const opponent = 'X';
  let myScore = 0;
  let oppScore = 0;

  function scoreForPattern(count: number, openEnds: number): number {
    if (count >= winLength) return 1000000; // 勝ち

    let score = 0;
    if (count === winLength - 1) {
      score = openEnds === 2 ? 100000 : 10000;
    } else if (count === winLength - 2) {
      score = openEnds === 2 ? 10000 : 1000;
    } else if (count === winLength - 3) {
      score = openEnds === 2 ? 500 : 50;
    } else if (count === 1) {
      score = 10;
    }
    return score;
  }

  function evaluateDirection(
    squares: ('X' | 'O' | null)[],
    blockedSquares: ('X' | 'O' | null)[],
    row: number,
    col: number,
    dr: number,
    dc: number,
    player: 'X' | 'O',
  ): number {
    let count = 1;
    let openEnds = 0;
    let r = row + dr;
    let c = col + dc;

    while (isValid(r, c, size)) {
      const pos = r * size + c;
      if (
        squares[pos] === player &&
        (!blockedSquares[pos] || blockedSquares[pos] === player)
      ) {
        count++;
        r += dr;
        c += dc;
      } else {
        if (
          isValid(r, c, size) &&
          !squares[pos] &&
          (!blockedSquares[pos] || blockedSquares[pos] === player)
        ) {
          openEnds++;
        }
        break;
      }
    }

    r = row - dr;
    c = col - dc;
    while (isValid(r, c, size)) {
      const pos = r * size + c;
      if (
        squares[pos] === player &&
        (!blockedSquares[pos] || blockedSquares[pos] === player)
      ) {
        count++;
        r -= dr;
        c -= dc;
      } else {
        if (
          isValid(r, c, size) &&
          !squares[pos] &&
          (!blockedSquares[pos] || blockedSquares[pos] === player)
        ) {
          openEnds++;
        }
        break;
      }
    }

    return scoreForPattern(count, openEnds);
  }

  for (const { dr, dc } of DIRECTIONS) {
    myScore += evaluateDirection(
      squares,
      blockedSquares,
      row,
      col,
      dr,
      dc,
      player,
    );
    oppScore += evaluateDirection(
      squares,
      blockedSquares,
      row,
      col,
      dr,
      dc,
      opponent,
    );
  }

  // 相手のラインはブロックの重要度が高いので、やや重視する
  const DEFENSE_WEIGHT = 1.5;
  const weightedOppScore = DEFENSE_WEIGHT * oppScore;

  // 中央寄りのボーナス：中心からのマンハッタン距離が短いほど高得点
  const CENTER = Math.floor(size / 2);
  const centerDistance = Math.abs(row - CENTER) + Math.abs(col - CENTER);
  const centerBonus = Math.max(0, (size - centerDistance) * 5);

  const totalScore = myScore + weightedOppScore + centerBonus;

  return { totalScore, myScore, oppScore, centerBonus };
}

export function useCPUOpponent({
  squares,
  blockedSquares,
  size,
  winLength,
  isCPUMode,
  isPlayerTurn,
  winner,
  cpuHand,
  cpuMana,
  onMove,
}: UseCPUOpponentProps) {
  useEffect(() => {
    if (!isCPUMode || isPlayerTurn || winner) return;

    const timer = setTimeout(() => {
      // 勝利可能な手を探す
      const winningMove = findWinningMove(
        squares,
        blockedSquares,
        size,
        winLength,
        cpuHand,
        cpuMana,
      );
      if (winningMove) {
        onMove(winningMove.position, winningMove.magic);
        return;
      }

      // 相手の勝利を阻止する手を探す
      const blockingMove = findBlockingMove(
        squares,
        blockedSquares,
        size,
        winLength,
        cpuHand,
        cpuMana,
      );
      if (blockingMove) {
        onMove(blockingMove.position, blockingMove.magic);
        return;
      }

      // 使用可能な魔法をチェック
      const availableMagics = cpuHand.filter((magic) => magic.cost <= cpuMana);

      if (availableMagics.length > 0) {
        // 魔法を使用
        const magic = chooseBestMagic(availableMagics);
        const position = findBestPositionForMagic(
          magic,
          squares,
          blockedSquares,
          size,
          winLength,
        );
        if (position !== null) {
          onMove(position, magic);
          return;
        }
      } else if (cpuMana >= GENERIC_MAGIC.cost) {
        // 手札に使える魔法がない場合は汎用魔法を使用
        const position = findBestPositionForMagic(
          GENERIC_MAGIC,
          squares,
          blockedSquares,
          size,
          winLength,
        );
        if (position !== null) {
          onMove(position, GENERIC_MAGIC);
          return;
        }
      } else {
        // 使用可能な魔法がない場合は何もしない
        console.log('CPUは使用可能な魔法がないためスキップします');
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares, isPlayerTurn, winner, cpuHand, cpuMana]);
}

// 勝利可能な手を探す
export function findWinningMove(
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  size: number,
  winLength: number,
  cpuHand: Magic[],
  cpuMana: number,
): {
  position: number;
  magic: Magic | null;
} | null {
  // 通常の石を置いて勝てる場合
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] || (blockedSquares[i] && blockedSquares[i] !== 'O'))
      continue;

    const testSquares = squares.slice();
    testSquares[i] = 'O';
    const result = calculateWinner(testSquares, size, winLength);
    if (result.winner === 'O') {
      return { position: i, magic: null };
    }
  }

  // 魔法を使って勝てる場合を探す
  const availableMagics = cpuHand.filter((magic) => magic.cost <= cpuMana);
  for (const magic of availableMagics) {
    const validPositions = findValidPositionsForMagic(
      magic,
      squares,
      blockedSquares,
    );
    for (const pos of validPositions) {
      // 魔法を使用した場合の結果をシミュレート
      const testSquares = squares.slice();
      testSquares[pos] = 'O';
      const result = calculateWinner(testSquares, size, winLength);
      if (result.winner === 'O') {
        return { position: pos, magic };
      }
    }
  }

  return null;
}

// 相手の勝利を阻止する手を探す
export function findBlockingMove(
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  size: number,
  winLength: number,
  cpuHand: Magic[],
  cpuMana: number,
): {
  position: number;
  magic: Magic | null;
} | null {
  // 相手が次のターンで勝利できる位置を探す
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] || (blockedSquares[i] && blockedSquares[i] !== 'X'))
      continue;

    const testSquares = squares.slice();
    testSquares[i] = 'X';
    const result = calculateWinner(testSquares, size, winLength);
    if (result.winner === 'X') {
      // その位置に自分の石を置いて阻止
      return { position: i, magic: null };
    }
  }

  // 魔法を使って阻止できる場合を探す
  const availableMagics = cpuHand.filter((magic) => magic.cost <= cpuMana);
  for (const magic of availableMagics) {
    if (magic.type === 'replace') {
      // replace魔法は相手の石を置き換えられる
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] !== 'X') continue;

        const testSquares = squares.slice();
        testSquares[i] = 'O';
        const result = calculateWinner(testSquares, size, winLength);
        if (result.winner !== 'X') {
          return { position: i, magic };
        }
      }
    }
  }

  return null;
}

// 最適な魔法を選択
export function chooseBestMagic(availableMagics: Magic[]): Magic {
  // コストの高い順にソートして、最初の魔法を選択
  return availableMagics.sort((a, b) => b.cost - a.cost)[0];
}

// 魔法に有効な位置を見つける
export function findValidPositionsForMagic(
  magic: Magic,
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
): number[] {
  let validPositions: number[] = [];

  switch (magic.type) {
    case 'replace':
      validPositions = squares
        .map((square, i) =>
          square === 'X' && (!blockedSquares[i] || blockedSquares[i] === 'O')
            ? i
            : -1,
        )
        .filter((i) => i !== -1);
      break;

    case 'blockUp':
    case 'blockRight':
    case 'blockDown':
    case 'blockLeft':
    case 'crossDestroy':
    case 'normal':
      validPositions = squares
        .map((square, i) =>
          !square && (!blockedSquares[i] || blockedSquares[i] === 'O') ? i : -1,
        )
        .filter((i) => i !== -1);
      break;
  }

  return validPositions;
}

// 魔法に最適な位置を見つける
export function findBestPositionForMagic(
  magic: Magic,
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  size: number,
  winLength: number,
): number | null {
  // 魔法の種類に応じて有効な位置を取得
  const validPositions = findValidPositionsForMagic(
    magic,
    squares,
    blockedSquares,
  );
  if (validPositions.length === 0) return null;

  // 各位置を評価
  let bestScore = -Infinity;
  let bestPosition = null;

  for (const position of validPositions) {
    const row = Math.floor(position / size);
    const col = position % size;

    // 魔法の種類に応じて評価
    let score = evaluateCell(
      squares,
      blockedSquares,
      position,
      size,
      winLength,
    ).totalScore;

    // 特定の魔法タイプに対する追加評価
    if (magic.type.startsWith('block')) {
      // ブロック魔法は相手の石の近くに置くと効果的
      for (const { dr, dc } of DIRECTIONS) {
        const r = row + dr;
        const c = col + dc;
        if (isValid(r, c, size) && squares[r * size + c] === 'X') {
          score += 100; // 相手の石の隣に置くボーナス
        }
      }
    } else if (magic.type === 'replace') {
      // replace魔法は相手の石を置き換える
      score += 200; // 直接相手の石を取れるのでボーナス
    } else if (magic.type === 'crossDestroy') {
      // crossDestroy魔法は十字方向の石を破壊する
      let destroyCount = 0;
      const targets = applyCrossDestroy(position, size);
      for (const pos of targets) {
        if (squares[pos] === 'X') {
          destroyCount++;
        }
      }
      score += destroyCount * 300; // 相手の石を多く破壊できるほど高評価
    } else if (magic.type === 'normal' || magic.id === 'generic-stone') {
      // 通常の石は連を作りやすい場所に置く
      // 既に評価済みなので追加処理なし
    }

    if (score > bestScore) {
      bestScore = score;
      bestPosition = position;
    }
  }

  return bestPosition;
}

// テスト用にエクスポート（本番環境では使用しない）
export const _internalsForTesting = {
  isValid,
  DIRECTIONS,
  GENERIC_MAGIC,
};
