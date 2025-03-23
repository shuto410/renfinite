import { StateCreator } from 'zustand';

export interface GameConfigState {
  size: number;
  winLength: number;
  isCPUMode: boolean;
  cpuLevel: number;
  setSize: (newSize: number) => void;
  setWinLength: (newWinLength: number) => void;
  setIsCPUMode: (newIsCPUMode: boolean) => void;
  setCPULevel: (newCPULevel: number) => void;
}

export const createGameConfigSlice: StateCreator<GameConfigState> = (set) => ({
  size: 9,
  winLength: 5,
  isCPUMode: true,
  cpuLevel: 1,
  setSize: (newSize: number) => set(() => ({ size: newSize })),
  setWinLength: (newWinLength: number) =>
    set(() => ({ winLength: newWinLength })),
  setIsCPUMode: (newIsCPUMode: boolean) =>
    set(() => ({ isCPUMode: newIsCPUMode })),
  setCPULevel: (newCPULevel: number) => set(() => ({ cpuLevel: newCPULevel })),
});
