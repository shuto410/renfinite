import {
  _internalsForTesting,
  useCPUOpponent,
} from '../../hooks/useCPUOpponent';
import { calculateWinner } from '@/utils';
import { Card } from '@/types/battle';
import { MAGIC_CARDS } from '@/constants/decks';
import { renderHook } from '@testing-library/react';

// Mock for testing
jest.mock('@/utils', () => ({
  calculateWinner: jest.fn(),
}));

// Get internal functions for testing
const { isValid, DIRECTIONS, GENERIC_MAGIC } = _internalsForTesting;

describe('useCPUOpponent utility functions', () => {
  describe('isValid', () => {
    test('should return true for valid positions', () => {
      expect(isValid(0, 0, 3)).toBe(true);
      expect(isValid(1, 1, 3)).toBe(true);
      expect(isValid(2, 2, 3)).toBe(true);
    });

    test('should return false for positions outside board', () => {
      expect(isValid(-1, 0, 3)).toBe(false);
      expect(isValid(0, -1, 3)).toBe(false);
      expect(isValid(3, 0, 3)).toBe(false);
      expect(isValid(0, 3, 3)).toBe(false);
    });
  });

  describe('DIRECTIONS', () => {
    test('should define 4 cardinal directions', () => {
      expect(DIRECTIONS.length).toBe(4);

      // Horizontal
      expect(DIRECTIONS).toContainEqual({ dr: 0, dc: 1 });
      // Vertical
      expect(DIRECTIONS).toContainEqual({ dr: 1, dc: 0 });
      // Diagonal bottom-right
      expect(DIRECTIONS).toContainEqual({ dr: 1, dc: 1 });
      // Diagonal bottom-left
      expect(DIRECTIONS).toContainEqual({ dr: 1, dc: -1 });
    });
  });

  describe('GENERIC_MAGIC', () => {
    test('should define a generic magic card', () => {
      expect(GENERIC_MAGIC).toHaveProperty('id', 'generic-stone');
      expect(GENERIC_MAGIC).toHaveProperty('cost', 1);
      expect(GENERIC_MAGIC).toHaveProperty('type', 'normal');
    });
  });
});

// Module function tests include findWinningMove, findBlockingMove, chooseBestMagic, findValidPositionsForMagic, findBestPositionForMagic, etc.

// These functions are not directly exported, so to test them, we need to either
// export them directly without using useEffect, or export them separately for testing.
// Or create a test bed for hook testing.

