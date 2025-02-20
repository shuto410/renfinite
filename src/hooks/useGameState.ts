import { useState } from 'react';
import { calculateWinner } from '@/utils';
import { applyBlockEffect, getValidBlockDirections } from '../utils/effects';
import type { BlockDirection } from '@/types/game';
import { useCPUOpponent } from './useCPUOpponent';

export function useGameState(initialSize: number = 9, initialWinLength: number = 5) {
  const [size, setSize] = useState(initialSize);
  const [winLength, setWinLength] = useState(initialWinLength);
  const [squares, setSquares] = useState<('X' | 'O' | null)[]>(Array(size * size).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [isCPUMode, setIsCPUMode] = useState(true);
  const [cpuLevel, setCPULevel] = useState(1);
  const [playerMana, setPlayerMana] = useState(0);
  const [cpuMana, setCpuMana] = useState(1);
  const [blockedSquares, setBlockedSquares] = useState<('X' | 'O' | null)[]>(Array(size * size).fill(null));
  const [isBlockEffectActive, setIsBlockEffectActive] = useState<BlockDirection>(null);
  const [isReplaceStoneActive, setIsReplaceStoneActive] = useState(false);

  const winner = calculateWinner(squares, size, winLength);

  function handleClick(i: number) {
    const currentPlayer = xIsNext ? 'X' : 'O';
    if (winner || (blockedSquares[i] && blockedSquares[i] !== currentPlayer)) return;
    if (isCPUMode && !xIsNext) return;

    if (isReplaceStoneActive) {
      if (squares[i] && squares[i] !== currentPlayer) {
        const nextSquares = squares.slice();
        nextSquares[i] = currentPlayer;
        setSquares(nextSquares);
        setIsReplaceStoneActive(false);
        if (xIsNext) {
          setPlayerMana(prev => prev - 2);
        } else {
          setCpuMana(prev => prev - 2);
        }
        setXIsNext(!xIsNext);
      }
      return;
    }

    if (squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    setSquares(nextSquares);

    if (isBlockEffectActive) {
      const blockIndex = applyBlockEffect(i, isBlockEffectActive, size);
      
      if (blockIndex !== null) {
        const newBlockedSquares = blockedSquares.slice();
        newBlockedSquares[blockIndex] = currentPlayer;
        setBlockedSquares(newBlockedSquares);
      }

      setIsBlockEffectActive(null);
      if (xIsNext) {
        setPlayerMana(prev => prev - 1);
      } else {
        setCpuMana(prev => prev - 1);
      }
    } else {
      if (xIsNext) {
        setPlayerMana(prev => prev + 1);
      } else if (!isCPUMode) {
        setCpuMana(prev => prev + 1);
      }
    }

    setXIsNext(!xIsNext);
  }

  function handleCPUMove(position: number, spType: 'block' | 'replace' | null) {
    const currentPlayer = 'O';
    
    if (spType === 'replace' && squares[position] === 'X') {
      const nextSquares = squares.slice();
      nextSquares[position] = currentPlayer;
      setSquares(nextSquares);
      setCpuMana(prev => prev - 2);
    } else {
      if (spType === 'block') {
        const validDirections = getValidBlockDirections(position, size, squares);
        if (validDirections.length > 0) {
          const randomDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
          const blockIndex = applyBlockEffect(position, randomDirection, size);
          
          if (blockIndex !== null) {
            const newBlockedSquares = blockedSquares.slice();
            newBlockedSquares[blockIndex] = currentPlayer;
            setBlockedSquares(newBlockedSquares);
            setCpuMana(prev => prev - 1);
          }
        }
      }

      const nextSquares = squares.slice();
      nextSquares[position] = currentPlayer;
      setSquares(nextSquares);
      
      if (spType === null) {
        setCpuMana(prev => prev + 1);
      }
    }
    setXIsNext(true);
  }

  function handleSizeChange(newSize: number) {
    setSize(newSize);
    setSquares(Array(newSize * newSize).fill(null));
    setXIsNext(true);
    if (winLength > newSize) {
      setWinLength(newSize);
    }
    resetMana();
  }

  function handleWinLengthChange(length: number) {
    setWinLength(length);
    setSquares(Array(size * size).fill(null));
    setXIsNext(true);
    resetMana();
  }

  function handleCPULevelChange(level: number) {
    setCPULevel(level);
    resetGame();
  }

  function toggleCPUMode() {
    setIsCPUMode(!isCPUMode);
    resetGame();
  }

  function resetMana() {
    setPlayerMana(0);
    setCpuMana(1);
  }

  function resetGame() {
    setSquares(Array(size * size).fill(null));
    setBlockedSquares(Array(size * size).fill(null));
    setIsBlockEffectActive(null);
    setXIsNext(true);
    resetMana();
  }

  function activateBlockEffect(direction: BlockDirection) {
    if ((xIsNext && playerMana >= 1) || (!xIsNext && cpuMana >= 1)) {
      setIsBlockEffectActive(direction);
    }
  }

  function activateReplaceSt() {
    if ((xIsNext && playerMana >= 2) || (!xIsNext && cpuMana >= 2)) {
      setIsReplaceStoneActive(true);
    }
  }

  const status = winner 
    ? `Winner: ${winner}` 
    : squares.every(square => square) 
      ? "Game is a draw!" 
      : `Next player: ${xIsNext ? 'X' : 'O'}${!xIsNext && isCPUMode ? ' (CPU thinking...)' : ''}`;

  const manaStatus = `Mana - X: ${playerMana} | O: ${cpuMana}`;

  useCPUOpponent({
    squares,
    blockedSquares,
    size,
    winLength,
    isCPUMode,
    cpuLevel,
    isPlayerTurn: xIsNext,
    winner,
    onMove: handleCPUMove,
    cpuMana,
  });

  return {
    // State
    size,
    winLength,
    squares,
    xIsNext,
    isCPUMode,
    cpuLevel,
    playerMana,
    cpuMana,
    blockedSquares,
    isBlockEffectActive,
    isReplaceStoneActive,
    winner,

    // Event handlers
    handleClick,
    handleSizeChange,
    handleWinLengthChange,
    handleCPULevelChange,
    toggleCPUMode,
    activateBlockEffect,
    activateReplaceSt,
    resetGame,
  };
} 