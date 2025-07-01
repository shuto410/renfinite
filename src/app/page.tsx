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
  
  // Calculate next stages dynamically with bounds checking
  const nextStages = React.useMemo<{ [k in RouteType]?: Stage }>(() => {
    if (!currentStage) return {};
    
    const nextIndex = currentStageIndex + 1;
    
    if (currentStage.canMoveOtherRoute) {
      return {
        A: routes['A']?.stages?.[nextIndex],
        B: routes['B']?.stages?.[nextIndex],
        C: routes['C']?.stages?.[nextIndex],
      };
    } else {
      return {
        [currentRouteType]: routes[currentRouteType]?.stages?.[nextIndex],
      };
    }
  }, [currentStage, currentStageIndex, currentRouteType, routes]);
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