// Test for useCPUOpponent hook itself
describe('useCPUOpponent hook', () => {
  // Basic hook behavior tests
  describe('basic behavior', () => {
    const onMoveMock = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();
      jest.clearAllMocks();
      (calculateWinner as jest.Mock).mockReset();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // Test: Do nothing when not in CPU mode
    test('should do nothing when not in CPU mode', () => {
      const squares = [null, null, null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: false, // Not in CPU mode
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand: [],
        cpuMana: 3,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // Confirm nothing is executed when not in CPU mode
      expect(onMoveMock).not.toHaveBeenCalled();
    });

    // Test: Do nothing when it is player's turn
    test("should do nothing when it is player's turn", () => {
      const squares = [null, null, null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: true, // Player's turn
        winner: null,
        cpuHand: [],
        cpuMana: 3,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // Confirm nothing is executed on player's turn
      expect(onMoveMock).not.toHaveBeenCalled();
    });

    // Test: Do nothing when there is a winner
    test('should do nothing when there is a winner', () => {
      const squares = [null, null, null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: 'X' as 'X' | 'O' | null, // Fix type error by using type assertion
        cpuHand: [],
        cpuMana: 3,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // Confirm nothing is executed when there is a winner
      expect(onMoveMock).not.toHaveBeenCalled();
    });
  });

  // CPU move decision logic tests
  describe('CPU move decision', () => {
    const onMoveMock = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();
      jest.clearAllMocks();
      (calculateWinner as jest.Mock).mockReset();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should choose winning move when available', () => {
      // O O _
      // _ _ _
      // _ _ _
      const squares = ['O', 'O', null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock victory condition: OOO in a row wins
      (calculateWinner as jest.Mock).mockImplementation((testSquares) => {
        const topRow = testSquares.slice(0, 3);
        if (topRow.filter((s: string | null) => s === 'O').length === 3)
          return { winner: 'O', winningLine: [0, 1, 2] };
        return { winner: null, winningLine: null };
      });

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand: [],
        cpuMana: 0,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // Can win by placing at position 2
      expect(onMoveMock).toHaveBeenCalledWith(2, expect.any(Object));
    });

    test('should choose blocking move when no winning move is available', () => {
      // X X _
      // _ O _
      // _ _ _
      const squares = ['X', 'X', null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock player and CPU victory conditions
      (calculateWinner as jest.Mock).mockImplementation((testSquares) => {
        // Player victory condition
        const topRow = testSquares.slice(0, 3);
        if (topRow.filter((s: string | null) => s === 'X').length === 3)
          return { winner: 'X', winningLine: [0, 1, 2] };

        // CPU cannot win with any move
        return { winner: null, winningLine: null };
      });

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand: [],
        cpuMana: 0,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // No winning move, so block player's victory at position 2
      expect(onMoveMock).toHaveBeenCalledWith(2, expect.any(Object));
    });

    test('should use available magic when possible', () => {
      // X _ _
      // _ _ _
      // _ _ _
      const squares = ['X', null, null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock so neither player nor CPU can win
      (calculateWinner as jest.Mock).mockImplementation(() => {
        return { winner: null, winningLine: null };
      });

      // Have magic card in hand
      const testMagic = {
        ...MAGIC_CARDS.normal,
        id: 'test-magic',
        cost: 2,
        type: 'normal' as const,
      };
      const cpuHand: Card[] = [testMagic];
      const cpuMana = 3; // Sufficient mana

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand,
        cpuMana,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));

      jest.advanceTimersByTime(1500);

      // Confirm position is chosen using magic
      expect(onMoveMock).toHaveBeenCalled();
      expect(onMoveMock.mock.calls[0][1]).toBe(testMagic);
    });

    test('should use generic magic when no hand magic is available', () => {
      // X _ _
      // _ _ _
      // _ _ _
      const squares = ['X', null, null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Mock so neither player nor CPU can win
      (calculateWinner as jest.Mock).mockImplementation(() => {
        return { winner: null, winningLine: null };
      });

      // Test with empty hand
      const cpuHand: Card[] = [];
      const cpuMana = 3; // Sufficient mana

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand,
        cpuMana,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));

      jest.advanceTimersByTime(1500);

      // Confirm generic magic is used
      expect(onMoveMock).toHaveBeenCalled();
      expect(onMoveMock.mock.calls[0][1]).toEqual(GENERIC_MAGIC);
    });

    test('should do nothing when not enough mana', () => {
      // X _ _
      // _ _ _
      // _ _ _
      const squares = ['X', null, null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // High cost magic card
      const expensiveMagic = {
        ...MAGIC_CARDS.normal,
        id: 'expensive-magic',
        cost: 5,
        type: 'normal' as const,
      };
      const cpuHand: Card[] = [expensiveMagic];
      const cpuMana = 0; // Insufficient mana

      // Mock so neither player nor CPU can win
      (calculateWinner as jest.Mock).mockImplementation(() => {
        return { winner: null, winningLine: null };
      });

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand,
        cpuMana,
        onMove: onMoveMock,
      };

      // Mock console log
      const originalConsoleLog = console.log;
      console.log = jest.fn();

      renderHook(() => useCPUOpponent(props));

      jest.advanceTimersByTime(1500);

      // Restore console log
      console.log = originalConsoleLog;

      // Confirm nothing is executed due to insufficient mana
      expect(onMoveMock).not.toHaveBeenCalled();
    });

    test('should choose higher cost magic from available ones', () => {
      // X _ _
      // _ _ _
      // _ _ _
      const squares = ['X', null, null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // Multiple magic cards
      const lowCostMagic = {
        ...MAGIC_CARDS.normal,
        id: 'low-cost-magic',
        cost: 1,
        type: 'normal' as const,
      };
      const highCostMagic = {
        ...MAGIC_CARDS.normal,
        id: 'high-cost-magic',
        cost: 3,
        type: 'normal' as const,
      };
      const cpuHand: Card[] = [lowCostMagic, highCostMagic];
      const cpuMana = 4; // Mana sufficient for both

      // Mock so neither player nor CPU can win
      (calculateWinner as jest.Mock).mockImplementation(() => {
        return { winner: null, winningLine: null };
      });

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand,
        cpuMana,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));

      jest.advanceTimersByTime(1500);

      // Confirm higher cost magic is chosen
      expect(onMoveMock).toHaveBeenCalled();
      expect(onMoveMock.mock.calls[0][1]).toBe(highCostMagic);
    });
  });

  // Special magic effect tests
  describe('special magic effects', () => {
    const onMoveMock = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();
      jest.clearAllMocks();
      (calculateWinner as jest.Mock).mockReset();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should prefer replace magic on opponent stones', () => {
      // _ X _
      // X _ X
      // _ _ _
      const squares = [null, 'X', null, 'X', null, 'X', null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      const replaceMagic = {
        ...MAGIC_CARDS.replace,
        id: 'test-replace',
        type: 'replace' as const,
      };
      const cpuHand: Card[] = [replaceMagic];
      const cpuMana = 3;

      // No victory condition
      (calculateWinner as jest.Mock).mockReturnValue({
        winner: null,
        winningLine: null,
      });

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand,
        cpuMana,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));

      jest.advanceTimersByTime(1500);

      // Confirm replace magic is used
      expect(onMoveMock).toHaveBeenCalled();
      const magic = onMoveMock.mock.calls[0][1];
      expect(magic).toBe(replaceMagic);

      // Confirm placement at X positions (1, 3, 5)
      const position = onMoveMock.mock.calls[0][0];
      expect([1, 3, 5]).toContain(position);
    });

    test('should prefer cross magic to destroy multiple opponent stones', () => {
      // X _ X
      // _ _ _
      // X _ _
      const squares = ['X', null, 'X', null, null, null, 'X', null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      const crossDestroyMagic = {
        ...MAGIC_CARDS.crossDestroy,
        id: 'test-crossDestroy',
        type: 'crossDestroy' as const,
      };
      const cpuHand: Card[] = [crossDestroyMagic];
      const cpuMana = 3;

      // No victory condition
      (calculateWinner as jest.Mock).mockReturnValue({
        winner: null,
        winningLine: null,
      });

      const props = {
        squares,
        blockedSquares,
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand,
        cpuMana,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));

      jest.advanceTimersByTime(1500);

      // Confirm crossDestroy magic is used
      expect(onMoveMock).toHaveBeenCalled();
      expect(onMoveMock.mock.calls[0][1]).toBe(crossDestroyMagic);

      // Center position (4) can destroy the most X stones
      expect(onMoveMock.mock.calls[0][0]).toBe(4);
    });
  });
});
