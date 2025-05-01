import { StateCreator } from 'zustand';

export interface ItemsState {
  gold: number;
  addGold: (amount: number) => void;
  removeGold: (amount: number) => void;
}

export const createItemsSlice: StateCreator<ItemsState> = (set) => ({
  gold: 100,
  addGold: (amount: number) => {
    set((state) => ({
      gold: state.gold + amount,
    }));
  },
  removeGold: (amount: number) => {
    set((state) => ({
      gold: state.gold - amount,
    }));
  },
});
