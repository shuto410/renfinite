import { useEffect } from 'react';
import { calculateWinner } from '@/utils';
import { Card } from '@/types/battle';
import { applyAllDestroy, applyCrossDestroy } from '../utils/effects';
import { MAGIC_CARDS } from '@/constants/decks';

// Generic magic card that is always available
const GENERIC_MAGIC: Card = {
  ...MAGIC_CARDS.normal,
  cost: 1, // Slightly higher cost than normal stones
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
  cpuHand: Card[];
  cpuMana: number;
  onMove: (position: number, magic: Card) => void;
}

// Check if position is within board boundaries
function isValid(row: number, col: number, size: number): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

// Define directions
const DIRECTIONS = [
  { dr: 0, dc: 1 }, // Horizontal
  { dr: 1, dc: 0 }, // Vertical
  { dr: 1, dc: 1 }, // Diagonal bottom-right
  { dr: 1, dc: -1 }, // Diagonal bottom-left
];

// Cell evaluation
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
    return { totalScore: -1, myScore: 0, oppScore: 0, centerBonus: 0 }; // Ignore already occupied cells
  if (blockedSquares[position] && blockedSquares[position] !== 'O')
    return { totalScore: -1, myScore: 0, oppScore: 0, centerBonus: 0 }; // Ignore cells that cannot be placed

  const player = 'O';
  const opponent = 'X';
  let myScore = 0;
  let oppScore = 0;

  function scoreForPattern(count: number, openEnds: number): number {
    if (count >= winLength) return 1000000; // Win

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

  // Opponent's lines are more important for blocking, so weight them slightly higher
  const DEFENSE_WEIGHT = 1.5;
  const weightedOppScore = DEFENSE_WEIGHT * oppScore;

  // Center proximity bonus: higher score for positions closer to center
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
      // Look for winning moves
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

      // Look for moves to block opponent's winning
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

      // Check available magics
      const availableMagics = cpuHand.filter((magic) => magic.cost <= cpuMana);

      if (availableMagics.length > 0) {
        // Use magic
        const magics = sortBestMagics(availableMagics);
        for (const magic of magics) {
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
        }
        console.log(
          'CPU skips as no available magic after findBestPositionForMagic',
        );
      }
      if (cpuMana >= GENERIC_MAGIC.cost) {
        // Use generic magic if no usable magic in hand
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
        // Skip if no available magic
        console.log('CPU skips as no available magic 2');
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares, isPlayerTurn, winner, cpuHand, cpuMana]);
}

// Look for winning moves
export function findWinningMove(
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  size: number,
  winLength: number,
  cpuHand: Card[],
  cpuMana: number,
): {
  position: number;
  magic: Card;
} | null {
  // Place normal stone to win
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] || (blockedSquares[i] && blockedSquares[i] !== 'O'))
      continue;

    const testSquares = squares.slice();
    testSquares[i] = 'O';
    const result = calculateWinner(testSquares, size, winLength);
    if (result.winner === 'O') {
      return { position: i, magic: GENERIC_MAGIC };
    }
  }

  // Look for winning moves using magic
  const availableMagics = cpuHand.filter((magic) => magic.cost <= cpuMana);
  for (const magic of availableMagics) {
    const validPositions = findValidPositionsForMagic(
      magic,
      squares,
      blockedSquares,
    );
    for (const pos of validPositions) {
      // Simulate result of using magic
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

// Look for moves to block opponent's winning
export function findBlockingMove(
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  size: number,
  winLength: number,
  cpuHand: Card[],
  cpuMana: number,
): {
  position: number;
  magic: Card;
} | null {
  // Look for positions where opponent can win next turn
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] || (blockedSquares[i] && blockedSquares[i] !== 'X'))
      continue;

    const testSquares = squares.slice();
    testSquares[i] = 'X';
    const result = calculateWinner(testSquares, size, winLength);
    if (result.winner === 'X') {
      // Place your stone to block
      return { position: i, magic: GENERIC_MAGIC };
    }
  }

  // Look for blocking moves using magic
  const availableMagics = cpuHand.filter((magic) => magic.cost <= cpuMana);
  for (const magic of availableMagics) {
    // Get effective positions for magic
    const validPositions = findValidPositionsForMagic(
      magic,
      squares,
      blockedSquares,
    );

    if (magic.type === 'replace') {
      // replace magic can be replaced by opponent
      // TBD
      return null;
    } else {
      // Check if other magics can be placed to block
      for (const position of validPositions) {
        const testSquares = squares.slice();
        testSquares[position] = 'X';
        const result = calculateWinner(testSquares, size, winLength);
        if (result.winner === 'X') {
          // Found blocking move
          return { position, magic };
        }
      }
    }
  }

  return null;
}

