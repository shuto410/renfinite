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

  // Remove stones and increase player count when ren is completed
  useEffect(() => {
    if (completedRen && completedRen.length > 0 && winner) {
      // winner is determined as 'X' or 'O'
      const totalRenAttackPower = completedRen.reduce((acc, position) => {
        return acc + (squaresMetaInfo[position].attackPower ?? 0);
      }, 0);

      // Add slight delay so player can confirm ren completion
      const timer = setTimeout(() => {
        const newSquares = [...squares];
        const newSquaresMetaInfo = [...squaresMetaInfo];
        // Remove stones that form the ren
        completedRen.forEach((position) => {
          newSquares[position] = null;
          newSquaresMetaInfo[position] = { attackPower: null };
        });
        setSquares(newSquares);
        setSquaresMetaInfo(newSquaresMetaInfo);

        // Increase ren count for corresponding player
        if (winner === 'X') {
          const newCount = playerRenCount + 1;
          setPlayerRenCount(newCount);
          const newCpuHitPoints = cpuHitPoints - totalRenAttackPower;
          setCpuHitPoints(newCpuHitPoints > 0 ? newCpuHitPoints : 0);

          // Check victory condition
          if (newCpuHitPoints <= 0) {
            setFinalWinner('X');
          }
        } else if (winner === 'O') {
          const newCount = cpuRenCount + 1;
          setCpuRenCount(newCount);
          const newPlayerHitPoints = playerHitPoints - totalRenAttackPower;
          setPlayerHitPoints(newPlayerHitPoints > 0 ? newPlayerHitPoints : 0);

          // Check victory condition
          if (newPlayerHitPoints <= 0) {
            setFinalWinner('O');
          }
        }
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedRen, winner, squares, playerRenCount, cpuRenCount]);

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
