import React from 'react';
import Image from 'next/image';
import { Card } from '@/types/battle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MagicCardProps extends Card {
  isPurchased?: boolean;
  onClick?: () => void;
  size?: 'large' | 'normal' | 'small';
}

export function MagicCard({
  name,
  description,
  cost,
  imageSrc,
  isPurchased,
  onClick,
  size = 'normal',
}: MagicCardProps) {
  const sizeClasses = {
    large: {
      container: 'max-w-sm',
      header: 'pl-3',
      title: 'text-lg',
      cost: 'text-lg',
      description: 'font-bold text-sm min-h-[3em]',
      padding: 'p-2',
    },
    normal: {
      container: 'max-w-[200px]',
      header: 'pl-2',
      title: 'text-base',
      cost: 'text-base',
      description: 'font-bold text-sm min-h-[2.5em]',
      padding: 'p-1.5',
    },
    small: {
      container: 'max-w-[120px]',
      header: 'pl-1',
      title: 'text-xs',
      cost: 'text-xs',
      description: 'font-bold text-[10px] min-h-[3em]',
      padding: 'p-1',
    },
  };

  return (
    <div
      className={`relative mx-auto cursor-pointer transition-all duration-200 ${
        sizeClasses[size].container
      } ${isPurchased ? 'opacity-50' : ''} ${
        onClick ? 'hover:scale-105 hover:shadow-xl' : ''
      }`}
      onClick={onClick}
    >
      {/* Card border */}
      {/* <div className='absolute inset-0 rounded-lg border-[14px] border-gray-400 z-10'></div> */}
      {/* <div className='absolute inset-0 rounded-lg bg-gradient-to-br from-gray-600 to-gray-900 p-[2px] -z-10'></div> */}

      {/* Card content */}
      <div
        className={`relative ${sizeClasses[size].padding} border-2 border-gray-900 bg-gray-600 rounded-lg`}
      >
        {/* Card name and cost */}
        <div
          className={`flex justify-between items-center bg-indigo-950 ${sizeClasses[size].header}`}
        >
          <h1 className={`text-gray-200 font-bold ${sizeClasses[size].title}`}>
            {name}
          </h1>
          <div
            className={`text-white font-extrabold ${sizeClasses[size].cost} pr-2`}
          >
            {cost}
          </div>
        </div>

        {/* Card image */}
        <div className='relative w-full aspect-square'>
          <Image
            src={imageSrc || '/images/block_stone.jpg'}
            alt={name}
            fill
            className='object-contain'
          />
        </div>

        <div className={`bg-slate-50 ${sizeClasses[size].padding}`}>
          {/* Rarity display */}
          {/* <div
            className={`text-gray-700 text-sm mb-2 ${
              rarityColors[rarity || 'common']
            }`}
          >
            {rarity?.toUpperCase() || 'COMMON'}
          </div> */}

          {/* Description tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`text-gray-800 cursor-default ${sizeClasses[size].description}`}
                >
                  {description}
                </div>
              </TooltipTrigger>
              <TooltipContent className='max-w-xs'>
                <p className='text-sm'>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
