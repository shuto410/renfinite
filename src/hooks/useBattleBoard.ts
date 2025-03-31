import { useGameStore } from '@/store';
import { calculateWinner } from '@/utils';
import { useEffect } from 'react';

export function useBattleBoard() {
  const size = useGameStore.use.size();
  const winLength = useGameStore.use.winLength();

  const squares = useGameStore.use.squares();
  const setSquares = useGameStore.use.setSquares();

  const xIsNext = useGameStore.use.xIsNext();
  const setXIsNext = useGameStore.use.setXIsNext();

  const blockedSquares = useGameStore.use.blockedSquares();
  const setBlockedSquares = useGameStore.use.setBlockedSquares();

  const squaresMetaInfo = useGameStore.use.squaresMetaInfo();
  const setSquaresMetaInfo = useGameStore.use.setSquaresMetaInfo();

  const lastPlacedPosition = useGameStore.use.lastPlacedPosition();

  const playerRenCount = useGameStore.use.playerRenCount();
  const cpuRenCount = useGameStore.use.cpuRenCount();
  const setPlayerRenCount = useGameStore.use.setPlayerRenCount();
  const setCpuRenCount = useGameStore.use.setCpuRenCount();

  const finalWinner = useGameStore.use.finalWinner();
  const setFinalWinner = useGameStore.use.setFinalWinner();

  const playerHitPoints = useGameStore.use.playerHitPoints();
  const cpuHitPoints = useGameStore.use.cpuHitPoints();
  const setPlayerHitPoints = useGameStore.use.setPlayerHitPoints();
  const setCpuHitPoints = useGameStore.use.setCpuHitPoints();

  const { winner, completedRen } = calculateWinner(squares, size, winLength);

  // 蓮が完成したら石を削除し、プレイヤーのカウントを増やす
  useEffect(() => {
    if (completedRen && completedRen.length > 0) {
      // 完成した連の所有者を確認（最初の石の所有者）
      const renOwner = squares[completedRen[0]];
      const totalRenAttackPower = completedRen.reduce((acc, position) => {
        return acc + (squaresMetaInfo[position].attackPower ?? 0);
      }, 0);

      // 少し遅延を入れて、プレイヤーが蓮の完成を確認できるようにする
      const timer = setTimeout(() => {
        const newSquares = [...squares];
        const newSquaresMetaInfo = [...squaresMetaInfo];
        // 蓮を構成する石を削除
        completedRen.forEach((position) => {
          newSquares[position] = null;
          newSquaresMetaInfo[position] = { attackPower: null };
        });
        setSquares(newSquares);
        setSquaresMetaInfo(newSquaresMetaInfo);

        // 対応するプレイヤーの連カウントを増やす
        if (renOwner === 'X') {
          const newCount = playerRenCount + 1;
          setPlayerRenCount(newCount);
          const newCpuHitPoints = cpuHitPoints - totalRenAttackPower;
          setCpuHitPoints(newCpuHitPoints > 0 ? newCpuHitPoints : 0);

          // 勝利条件を確認
          if (newCpuHitPoints <= 0) {
            setFinalWinner('X');
          }
        } else if (renOwner === 'O') {
          const newCount = cpuRenCount + 1;
          setCpuRenCount(newCount);
          const newPlayerHitPoints = playerHitPoints - totalRenAttackPower;
          setPlayerHitPoints(newPlayerHitPoints > 0 ? newPlayerHitPoints : 0);

          // 勝利条件を確認
          if (newPlayerHitPoints <= 0) {
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
    lastPlacedPosition,
    winner,
    playerRenCount,
    cpuRenCount,
    finalWinner,
    blockedSquares,
    setXIsNext,
  };
}
