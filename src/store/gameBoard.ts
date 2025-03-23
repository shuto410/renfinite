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
});
