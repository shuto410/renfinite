import { renderHook, act } from '@testing-library/react';
import { useBattleState } from '@/hooks/useBattleState';
import { useGameStore } from '@/store';
import { useCPUOpponent } from '@/hooks/useCPUOpponent';
import { useMagicSystem } from '@/hooks/useMagicSystem';
import { useBattleBoard } from '@/hooks/useBattleBoard';
import { resetBattle } from '@/store/utils';

// Override INITIAL_MANA for testing
const INITIAL_MANA = 10;

// Mock dependencies
jest.mock('@/store');
jest.mock('@/hooks/useCPUOpponent');
jest.mock('@/hooks/useMagicSystem');
jest.mock('@/hooks/useBattleBoard');
jest.mock('@/store/utils');

const mockUseGameStore = useGameStore as jest.Mocked<typeof useGameStore>;
const mockUseCPUOpponent = useCPUOpponent as jest.MockedFunction<
  typeof useCPUOpponent
>;
const mockUseMagicSystem = useMagicSystem as jest.MockedFunction<
  typeof useMagicSystem
>;
const mockUseBattleBoard = useBattleBoard as jest.MockedFunction<
  typeof useBattleBoard
>;
const mockResetBattle = resetBattle as jest.MockedFunction<typeof resetBattle>;

