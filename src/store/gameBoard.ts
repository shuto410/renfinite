import { BlockDirection } from '@/types/game';
import {
  applyAllDestroy,
  applyBlockEffect,
  applyCrossDestroy,
} from '@/utils/effects';
import { StateCreator } from 'zustand';

export interface GameBoardState {
  squares: ('X' | 'O' | null)[];
  xIsNext: boolean;
  blockedSquares: ('X' | 'O' | null)[];
  lastPlacedPosition: number | null;
  playerRenCount: number;
  cpuRenCount: number;
  finalWinner: 'X' | 'O' | null;
  setSquares: (newSquares: ('X' | 'O' | null)[]) => void;
  setXIsNext: (newXIsNext: boolean) => void;
  setBlockedSquares: (newBlockedSquares: ('X' | 'O' | null)[]) => void;
  setLastPlacedPosition: (newLastPlacedPosition: number | null) => void;
  setPlayerRenCount: (newPlayerRenCount: number) => void;
  setCpuRenCount: (newCpuRenCount: number) => void;
  setFinalWinner: (newFinalWinner: 'X' | 'O' | null) => void;
  endTurn: () => void;
  placePiece: (position: number) => void;
  placeBlock: (position: number, blockDirection: BlockDirection) => void;
  destroyPiece: (position: number) => void;
  crossDestroyAndPlace: (position: number) => void;
  allDestroyAndPlace: (position: number) => void;
}
export const createGameBoardSlice: StateCreator<GameBoardState> = (set) => ({
  squares: Array(9 * 9).fill(null),
  xIsNext: true,
  blockedSquares: Array(9 * 9).fill(null),
  lastPlacedPosition: null,
  playerRenCount: 0,
  cpuRenCount: 0,
  finalWinner: null,
  setSquares: (newSquares: ('X' | 'O' | null)[]) =>
    set(() => ({ squares: newSquares })),
  setXIsNext: (newXIsNext: boolean) => set(() => ({ xIsNext: newXIsNext })),
  setBlockedSquares: (newBlockedSquares: ('X' | 'O' | null)[]) =>
    set(() => ({ blockedSquares: newBlockedSquares })),
  setLastPlacedPosition: (newLastPlacedPosition: number | null) =>
    set(() => ({ lastPlacedPosition: newLastPlacedPosition })),
  setPlayerRenCount: (newPlayerRenCount: number) =>
    set(() => ({ playerRenCount: newPlayerRenCount })),
  setCpuRenCount: (newCpuRenCount: number) =>
    set(() => ({ cpuRenCount: newCpuRenCount })),
  setFinalWinner: (newFinalWinner: 'X' | 'O' | null) =>
    set(() => ({ finalWinner: newFinalWinner })),
  endTurn: () => set((state) => ({ xIsNext: !state.xIsNext })),
  placePiece: (position: number) => {
    set((state) => {
      const nextSquares = state.squares.slice();
      nextSquares[position] = state.xIsNext ? 'X' : 'O';
      return {
        squares: nextSquares,
        lastPlacedPosition: position,
        xIsNext: !state.xIsNext,
      };
    });
  },
  placeBlock: (position: number, blockDirection: BlockDirection) => {
    set((state) => {
      const size = Math.sqrt(state.squares.length); // should be 9 in the page load
      const blockTargets = applyBlockEffect(position, blockDirection, size);
      const newBlockedSquares = state.blockedSquares.slice();
      for (const blockTarget of blockTargets) {
        if (blockTarget !== null) {
          newBlockedSquares[blockTarget] = state.xIsNext ? 'X' : 'O';
        }
      }
      return { blockedSquares: newBlockedSquares };
    });
  },
  destroyPiece: (position: number) => {
    set((state) => {
      const nextSquares = state.squares.slice();
      nextSquares[position] = null;
      return { squares: nextSquares };
    });
  },
  crossDestroyAndPlace: (position: number) => {
    set((state) => {
      const nextSquares = state.squares.slice();
      const size = Math.sqrt(state.squares.length); // should be 9 in the page load
      const crossDestroyTargets = applyCrossDestroy(position, size);
      crossDestroyTargets.forEach((pos) => {
        nextSquares[pos] = null;
      });
      nextSquares[position] = state.xIsNext ? 'X' : 'O';
      return {
        squares: nextSquares,
        lastPlacedPosition: position,
        xIsNext: !state.xIsNext,
      };
    });
  },
  allDestroyAndPlace: (position: number) => {
    set((state) => {
      const nextSquares = state.squares.slice();
      const size = Math.sqrt(state.squares.length); // should be 9 in the page load
      const allDestroyTargets = applyAllDestroy(position, size);
      allDestroyTargets.forEach((pos) => {
        nextSquares[pos] = null;
      });
      nextSquares[position] = state.xIsNext ? 'X' : 'O';
      return {
        squares: nextSquares,
        lastPlacedPosition: position,
        xIsNext: !state.xIsNext,
      };
    });
  },
});
