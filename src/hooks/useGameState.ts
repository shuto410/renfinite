import type { Magic } from '@/types/game';
import { useCPUOpponent } from './useCPUOpponent';
import {
  CPU_INITIAL_DECK,
  PLAYER_INITIAL_DECK,
  INITIAL_MANA,
  INITIAL_HAND_SIZE,
} from '@/constants/decks';
import { MAGIC_CARDS } from '@/constants/decks';
import { useGameStore } from '@/store';
import { useMagicSystem } from './useMagicSystem';
import { useGameBoard } from './useGameBoard';

// 常に使用可能な汎用魔法カード
const GENERIC_MAGIC: Magic = {
  ...MAGIC_CARDS.normal,
  cost: 1, // 通常の石より少し高いコスト
  name: 'Basic Stone',
  description: 'Place a stone without any special effect',
  id: 'generic-stone',
};

// 勝利に必要な連の数
const REQUIRED_REN_TO_WIN = 3;

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

export function useGameState() {
  const addMoveRecord = useGameStore.use.addMoveRecord();
  const size = useGameStore.use.size();
  const setSize = useGameStore.use.setSize();
  const winLength = useGameStore.use.winLength();
  const setWinLength = useGameStore.use.setWinLength();
  const squares = useGameStore.use.squares();
  const setSquares = useGameStore.use.setSquares();
  const squaresMetaInfo = useGameStore.use.squaresMetaInfo();
  const isCPUMode = useGameStore.use.isCPUMode();
  const setIsCPUMode = useGameStore.use.setIsCPUMode();
  const cpuLevel = useGameStore.use.cpuLevel();
  const setCPULevel = useGameStore.use.setCPULevel();
  const placePiece = useGameStore.use.placePiece();
  const endTurn = useGameStore.use.endTurn();
  const playerHitPoints = useGameStore.use.playerHitPoints();
  const cpuHitPoints = useGameStore.use.cpuHitPoints();

  const {
    winner,
    xIsNext,
    playerRenCount,
    cpuRenCount,
    finalWinner,
    lastPlacedPosition,
    blockedSquares,
    setXIsNext,
    setFinalWinner,
    setBlockedSquares,
    setPlayerRenCount,
    setCpuRenCount,
  } = useGameBoard();

  const {
    playerState,
    cpuState,
    selectedMagic,
    setPlayerDeck,
    setCpuDeck,
    setPlayerHand,
    setCpuHand,
    setPlayerMana,
    setCpuMana,
    setSelectedMagic,
    castMagic,
  } = useMagicSystem();

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

  function handleClick(position: number) {
    console.log('handleClick: ', position);
    const currentPlayer = xIsNext ? 'X' : 'O';
    if (finalWinner || winner) return;
    if ((isCPUMode && !xIsNext) || !selectedMagic) return;

    if (selectedMagic.type !== 'destroy' && selectedMagic.type !== 'block') {
      if (
        blockedSquares[position] &&
        blockedSquares[position] !== currentPlayer
      ) {
        return;
      }
    }

    console.log('handleClick: ', position, selectedMagic);

    const state = xIsNext ? playerState : cpuState;
    const isGenericMagic = selectedMagic.id === GENERIC_MAGIC.id;

    // マナが足りない場合は処理しない
    if (state.mana < selectedMagic.cost) return;

    // replace魔法の場合は、相手の石がある場所のみ選択可能
    if (selectedMagic.type === 'replace') {
      if (!squares[position] || squares[position] === currentPlayer) return;
    } else if (
      selectedMagic.type !== 'destroy' &&
      selectedMagic.type !== 'block'
    ) {
      if (squares[position]) return;
    }

    // 汎用魔法カードの場合は手札から削除しない
    if (isGenericMagic) {
      // マナだけ消費
      const setMana = xIsNext ? setPlayerMana : setCpuMana;
      setMana(state.mana - selectedMagic.cost);

      // 効果を適用（通常の石を置く）
      placePiece(position);
    } else {
      // 通常の魔法カードを使用
      castMagic(selectedMagic, position);
    }

    addMoveRecord(currentPlayer, position, selectedMagic);
    setSelectedMagic(null);
  }

  function handleCPUMove(position: number, magic: Magic | null) {
    console.log('handleCPUMove: ', position, magic);
    if (magic) {
      castMagic(magic, position);
    } else {
      placePiece(position);
    }
    addMoveRecord(xIsNext ? 'X' : 'O', position, magic);
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
    setPlayerMana(INITIAL_MANA);
    setCpuMana(INITIAL_MANA);
  }

  function resetGame() {
    setSquares(Array(size * size).fill(null));
    setBlockedSquares(Array(size * size).fill(null));
    setSelectedMagic(null);
    setXIsNext(true);
    setPlayerRenCount(0);
    setCpuRenCount(0);
    setFinalWinner(null);

    // 新しい初期手札とデッキを生成
    const newPlayerInitialDraw = generateInitialHand(PLAYER_INITIAL_DECK);
    const newCpuInitialDraw = generateInitialHand(CPU_INITIAL_DECK);

    // デッキと手札をリセット
    setPlayerDeck(newPlayerInitialDraw.remainingDeck);
    setPlayerHand(newPlayerInitialDraw.hand);
    setCpuDeck(newCpuInitialDraw.remainingDeck);
    setCpuHand(newCpuInitialDraw.hand);
    setPlayerMana(INITIAL_MANA);
    setCpuMana(INITIAL_MANA);
  }

  return {
    // State
    size,
    winLength,
    squares,
    squaresMetaInfo,
    xIsNext,
    isCPUMode,
    cpuLevel,
    blockedSquares,
    winner: finalWinner || winner,
    lastPlacedPosition,
    playerHand: playerState.hand,
    cpuHand: cpuState.hand,
    selectedMagic,
    playerMana: playerState.mana,
    cpuMana: cpuState.mana,
    playerRenCount,
    cpuRenCount,
    requiredRenToWin: REQUIRED_REN_TO_WIN,
    playerDeckCount: playerState.deck.length,
    cpuDeckCount: cpuState.deck.length,
    playerDiscardCount: playerState.discardPile.length,
    cpuDiscardCount: cpuState.discardPile.length,
    playerHitPoints,
    cpuHitPoints,

    // Event handlers
    handleClick,
    handleSizeChange,
    handleWinLengthChange,
    handleCPULevelChange,
    toggleCPUMode,
    resetGame,
    endTurn,
    setSelectedMagic,
  };
}
