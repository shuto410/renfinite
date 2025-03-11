import React, { useState } from 'react';
import { Magic } from '@/types/game';

interface CellEvaluation {
  position: number;
  myScore: number;
  oppScore: number;
  centerBonus: number;
  totalScore: number;
}

interface DebugOverlayProps {
  size: number;
  squares: ('X' | 'O' | null)[];
  blockedSquares: ('X' | 'O' | null)[];
  evaluateCell: (
    squares: ('X' | 'O' | null)[],
    blockedSquares: ('X' | 'O' | null)[],
    position: number,
  ) => {
    totalScore: number;
    myScore: number;
    oppScore: number;
    centerBonus: number;
  };
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  size,
  squares,
  blockedSquares,
  evaluateCell,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // 全セルの評価を計算
  const evaluations: CellEvaluation[] = [];
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] || (blockedSquares[i] && blockedSquares[i] !== 'O'))
      continue;
    const evaluation = evaluateCell(squares, blockedSquares, i);
    if (evaluation.totalScore === -1) continue; // 無効な位置はスキップ

    evaluations.push({
      position: i,
      myScore: evaluation.myScore,
      oppScore: evaluation.oppScore,
      centerBonus: evaluation.centerBonus,
      totalScore: evaluation.totalScore,
    });
  }

  // スコアの絶対値で降順ソート
  const sortedEvaluations = [...evaluations].sort(
    (a, b) => Math.abs(b.totalScore) - Math.abs(a.totalScore),
  );

  // 位置からスコアを取得するマップを作成
  const positionToEval = new Map(
    evaluations.map((evaluation) => [evaluation.position, evaluation]),
  );

  // スコアの正規化（色分け用）
  const maxAbsScore = Math.max(
    ...evaluations.map((evaluation) => Math.abs(evaluation.totalScore)),
  );

  // スコアに基づいて背景色を決定
  const getBackgroundColor = (score: number) => {
    const normalizedScore = score / maxAbsScore;
    const intensity = Math.min(Math.abs(normalizedScore) * 255, 255);
    if (score > 0) {
      return `rgba(0, 0, ${intensity}, 0.5)`;
    } else {
      return `rgba(${intensity}, 0, 0, 0.5)`;
    }
  };

  // スコアに基づいてテキスト色を決定
  const getTextColor = (score: number) => {
    const normalizedScore = Math.abs(score / maxAbsScore);
    return normalizedScore > 0.5 ? 'white' : 'black';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className='fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded'
      >
        Show Debug Info
      </button>
    );
  }

  return (
    <div className='fixed inset-0 bg-white bg-opacity-90 p-4 overflow-auto'>
      <button
        onClick={() => setIsVisible(false)}
        className='absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded'
      >
        Close
      </button>

      <h2 className='text-xl font-bold mb-4'>CPU Evaluation Debug</h2>

      {/* Grid View */}
      <div className='mb-8'>
        <h3 className='text-lg font-semibold mb-2'>Grid View</h3>
        <div
          className='grid gap-1'
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            width: 'fit-content',
          }}
        >
          {Array(size * size)
            .fill(null)
            .map((_, i) => {
              const evaluation = positionToEval.get(i);
              return (
                <div
                  key={i}
                  className='w-12 h-12 border flex items-center justify-center relative'
                  style={{
                    backgroundColor: evaluation
                      ? getBackgroundColor(evaluation.totalScore)
                      : 'transparent',
                  }}
                >
                  {evaluation && (
                    <span
                      className='text-xs'
                      style={{ color: getTextColor(evaluation.totalScore) }}
                      title={`Total: ${evaluation.totalScore.toFixed(0)}`}
                    >
                      {evaluation.totalScore.toFixed(0)}
                    </span>
                  )}
                  {/* Top 10 positions marker */}
                  {sortedEvaluations
                    .slice(0, 10)
                    .some((e) => e.position === i) && (
                    <div className='absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full' />
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Legend */}
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Legend</h3>
        <div className='flex gap-4'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-blue-500 opacity-50' />
            <span>High Attack Value</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-red-500 opacity-50' />
            <span>High Defense Value</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-yellow-400 rounded-full' />
            <span>Top 10 Moves</span>
          </div>
        </div>
      </div>

      {/* List View */}
      <div>
        <h3 className='text-lg font-semibold mb-2'>Detailed Evaluations</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {sortedEvaluations.slice(0, 15).map((evaluation) => (
            <div
              key={evaluation.position}
              className='p-2 rounded'
              style={{
                backgroundColor: getBackgroundColor(evaluation.totalScore),
                color: getTextColor(evaluation.totalScore),
              }}
            >
              <div className='font-semibold'>
                Position: ({Math.floor(evaluation.position / size)},{' '}
                {evaluation.position % size})
              </div>
              <div>Total Score: {evaluation.totalScore.toFixed(1)}</div>
              <div>Attack Score: {evaluation.myScore.toFixed(1)}</div>
              <div>Defense Score: {evaluation.oppScore.toFixed(1)}</div>
              <div>Center Bonus: {evaluation.centerBonus.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
