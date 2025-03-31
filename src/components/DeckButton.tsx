import React from 'react';
import { DeckViewPopup } from './DeckViewPopup';
import { useGameStore } from '@/store';

export const DeckButton: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
      >
        <span>デッキ</span>
        <span className='text-sm'>
          ({useGameStore.getState().getDeckSize()}枚)
        </span>
      </button>

      <DeckViewPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
