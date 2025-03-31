'use client';
import { RouteSelection } from '@/components/RouteSelection';
import * as React from 'react';
import { NodeType } from '@/types/game';
import { useRouter } from 'next/navigation';
import { DeckButton } from '@/components/DeckButton';

export default function Home() {
  const router = useRouter();
  const sampleRoutes = [
    {
      type: 'enemy' as NodeType,
      position: { x: 100, y: 100 },
    },
    {
      type: 'shop' as NodeType,
      position: { x: 200, y: 100 },
    },
    {
      type: 'event' as NodeType,
      position: { x: 300, y: 100 },
    },
  ];

  const handleRouteSelect = (routeIndex: number) => {
    const selectedRoute = sampleRoutes[routeIndex];
    console.log('Selected route:', selectedRoute);
    router.push(`/battle`);
  };

  return (
    <>
      <RouteSelection routes={sampleRoutes} onSelect={handleRouteSelect} />;
      <DeckButton />
    </>
  );
}
