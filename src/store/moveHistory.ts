import { Card } from '@/types';
import { StateCreator } from 'zustand';

export interface MoveRecord {
  player: 'X' | 'O';
  position: number;
  magic: Card | null;
  timestamp: number;
}

export interface MoveHistoryState {
  moveRecords: MoveRecord[];
  addMoveRecord: (
    player: 'X' | 'O',
    position: number,
    magic: Card | null,
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
