import React from 'react';
import { positionToCoordinates } from '@/utils/boardUtils';
import { Magic } from '@/types/game';
import { useGameStore } from '@/store';

export interface MoveRecord {
  player: 'X' | 'O';
  position: number;
  magic: Magic | null;
  timestamp: number;
}

interface MoveHistoryProps {
  boardSize: number;
  maxDisplayed?: number;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({
  boardSize,
  maxDisplayed = 10,
}) => {
  const moves = useGameStore((state) => state.moveRecords);

  // 最新の動きを最初に表示するために逆順にする
  const recentMoves = [...moves].reverse().slice(0, maxDisplayed);

  return (
    <div className='bg-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto'>
      <h2 className='text-xl font-bold text-black mb-3'>対戦履歴</h2>
      {recentMoves.length === 0 ? (
        <p className='text-gray-400 italic'>まだ動きはありません</p>
      ) : (
        <ul className='space-y-2'>
          {recentMoves.map((move, index) => {
            const isPlayer = move.player === 'X';
            const playerName = isPlayer ? 'プレイヤー' : 'CPU';
            const coords = positionToCoordinates(move.position, boardSize);
            // const magicName = move.magic ? move.magic.name : '通常の石';
            const magicName = move.magic?.cardType;

            return (
              <li
                key={`${move.timestamp}-${index}`}
                className={`p-2 rounded ${
                  isPlayer ? 'bg-blue-500' : 'bg-red-500'
                }`}
              >
                <div className='flex items-center'>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2  ${
                      isPlayer ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                  >
                    {move.player}
                  </div>
                  <div className='text-white'>
                    <span className='font-bold'>{playerName}</span>
                    <span> が {coords} に </span>
                    <span className='italic'>{magicName}</span>
                    <span> を置きました</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MoveHistory;
