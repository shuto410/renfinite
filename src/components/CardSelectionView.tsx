import React from 'react';
import { Magic } from '@/types/game';
import { MAGIC_CARDS } from '@/constants/decks';

interface CardSelectionViewProps {
  onSelect: (card: Magic) => void;
}

export const CardSelectionView: React.FC<CardSelectionViewProps> = ({
  onSelect,
}) => {
  // ランダムに3枚のカードを選択し、IDを付与
  const availableCards = Object.entries(MAGIC_CARDS)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(([type, card], index) => ({
      ...card,
      id: `selection-${index + 1}`,
    }));

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <h1 className='text-3xl font-bold mb-8 text-gray-800'>
        Select your card
      </h1>
      <div className='flex flex-wrap justify-center gap-6 max-w-4xl'>
        {availableCards.map((card) => (
          <div
            key={card.id}
            className='bg-white rounded-lg shadow-lg p-6 w-64 cursor-pointer hover:shadow-xl transition-shadow'
            onClick={() => onSelect(card)}
          >
            <div className='text-xl font-bold mb-2'>{card.name}</div>
            <div className='text-sm text-gray-600 mb-4'>{card.description}</div>
            <div className='flex justify-between items-center'>
              <span className='text-blue-600 font-semibold'>
                Cost: {card.cost}
              </span>
              <span className='text-sm text-gray-500'>{card.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
