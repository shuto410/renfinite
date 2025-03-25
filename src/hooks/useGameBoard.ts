import { useGameStore } from '@/store';
import { calculateWinner } from '@/utils';
import { useEffect } from 'react';

const REQUIRED_REN_TO_WIN = 3;

export function useGameBoard() {
  const size = useGameStore.use.size();
  const winLength = useGameStore.use.winLength();

  const squares = useGameStore.use.squares();
  const setSquares = useGameStore.use.setSquares();

  const xIsNext = useGameStore.use.xIsNext();
  const setXIsNext = useGameStore.use.setXIsNext();

  const blockedSquares = useGameStore.use.blockedSquares();
  const setBlockedSquares = useGameStore.use.setBlockedSquares();

  const lastPlacedPosition = useGameStore.use.lastPlacedPosition();

  const playerRenCount = useGameStore.use.playerRenCount();
  const cpuRenCount = useGameStore.use.cpuRenCount();
  const setPlayerRenCount = useGameStore.use.setPlayerRenCount();
  const setCpuRenCount = useGameStore.use.setCpuRenCount();

  const finalWinner = useGameStore.use.finalWinner();
  const setFinalWinner = useGameStore.use.setFinalWinner();

  const { winner, completedRen } = calculateWinner(squares, size, winLength);

  // 蓮が完成したら石を削除し、プレイヤーのカウントを増やす
  useEffect(() => {
    if (completedRen && completedRen.length > 0) {
      // 完成した連の所有者を確認（最初の石の所有者）
      const renOwner = squares[completedRen[0]];

      // 少し遅延を入れて、プレイヤーが蓮の完成を確認できるようにする
      const timer = setTimeout(() => {
        const newSquares = [...squares];
        // 蓮を構成する石を削除
        completedRen.forEach((position) => {
          newSquares[position] = null;
        });
        setSquares(newSquares);

        // 対応するプレイヤーの連カウントを増やす
        if (renOwner === 'X') {
          const newCount = playerRenCount + 1;
          setPlayerRenCount(newCount);

          // 勝利条件を確認
          if (newCount >= REQUIRED_REN_TO_WIN) {
            setFinalWinner('X');
          }
        } else if (renOwner === 'O') {
          const newCount = cpuRenCount + 1;
          setCpuRenCount(newCount);

          // 勝利条件を確認
          if (newCount >= REQUIRED_REN_TO_WIN) {
            setFinalWinner('O');
          }
        }
      }, 500); // 500ミリ秒の遅延

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedRen, squares, playerRenCount, cpuRenCount]);

  return {
    xIsNext,
    setXIsNext,
    squares,
    setSquares,
    size,
    lastPlacedPosition,
    winner,
    completedRen,
    playerRenCount,
    cpuRenCount,
    finalWinner,
    blockedSquares,
    setPlayerRenCount,
    setCpuRenCount,
    setBlockedSquares,
    setFinalWinner,
  };
}
