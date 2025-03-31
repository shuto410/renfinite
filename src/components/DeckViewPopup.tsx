import React from 'react';
import { DeckView } from './DeckView';

interface DeckViewPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeckViewPopup: React.FC<DeckViewPopupProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
      <div className='bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center'>
          <h2 className='text-xl font-bold text-white'>デッキ管理</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            ✕
          </button>
        </div>
        <div className='p-4'>
          <DeckView />
        </div>
      </div>
    </div>
  );
};
