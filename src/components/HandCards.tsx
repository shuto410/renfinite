'use client';
import { Card } from '@/types/game';
import { useEffect, useState } from 'react';
import { MagicCard } from './MagicCard';

interface HandCardsProps {
  hand: Card[];
  selectedMagic: Card | null;
  xIsNext: boolean;
  playerMana: number;
  cpuMana: number;
  onSelectMagic: (magic: Card | null) => void;
}

export function HandCards({
  hand,
  selectedMagic,
  xIsNext,
  playerMana,
  cpuMana,
  onSelectMagic,
}: HandCardsProps) {
  // Use client-side only rendering to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentMana = xIsNext ? playerMana : cpuMana;

  function renderMagicCard(magic: Card, isGeneric: boolean = false) {
    const isSelected = selectedMagic && selectedMagic.id === magic.id;
    const canUse = currentMana >= magic.cost;

    return (
      <div
        key={`${magic.type}-${magic.cost}-${magic.id}`}
        className={`cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-yellow-400' : ''
        } ${!canUse ? 'opacity-50' : ''}`}
        onClick={() => canUse && onSelectMagic(isSelected ? null : magic)}
      >
        <MagicCard {...magic} size='small' />
      </div>
    );
  }

  // Only render the actual buttons on the client side
  if (!isClient) {
    return (
      <div className='mb-4'>
        <div className='flex gap-2'>{/* Empty placeholder during SSR */}</div>
      </div>
    );
  }

  return (
    <div className='mb-4 w-full max-w-4xl'>
      <div className='flex flex-col gap-4'>
        {/* 手札のカード */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
          {hand.map((magic) => renderMagicCard(magic))}
        </div>

        {/* 区切り線 */}
        {/* <div className='border-t border-gray-300 my-2'></div> */}

        {/* 常に使用可能な汎用魔法カード */}
        {/* <div className='flex justify-center'>
          {renderMagicCard(GENERIC_MAGIC, true)}
        </div> */}
      </div>
    </div>
  );
}
