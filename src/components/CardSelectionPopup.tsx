import React, { useEffect, useState } from 'react';
import { Card } from '@/types/battle';
import { MAGIC_CARDS } from '@/constants/decks';
import { MagicCard } from './MagicCard';

interface CardSelectionPopupProps {
  onSelect: (card: Card) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const CardSelectionPopup: React.FC<CardSelectionPopupProps> = ({
  onSelect,
  onClose,
  isOpen,
}) => {
  // Randomly select 3 cards and assign IDs
  const [availableCards, setAvailableCards] = useState<Card[]>([]);

  useEffect(() => {
    setAvailableCards(
      Object.entries(MAGIC_CARDS)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(([type, card], index) => ({
          ...card,
          id: `selection-${type}${index + 1}`,
        })),
    );
  }, []);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-white'>Select your card</h1>
          {onClose && (
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-white transition-colors'
            >
              ✕
            </button>
          )}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {availableCards.map((card) => (
            <div
              key={card.id}
              className='cursor-pointer hover:scale-105 transition-transform'
              onClick={() => onSelect(card)}
            >
              <MagicCard {...card} size='normal' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
