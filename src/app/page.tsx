'use client';
import { RouteSelection } from '@/components/RouteSelection';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DeckButton } from '@/components/DeckButton';
import { useGameStore } from '@/store';
import { RouteType, Stage } from '@/store/stageRoute';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const routes = useGameStore.use.routes();
  const currentRouteType = useGameStore.use.currentRouteType();
  const currentStageIndex = useGameStore.use.currentStageIndex();
  const currentStage = routes[currentRouteType].stages[currentStageIndex];
  const [nextStages] = useState<{ [k in RouteType]?: Stage }>(
    currentStage.canMoveOtherRoute
      ? {
          A: routes['A'].stages[currentStageIndex + 1],
          B: routes['B'].stages[currentStageIndex + 1],
          C: routes['C'].stages[currentStageIndex + 1],
        }
      : {
          [currentRouteType]:
            routes[currentRouteType].stages[currentStageIndex + 1],
        },
  );
  // React.useEffect(() => {
  //   setNextStages(
  //     currentStage.canMoveOtherRoute
  //       ? {
  //           A: routes['A'].stages[currentStageIndex + 1],
  //           B: routes['B'].stages[currentStageIndex + 1],
  //           C: routes['C'].stages[currentStageIndex + 1],
  //         }
  //       : {
  //           [currentRouteType]:
  //             routes[currentRouteType].stages[currentStageIndex + 1],
  //         },
  //   );
  // }, []);
  const moveToNextStage = useGameStore.use.moveToNextStage();

  const handleRouteSelect = (routeType: RouteType) => {
    const selectedRoute = nextStages[routeType];
    console.log('Selected route:', selectedRoute);
    switch (selectedRoute?.type) {
      case 'battle':
        router.push(`/battle`);
        break;
      case 'shop':
        router.push(`/shop`);
        break;
      case 'event':
        router.push(`/event`);
        break;
    }
    moveToNextStage(routeType);
  };
  return (
    <>
      <RouteSelection stages={nextStages} onSelect={handleRouteSelect} />
      <DeckButton />
    </>
  );
}
