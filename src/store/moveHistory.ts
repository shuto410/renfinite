import { Magic } from '@/types/game';
import { StateCreator } from 'zustand';

export interface MoveRecord {
  player: 'X' | 'O';
  position: number;
  magic: Magic | null;
  timestamp: number;
}

export interface MoveHistoryState {
  moveRecords: MoveRecord[];
  addMoveRecord: (
    player: 'X' | 'O',
    position: number,
    magic: Magic | null,
  ) => void;
  clearMoveRecords: () => void;
}

export const createMoveHistorySlice: StateCreator<MoveHistoryState> = (
  set,
) => ({
  moveRecords: [],
  addMoveRecord: (player, position, magic) => {
    const newMove: MoveRecord = {
      player,
      position,
      magic,
      timestamp: Date.now(),
    };
    set((state) => ({
      moveRecords: [...state.moveRecords, newMove],
    }));
  },
  clearMoveRecords: () => set({ moveRecords: [] }),
});
