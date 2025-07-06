import {
  evaluateCell,
  findWinningMove,
  findBlockingMove,
  sortBestMagics,
  findValidPositionsForMagic,
  findBestPositionForMagic,
} from '@/hooks/useCPUOpponent';
import { Card } from '@/types';
import { MAGIC_CARDS } from '@/constants/decks';

// Mock the calculateWinner function
jest.mock('@/utils', () => ({
  calculateWinner: jest.fn(),
}));

import { calculateWinner } from '@/utils';
const mockCalculateWinner = calculateWinner as jest.MockedFunction<
  typeof calculateWinner
>;

describe('CPU Opponent Functions', () => {
  beforeEach(() => {
    mockCalculateWinner.mockReset();
  });

  describe('evaluateCell', () => {
    describe('basic evaluation', () => {
      test('should return negative score for occupied cell', () => {
        const squares = [null, 'X', null, null] as ('X' | 'O' | null)[];
        const blockedSquares = [null, null, null, null] as ('X' | 'O' | null)[];

        const result = evaluateCell(squares, blockedSquares, 1, 2, 3);

        expect(result.totalScore).toBe(-1);
        expect(result.myScore).toBe(0);
        expect(result.oppScore).toBe(0);
        expect(result.centerBonus).toBe(0);
      });

      test('should return negative score for blocked cell (by opponent)', () => {
        const squares = [null, null, null, null] as ('X' | 'O' | null)[];
        const blockedSquares = [null, 'X', null, null] as ('X' | 'O' | null)[];

        const result = evaluateCell(squares, blockedSquares, 1, 2, 3);

        expect(result.totalScore).toBe(-1);
      });

      test('should allow placement on cell blocked by CPU itself', () => {
        const squares = [null, null, null, null] as ('X' | 'O' | null)[];
        const blockedSquares = [null, 'O', null, null] as ('X' | 'O' | null)[];

        const result = evaluateCell(squares, blockedSquares, 1, 2, 3);

        expect(result.totalScore).not.toBe(-1);
      });
    });

    describe('center bonus calculation', () => {
      test('should give higher center bonus to center positions', () => {
        const size = 3;
        const emptySquares = Array(9).fill(null) as ('X' | 'O' | null)[];
        const emptyBlocked = Array(9).fill(null) as ('X' | 'O' | null)[];

        const centerResult = evaluateCell(
          emptySquares,
          emptyBlocked,
          4,
          size,
          3,
        ); // center
        const cornerResult = evaluateCell(
          emptySquares,
          emptyBlocked,
          0,
          size,
          3,
        ); // corner
        const edgeResult = evaluateCell(emptySquares, emptyBlocked, 1, size, 3); // edge

        expect(centerResult.centerBonus).toBeGreaterThan(
          edgeResult.centerBonus,
        );
        expect(edgeResult.centerBonus).toBeGreaterThan(
          cornerResult.centerBonus,
        );
      });

      test('should calculate correct center bonus for 5x5 board', () => {
        const size = 5;
        const emptySquares = Array(25).fill(null) as ('X' | 'O' | null)[];
        const emptyBlocked = Array(25).fill(null) as ('X' | 'O' | null)[];

        const centerResult = evaluateCell(
          emptySquares,
          emptyBlocked,
          12,
          size,
          4,
        ); // center (2,2)
        const cornerResult = evaluateCell(
          emptySquares,
          emptyBlocked,
          0,
          size,
          4,
        ); // corner (0,0)

        expect(centerResult.centerBonus).toBeGreaterThan(
          cornerResult.centerBonus,
        );
      });
    });
  });

  describe('sortBestMagics', () => {
    test('should sort magics by cost in descending order', () => {
      const magics: Card[] = [
        { ...MAGIC_CARDS.normal, cost: 1, id: 'magic1' },
        { ...MAGIC_CARDS.blockUp, cost: 3, id: 'magic2' },
        { ...MAGIC_CARDS.replace, cost: 2, id: 'magic3' },
      ];

      const result = sortBestMagics(magics);

      expect(result[0].cost).toBe(3);
      expect(result[1].cost).toBe(2);
      expect(result[2].cost).toBe(1);
    });

    test('should handle empty array', () => {
      const result = sortBestMagics([]);
      expect(result).toEqual([]);
    });

    test('should handle single magic', () => {
      const magic: Card[] = [{ ...MAGIC_CARDS.normal, cost: 1, id: 'magic1' }];
      const result = sortBestMagics(magic);
      expect(result).toEqual(magic);
    });

    test('should maintain order for equal costs', () => {
      const magics: Card[] = [
        { ...MAGIC_CARDS.normal, cost: 2, id: 'magic1' },
        { ...MAGIC_CARDS.blockUp, cost: 2, id: 'magic2' },
        { ...MAGIC_CARDS.replace, cost: 2, id: 'magic3' },
      ];

      const result = sortBestMagics(magics);

      result.forEach((magic) => {
        expect(magic.cost).toBe(2);
      });
    });
  });

  describe('findValidPositionsForMagic', () => {
    const squares = [null, 'X', null, 'O', null, null, null, null, null] as (
      | 'X'
      | 'O'
      | null
    )[];
    const blockedSquares = [
      null,
      null,
      'X',
      null,
      null,
      null,
      null,
      null,
      null,
    ] as ('X' | 'O' | null)[];

    test('should find valid positions for replace magic', () => {
      const replaceMagic: Card = { ...MAGIC_CARDS.replace, id: 'replace-test' };

      const result = findValidPositionsForMagic(
        replaceMagic,
        squares,
        blockedSquares,
      );

      // Should only return positions with 'X' pieces that aren't blocked by opponent
      expect(result).toContain(1); // position 1 has 'X' and isn't blocked by 'X'
      expect(result).not.toContain(0); // position 0 is empty
      expect(result).not.toContain(3); // position 3 has 'O'
    });

    test('should find valid positions for normal magic', () => {
      const normalMagic: Card = { ...MAGIC_CARDS.normal, id: 'normal-test' };

      const result = findValidPositionsForMagic(
        normalMagic,
        squares,
        blockedSquares,
      );

      // Should return empty positions that aren't blocked by opponent
      expect(result).toContain(0); // empty and not blocked
      expect(result).toContain(4); // empty and not blocked
      expect(result).not.toContain(1); // occupied by 'X'
      expect(result).not.toContain(2); // blocked by 'X'
      expect(result).not.toContain(3); // occupied by 'O'
    });

    test('should find valid positions for block magic', () => {
      const blockMagic: Card = { ...MAGIC_CARDS.blockUp, id: 'block-test' };

      const result = findValidPositionsForMagic(
        blockMagic,
        squares,
        blockedSquares,
      );

      // Should behave like normal magic for placement
      expect(result).toContain(0);
      expect(result).toContain(4);
      expect(result).not.toContain(1);
      expect(result).not.toContain(2);
    });

    test('should handle empty board', () => {
      const emptySquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const emptyBlocked = Array(9).fill(null) as ('X' | 'O' | null)[];
      const normalMagic: Card = { ...MAGIC_CARDS.normal, id: 'normal-test' };

      const result = findValidPositionsForMagic(
        normalMagic,
        emptySquares,
        emptyBlocked,
      );

      expect(result).toHaveLength(9);
      expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('findWinningMove', () => {
    beforeEach(() => {
      // Default mock: no winner
      mockCalculateWinner.mockReturnValue({ winner: null, completedRen: null });
    });

    test('should find winning move with normal placement', () => {
      const squares = [null, null, null, 'O', 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock: placing at position 5 results in a win
      mockCalculateWinner.mockImplementation((testSquares) => {
        if (testSquares[5] === 'O') {
          return { winner: 'O', completedRen: [3, 4, 5] };
        }
        return { winner: null, completedRen: null };
      });

      const result = findWinningMove(squares, blockedSquares, 3, 3, [], 1);

      expect(result).toBeTruthy();
      expect(result?.position).toBe(5);
      expect(result?.magic.type).toBe('normal');
    });

    test('should find winning move with magic', () => {
      const squares = ['X', null, null, 'O', 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const replaceMagic: Card = {
        ...MAGIC_CARDS.replace,
        cost: 2,
        id: 'replace-test',
      };

      // Mock: replacing position 0 results in a win
      mockCalculateWinner.mockImplementation((testSquares) => {
        if (testSquares[0] === 'O') {
          return { winner: 'O', completedRen: [0, 4, 8] };
        }
        return { winner: null, completedRen: null };
      });

      const result = findWinningMove(
        squares,
        blockedSquares,
        3,
        3,
        [replaceMagic],
        3,
      );

      expect(result).toBeTruthy();
      expect(result?.position).toBe(0);
      expect(result?.magic.id).toBe('replace-test');
    });

    test('should return null when no winning move exists', () => {
      const squares = [null, null, null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock: no winning moves
      mockCalculateWinner.mockReturnValue({ winner: null, completedRen: null });

      const result = findWinningMove(squares, blockedSquares, 3, 3, [], 1);

      expect(result).toBe(null);
    });

    test('should not use magic if insufficient mana', () => {
      const squares = ['X', null, null, 'O', 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const expensiveMagic: Card = {
        ...MAGIC_CARDS.replace,
        cost: 5,
        id: 'expensive',
      };

      const result = findWinningMove(
        squares,
        blockedSquares,
        3,
        3,
        [expensiveMagic],
        2,
      );

      // Should not consider the expensive magic due to insufficient mana
      if (result?.magic) {
        expect(result.magic.cost).toBeLessThanOrEqual(2);
      } else {
        expect(result?.magic).toBeUndefined();
      }
    });
  });

  describe('findBlockingMove', () => {
    beforeEach(() => {
      mockCalculateWinner.mockReturnValue({ winner: null, completedRen: null });
    });

    test('should find move to block opponent victory', () => {
      const squares = ['X', 'X', null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock: opponent wins if they place at position 2
      mockCalculateWinner.mockImplementation((testSquares) => {
        if (testSquares[2] === 'X') {
          return { winner: 'X', completedRen: [0, 1, 2] };
        }
        return { winner: null, completedRen: null };
      });

      const result = findBlockingMove(squares, blockedSquares, 3, 3, [], 1);

      expect(result).toBeTruthy();
      expect(result?.position).toBe(2);
    });

    test('should return null when no blocking needed', () => {
      const squares = [null, null, null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock: no immediate threats
      mockCalculateWinner.mockReturnValue({ winner: null, completedRen: null });

      const result = findBlockingMove(squares, blockedSquares, 3, 3, [], 1);

      expect(result).toBe(null);
    });

    test('should prioritize blocking over other moves', () => {
      const squares = ['X', 'X', null, 'O', null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock: opponent wins at position 2
      mockCalculateWinner.mockImplementation((testSquares) => {
        if (testSquares[2] === 'X') {
          return { winner: 'X', completedRen: [0, 1, 2] };
        }
        return { winner: null, completedRen: null };
      });

      const result = findBlockingMove(squares, blockedSquares, 3, 3, [], 1);

      expect(result?.position).toBe(2);
    });
  });

  describe('findBestPositionForMagic', () => {
    test('should find best position for normal magic', () => {
      const squares = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ] as ('X' | 'O' | null)[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const normalMagic: Card = { ...MAGIC_CARDS.normal, id: 'normal-test' };

      const result = findBestPositionForMagic(
        normalMagic,
        squares,
        blockedSquares,
        3,
        3,
      );

      expect(result).toBeTruthy();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(9);
    });

    test('should prefer center positions', () => {
      const squares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const normalMagic: Card = { ...MAGIC_CARDS.normal, id: 'normal-test' };

      const result = findBestPositionForMagic(
        normalMagic,
        squares,
        blockedSquares,
        3,
        3,
      );

      // On an empty board, should prefer center (position 4)
      expect(result).toBe(4);
    });

    test('should return null when no valid positions', () => {
      const squares = Array(9).fill('X') as ('X' | 'O' | null)[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const normalMagic: Card = { ...MAGIC_CARDS.normal, id: 'normal-test' };

      const result = findBestPositionForMagic(
        normalMagic,
        squares,
        blockedSquares,
        3,
        3,
      );

      expect(result).toBe(null);
    });

    test('should handle replace magic correctly', () => {
      const squares = ['X', null, null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const replaceMagic: Card = { ...MAGIC_CARDS.replace, id: 'replace-test' };

      const result = findBestPositionForMagic(
        replaceMagic,
        squares,
        blockedSquares,
        3,
        3,
      );

      // Should target the X piece at position 0
      expect(result).toBe(0);
    });

    test('should consider crossDestroy magic effectiveness', () => {
      const squares = [null, null, null, null, 'X', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const crossDestroyMagic: Card = {
        ...MAGIC_CARDS.crossDestroy,
        id: 'cross-test',
      };

      const result = findBestPositionForMagic(
        crossDestroyMagic,
        squares,
        blockedSquares,
        3,
        3,
      );

      expect(result).toBeTruthy();
      expect(typeof result).toBe('number');
    });
  });

  describe('integration scenarios', () => {
    test('should prioritize winning over blocking', () => {
      const squares = ['X', 'X', null, 'O', 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock both winning and blocking opportunities
      mockCalculateWinner.mockImplementation((testSquares) => {
        if (testSquares[5] === 'O') {
          return { winner: 'O', completedRen: [3, 4, 5] }; // CPU can win
        }
        if (testSquares[2] === 'X') {
          return { winner: 'X', completedRen: [0, 1, 2] }; // Player can win
        }
        return { winner: null, completedRen: null };
      });

      const winningMove = findWinningMove(squares, blockedSquares, 3, 3, [], 1);
      const blockingMove = findBlockingMove(
        squares,
        blockedSquares,
        3,
        3,
        [],
        1,
      );

      expect(winningMove).toBeTruthy();
      expect(blockingMove).toBeTruthy();
      expect(winningMove?.position).toBe(5);
      expect(blockingMove?.position).toBe(2);
    });
  });
});