describe('useBattleState', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMagicSystem: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockBattleBoard: any;
  let setSizeMock: jest.Mock;
  let setWinLengthMock: jest.Mock;
  let setSquaresMock: jest.Mock;
  let setIsCPUModeMock: jest.Mock;
  let setCPULevelMock: jest.Mock;
  let placePieceMock: jest.Mock;
  let endTurnMock: jest.Mock;
  let addMoveRecordMock: jest.Mock;
  let setPlayerManaMock: jest.Mock;
  let setCpuManaMock: jest.Mock;
  let setSelectedMagicMock: jest.Mock;
  let castMagicMock: jest.Mock;
  let setXIsNextMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    setSizeMock = jest.fn();
    setWinLengthMock = jest.fn();
    setSquaresMock = jest.fn();
    setIsCPUModeMock = jest.fn();
    setCPULevelMock = jest.fn();
    placePieceMock = jest.fn();
    endTurnMock = jest.fn();
    addMoveRecordMock = jest.fn();
    setPlayerManaMock = jest.fn();
    setCpuManaMock = jest.fn();
    setSelectedMagicMock = jest.fn();
    castMagicMock = jest.fn();
    setXIsNextMock = jest.fn();
    mockStore = {
      use: {
        addMoveRecord: jest.fn(() => addMoveRecordMock),
        size: jest.fn(() => 3),
        setSize: jest.fn(() => setSizeMock),
        winLength: jest.fn(() => 3),
        setWinLength: jest.fn(() => setWinLengthMock),
        squares: jest.fn(() => Array(9).fill(null)),
        setSquares: jest.fn(() => setSquaresMock),
        squaresMetaInfo: jest.fn(() => Array(9).fill({ attackPower: null })),
        isCPUMode: jest.fn(() => true),
        setIsCPUMode: jest.fn(() => setIsCPUModeMock),
        cpuLevel: jest.fn(() => 1),
        setCPULevel: jest.fn(() => setCPULevelMock),
        placePiece: jest.fn(() => placePieceMock),
        endTurn: jest.fn(() => endTurnMock),
        playerHitPoints: jest.fn(() => 100),
        cpuHitPoints: jest.fn(() => 100),
        xIsNext: jest.fn(() => true),
        playerMana: jest.fn(() => 10),
        cpuMana: jest.fn(() => 10),
        playerState: jest.fn(() => ({
          hand: [],
          mana: 10,
          deck: [],
          discardPile: [],
        })),
        cpuState: jest.fn(() => ({
          hand: [],
          mana: 10,
          deck: [],
          discardPile: [],
        })),
      },
    };
    (useGameStore as unknown as jest.Mock).mockReturnValue(mockStore);
    mockUseGameStore.use = mockStore.use;
    mockMagicSystem = {
      selectedMagic: null,
      castMagic: jest.fn(),
      drawCard: jest.fn(),
      setSelectedMagic: setSelectedMagicMock,
      setPlayerMana: setPlayerManaMock,
      setCpuMana: setCpuManaMock,
      playerState: {
        mana: 10,
        hand: [],
        deck: [],
        discardPile: [],
      },
      cpuState: {
        mana: 10,
        hand: [],
        deck: [],
        discardPile: [],
      },
    };
    mockBattleBoard = {
      winner: null,
      xIsNext: true,
      playerRenCount: 0,
      cpuRenCount: 0,
      finalWinner: null,
      lastPlacedPosition: null,
      blockedSquares: {},
      setXIsNext: jest.fn(() => setXIsNextMock),
    };
    mockUseMagicSystem.mockReturnValue(mockMagicSystem);
    mockUseBattleBoard.mockReturnValue(mockBattleBoard);
    mockUseCPUOpponent.mockReturnValue(undefined);
  });

  describe('basic functionality', () => {
    it('should return correct initial state', () => {
      const { result } = renderHook(() => useBattleState());

      expect(result.current.size).toBe(3);
      expect(result.current.winLength).toBe(3);
      expect(result.current.squares).toEqual(Array(9).fill(null));
      expect(result.current.xIsNext).toBe(true);
      expect(result.current.isCPUMode).toBe(true);
      expect(result.current.cpuLevel).toBe(1);
      expect(result.current.winner).toBe(null);
      expect(result.current.selectedMagic).toBe(null);
      expect(result.current.playerMana).toBe(INITIAL_MANA);
      expect(result.current.cpuMana).toBe(INITIAL_MANA);
      expect(result.current.playerRenCount).toBe(0);
      expect(result.current.cpuRenCount).toBe(0);
      expect(result.current.playerHitPoints).toBe(100);
      expect(result.current.cpuHitPoints).toBe(100);
    });

    it('should call useCPUOpponent with correct parameters', () => {
      renderHook(() => useBattleState());

      expect(mockUseCPUOpponent).toHaveBeenCalledWith({
        squares: Array(9).fill(null),
        blockedSquares: {},
        size: 3,
        winLength: 3,
        isCPUMode: true,
        cpuLevel: 1,
        isPlayerTurn: true,
        winner: null,
        onMove: expect.any(Function),
        cpuMana: INITIAL_MANA,
        cpuHand: [],
      });
    });
  });

  describe('handleClick', () => {
    it('should not handle click when there is a winner', () => {
      mockBattleBoard.finalWinner = 'X';
      const { result } = renderHook(() => useBattleState());

      act(() => {
        result.current.handleClick(0);
      });

      expect(addMoveRecordMock).not.toHaveBeenCalled();
      expect(castMagicMock).not.toHaveBeenCalled();
    });

    it('should not handle click when no magic is selected', () => {
      mockMagicSystem.selectedMagic = null;
      const { result } = renderHook(() => useBattleState());

      act(() => {
        result.current.handleClick(0);
      });

      expect(addMoveRecordMock).not.toHaveBeenCalled();
      expect(castMagicMock).not.toHaveBeenCalled();
    });

    it('should handle click for normal magic', () => {
      const newMagic = {
        id: 'test',
        cost: 2,
        type: 'normal' as const,
        cardType: 'normal' as const,
        name: 'Test Magic',
        description: 'Test description',
        endTurn: true,
      };
      mockMagicSystem.selectedMagic = newMagic;
      const { result } = renderHook(() => useBattleState());

      act(() => {
        result.current.handleClick(0);
      });

      expect(addMoveRecordMock).toHaveBeenCalledWith(
        'X',
        0,
        mockMagicSystem.selectedMagic,
      );
      expect(mockMagicSystem.castMagic).toHaveBeenCalledWith(newMagic, 0);
    });
  });

  describe('configuration functions', () => {
    it('should handle size change', () => {
      mockStore.use.squares.mockReturnValue(Array(25).fill(null));
      mockStore.use.playerMana.mockReturnValue(10);
      mockStore.use.cpuMana.mockReturnValue(10);
      const { result } = renderHook(() => useBattleState());
      act(() => {
        result.current.handleSizeChange(5);
      });
      expect(setSizeMock).toHaveBeenCalledWith(5);
      expect(setSquaresMock).toHaveBeenCalledWith(Array(25).fill(null));
      expect(setPlayerManaMock).toHaveBeenCalledWith(0);
      expect(setCpuManaMock).toHaveBeenCalledWith(0);
    });

    it('should handle win length change', () => {
      mockStore.use.squares.mockReturnValue(Array(9).fill(null));
      mockStore.use.playerMana.mockReturnValue(10);
      mockStore.use.cpuMana.mockReturnValue(10);
      const { result } = renderHook(() => useBattleState());
      act(() => {
        result.current.handleWinLengthChange(4);
      });
      expect(setWinLengthMock).toHaveBeenCalledWith(4);
      expect(setSquaresMock).toHaveBeenCalledWith(Array(9).fill(null));
      expect(setPlayerManaMock).toHaveBeenCalledWith(0);
      expect(setCpuManaMock).toHaveBeenCalledWith(0);
    });

    it('should handle CPU level change', () => {
      const { result } = renderHook(() => useBattleState());

      act(() => {
        result.current.handleCPULevelChange(2);
      });

      expect(setCPULevelMock).toHaveBeenCalledWith(2);
      expect(mockResetBattle).toHaveBeenCalled();
    });

    it('should toggle CPU mode', () => {
      const { result } = renderHook(() => useBattleState());

      act(() => {
        result.current.toggleCPUMode();
      });

      expect(setIsCPUModeMock).toHaveBeenCalledWith(false);
      expect(mockResetBattle).toHaveBeenCalled();
    });
  });

  describe('utility functions', () => {
    it('should call endTurn from store', () => {
      const { result } = renderHook(() => useBattleState());

      act(() => {
        result.current.endTurn();
      });

      expect(endTurnMock).toHaveBeenCalled();
    });

    it('should call setSelectedMagic from magic system', () => {
      const mockMagic = {
        id: 'test',
        cost: 1,
        type: 'normal' as const,
        cardType: 'normal' as const,
        name: 'Test Magic',
        description: 'Test description',
        endTurn: true,
      };
      const { result } = renderHook(() => useBattleState());
      act(() => {
        result.current.setSelectedMagic(mockMagic);
      });
      expect(setSelectedMagicMock).toHaveBeenCalledWith(mockMagic);
    });

    it('should call resetBattle from store utils', () => {
      const { result } = renderHook(() => useBattleState());

      act(() => {
        result.current.resetBattle();
      });

      expect(mockResetBattle).toHaveBeenCalled();
    });
  });

  describe('state updates', () => {
    it('should update when store state changes', () => {
      const { result, rerender } = renderHook(() => useBattleState());

      // Initial state
      expect(result.current.size).toBe(3);

      // Change state
      mockStore.use.size.mockReturnValue(5);
      rerender();

      // Verify updated state
      expect(result.current.size).toBe(5);
    });

    it('should update when magic system state changes', () => {
      const { result, rerender } = renderHook(() => useBattleState());

      // Initial state
      expect(result.current.selectedMagic).toBe(null);

      // Change state
      const newMagic = {
        id: 'test',
        cost: 1,
        type: 'normal' as const,
        cardType: 'normal' as const,
        name: 'Test Magic',
        description: 'Test description',
        endTurn: true,
      };
      mockMagicSystem.selectedMagic = newMagic;
      rerender();

      // Verify updated state
      expect(result.current.selectedMagic).toBe(newMagic);
    });

    it('should update when battle board state changes', () => {
      const { result, rerender } = renderHook(() => useBattleState());

      // Initial state
      expect(result.current.winner).toBe(null);

      // Change state
      mockBattleBoard.finalWinner = 'X';
      rerender();

      // Verify updated state
      expect(result.current.winner).toBe('X');
    });
  });
});
