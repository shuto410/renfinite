'use client';
import { Magic } from '@/types/game';
import { useEffect, useState } from 'react';
import { Link } from 'lucide-react';

// 常に使用可能な汎用魔法カード
const GENERIC_MAGIC: Magic = {
  type: 'normal',
  cardType: 'normal',
  cost: 1,
  name: 'Basic Stone',
  description: 'Place a stone without any special effect',
  id: 'generic-stone',
  endTurn: true,
};

interface MagicButtonsProps {
  hand: Magic[];
  selectedMagic: Magic | null;
  xIsNext: boolean;
  playerMana: number;
  cpuMana: number;
  onSelectMagic: (magic: Magic | null) => void;
}

export function MagicButtons({
  hand,
  selectedMagic,
  xIsNext,
  playerMana,
  cpuMana,
  onSelectMagic,
}: MagicButtonsProps) {
  // Use client-side only rendering to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentMana = xIsNext ? playerMana : cpuMana;

  function renderMagicButton(magic: Magic, isGeneric: boolean = false) {
    const isSelected = selectedMagic && selectedMagic.id === magic.id;
    const canUse = currentMana >= magic.cost;

    return (
      <button
        key={`${magic.type}-${magic.cost}-${magic.id}`}
        className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center
          ${
            isSelected
              ? 'bg-blue-500 text-white'
              : canUse
              ? isGeneric
                ? 'bg-green-200 hover:bg-green-300' // 汎用カードは緑色で表示
                : 'bg-blue-200 hover:bg-blue-300'
              : 'bg-gray-200 cursor-not-allowed'
          }`}
        onClick={() => onSelectMagic(isSelected ? null : magic)}
        disabled={!canUse}
      >
        {!magic.endTurn && <Link className='mr-2' size={16} />}
        {getMagicLabel(magic)}
      </button>
    );
  }

  function getMagicLabel(magic: Magic): string {
    switch (magic.type) {
      case 'blockUp':
        return `Block Up (${magic.cost} Mana)`;
      case 'blockRight':
        return `Block Right (${magic.cost} Mana)`;
      case 'blockDown':
        return `Block Down (${magic.cost} Mana)`;
      case 'blockLeft':
        return `Block Left (${magic.cost} Mana)`;
      case 'block':
        return `Block (${magic.cost} Mana)`;
      case 'replace':
        return `Replace (${magic.cost} Mana)`;
      case 'crossDestroy':
        return `Cross Destroy (${magic.cost} Mana)`;
      case 'normal':
        return `Normal Stone (${magic.cost} Mana)`;
      case 'destroy':
        return `Destroy (${magic.cost} Mana)`;
      case 'allDestroy':
        return `All Destroy (${magic.cost} Mana)`;
      case 'allBlock':
        return `All Block (${magic.cost} Mana)`;
    }
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
      <div className='flex flex-col gap-2'>
        {/* 手札のカード */}
        <div className='flex gap-2 flex-wrap justify-center'>
          {hand.map((magic) => renderMagicButton(magic))}
        </div>

        {/* 区切り線 */}
        <div className='border-t border-gray-300 my-2'></div>

        {/* 常に使用可能な汎用魔法カード */}
        <div className='flex justify-center'>
          {renderMagicButton(GENERIC_MAGIC, true)}
        </div>
      </div>
    </div>
  );
}
