import { type ReactNode } from 'react';
import Square from './Square';
import { SquareMetaInfo } from '@/store/battleBoard';

interface BoardProps {
  size: number;
  squares: ('X' | 'O' | null)[];
  squaresMetaInfo: SquareMetaInfo[];
  blockedSquares: ('X' | 'O' | null)[]; // どちらがブロックしたかを記録
  lastPlacedPosition: number | null; // 追加
  onSquareClick: (index: number) => void;
}

export default function Board({
  size,
  squares,
  squaresMetaInfo,
  blockedSquares,
  lastPlacedPosition,
  onSquareClick,
}: BoardProps): ReactNode {
  function renderBoard() {
    const rows = [];
    for (let i = 0; i < size; i++) {
      const cells = [];
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        cells.push(
          <Square
            key={index}
            value={squares[index]}
            attackPower={squaresMetaInfo[index].attackPower}
            blockedBy={blockedSquares[index]}
            onSquareClick={() => onSquareClick(index)}
            isLastPlaced={lastPlacedPosition === index}
          />,
        );
      }
      rows.push(
        <div key={i} className='flex'>
          {cells}
        </div>,
      );
    }
    return rows;
  }

  return (
    <div className='border-2 border-gray-800 rounded-lg overflow-hidden'>
      {renderBoard()}
    </div>
  );
}
