import React from 'react';
import { RouteType, Stage, StageType } from '@/store/stageRoute';

interface RouteSelectionProps {
  stages: { [k in RouteType]?: Stage };
  onSelect: (routeType: RouteType) => void;
}

const getRouteButtonStyle = (type: StageType) => {
  switch (type) {
    case 'battle':
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

const getRouteLabel = (type: StageType) => {
  switch (type) {
    case 'battle':
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
  stages,
  onSelect,
}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-xl'>
        <h2 className='text-xl font-bold text-white mb-4'>
          進むルートを選択してください
        </h2>
        <div className='flex gap-4 justify-center'>
          {Object.keys(stages).map((routeType) => (
            <button
              key={routeType}
              onClick={() => onSelect(routeType as RouteType)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors text-white ${getRouteButtonStyle(
                stages[routeType as RouteType]!.type,
              )}`}
            >
              {getRouteLabel(stages[routeType as RouteType]!.type)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
