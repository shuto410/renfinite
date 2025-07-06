import { MAGIC_CARDS } from '@/constants/decks';
import { BlockDirection, MagicType } from '@/types/battle';
import { SquareMetaInfo } from '@/types/battle';
import { BattleBoardState } from '@/types/store';
import {
  applyAllDestroy,
  applyBlockEffect,
  applyCrossDestroy,
} from '@/utils/effects';
import { StateCreator } from 'zustand';
export const createBattleBoardSlice: StateCreator<BattleBoardState> = (
  set,
) => ({
  squares: Array(9 * 9).fill(null),
  squaresMetaInfo: Array(9 * 9).fill({ attackPower: null }),
  xIsNext: true,
  blockedSquares: Array(9 * 9).fill(null),
  lastPlacedPosition: null,
  playerRenCount: 0,
  cpuRenCount: 0,
  playerHitPoints: 80,
  cpuHitPoints: 80,
  finalWinner: null,
  setSquares: (newSquares: ('X' | 'O' | null)[]) =>
    set(() => ({ squares: newSquares })),
  setSquaresMetaInfo: (newSquaresMetaInfo: SquareMetaInfo[]) =>
    set(() => ({ squaresMetaInfo: newSquaresMetaInfo })),
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
  setPlayerHitPoints: (newPlayerHitPoints: number) =>
    set(() => ({ playerHitPoints: newPlayerHitPoints })),
  setCpuHitPoints: (newCpuHitPoints: number) =>
    set(() => ({ cpuHitPoints: newCpuHitPoints })),
  placePiece: (position: number, magicType?: MagicType) => {
    set((state) => {
      const nextSquares = state.squares.slice();
      nextSquares[position] = state.xIsNext ? 'X' : 'O';
      const nextSquaresMetaInfo = state.squaresMetaInfo.slice();
      if (magicType) {
        nextSquaresMetaInfo[position] = {
          attackPower: MAGIC_CARDS[magicType].attackPower ?? null,
        };
      }
      return {
        squares: nextSquares,
        squaresMetaInfo: nextSquaresMetaInfo,
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
      const nextSquaresMetaInfo = state.squaresMetaInfo.slice();
      nextSquaresMetaInfo[position] = { attackPower: null };
      return {
        squares: nextSquares,
        squaresMetaInfo: nextSquaresMetaInfo,
      };
    });
  },
  crossDestroyAndPlace: (position: number, magicType?: MagicType) => {
    set((state) => {
      const nextSquares = state.squares.slice();
      const size = Math.sqrt(state.squares.length); // should be 9 in the page load
      const crossDestroyTargets = applyCrossDestroy(position, size);
      const nextSquaresMetaInfo = state.squaresMetaInfo.slice();
      crossDestroyTargets.forEach((pos) => {
        nextSquares[pos] = null;
        nextSquaresMetaInfo[pos] = { attackPower: null };
      });
      nextSquares[position] = state.xIsNext ? 'X' : 'O';
      if (magicType) {
        nextSquaresMetaInfo[position] = {
          attackPower: MAGIC_CARDS[magicType].attackPower ?? null,
        };
      }
      return {
        squares: nextSquares,
        squaresMetaInfo: nextSquaresMetaInfo,
        lastPlacedPosition: position,
        xIsNext: !state.xIsNext,
      };
    });
  },
  allDestroyAndPlace: (position: number, magicType?: MagicType) => {
    set((state) => {
      const nextSquares = state.squares.slice();
      const size = Math.sqrt(state.squares.length); // should be 9 in the page load
      const allDestroyTargets = applyAllDestroy(position, size);
      const nextSquaresMetaInfo = state.squaresMetaInfo.slice();
      allDestroyTargets.forEach((pos) => {
        nextSquares[pos] = null;
        nextSquaresMetaInfo[pos] = { attackPower: null };
      });
      nextSquares[position] = state.xIsNext ? 'X' : 'O';
      if (magicType) {
        nextSquaresMetaInfo[position] = {
          attackPower: MAGIC_CARDS[magicType].attackPower ?? null,
        };
      }
      return {
        squares: nextSquares,
        squaresMetaInfo: nextSquaresMetaInfo,
        lastPlacedPosition: position,
        xIsNext: !state.xIsNext,
      };
    });
  },
});
