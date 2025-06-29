import React from 'react';
import Image from 'next/image';

interface PlayerInfoProps {
  name: string;
  imageSrc: string;
  hp: number;
  mana: number;
  maxMana: number;
  isActive: boolean;
}

export function PlayerInfo({
  name,
  imageSrc,
  hp,
  mana,
  maxMana,
  isActive,
}: PlayerInfoProps) {
  return (
    <div
      className={`flex flex-col items-center p-4 rounded-lg border-2 ${
        isActive ? 'border-blue-600' : 'border-gray-700'
      } bg-gray-800`}
    >
      {/* プレイヤー名 */}
      <h2 className='text-xl font-bold text-white mb-2'>{name}</h2>

      {/* プレイヤー画像 */}
      <div className='relative w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-gray-600'>
        <Image src={imageSrc} alt={name} fill className='object-cover' />
      </div>

      {/* HP表示 */}
      <div className='w-full mb-2'>
        <div className='flex justify-between items-center mb-1'>
          <span className='text-red-400 font-bold'>HP</span>
          <span className='text-white'>{hp}</span>
        </div>
        <div className='w-full h-4 bg-gray-700 rounded-full overflow-hidden'>
          <div
            className='h-full bg-red-500 transition-all duration-300'
            style={{ width: `${(hp / 100) * 100}%` }}
          />
        </div>
      </div>

      {/* マナ表示 */}
      <div className='w-full'>
        <div className='flex justify-between items-center mb-1'>
          <span className='text-blue-400 font-bold'>Mana</span>
          <span className='text-white'>
            {mana}/{maxMana}
          </span>
        </div>
        <div className='w-full h-4 bg-gray-700 rounded-full overflow-hidden'>
          <div
            className='h-full bg-blue-500 transition-all duration-300'
            style={{ width: `${(mana / maxMana) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
