import { useState, useEffect } from 'react';
import { calculateWinner } from '@/utils';
import {
  applyBlockEffect,
  getValidBlockDirections,
  applyCrossDestroy,
} from '../utils/effects';
import type { BlockDirection, Magic, Player } from '@/types/game';
import { useCPUOpponent } from './useCPUOpponent';
import {
  CPU_INITIAL_DECK,
  PLAYER_INITIAL_DECK,
  MAX_MANA,
  MANA_REGENERATION_PER_TURN,
  INITIAL_MANA,
  INITIAL_HAND_SIZE,
  MAX_HAND_SIZE,
} from '@/constants/decks';
import { MAGIC_CARDS } from '@/constants/decks';

// 常に使用可能な汎用魔法カード
const GENERIC_MAGIC: Magic = {
  ...MAGIC_CARDS.normal,
  cost: 1, // 通常の石より少し高いコスト
  name: 'Basic Stone',
  description: 'Place a stone without any special effect',
  id: 'generic-stone',
};

// 初期手札を生成する関数
function generateInitialHand(deck: Magic[]): {
  hand: Magic[];
  remainingDeck: Magic[];
} {
  const deckCopy = [...deck];
  const hand: Magic[] = [];

  for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
    if (deckCopy.length > 0) {
      const randomIndex = Math.floor(Math.random() * deckCopy.length);
      const drawnCard = deckCopy[randomIndex];
      deckCopy.splice(randomIndex, 1);
      hand.push(drawnCard);
    }
  }

  return { hand, remainingDeck: deckCopy };
}