// Select best magic
export function sortBestMagics(availableMagics: Card[]): Card[] {
  // Sort by cost, select first magic
  return availableMagics.sort((a, b) => b.cost - a.cost);
}

// Get effective positions for magic
export function findValidPositionsForMagic(
  magic: Card,
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
): number[] {
  let validPositions: number[] = [];

  switch (magic.type) {
    case 'replace':
      validPositions = squares
        .map((square, i) => {
          return square === 'X' &&
            (!blockedSquares[i] || blockedSquares[i] === 'O')
            ? i
            : -1;
        })
        .filter((i) => i !== -1);
      break;

    case 'blockUp':
    case 'blockRight':
    case 'blockDown':
    case 'blockLeft':
    case 'crossDestroy':
    case 'allDestroy':
    case 'allBlock':
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

// Find best position for magic
export function findBestPositionForMagic(
  magic: Card,
  squares: ('X' | 'O' | null)[],
  blockedSquares: ('X' | 'O' | null)[],
  size: number,
  winLength: number,
): number | null {
  // Get effective positions based on magic type
  const validPositions = findValidPositionsForMagic(
    magic,
    squares,
    blockedSquares,
  );
  if (validPositions.length === 0) return null;

  // Evaluate each position
  let bestScore = -Infinity;
  let bestPosition = null;

  for (const position of validPositions) {
    const row = Math.floor(position / size);
    const col = position % size;

    // Evaluate based on magic type
    let score = evaluateCell(
      squares,
      blockedSquares,
      position,
      size,
      winLength,
    ).totalScore;

    // Additional evaluation for specific magic type
    if (magic.type.startsWith('block')) {
      // Block magics are effective when placed near opponent's stones
      for (const { dr, dc } of DIRECTIONS) {
        const r = row + dr;
        const c = col + dc;
        if (isValid(r, c, size) && squares[r * size + c] === 'X') {
          score += 100; // Bonus for placing near opponent's stone
        }
      }
    } else if (magic.type === 'replace') {
      // replace magic can directly replace opponent's stone
      score += 200; // Bonus for directly replacing opponent's stone
    } else if (magic.type === 'crossDestroy') {
      // crossDestroy magic destroys stones in cross direction
      let destroyCount = 0;
      const targets = applyCrossDestroy(position, size);
      for (const pos of targets) {
        if (squares[pos] === 'X') {
          destroyCount++;
        }
      }
      score += destroyCount * 300; // Higher score for destroying more opponent's stones
    } else if (magic.type === 'allDestroy') {
      let destroyCount = 0;
      const targets = applyAllDestroy(position, size);
      for (const pos of targets) {
        if (squares[pos] === 'X') {
          destroyCount++;
        }
      }
      score += destroyCount * 300; // Higher score for destroying more opponent's stones
    } else if (magic.type === 'allBlock') {
      let blockCount = 0;
      const targets = applyAllDestroy(position, size);
      for (const pos of targets) {
        if (squares[pos] === 'X') {
          blockCount++;
        }
      }
      score += blockCount * 300; // Higher score for blocking more opponent's stones
    } else if (magic.type === 'normal' || magic.id === 'generic-stone') {
      // Normal stone is placed in easy-to-connect locations
      // Already evaluated, no additional processing
    }

    if (score > bestScore) {
      bestScore = score;
      bestPosition = position;
    }
  }

  return bestPosition;
}

// Export for testing (do not use in production)
export const _internalsForTesting = {
  isValid,
  DIRECTIONS,
  GENERIC_MAGIC,
};
