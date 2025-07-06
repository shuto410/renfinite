import {
  _internalsForTesting,
  useCPUOpponent,
} from '../../hooks/useCPUOpponent';
import { calculateWinner } from '@/utils';
import { Card } from '@/types';
import { MAGIC_CARDS } from '@/constants/decks';
import { renderHook } from '@testing-library/react';

// テスト用のモック
jest.mock('@/utils', () => ({
  calculateWinner: jest.fn(),
}));

// 内部関数をテスト用に取得
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

      // 横方向
      expect(DIRECTIONS).toContainEqual({ dr: 0, dc: 1 });
      // 縦方向
      expect(DIRECTIONS).toContainEqual({ dr: 1, dc: 0 });
      // 右下斜め
      expect(DIRECTIONS).toContainEqual({ dr: 1, dc: 1 });
      // 左下斜め
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

// モジュール関数のテストはfindWinningMove、findBlockingMove、chooseBestMagic、findValidPositionsForMagic、findBestPositionForMagicなど

// これらの関数は直接exportされていないため、useCPUOpponentフック内にあるためテストするには、
// useEffectを使わずに直接これらの関数をexportするか、別途テスト用にexportする必要があります。
// または、フックのテスト用にテストベッドを作成します。

// useCPUOpponentフック自体のテスト
describe('useCPUOpponent hook', () => {
  // フックの基本的な動作テスト
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

    // テスト: CPUモードでない場合は何もしない
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
        isCPUMode: false, // CPUモードでない
        cpuLevel: 1,
        isPlayerTurn: false,
        winner: null,
        cpuHand: [],
        cpuMana: 3,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // CPUモードでないので何も実行されないことを確認
      expect(onMoveMock).not.toHaveBeenCalled();
    });

    // テスト: プレイヤーのターンの場合は何もしない
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
        isPlayerTurn: true, // プレイヤーのターン
        winner: null,
        cpuHand: [],
        cpuMana: 3,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // プレイヤーのターンなので何も実行されないことを確認
      expect(onMoveMock).not.toHaveBeenCalled();
    });

    // テスト: 勝者がいる場合は何もしない
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

      // 勝者がいるので何も実行されないことを確認
      expect(onMoveMock).not.toHaveBeenCalled();
    });
  });

  // CPUの手番の決定ロジックテスト
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

      // 勝利条件のモック: OOO が並ぶと勝利
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

      // 位置2に置くことで勝利できる
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

      // プレイヤーの勝利条件とCPUの勝利条件をモック
      (calculateWinner as jest.Mock).mockImplementation((testSquares) => {
        // プレイヤーの勝利条件
        const topRow = testSquares.slice(0, 3);
        if (topRow.filter((s: string | null) => s === 'X').length === 3)
          return { winner: 'X', winningLine: [0, 1, 2] };

        // どの手を打ってもCPUは勝利できない
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

      // 勝利手がないので、プレイヤーの勝利をブロックする位置2に置く
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

      // プレイヤーとCPUどちらも勝利できないようにモック
      (calculateWinner as jest.Mock).mockImplementation(() => {
        return { winner: null, winningLine: null };
      });

      // 魔法カードを手札に持っている
      const testMagic = {
        ...MAGIC_CARDS.normal,
        id: 'test-magic',
        cost: 2,
        type: 'normal' as const,
      };
      const cpuHand: Card[] = [testMagic];
      const cpuMana = 3; // 十分なマナ

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

      // 魔法を使って位置が選ばれることを確認
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

      // プレイヤーとCPUどちらも勝利できないようにモック
      (calculateWinner as jest.Mock).mockImplementation(() => {
        return { winner: null, winningLine: null };
      });

      // 空の手札でテスト
      const cpuHand: Card[] = [];
      const cpuMana = 3; // 十分なマナ

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

      // 汎用魔法を使うことを確認
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

      // 高コストな魔法カード
      const expensiveMagic = {
        ...MAGIC_CARDS.normal,
        id: 'expensive-magic',
        cost: 5,
        type: 'normal' as const,
      };
      const cpuHand: Card[] = [expensiveMagic];
      const cpuMana = 0; // マナ不足

      // プレイヤーとCPUどちらも勝利できないようにモック
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

      // コンソールログをモック
      const originalConsoleLog = console.log;
      console.log = jest.fn();

      renderHook(() => useCPUOpponent(props));

      jest.advanceTimersByTime(1500);

      // コンソールログを元に戻す
      console.log = originalConsoleLog;

      // マナ不足で何も実行されないことを確認
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

      // 複数の魔法カード
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
      const cpuMana = 4; // 両方使用可能なマナ

      // プレイヤーとCPUどちらも勝利できないようにモック
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

      // コスト高の魔法が選ばれることを確認
      expect(onMoveMock).toHaveBeenCalled();
      expect(onMoveMock.mock.calls[0][1]).toBe(highCostMagic);
    });
  });

  // 特殊な魔法効果のテスト
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

      // 勝利条件なし
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

      // replace魔法を使用していることを確認
      expect(onMoveMock).toHaveBeenCalled();
      const magic = onMoveMock.mock.calls[0][1];
      expect(magic).toBe(replaceMagic);

      // Xの位置（1, 3, 5のいずれか）に置いていることを確認
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

      // 勝利条件なし
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

      // crossDestroy魔法を使用していることを確認
      expect(onMoveMock).toHaveBeenCalled();
      expect(onMoveMock.mock.calls[0][1]).toBe(crossDestroyMagic);

      // 中央（位置4）に置くと最も多くのXを破壊できる
      expect(onMoveMock.mock.calls[0][0]).toBe(4);
    });
  });
});
