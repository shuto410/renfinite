import { StateCreator } from 'zustand';

export interface ItemsState {
  money: number;
  addMoney: (amount: number) => void;
  removeMoney: (amount: number) => void;
}

export const createMoveHistorySlice: StateCreator<ItemsState> = (set) => ({
  money: 0,
  addMoney: (amount: number) => {
    set((state) => ({
      money: state.money + amount,
    }));
  },
  removeMoney: (amount: number) => {
    set((state) => ({
      money: state.money - amount,
    }));
  },
});
