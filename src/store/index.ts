import { create } from 'zustand';
import { createBattleBoardSlice } from './battleBoard';
import { createGameConfigSlice } from './gameConfig';
import { StoreApi, UseBoundStore } from 'zustand';
import { createMagicSystemSlice } from './magicSystem';
import { createMoveHistorySlice } from './moveHistory';
import { createPlayerDeckSlice } from './playerDeckSlice';
import { createItemsSlice } from './items';
import { createStageRouteSlice } from './stageRoute';
import { StoreState } from '@/types/store';

const gameStore = create<StoreState>((...a) => ({
  ...createGameConfigSlice(...a),
  ...createBattleBoardSlice(...a),
  ...createMagicSystemSlice(...a),
  ...createMoveHistorySlice(...a),
  ...createPlayerDeckSlice(...a),
  ...createItemsSlice(...a),
  ...createStageRouteSlice(...a),
}));

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const useGameStore = createSelectors(gameStore);
