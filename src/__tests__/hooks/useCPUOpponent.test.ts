import {
  evaluateCell,
  _internalsForTesting,
  useCPUOpponent,
} from '../../hooks/useCPUOpponent';
import { calculateWinner } from '@/utils';
import { Magic } from '@/types/game';
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

describe('evaluateCell', () => {
  // 基本的な評価のテスト
  describe('basic evaluation', () => {
    test('should return negative score for already occupied cell', () => {
      // 配置済みのセルは選べないので評価は-1
      const squares = [null, 'X', null, null] as ('X' | 'O' | null)[];
      const blockedSquares = [null, null, null, null] as ('X' | 'O' | null)[];
      const result = evaluateCell(squares, blockedSquares, 1, 2, 3);

      expect(result.totalScore).toBe(-1);
      expect(result.myScore).toBe(0);
      expect(result.oppScore).toBe(0);
    });

    test('should return negative score for blocked cell', () => {
      // ブロックされたセルは選べないので評価は-1
      const squares = [null, null, null, null] as ('X' | 'O' | null)[];
      const blockedSquares = [null, 'X', null, null] as ('X' | 'O' | null)[];
      const result = evaluateCell(squares, blockedSquares, 1, 2, 3);

      expect(result.totalScore).toBe(-1);
      expect(result.myScore).toBe(0);
      expect(result.oppScore).toBe(0);
    });

    test('should allow CPU to place on cell blocked by itself', () => {
      // CPUが自分でブロックしたセルには置ける
      const squares = [null, null, null, null] as ('X' | 'O' | null)[];
      const blockedSquares = [null, 'O', null, null] as ('X' | 'O' | null)[];
      const result = evaluateCell(squares, blockedSquares, 1, 2, 3);

      expect(result.totalScore).not.toBe(-1);
    });
  });

  // スコア計算のテスト
  describe('score calculation', () => {
    test('should give higher score to cells that can form a winning line', () => {
      // CPUの勝利ラインを形成できるセルに高いスコアを与える
      const size = 3;
      const winLength = 3;

      // O O _
      // _ _ _
      // _ _ _
      const squares = ['O', 'O', null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      const result = evaluateCell(squares, blockedSquares, 2, size, winLength);

      // 勝利ラインを形成できるセルなので高いスコア
      expect(result.myScore).toBeGreaterThan(1000);
    });

    test("should give higher score to cells that can block opponent's winning line", () => {
      // プレイヤーの勝利ラインをブロックできるセルに高いスコア
      const size = 3;
      const winLength = 3;

      // X X _
      // _ _ _
      // _ _ _
      const squares = ['X', 'X', null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      const result = evaluateCell(squares, blockedSquares, 2, size, winLength);

      // 相手の勝利ラインをブロックできるセルなのでoppScoreが高い
      expect(result.oppScore).toBeGreaterThan(1000);
      // 防御は攻撃より重視される（DEFENSE_WEIGHT = 1.5）
      expect(result.totalScore).toBeGreaterThan(result.myScore);
    });

    test('should prefer center positions over edges', () => {
      // 中央位置のほうが角や端よりも高評価
      const size = 3;
      const winLength = 3;
      const emptySquares = Array(9).fill(null) as ('X' | 'O' | null)[];
      const emptyBlockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // 中央
      const centerResult = evaluateCell(
        emptySquares,
        emptyBlockedSquares,
        4,
        size,
        winLength,
      );
      // 端
      const edgeResult = evaluateCell(
        emptySquares,
        emptyBlockedSquares,
        1,
        size,
        winLength,
      );
      // 角
      const cornerResult = evaluateCell(
        emptySquares,
        emptyBlockedSquares,
        0,
        size,
        winLength,
      );

      expect(centerResult.centerBonus).toBeGreaterThan(edgeResult.centerBonus);
      expect(edgeResult.centerBonus).toBeGreaterThan(cornerResult.centerBonus);
    });
  });

  // 方向評価のテスト
  describe('directional evaluation', () => {
    test('should evaluate all directions correctly', () => {
      const size = 3;
      const winLength = 3;

      // _ _ _
      // _ O _
      // _ _ _
      const squares = [null, null, null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // 上
      const topResult = evaluateCell(
        squares,
        blockedSquares,
        1,
        size,
        winLength,
      );
      // 横
      const rightResult = evaluateCell(
        squares,
        blockedSquares,
        5,
        size,
        winLength,
      );
      // 下
      const bottomResult = evaluateCell(
        squares,
        blockedSquares,
        7,
        size,
        winLength,
      );
      // 左
      const leftResult = evaluateCell(
        squares,
        blockedSquares,
        3,
        size,
        winLength,
      );

      // すべての方向で評価スコアがゼロより大きい
      expect(topResult.myScore).toBeGreaterThan(0);
      expect(rightResult.myScore).toBeGreaterThan(0);
      expect(bottomResult.myScore).toBeGreaterThan(0);
      expect(leftResult.myScore).toBeGreaterThan(0);
    });

    test('should evaluate open-ended sequences higher', () => {
      const size = 5;
      const winLength = 4;

      // _ _ _ _ _
      // _ O O _ _
      // _ _ _ _ _
      // _ _ _ _ _
      // _ _ _ _ _
      const squares = Array(25).fill(null) as ('X' | 'O' | null)[];
      squares[6] = 'O';
      squares[7] = 'O';
      const blockedSquares = Array(25).fill(null) as ('X' | 'O' | null)[];

      // 両端が空いている位置（高評価）
      // _ O O _ _
      //         ^ この位置
      const openEndedResult = evaluateCell(
        squares,
        blockedSquares,
        8,
        size,
        winLength,
      );

      // 片方が壁または別の石で塞がれている位置（低評価）
      // _ O O _ _
      // ^ この位置
      const singleEndedResult = evaluateCell(
        squares,
        blockedSquares,
        5,
        size,
        winLength,
      );

      expect(openEndedResult.myScore).toBeGreaterThan(
        singleEndedResult.myScore,
      );
    });
  });
});

// モジュール関数のテストはfindWinningMove、findBlockingMove、chooseBestMagic、findValidPositionsForMagic、findBestPositionForMagicなど

// これらの関数は直接exportされていないため、useCPUOpponentフック内にあるためテストするには、
// useEffectを使わずに直接これらの関数をexportするか、別途テスト用にexportする必要があります。
// または、フックのテスト用にテストベッドを作成します。
describe('useCPUOpponent internal functions', () => {
  /**
   * 注意: 以下はテスト構造を示すだけで、実際に関数をモックするなどの方法が必要です。
   * 以下のテストはfindWinningMoveなど内部関数が直接exportされている場合に動作します。
   * 実際には関数をモジュールexportするか、テスト用の構造に変更する必要があります。
   */

  // 勝利可能な手を見つける関数のテスト
  describe('findWinningMove', () => {
    const onMoveMock = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();
      jest.clearAllMocks();
      (calculateWinner as jest.Mock).mockReset();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // テスト: 勝利可能な位置を見つける
    test('should find a winning move when available', () => {
      // _ _ _
      // O O _
      // _ _ _
      const squares = [null, null, null, 'O', 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // 勝利条件のモック: OOO が並ぶと勝利
      (calculateWinner as jest.Mock).mockImplementation((testSquares) => {
        // 横一列に3つのOが並んでいるかチェック
        const topRow = testSquares.slice(0, 3);
        const midRow = testSquares.slice(3, 6);
        const botRow = testSquares.slice(6, 9);

        if (topRow.filter((s: string | null) => s === 'O').length === 3)
          return { winner: 'O', winningLine: [0, 1, 2] };
        if (midRow.filter((s: string | null) => s === 'O').length === 3)
          return { winner: 'O', winningLine: [3, 4, 5] };
        if (botRow.filter((s: string | null) => s === 'O').length === 3)
          return { winner: 'O', winningLine: [6, 7, 8] };

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

      // フックをレンダリングして動作をテスト
      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // 位置5に置くことで勝利できるはず
      expect(onMoveMock).toHaveBeenCalledWith(5, null);
    });

    // テスト: 勝利可能な位置がない場合の動作
    test('should not find a winning move when none is available', () => {
      // _ _ _
      // _ O _
      // _ _ _
      const squares = [null, null, null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // どの手を打ってもまだ勝利条件を満たさないようにモック
      (calculateWinner as jest.Mock).mockReturnValue({
        winner: null,
        winningLine: null,
      });

      // 追加のプロパティを設定して確実にCPUが手を打つようにする
      squares[0] = 'X'; // プレイヤーの石を1つ配置

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
        cpuMana: 1, // マナを提供
        onMove: onMoveMock,
      };

      // ここでは勝利手がないので、他の戦略が選ばれる
      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      expect(onMoveMock).toHaveBeenCalled();
    });

    // テスト: 魔法を使った勝利手も見つける
    test('should find a winning move using magic when possible', () => {
      // X _ _
      // O O _
      // _ _ _
      const squares = ['X', null, null, 'O', 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // replace魔法があり、位置0をreplaceで置き換えると勝利できる
      const replaceMagic = {
        ...MAGIC_CARDS.replace,
        id: 'test-replace',
        type: 'replace' as const,
        cost: 1,
      };

      // 勝利条件のモック: 位置0がOになった場合のみ勝利
      (calculateWinner as jest.Mock).mockImplementation((testSquares) => {
        // 位置0をreplaceした場合のみ勝利
        if (testSquares[0] === 'O') {
          return { winner: 'O', winningLine: [0, 4, 8] }; // 斜め
        }
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
        cpuHand: [replaceMagic],
        cpuMana: 2,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // 位置0をreplaceすることで勝利できるはず
      expect(onMoveMock).toHaveBeenCalledWith(0, replaceMagic);
    });
  });

  // ブロッキング手を見つける関数のテスト
  describe('findBlockingMove', () => {
    const onMoveMock = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();
      jest.clearAllMocks();
      (calculateWinner as jest.Mock).mockReset();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // テスト: プレイヤーの勝利位置をブロックする
    test('should find a move to block player from winning', () => {
      // X X _
      // _ O _
      // _ _ _
      const squares = ['X', 'X', null, null, 'O', null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = Array(9).fill(null) as ('X' | 'O' | null)[];

      // プレイヤーの勝利条件をモック: 横一列に3つのXが並ぶとXの勝利
      (calculateWinner as jest.Mock).mockImplementation((testSquares) => {
        const topRow = testSquares.slice(0, 3);
        if (topRow.filter((s: string | null) => s === 'X').length === 3)
          return { winner: 'X', winningLine: [0, 1, 2] };
        // CPUは勝利できない
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

      // 位置2をブロックすることを期待
      expect(onMoveMock).toHaveBeenCalledWith(2, null);
    });

    // テスト: replace魔法を使って勝利をブロックする
    test("should use replace magic to block player's win when possible", () => {
      // X X _
      // _ _ _
      // _ _ _
      const squares = ['X', 'X', null, null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const blockedSquares = [
        null,
        null,
        'O',
        null,
        null,
        null,
        null,
        null,
        null,
      ] as ('X' | 'O' | null)[];

      // replace魔法があり、位置0または1をreplaceすれば勝利を防げる
      const replaceMagic = {
        ...MAGIC_CARDS.replace,
        id: 'test-replace',
        type: 'replace' as const,
        cost: 1,
      };

      // プレイヤーの勝利条件をモック
      (calculateWinner as jest.Mock).mockImplementation((testSquares) => {
        const topRow = testSquares.slice(0, 3);
        if (topRow.filter((s: string | null) => s === 'X').length === 3)
          return { winner: 'X', winningLine: [0, 1, 2] };
        // CPUは勝利できない
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
        cpuHand: [replaceMagic],
        cpuMana: 1,
        onMove: onMoveMock,
      };

      renderHook(() => useCPUOpponent(props));
      jest.advanceTimersByTime(1500);

      // replace魔法を使用し、位置0または1のいずれかのXを置き換える
      expect(onMoveMock).toHaveBeenCalled();
      const position = onMoveMock.mock.calls[0][0];
      const magic = onMoveMock.mock.calls[0][1];
      expect([0, 1]).toContain(position);
      expect(magic).toBe(replaceMagic);
    });
  });
});

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
      expect(onMoveMock).toHaveBeenCalledWith(2, null);
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
      expect(onMoveMock).toHaveBeenCalledWith(2, null);
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
      const cpuHand: Magic[] = [testMagic];
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
      const cpuHand: Magic[] = [];
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
      const cpuHand: Magic[] = [expensiveMagic];
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
      const cpuHand: Magic[] = [lowCostMagic, highCostMagic];
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
      const cpuHand: Magic[] = [replaceMagic];
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
      const cpuHand: Magic[] = [crossDestroyMagic];
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