export function useGameState(
  initialSize: number = 9,
  initialWinLength: number = 5,
) {
  // 初期手札とデッキを生成
  const playerInitialDraw = generateInitialHand(PLAYER_INITIAL_DECK);
  const cpuInitialDraw = generateInitialHand(CPU_INITIAL_DECK);

  const [size, setSize] = useState(initialSize);
  const [winLength, setWinLength] = useState(initialWinLength);
  const [squares, setSquares] = useState<('X' | 'O' | null)[]>(
    Array(size * size).fill(null),
  );
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [isCPUMode, setIsCPUMode] = useState(true);
  const [cpuLevel, setCPULevel] = useState(1);
  const [blockedSquares, setBlockedSquares] = useState<('X' | 'O' | null)[]>(
    Array(size * size).fill(null),
  );
  const [lastPlacedPosition, setLastPlacedPosition] = useState<number | null>(
    null,
  );
  const [playerState, setPlayerState] = useState<Player>({
    deck: playerInitialDraw.remainingDeck,
    hand: playerInitialDraw.hand,
    mana: INITIAL_MANA,
  });
  const [cpuState, setCpuState] = useState<Player>({
    deck: cpuInitialDraw.remainingDeck,
    hand: cpuInitialDraw.hand,
    mana: INITIAL_MANA,
  });
  const [selectedMagic, setSelectedMagic] = useState<Magic | null>(null);

  const winner = calculateWinner(squares, size, winLength);

  // 共通の石を置くロジック
  function placePiece(
    position: number,
    player: 'X' | 'O',
    spType: 'block' | 'replace' | 'crossDestroy' | null,
    blockDirection?: BlockDirection,
  ) {
    const nextSquares = squares.slice();
    nextSquares[position] = player;
    setSquares(nextSquares);

    // 特殊効果の処理
    if (spType === 'block' && blockDirection) {
      const blockIndex = applyBlockEffect(position, blockDirection, size);
      if (blockIndex !== null) {
        const newBlockedSquares = blockedSquares.slice();
        newBlockedSquares[blockIndex] = player;
        setBlockedSquares(newBlockedSquares);
      }
    } else if (spType === 'crossDestroy') {
      const targets = applyCrossDestroy(position, size);
      const newSquares = nextSquares.slice();
      targets.forEach((pos) => {
        newSquares[pos] = null;
      });
      setSquares(newSquares);
    }

    setLastPlacedPosition(position);
    setXIsNext(!xIsNext);
  }

  function handleClick(position: number) {
    const currentPlayer = xIsNext ? 'X' : 'O';
    if (
      winner ||
      (blockedSquares[position] && blockedSquares[position] !== currentPlayer)
    )
      return;
    if (isCPUMode && !xIsNext) return;

    // 選択された魔法がある場合
    if (selectedMagic) {
      const state = xIsNext ? playerState : cpuState;
      const isGenericMagic = selectedMagic.id === GENERIC_MAGIC.id;

      // マナが足りない場合は処理しない
      if (state.mana < selectedMagic.cost) return;

      // replace魔法の場合は、相手の石がある場所のみ選択可能
      if (selectedMagic.type === 'replace') {
        if (!squares[position] || squares[position] === currentPlayer) return;
      } else if (selectedMagic.type === 'normal') {
        // normal魔法は空いているマスのみ選択可能
        if (squares[position]) return;
      } else {
        // その他の魔法は空いているマスのみ選択可能
        if (squares[position]) return;
      }

      // 汎用魔法カードの場合は手札から削除しない
      if (isGenericMagic) {
        // マナだけ消費
        const setState = xIsNext ? setPlayerState : setCpuState;
        setState({
          ...state,
          mana: state.mana - selectedMagic.cost,
        });

        // 効果を適用（通常の石を置く）
        placePiece(position, currentPlayer, null);
      } else {
        // 通常の魔法カードを使用
        useMagic(selectedMagic, position);
      }

      setSelectedMagic(null);
    }
    // 魔法が選択されていない場合は何もしない
  }

  function handleCPUMove(position: number, magic: Magic | null) {
    if (magic) {
      useMagic(magic, position);
    } else {
      placePiece(position, 'O', null);
    }
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
    setPlayerState((prev) => ({ ...prev, mana: INITIAL_MANA }));
    setCpuState((prev) => ({ ...prev, mana: INITIAL_MANA }));
  }

  function resetGame() {
    setSquares(Array(size * size).fill(null));
    setBlockedSquares(Array(size * size).fill(null));
    setSelectedMagic(null);
    setXIsNext(true);

    // 新しい初期手札とデッキを生成
    const newPlayerInitialDraw = generateInitialHand(PLAYER_INITIAL_DECK);
    const newCpuInitialDraw = generateInitialHand(CPU_INITIAL_DECK);

    // デッキと手札をリセット
    setPlayerState({
      deck: newPlayerInitialDraw.remainingDeck,
      hand: newPlayerInitialDraw.hand,
      mana: INITIAL_MANA,
    });
    setCpuState({
      deck: newCpuInitialDraw.remainingDeck,
      hand: newCpuInitialDraw.hand,
      mana: INITIAL_MANA,
    });
  }

  // 魔法を使用
  function useMagic(magic: Magic, position: number) {
    const isPlayer = xIsNext;
    const state = isPlayer ? playerState : cpuState;
    const setState = isPlayer ? setPlayerState : setCpuState;

    if (state.mana >= magic.cost && position >= 0) {
      // 手札から削除
      const newHand = state.hand.filter((m) => m !== magic);
      setState({
        ...state,
        hand: newHand,
        mana: state.mana - magic.cost,
      });

      // 効果を適用
      const currentPlayer = isPlayer ? 'X' : 'O';
      switch (magic.type) {
        case 'blockUp':
          placePiece(position, currentPlayer, 'block', 'up');
          break;
        case 'blockRight':
          placePiece(position, currentPlayer, 'block', 'right');
          break;
        case 'blockDown':
          placePiece(position, currentPlayer, 'block', 'down');
          break;
        case 'blockLeft':
          placePiece(position, currentPlayer, 'block', 'left');
          break;
        case 'replace':
          placePiece(position, currentPlayer, 'replace');
          break;
        case 'crossDestroy':
          placePiece(position, currentPlayer, 'crossDestroy');
          break;
        case 'normal':
          placePiece(position, currentPlayer, null);
          break;
      }
    }
  }

  // ターン開始時に手札を補充
  useEffect(() => {
    // 勝者がいる場合は手札を補充しない
    if (winner) return;

    // 現在のプレイヤーの手札が最大数より少ない場合に補充
    const currentState = xIsNext ? playerState : cpuState;
    if (
      currentState.hand.length < MAX_HAND_SIZE &&
      currentState.deck.length > 0
    ) {
      drawCard(xIsNext);
    }
  }, [xIsNext, winner]);

  // ターン開始時にマナを1補充
  useEffect(() => {
    // 勝者がいる場合はマナを補充しない
    if (winner) return;

    // 現在のプレイヤーのマナを補充
    if (xIsNext) {
      setPlayerState((prev) => ({
        ...prev,
        mana: Math.min(MAX_MANA, prev.mana + MANA_REGENERATION_PER_TURN),
      }));
    } else {
      setCpuState((prev) => ({
        ...prev,
        mana: Math.min(MAX_MANA, prev.mana + MANA_REGENERATION_PER_TURN),
      }));
    }
  }, [xIsNext, winner]);

  // 手札を補充
  function drawCard(isPlayer: boolean) {
    const state = isPlayer ? playerState : cpuState;
    const setState = isPlayer ? setPlayerState : setCpuState;

    if (state.hand.length < MAX_HAND_SIZE && state.deck.length > 0) {
      const randomIndex = Math.floor(Math.random() * state.deck.length);
      const drawnCard = state.deck[randomIndex];
      const newDeck = [...state.deck];
      newDeck.splice(randomIndex, 1);
      const newHand = [...state.hand, drawnCard];

      setState({
        ...state,
        deck: newDeck,
        hand: newHand,
      });
    }
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
    onMove: handleCPUMove,
    cpuMana: cpuState.mana,
    cpuHand: cpuState.hand,
  });

  return {
    // State
    size,
    winLength,
    squares,
    xIsNext,
    isCPUMode,
    cpuLevel,
    blockedSquares,
    winner,
    lastPlacedPosition,
    playerHand: playerState.hand,
    cpuHand: cpuState.hand,
    selectedMagic,
    playerMana: playerState.mana,
    cpuMana: cpuState.mana,

    // Event handlers
    handleClick,
    handleSizeChange,
    handleWinLengthChange,
    handleCPULevelChange,
    toggleCPUMode,
    resetGame,
    drawCard,
    useMagic,
    setSelectedMagic,
  };
}
