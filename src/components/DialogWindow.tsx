import React from 'react';
import Image from 'next/image';

interface DialogWindowProps {
  characterName: string;
  characterImage: string;
  dialogue: string;
  onClick: () => void;
}

export const DialogWindow: React.FC<DialogWindowProps> = ({
  characterName,
  characterImage,
  dialogue,
  onClick,
}) => {
  return (
    <div
      className='fixed inset-0 bg-black/80 flex items-end justify-center p-4 cursor-pointer'
      onClick={onClick}
    >
      <div className='w-full max-w-4xl relative'>
        {/* Character image */}
        <div className='absolute bottom-full left-0 mb-4 w-64 h-96'>
          <Image
            src={characterImage}
            alt={characterName}
            fill
            className='object-contain'
          />
        </div>

        {/* Dialogue window */}
        <div className='bg-gray-900/90 border-2 border-cyan-500 rounded-lg p-6 backdrop-blur-sm'>
          {/* Decorative elements */}
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500' />
          <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500' />

          {/* Character name */}
          <div className='text-cyan-400 text-xl font-bold mb-2'>
            {characterName}
          </div>

          {/* Dialogue text */}
          <div className='text-white text-lg leading-relaxed'>{dialogue}</div>

          {/* Click indicator */}
          <div className='absolute bottom-4 right-4 text-cyan-400 animate-pulse'>
            Click to continue...
          </div>
        </div>
      </div>
    </div>
  );
};
