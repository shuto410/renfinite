import { create } from 'zustand';
import { createBattleBoardSlice, BattleBoardState } from './battleBoard';
import { GameConfigState, createGameConfigSlice } from './gameConfig';
import { StoreApi, UseBoundStore } from 'zustand';
import { createMagicSystemSlice, MagicSystemState } from './magicSystem';
import { MoveHistoryState, createMoveHistorySlice } from './moveHistory';
import { createPlayerDeckSlice, PlayerDeckState } from './playerDeckSlice';

const gameStore = create<
  GameConfigState &
    BattleBoardState &
    MagicSystemState &
    MoveHistoryState &
    PlayerDeckState
>((...a) => ({
  ...createGameConfigSlice(...a),
  ...createBattleBoardSlice(...a),
  ...createMagicSystemSlice(...a),
  ...createMoveHistorySlice(...a),
  ...createPlayerDeckSlice(...a),
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
