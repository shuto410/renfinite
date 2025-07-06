import { StateCreator } from 'zustand';
import { Routes, RouteType } from '@/types/stage';
import { StageRouteState } from '@/types/store';

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
