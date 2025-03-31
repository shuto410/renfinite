import React from 'react';
import { NodeType } from '@/types/game';

interface RouteSelectionProps {
  routes: {
    type: NodeType;
    position: { x: number; y: number };
  }[];
  onSelect: (routeIndex: number) => void;
}

const getRouteButtonStyle = (type: NodeType) => {
  switch (type) {
    case 'enemy':
      return 'bg-red-600 hover:bg-red-700';
    case 'shop':
      return 'bg-yellow-600 hover:bg-yellow-700';
    case 'event':
      return 'bg-green-600 hover:bg-green-700';
    case 'boss':
      return 'bg-purple-600 hover:bg-purple-700';
    default:
      return 'bg-gray-600 hover:bg-gray-700';
  }
};

const getRouteLabel = (type: NodeType) => {
  switch (type) {
    case 'enemy':
      return '敵との戦闘';
    case 'shop':
      return 'ショップ';
    case 'event':
      return 'イベント';
    case 'boss':
      return 'ボス戦';
    default:
      return '不明';
  }
};

export const RouteSelection: React.FC<RouteSelectionProps> = ({
  routes,
  onSelect,
}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-xl'>
        <h2 className='text-xl font-bold text-white mb-4'>
          進むルートを選択してください
        </h2>
        <div className='flex gap-4'>
          {routes.map((route, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors text-white ${getRouteButtonStyle(
                route.type,
              )}`}
            >
              {getRouteLabel(route.type)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
