import { create } from 'zustand';
import { createGameBoardSlice, GameBoardState } from './gameBoard';
import { GameConfigState, createGameConfigSlice } from './gameConfig';
import { StoreApi, UseBoundStore } from 'zustand';
import { createMagicSystemSlice, MagicSystemState } from './magicSystem';

const gameStore = create<GameConfigState & GameBoardState & MagicSystemState>(
  (...a) => ({
    ...createGameConfigSlice(...a),
    ...createGameBoardSlice(...a),
    ...createMagicSystemSlice(...a),
  }),
);

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const useGameStore = createSelectors(gameStore);
