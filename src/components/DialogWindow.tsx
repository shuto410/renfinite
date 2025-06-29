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
        {/* キャラクター画像 */}
        <div className='absolute bottom-full left-0 mb-4 w-64 h-96'>
          <Image
            src={characterImage}
            alt={characterName}
            fill
            className='object-contain'
          />
        </div>

        {/* 会話ウィンドウ */}
        <div className='bg-gray-900/90 border-2 border-cyan-500 rounded-lg p-6 backdrop-blur-sm'>
          {/* 装飾的な要素 */}
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500' />
          <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500' />

          {/* キャラクター名 */}
          <div className='text-cyan-400 text-xl font-bold mb-2'>
            {characterName}
          </div>

          {/* 会話テキスト */}
          <div className='text-white text-lg leading-relaxed'>{dialogue}</div>

          {/* クリックを促すインジケーター */}
          <div className='absolute bottom-4 right-4 text-cyan-400 animate-pulse'>
            Click to continue...
          </div>
        </div>
      </div>
    </div>
  );
};
