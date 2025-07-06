import { renderHook, act } from '@testing-library/react';
import { useMagicSystem } from '@/hooks/useMagicSystem';
import { useGameStore } from '@/store';
import {
  MANA_REGENERATION_PER_TURN,
  MAX_HAND_SIZE,
  MAX_MANA,
} from '@/constants/decks';

// Mock dependencies
jest.mock('@/store');

const mockUseGameStore = useGameStore as jest.Mocked<typeof useGameStore>;

describe('useMagicSystem', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStore: any;
  let setPlayerDeckMock: jest.Mock;
  let setCpuDeckMock: jest.Mock;
  let setPlayerHandMock: jest.Mock;
  let setCpuHandMock: jest.Mock;
  let setPlayerManaMock: jest.Mock;
  let setCpuManaMock: jest.Mock;
  let setSelectedMagicMock: jest.Mock;
  let addToPlayerDiscardMock: jest.Mock;
  let addToCpuDiscardMock: jest.Mock;
  let reshufflePlayerDiscardMock: jest.Mock;
  let reshuffleCpuDiscardMock: jest.Mock;
  let placePieceMock: jest.Mock;
  let placeBlockMock: jest.Mock;
  let destroyPieceMock: jest.Mock;
  let crossDestroyAndPlaceMock: jest.Mock;
  let allDestroyAndPlaceMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Prepare individual mock functions for setters
    setPlayerDeckMock = jest.fn();
    setCpuDeckMock = jest.fn();
    setPlayerHandMock = jest.fn();
    setCpuHandMock = jest.fn();
    setPlayerManaMock = jest.fn();
    setCpuManaMock = jest.fn();
    setSelectedMagicMock = jest.fn();
    addToPlayerDiscardMock = jest.fn();
    addToCpuDiscardMock = jest.fn();
    reshufflePlayerDiscardMock = jest.fn();
    reshuffleCpuDiscardMock = jest.fn();
    placePieceMock = jest.fn();
    placeBlockMock = jest.fn();
    destroyPieceMock = jest.fn();
    crossDestroyAndPlaceMock = jest.fn();
    allDestroyAndPlaceMock = jest.fn();
    mockStore = {
      use: {
        playerState: jest.fn(() => ({
          hand: [],
          mana: 5,
          deck: [],
          discardPile: [],
        })),
        cpuState: jest.fn(() => ({
          hand: [],
          mana: 5,
          deck: [],
          discardPile: [],
        })),
        selectedMagic: jest.fn(() => null),
        setPlayerDeck: jest.fn(() => setPlayerDeckMock),
        setCpuDeck: jest.fn(() => setCpuDeckMock),
        setPlayerHand: jest.fn(() => setPlayerHandMock),
        setCpuHand: jest.fn(() => setCpuHandMock),
        setPlayerMana: jest.fn(() => setPlayerManaMock),
        setCpuMana: jest.fn(() => setCpuManaMock),
        setSelectedMagic: jest.fn(() => setSelectedMagicMock),
        addToPlayerDiscard: jest.fn(() => addToPlayerDiscardMock),
        addToCpuDiscard: jest.fn(() => addToCpuDiscardMock),
        reshufflePlayerDiscard: jest.fn(() => reshufflePlayerDiscardMock),
        reshuffleCpuDiscard: jest.fn(() => reshuffleCpuDiscardMock),
        finalWinner: jest.fn(() => null),
        xIsNext: jest.fn(() => true),
        playerRenCount: jest.fn(() => 0),
        cpuRenCount: jest.fn(() => 0),
        placePiece: jest.fn(() => placePieceMock),
        placeBlock: jest.fn(() => placeBlockMock),
        destroyPiece: jest.fn(() => destroyPieceMock),
        crossDestroyAndPlace: jest.fn(() => crossDestroyAndPlaceMock),
        allDestroyAndPlace: jest.fn(() => allDestroyAndPlaceMock),
      },
    };
    (useGameStore as unknown as jest.Mock).mockReturnValue(mockStore);
    mockUseGameStore.use = mockStore.use;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should return correct initial state', () => {
      const { result } = renderHook(() => useMagicSystem());

      expect(result.current.playerState).toEqual({
        hand: [],
        mana: 5,
        deck: [],
        discardPile: [],
      });
      expect(result.current.cpuState).toEqual({
        hand: [],
        mana: 5,
        deck: [],
        discardPile: [],
      });
      expect(result.current.selectedMagic).toBe(null);
      expect(typeof result.current.setPlayerMana).toBe('function');
      expect(typeof result.current.setCpuMana).toBe('function');
      expect(typeof result.current.setSelectedMagic).toBe('function');
      expect(typeof result.current.castMagic).toBe('function');
    });
  });

  describe('useEffect - Hand Replenishment', () => {
    it('should not draw cards when there is a final winner', () => {
      mockStore.use.finalWinner.mockReturnValue('X');
      renderHook(() => useMagicSystem());

      // Confirm hand replenishment useEffect is not executed
      expect(setPlayerHandMock).not.toHaveBeenCalled();
      expect(setPlayerDeckMock).not.toHaveBeenCalled();
    });

    it('should draw card when hand is not full and deck has cards', () => {
      const mockPlayerState = {
        hand: ['card1'],
        mana: 5,
        deck: ['card2', 'card3'],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      renderHook(() => useMagicSystem());

      expect(mockStore.use.setPlayerHand).toHaveBeenCalled();
      expect(mockStore.use.setPlayerDeck).toHaveBeenCalled();
    });

    it('should reshuffle discard pile when deck is empty', () => {
      const mockPlayerState = {
        hand: ['card1'],
        mana: 5,
        deck: [],
        discardPile: ['card2', 'card3'],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      renderHook(() => useMagicSystem());

      expect(mockStore.use.reshufflePlayerDiscard).toHaveBeenCalled();
    });

    it('should handle CPU turn correctly', () => {
      const mockCpuState = {
        hand: ['card1'],
        mana: 5,
        deck: ['card2'],
        discardPile: [],
      };
      mockStore.use.cpuState.mockReturnValue(mockCpuState);
      mockStore.use.xIsNext.mockReturnValue(false);

      renderHook(() => useMagicSystem());

      expect(mockStore.use.setCpuHand).toHaveBeenCalled();
      expect(mockStore.use.setCpuDeck).toHaveBeenCalled();
    });
  });

  describe('useEffect - Mana Regeneration', () => {
    it('should not regenerate mana when there is a final winner', () => {
      mockStore.use.finalWinner.mockReturnValue('X');
      renderHook(() => useMagicSystem());

      expect(setPlayerManaMock).not.toHaveBeenCalled();
      expect(setCpuManaMock).not.toHaveBeenCalled();
    });

    it('should regenerate mana for player turn', () => {
      const mockPlayerState = {
        hand: [],
        mana: 5,
        deck: ['card1'],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);
      mockStore.use.playerRenCount.mockReturnValue(2);
      mockStore.use.cpuRenCount.mockReturnValue(1);

      renderHook(() => useMagicSystem());

      const expectedMana = Math.min(
        MAX_MANA,
        5 + MANA_REGENERATION_PER_TURN + 2,
      );
      expect(setPlayerManaMock).toHaveBeenCalledWith(expectedMana);
      expect(setPlayerHandMock).toHaveBeenCalledWith(['card1']);
    });

    it('should regenerate mana for CPU turn', () => {
      const mockCpuState = {
        hand: [],
        mana: 3,
        deck: ['card1'],
        discardPile: [],
      };
      mockStore.use.cpuState.mockReturnValue(mockCpuState);
      mockStore.use.xIsNext.mockReturnValue(false);
      mockStore.use.cpuRenCount.mockReturnValue(1);
      mockStore.use.playerRenCount.mockReturnValue(2);

      renderHook(() => useMagicSystem());

      const expectedMana = Math.min(
        MAX_MANA,
        3 + MANA_REGENERATION_PER_TURN + 1,
      );
      expect(setCpuManaMock).toHaveBeenCalledWith(expectedMana);
      expect(setCpuHandMock).toHaveBeenCalledWith(['card1']);
    });

    it('should cap mana at MAX_MANA', () => {
      const mockPlayerState = {
        hand: [],
        mana: MAX_MANA - 1,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);
      mockStore.use.playerRenCount.mockReturnValue(5);

      renderHook(() => useMagicSystem());

      expect(setPlayerManaMock).toHaveBeenCalledWith(MAX_MANA);
    });
  });

  describe('drawCard', () => {
    it('should draw card for player when hand is not full', () => {
      const mockPlayerState = {
        hand: ['card1'],
        mana: 5,
        deck: ['card2', 'card3'],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);

      renderHook(() => useMagicSystem());

      // drawCard is an internal function, so test through useEffect
      mockStore.use.xIsNext.mockReturnValue(true);

      expect(mockStore.use.setPlayerHand).toHaveBeenCalled();
      expect(mockStore.use.setPlayerDeck).toHaveBeenCalled();
    });

    it('should not draw card when hand is full', () => {
      const mockPlayerState = {
        hand: Array(MAX_HAND_SIZE).fill('card'),
        mana: 5,
        deck: ['card2'],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);

      renderHook(() => useMagicSystem());

      expect(setPlayerHandMock).not.toHaveBeenCalled();
      expect(setPlayerDeckMock).not.toHaveBeenCalled();
    });

    it('should not draw card when deck is empty', () => {
      const mockPlayerState = {
        hand: ['card1'],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);

      renderHook(() => useMagicSystem());

      expect(setPlayerHandMock).not.toHaveBeenCalled();
      expect(setPlayerDeckMock).not.toHaveBeenCalled();
    });
  });

  describe('castMagic', () => {
    const mockMagic = {
      id: 'test-magic',
      cost: 2,
      type: 'normal' as const,
      cardType: 'normal' as const,
      name: 'Test Magic',
      description: 'Test description',
      endTurn: true,
    };

    it('should not cast magic when insufficient mana', () => {
      const mockPlayerState = {
        hand: [mockMagic],
        mana: 1,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);
      mockStore.use.playerRenCount.mockReturnValue(0);
      mockStore.use.cpuRenCount.mockReturnValue(0);

      const { result } = renderHook(() => useMagicSystem());
      jest.clearAllMocks(); // Reset side effects

      act(() => {
        result.current.castMagic(mockMagic, 0);
      });

      expect(setPlayerHandMock).not.toHaveBeenCalled();
      expect(setPlayerManaMock).not.toHaveBeenCalled();
      expect(placePieceMock).not.toHaveBeenCalled();
    });

    it('should not cast magic when position is invalid', () => {
      const mockPlayerState = {
        hand: [mockMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);
      mockStore.use.playerRenCount.mockReturnValue(0);
      mockStore.use.cpuRenCount.mockReturnValue(0);

      const { result } = renderHook(() => useMagicSystem());
      jest.clearAllMocks(); // Reset side effects

      act(() => {
        result.current.castMagic(mockMagic, -1);
      });

      expect(setPlayerHandMock).not.toHaveBeenCalled();
      expect(setPlayerManaMock).not.toHaveBeenCalled();
      expect(placePieceMock).not.toHaveBeenCalled();
    });

    it('should cast normal magic correctly', () => {
      const mockPlayerState = {
        hand: [mockMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(mockMagic, 0);
      });

      expect(setPlayerHandMock).toHaveBeenCalledWith([]);
      expect(setPlayerManaMock).toHaveBeenCalledWith(3);
      expect(addToPlayerDiscardMock).toHaveBeenCalledWith([mockMagic]);
      expect(placePieceMock).toHaveBeenCalledWith(0, 'normal');
    });

    it('should cast block magic correctly', () => {
      const blockMagic = { ...mockMagic, type: 'block' as const };
      const mockPlayerState = {
        hand: [blockMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(blockMagic, 0);
      });

      expect(placeBlockMock).toHaveBeenCalledWith(0, null);
    });

    it('should cast directional block magic correctly', () => {
      const blockUpMagic = { ...mockMagic, type: 'blockUp' as const };
      const mockPlayerState = {
        hand: [blockUpMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(blockUpMagic, 0);
      });

      expect(placeBlockMock).toHaveBeenCalledWith(0, 'up');
      expect(placePieceMock).toHaveBeenCalledWith(0, 'blockUp');
    });

    it('should cast replace magic correctly', () => {
      const replaceMagic = { ...mockMagic, type: 'replace' as const };
      const mockPlayerState = {
        hand: [replaceMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(replaceMagic, 0);
      });

      expect(placePieceMock).toHaveBeenCalledWith(0, 'replace');
    });

    it('should cast destroy magic correctly', () => {
      const destroyMagic = { ...mockMagic, type: 'destroy' as const };
      const mockPlayerState = {
        hand: [destroyMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(destroyMagic, 0);
      });

      expect(destroyPieceMock).toHaveBeenCalledWith(0);
    });

    it('should cast cross destroy magic correctly', () => {
      const crossDestroyMagic = { ...mockMagic, type: 'crossDestroy' as const };
      const mockPlayerState = {
        hand: [crossDestroyMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(crossDestroyMagic, 0);
      });

      expect(crossDestroyAndPlaceMock).toHaveBeenCalledWith(0, 'crossDestroy');
    });

    it('should cast all destroy magic correctly', () => {
      const allDestroyMagic = { ...mockMagic, type: 'allDestroy' as const };
      const mockPlayerState = {
        hand: [allDestroyMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(allDestroyMagic, 0);
      });

      expect(allDestroyAndPlaceMock).toHaveBeenCalledWith(0, 'allDestroy');
    });

    it('should cast all block magic correctly', () => {
      const allBlockMagic = { ...mockMagic, type: 'allBlock' as const };
      const mockPlayerState = {
        hand: [allBlockMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.playerState.mockReturnValue(mockPlayerState);
      mockStore.use.xIsNext.mockReturnValue(true);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(allBlockMagic, 0);
      });

      expect(placeBlockMock).toHaveBeenCalledWith(0, 'all');
      expect(placePieceMock).toHaveBeenCalledWith(0, 'allBlock');
    });

    it('should handle CPU magic casting', () => {
      const mockCpuState = {
        hand: [mockMagic],
        mana: 5,
        deck: [],
        discardPile: [],
      };
      mockStore.use.cpuState.mockReturnValue(mockCpuState);
      mockStore.use.xIsNext.mockReturnValue(false);

      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.castMagic(mockMagic, 0);
      });

      expect(setCpuHandMock).toHaveBeenCalledWith([]);
      expect(setCpuManaMock).toHaveBeenCalledWith(3);
      expect(addToCpuDiscardMock).toHaveBeenCalledWith([mockMagic]);
    });
  });

  describe('state updates', () => {
    it('should update when store state changes', () => {
      const { result, rerender } = renderHook(() => useMagicSystem());

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
      mockStore.use.selectedMagic.mockReturnValue(newMagic);
      rerender();

      // Verify updated state
      expect(result.current.selectedMagic).toBe(newMagic);
    });

    it('should handle setPlayerMana function', () => {
      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.setPlayerMana(10);
      });

      expect(setPlayerManaMock).toHaveBeenCalledWith(10);
    });

    it('should handle setCpuMana function', () => {
      const { result } = renderHook(() => useMagicSystem());

      act(() => {
        result.current.setCpuMana(8);
      });

      expect(setCpuManaMock).toHaveBeenCalledWith(8);
    });

    it('should handle setSelectedMagic function', () => {
      const { result } = renderHook(() => useMagicSystem());

      const magic = {
        id: 'test',
        cost: 1,
        type: 'normal' as const,
        cardType: 'normal' as const,
        name: 'Test Magic',
        description: 'Test description',
        endTurn: true,
      };
      act(() => {
        result.current.setSelectedMagic(magic);
      });

      expect(setSelectedMagicMock).toHaveBeenCalledWith(magic);
    });
  });
});
