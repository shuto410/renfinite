import { StateCreator } from 'zustand';
import { GameConfigState } from '@/types/store';

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
