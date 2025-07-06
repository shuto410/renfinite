import { StateCreator } from 'zustand';

export type StageType = 'start' | 'shop' | 'battle' | 'event' | 'boss';

type BaseStage = {
  canMoveOtherRoute?: boolean;
};

type StartStage = {
  type: 'start';
  canMoveOtherRoute: true;
};

type BattleStage = {
  type: 'battle';
  enemyLevel: 'test' | 'easy' | 'medium' | 'hard';
};

type ShopStage = {
  type: 'shop';
  // shopItems: ShopItem[];
};

type EventStage = {
  type: 'event';
  // eventType: '' | 'special';
};

type BossStage = {
  type: 'boss';
};

export type Stage =
  | BaseStage & (StartStage | BattleStage | ShopStage | EventStage | BossStage);

export type RouteType = 'A' | 'B' | 'C';

export type Route = {
  stages: Stage[];
};

export type Routes = {
  [key in RouteType]: Route;
};

export interface StageRouteState {
  routes: Routes;
  currentRouteType: RouteType;
  currentStageIndex: number;
  setCurrentRouteType: (route: RouteType) => void;
  setCurrentStageIndex: (stage: number) => void;
  moveToNextStage: (routeType?: RouteType) => void;
}

const ROUTES: Routes = {
  A: {
    stages: [
      { type: 'start', canMoveOtherRoute: true },
      { type: 'battle', enemyLevel: 'test' },
      { type: 'battle', enemyLevel: 'test' },
      { type: 'shop' },
      { type: 'battle', enemyLevel: 'test' },
      { type: 'battle', enemyLevel: 'test', canMoveOtherRoute: true },
      { type: 'battle', enemyLevel: 'test' },
      { type: 'shop' },
      { type: 'battle', enemyLevel: 'test' },
      { type: 'boss' },
    ],
  },
  B: {
    stages: [
      { type: 'start', canMoveOtherRoute: true },
      { type: 'shop' },
      { type: 'event' },
      { type: 'battle', enemyLevel: 'test', canMoveOtherRoute: true },
      { type: 'event' },
      { type: 'event' },
      { type: 'event' },
      { type: 'boss' },
    ],
  },
  C: {
    stages: [
      { type: 'start', canMoveOtherRoute: true },
      { type: 'event' },
      { type: 'shop' },
      { type: 'event' },
      { type: 'shop' },
      { type: 'shop' },
      { type: 'battle', enemyLevel: 'test' },
      { type: 'boss' },
    ],
  },
};

export const createStageRouteSlice: StateCreator<StageRouteState> = (
  set,
  get,
) => ({
  routes: ROUTES,
  currentRouteType: 'A',
  currentStageIndex: 0,
  setCurrentRouteType: (route) => set({ currentRouteType: route }),
  setCurrentStageIndex: (stage) => set({ currentStageIndex: stage }),
  moveToNextStage: (routeType?: RouteType) =>
    set((state) => {
      const nextStageIndex = state.currentStageIndex + 1;
      if (nextStageIndex < get().routes[state.currentRouteType].stages.length) {
        if (routeType) {
          return {
            currentRouteType: routeType,
            currentStageIndex: nextStageIndex,
          };
        }
        return { currentStageIndex: nextStageIndex };
      }
      return { currentStageIndex: 0 };
    }),
});
