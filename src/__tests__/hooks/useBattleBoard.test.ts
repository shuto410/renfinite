import { renderHook, act } from '@testing-library/react';
import { useBattleBoard } from '@/hooks/useBattleBoard';
import { useGameStore } from '@/store';
import { calculateWinner } from '@/utils';

// Mock dependencies
jest.mock('@/store');
jest.mock('@/utils');

const mockUseGameStore = useGameStore as jest.Mocked<typeof useGameStore>;
const mockCalculateWinner = calculateWinner as jest.MockedFunction<
  typeof calculateWinner
>;

describe('useBattleBoard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStore: any;
  let setXIsNextMock: jest.Mock;
  let setSquaresMock: jest.Mock;
  let setSquaresMetaInfoMock: jest.Mock;
  let setPlayerRenCountMock: jest.Mock;
  let setCpuRenCountMock: jest.Mock;
  let setFinalWinnerMock: jest.Mock;
  let setPlayerHitPointsMock: jest.Mock;
  let setCpuHitPointsMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Prepare individual mock functions for setters
    setXIsNextMock = jest.fn();
    setSquaresMock = jest.fn();
    setSquaresMetaInfoMock = jest.fn();
    setPlayerRenCountMock = jest.fn();
    setCpuRenCountMock = jest.fn();
    setFinalWinnerMock = jest.fn();
    setPlayerHitPointsMock = jest.fn();
    setCpuHitPointsMock = jest.fn();
    mockStore = {
      use: {
        size: jest.fn(() => 3),
        winLength: jest.fn(() => 3),
        squares: jest.fn(() => Array(9).fill(null)),
        setSquares: jest.fn(() => setSquaresMock),
        xIsNext: jest.fn(() => true),
        setXIsNext: jest.fn(() => setXIsNextMock),
        blockedSquares: jest.fn(() => ({})),
        squaresMetaInfo: jest.fn(() => Array(9).fill({ attackPower: null })),
        setSquaresMetaInfo: jest.fn(() => setSquaresMetaInfoMock),
        lastPlacedPosition: jest.fn(() => null),
        playerRenCount: jest.fn(() => 0),
        cpuRenCount: jest.fn(() => 0),
        setPlayerRenCount: jest.fn(() => setPlayerRenCountMock),
        setCpuRenCount: jest.fn(() => setCpuRenCountMock),
        finalWinner: jest.fn(() => null),
        setFinalWinner: jest.fn(() => setFinalWinnerMock),
        playerHitPoints: jest.fn(() => 100),
        cpuHitPoints: jest.fn(() => 100),
        setPlayerHitPoints: jest.fn(() => setPlayerHitPointsMock),
        setCpuHitPoints: jest.fn(() => setCpuHitPointsMock),
      },
    };
    (useGameStore as unknown as jest.Mock).mockReturnValue(mockStore);
    mockUseGameStore.use = mockStore.use;
    mockCalculateWinner.mockReturnValue({ winner: null, completedRen: [] });
  });

  describe('basic functionality', () => {
    it('should return correct initial state', () => {
      const { result } = renderHook(() => useBattleBoard());

      expect(result.current.xIsNext).toBe(true);
      expect(result.current.lastPlacedPosition).toBe(null);
      expect(result.current.playerRenCount).toBe(0);
      expect(result.current.cpuRenCount).toBe(0);
      expect(result.current.finalWinner).toBe(null);
      expect(result.current.blockedSquares).toEqual({});
      expect(result.current.setXIsNext).toBeDefined();
    });

    it('should call calculateWinner with correct parameters', () => {
      const mockSquares = ['X', 'O', null, 'X', 'O', null, null, null, null];
      mockStore.use.squares.mockReturnValue(mockSquares);

      renderHook(() => useBattleBoard());

      expect(mockCalculateWinner).toHaveBeenCalledWith(mockSquares, 3, 3);
    });

    it('should return winner from calculateWinner', () => {
      mockCalculateWinner.mockReturnValue({
        winner: 'X',
        completedRen: [0, 1, 2],
      });

      const { result } = renderHook(() => useBattleBoard());

      expect(result.current.winner).toBe('X');
    });
  });

  describe('state updates', () => {
    it('should update when store state changes', () => {
      const { result, rerender } = renderHook(() => useBattleBoard());

      // Initial state
      expect(result.current.xIsNext).toBe(true);

      // Change state
      mockStore.use.xIsNext.mockReturnValue(false);
      rerender();

      // Verify updated state
      expect(result.current.xIsNext).toBe(false);
    });

    it('should handle setXIsNext function', () => {
      const { result } = renderHook(() => useBattleBoard());
      act(() => {
        result.current.setXIsNext(false);
      });
      expect(setXIsNextMock).toHaveBeenCalledWith(false);
    });
  });

  describe('store integration', () => {
    it('should access all required store values', () => {
      renderHook(() => useBattleBoard());

      expect(mockStore.use.size).toHaveBeenCalled();
      expect(mockStore.use.winLength).toHaveBeenCalled();
      expect(mockStore.use.squares).toHaveBeenCalled();
      expect(mockStore.use.xIsNext).toHaveBeenCalled();
      expect(mockStore.use.blockedSquares).toHaveBeenCalled();
      expect(mockStore.use.squaresMetaInfo).toHaveBeenCalled();
      expect(mockStore.use.lastPlacedPosition).toHaveBeenCalled();
      expect(mockStore.use.playerRenCount).toHaveBeenCalled();
      expect(mockStore.use.cpuRenCount).toHaveBeenCalled();
      expect(mockStore.use.finalWinner).toHaveBeenCalled();
      expect(mockStore.use.playerHitPoints).toHaveBeenCalled();
      expect(mockStore.use.cpuHitPoints).toHaveBeenCalled();
    });

    it('should provide all required store setters', () => {
      const { result } = renderHook(() => useBattleBoard());

      expect(result.current.setXIsNext).toBeDefined();
    });
  });
});
