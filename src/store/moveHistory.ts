import { MoveRecord } from '@/types/battle';
import { MoveHistoryState } from '@/types/store';
import { StateCreator } from 'zustand';

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
