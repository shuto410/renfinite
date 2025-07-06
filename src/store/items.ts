import { StateCreator } from 'zustand';
import { ItemsState } from '@/types/store';

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
