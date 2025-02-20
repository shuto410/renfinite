'use client';
import { useState } from 'react';
import Board from './board';
import SettingButtons from './setting-buttons';
import { calculateWinner } from '@/utils';
import { useCPUOpponent } from '@/hooks/useCPUOpponent';

type BlockDirection = 'up' | 'right' | 'down' | 'left' | null;

function applyBlockEffect(
  position: number,
  direction: BlockDirection,
  size: number,
): number | null {
  let blockIndex: number | null = null;

  switch (direction) {
    case 'up':
      blockIndex = position - size;
      break;
    case 'right':
      blockIndex = position + 1;
      if (Math.floor(position / size) !== Math.floor(blockIndex / size)) blockIndex = null;
      break;
    case 'down':
      blockIndex = position + size;
      break;
    case 'left':
      blockIndex = position - 1;
      if (Math.floor(position / size) !== Math.floor(blockIndex / size)) blockIndex = null;
      break;
  }

  if (blockIndex !== null && blockIndex >= 0 && blockIndex < size * size) {
    return blockIndex;
  }
  return null;
}

function getValidBlockDirections(
  position: number,
  size: number,
  squares: ('X' | 'O' | null)[]
): BlockDirection[] {
  const directions: BlockDirection[] = ['up', 'right', 'down', 'left'];
  return directions.filter(dir => {
    const blockIndex = applyBlockEffect(position, dir, size );
    return blockIndex !== null;
  });
}

export default function Home() {
  const [size, setSize] = useState(9);
  const [winLength, setWinLength] = useState(5);
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
          const blockIndex = applyBlockEffect(position, randomDirection,  size );
          
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

  function handleCPULevelChange(level: number) {
    setCPULevel(level);
    resetGame();
  }

  useCPUOpponent({
    squares,
    blockedSquares,
    size,
    winLength,
    isCPUMode,
    cpuLevel,
    isPlayerTurn: xIsNext,
    winner,
    cpuMana,
    onMove: handleCPUMove,
  });

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
      const blockIndex = applyBlockEffect(i, isBlockEffectActive,  size );
      
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

  function toggleCPUMode() {
    setIsCPUMode(!isCPUMode);
    resetGame();
  }

  function resetMana() {
    setPlayerMana(0);
    setCpuMana(0);
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

  return (
    <div className="flex flex-col items-center p-5 font-sans min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tic Tac Toe</h1>
      
      <SettingButtons
        size={size}
        winLength={winLength}
        isCPUMode={isCPUMode}
        cpuLevel={cpuLevel}
        onSizeChange={handleSizeChange}
        onWinLengthChange={handleWinLengthChange}
        onCPUModeToggle={toggleCPUMode}
        onCPULevelChange={handleCPULevelChange}
      />

      <div className="text-xl font-semibold text-gray-700 mb-6">
        {status}
      </div>

      <div className="text-lg text-blue-600 mb-4">
        {manaStatus}
      </div>

      <div className="mb-4 flex gap-2">
        {(['up', 'right', 'down', 'left'] as const).map((direction) => (
          <button
            key={direction}
            className={`px-4 py-2 rounded-md transition-colors duration-200 
              ${isBlockEffectActive === direction
                ? 'bg-purple-500 text-white' 
                : ((xIsNext && playerMana >= 1) || (!xIsNext && cpuMana >= 1))
                  ? 'bg-purple-200 hover:bg-purple-300'
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
            onClick={() => activateBlockEffect(direction)}
            disabled={isBlockEffectActive !== null || ((xIsNext && playerMana < 1) || (!xIsNext && cpuMana < 1))}
          >
            {isBlockEffectActive === direction ? 'Block Effect Active' : `Block ${direction} (1 Mana)`}
          </button>
        ))}
        <button
          className={`px-4 py-2 rounded-md transition-colors duration-200 
            ${isReplaceStoneActive
              ? 'bg-red-500 text-white' 
              : ((xIsNext && playerMana >= 2) || (!xIsNext && cpuMana >= 2))
                ? 'bg-red-200 hover:bg-red-300'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          onClick={() => activateReplaceSt()}
          disabled={isReplaceStoneActive || ((xIsNext && playerMana < 2) || (!xIsNext && cpuMana < 2))}
        >
          {isReplaceStoneActive ? 'Replace Stone Active' : 'Replace Stone (2 Mana)'}
        </button>
      </div>

      <Board 
        size={size}
        squares={squares}
        blockedSquares={blockedSquares}
        currentPlayer={xIsNext ? 'X' : 'O'}
        onSquareClick={handleClick}
      />

      <button 
        className="mt-6 px-6 py-3 text-lg bg-green-500 text-white rounded-md
                   hover:bg-green-600 transition-colors duration-200"
        onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
}

