import React from 'react';
import { Card } from '@/types/game';
import { useGameStore } from '@/store';
import { MagicCard } from './MagicCard';

export const DeckView: React.FC = () => {
  const { deck, getDeckSize } = useGameStore();
  const [selectedCard, setSelectedCard] = React.useState<Card | null>(null);

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <h2 className='text-xl font-bold text-white'>デッキ一覧</h2>
        <p className='text-gray-400'>デッキ枚数: {getDeckSize()}枚</p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {deck.map((card) => (
          <div
            key={card.id}
            className='cursor-pointer'
            onClick={() => setSelectedCard(card)}
          >
            <MagicCard {...card} size='small' />
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4'>
          <div className='bg-gray-800 rounded-lg p-6 max-w-md w-full'>
            <div className='flex justify-between items-start mb-4'>
              <h3 className='text-xl font-bold text-white'>
                {selectedCard.name}
              </h3>
              <button
                onClick={() => setSelectedCard(null)}
                className='text-gray-400 hover:text-white'
              >
                ✕
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <span className='text-gray-400'>コスト: </span>
                <span className='text-white'>{selectedCard.cost}</span>
              </div>
              <div>
                <span className='text-gray-400'>説明: </span>
                <p className='text-white'>{selectedCard.description}</p>
              </div>
              {selectedCard.attackPower && (
                <div>
                  <span className='text-gray-400'>攻撃力: </span>
                  <span className='text-white'>{selectedCard.attackPower}</span>
                </div>
              )}
              {selectedCard.rarity && (
                <div>
                  <span className='text-gray-400'>レアリティ: </span>
                  <span className='text-white'>{selectedCard.rarity}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
