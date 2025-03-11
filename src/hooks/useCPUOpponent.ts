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
  winner: string | null;
  cpuHand: Magic[];
  cpuMana: number;
  onMove: (position: number, magic: Magic | null) => void;
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
      const winningMove = findWinningMove();
      if (winningMove) {
        onMove(winningMove.position, winningMove.magic);
        return;
      }

      // 相手の勝利を阻止する手を探す
      const blockingMove = findBlockingMove();
      if (blockingMove) {
        onMove(blockingMove.position, blockingMove.magic);
        return;
      }

      // 使用可能な魔法をチェック
      const availableMagics = cpuHand.filter((magic) => magic.cost <= cpuMana);

      if (availableMagics.length > 0) {
        // 魔法を使用
        const magic = chooseBestMagic(availableMagics);
        const position = findBestPositionForMagic(magic);
        if (position !== null) {
          onMove(position, magic);
          return;
        }
      } else if (cpuMana >= GENERIC_MAGIC.cost) {
        // 手札に使える魔法がない場合は汎用魔法を使用
        const position = findBestPositionForMagic(GENERIC_MAGIC);
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
  }, [squares, isPlayerTurn, winner, cpuHand, cpuMana]);

  // 勝利可能な手を探す
  function findWinningMove(): { position: number; magic: Magic | null } | null {
    // 通常の石を置いて勝てる場合
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] || (blockedSquares[i] && blockedSquares[i] !== 'O'))
        continue;

      const testSquares = squares.slice();
      testSquares[i] = 'O';
      if (calculateWinner(testSquares, size, winLength) === 'O') {
        return { position: i, magic: null };
      }
    }

    // 魔法を使って勝てる場合を探す
    const availableMagics = cpuHand.filter((magic) => magic.cost <= cpuMana);
    for (const magic of availableMagics) {
      const validPositions = findValidPositionsForMagic(magic);
      for (const pos of validPositions) {
        // 魔法を使用した場合の結果をシミュレート
        const testSquares = squares.slice();
        testSquares[pos] = 'O';
        if (calculateWinner(testSquares, size, winLength) === 'O') {
          return { position: pos, magic };
        }
      }
    }

    return null;
  }

  // 相手の勝利を阻止する手を探す
  function findBlockingMove(): {
    position: number;
    magic: Magic | null;
  } | null {
    // 相手が次のターンで勝利できる位置を探す
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] || (blockedSquares[i] && blockedSquares[i] !== 'X'))
        continue;

      const testSquares = squares.slice();
      testSquares[i] = 'X';
      if (calculateWinner(testSquares, size, winLength) === 'X') {
        // 通常の石で防げる場合
        if (!squares[i] && (!blockedSquares[i] || blockedSquares[i] === 'O')) {
          return { position: i, magic: null };
        }

        // 魔法で防ぐ必要がある場合
        const availableMagics = cpuHand.filter(
          (magic) => magic.cost <= cpuMana,
        );
        for (const magic of availableMagics) {
          if (magic.type === 'replace' && squares[i] === 'X') {
            return { position: i, magic };
          }
        }
      }
    }

    return null;
  }

  // 最適な魔法を選択
  function chooseBestMagic(availableMagics: Magic[]): Magic {
    // コストの高い順にソートして、最初の魔法を選択
    return availableMagics.sort((a, b) => b.cost - a.cost)[0];
  }

  // 方向を定義
  const DIRECTIONS = [
    { dr: 0, dc: 1 }, // 横方向
    { dr: 1, dc: 0 }, // 縦方向
    { dr: 1, dc: 1 }, // 右下斜め
    { dr: 1, dc: -1 }, // 左下斜め
  ];

  // 盤面内かどうかチェック
  function isValid(row: number, col: number): boolean {
    return row >= 0 && row < size && col >= 0 && col < size;
  }

  // パターンに応じたスコアを計算
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

  // ひとつ跳びを含むパターンのスコア計算
  function scoreForGapPattern(
    effectiveCount: number,
    gapCount: number,
    openEnds: number,
  ): number {
    // 空きマスを含めた全体の長さが勝利条件以上なら高評価
    if (effectiveCount + gapCount >= winLength) {
      // 空きマスが1つだけなら、それを埋めれば勝ちに近づく
      if (gapCount === 1) {
        return 50000; // 高い優先度だが、直接の勝利手よりは低い
      }
      return 5000;
    }

    let score = 0;
    // 空きマスを含む全体の長さに基づいてスコア付け
    if (effectiveCount === winLength - 2) {
      score = openEnds === 2 ? 8000 : 800;
    } else if (effectiveCount === winLength - 3) {
      score = openEnds === 2 ? 400 : 40;
    } else if (effectiveCount > 1) {
      score = openEnds === 2 ? 200 : 20;
    }

    // 空きマスが少ないほど価値が高い
    return score * (1 / (gapCount + 1));
  }

  // 指定方向の評価
  function evaluateDirection(
    squares: ('X' | 'O' | null)[],
    blockedSquares: ('X' | 'O' | null)[],
    row: number,
    col: number,
    dr: number,
    dc: number,
    player: 'X' | 'O',
  ): number {
    let count = 1; // 仮に置くので1から開始
    let openEnds = 0;
    let gapCount = 0; // 空きマスの数をカウント
    let totalCount = 1; // 空きマスを含む全体の石の数

    // 正方向
    let r = row + dr;
    let c = col + dc;
    let hasGap = false; // この方向で既に空きマスがあるかどうか

    while (isValid(r, c)) {
      const pos = r * size + c;

      if (
        squares[pos] === player &&
        (!blockedSquares[pos] || blockedSquares[pos] === player)
      ) {
        // プレイヤーの石がある場合
        count++;
        totalCount++;
        r += dr;
        c += dc;
      } else if (
        !squares[pos] &&
        (!blockedSquares[pos] || blockedSquares[pos] === player) &&
        !hasGap
      ) {
        // 空きマスがあり、まだ空きマスを使っていない場合
        hasGap = true;
        gapCount++;
        r += dr;
        c += dc;
      } else {
        // それ以外の場合（相手の石や2つ目の空きマス）
        if (
          isValid(r, c) &&
          !squares[pos] &&
          (!blockedSquares[pos] || blockedSquares[pos] === player)
        ) {
          openEnds++;
        }
        break;
      }
    }

    // 逆方向
    r = row - dr;
    c = col - dc;
    hasGap = false; // 逆方向では再度空きマスを使えるようにリセット

    while (isValid(r, c)) {
      const pos = r * size + c;

      if (
        squares[pos] === player &&
        (!blockedSquares[pos] || blockedSquares[pos] === player)
      ) {
        // プレイヤーの石がある場合
        count++;
        totalCount++;
        r -= dr;
        c -= dc;
      } else if (
        !squares[pos] &&
        (!blockedSquares[pos] || blockedSquares[pos] === player) &&
        !hasGap
      ) {
        // 空きマスがあり、まだ空きマスを使っていない場合
        hasGap = true;
        gapCount++;
        r -= dr;
        c -= dc;
      } else {
        // それ以外の場合（相手の石や2つ目の空きマス）
        if (
          isValid(r, c) &&
          !squares[pos] &&
          (!blockedSquares[pos] || blockedSquares[pos] === player)
        ) {
          openEnds++;
        }
        break;
      }
    }

    // 連続した石の数と、ひとつ跳びを含む石の数の両方を評価
    const continuousScore = scoreForPattern(count, openEnds);

    // ひとつ跳びを含む評価
    let gapScore = 0;
    if (gapCount > 0 && totalCount > count) {
      // ひとつ跳びがある場合、totalCountは実際の石の数+自分自身
      const effectiveCount = totalCount - gapCount;
      gapScore = scoreForGapPattern(effectiveCount, gapCount, openEnds);

      // ひとつ跳びの連を検出した場合のデバッグログ
      if (gapScore > 0) {
        console.log(
          `ひとつ跳びの連を検出: 位置(${row}, ${col}) 方向(${dr}, ${dc}) プレイヤー:${player}`,
        );
        console.log(
          `  連続石数:${count} 空きマス数:${gapCount} 全体石数:${totalCount} 有効石数:${effectiveCount}`,
        );
        console.log(
          `  連続スコア:${continuousScore} ひとつ跳びスコア:${gapScore}`,
        );
      }
    }

    // 高い方のスコアを返す
    return Math.max(continuousScore, gapScore);
  }

  // セルの評価
  function evaluateCell(
    squares: ('X' | 'O' | null)[],
    blockedSquares: ('X' | 'O' | null)[],
    position: number,
  ): number {
    const row = Math.floor(position / size);
    const col = position % size;

    if (squares[position] !== null) return -1; // 既に埋まっているセルは無視
    if (blockedSquares[position] && blockedSquares[position] !== 'O') return -1; // 置けないセルは無視

    const player = 'O';
    const opponent = 'X';
    let myScore = 0;
    let oppScore = 0;

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
    let totalScore = myScore + DEFENSE_WEIGHT * oppScore;

    // 中央寄りのボーナス：中心からのマンハッタン距離が短いほど高得点
    const CENTER = Math.floor(size / 2);
    const centerDistance = Math.abs(row - CENTER) + Math.abs(col - CENTER);
    const centerBonus = Math.max(0, (size - centerDistance) * 5);
    totalScore += centerBonus;

    console.log(
      `位置 (${row}, ${col}) - 自分: ${myScore}, 相手: ${oppScore}, 中央ボーナス: ${centerBonus}, 合計: ${totalScore}`,
    );
    return totalScore;
  }

  // 魔法に有効な位置を見つける
  function findValidPositionsForMagic(magic: Magic): number[] {
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
            !square && (!blockedSquares[i] || blockedSquares[i] === 'O')
              ? i
              : -1,
          )
          .filter((i) => i !== -1);
        break;
    }

    return validPositions;
  }

  // 魔法に最適な位置を見つける
  function findBestPositionForMagic(magic: Magic): number | null {
    // 魔法の種類に応じて有効な位置を取得
    const validPositions = findValidPositionsForMagic(magic);
    if (validPositions.length === 0) return null;

    // 各位置を評価
    let bestScore = -Infinity;
    let bestPosition = null;

    for (const position of validPositions) {
      const row = Math.floor(position / size);
      const col = position % size;

      // 魔法の種類に応じて評価
      let score = evaluateCell(squares, blockedSquares, position);

      // 特定の魔法タイプに対する追加評価
      if (magic.type.startsWith('block')) {
        // ブロック魔法は相手の石の近くに置くと効果的
        for (const { dr, dc } of DIRECTIONS) {
          const r = row + dr;
          const c = col + dc;
          if (isValid(r, c) && squares[r * size + c] === 'X') {
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
}
