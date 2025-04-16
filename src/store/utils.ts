import {
  CPU_INITIAL_DECK,
  INITIAL_HAND_SIZE,
  INITIAL_MANA,
} from '@/constants/decks';
import { useGameStore } from '.';
import { Card } from '@/types/game';

export function resetBattle() {
  const setSquares = useGameStore.use.setSquares();
  const setBlockedSquares = useGameStore.use.setBlockedSquares();
  const setSelectedMagic = useGameStore.use.setSelectedMagic();
  const setXIsNext = useGameStore.use.setXIsNext();
  const setPlayerRenCount = useGameStore.use.setPlayerRenCount();
  const setCpuRenCount = useGameStore.use.setCpuRenCount();
  const setFinalWinner = useGameStore.use.setFinalWinner();
  const setPlayerHitPoints = useGameStore.use.setPlayerHitPoints();
  const setCpuHitPoints = useGameStore.use.setCpuHitPoints();
  const setPlayerDeck = useGameStore.use.setPlayerDeck();
  const setPlayerHand = useGameStore.use.setPlayerHand();
  const setCpuDeck = useGameStore.use.setCpuDeck();
  const setCpuHand = useGameStore.use.setCpuHand();
  const setPlayerMana = useGameStore.use.setPlayerMana();
  const setCpuMana = useGameStore.use.setCpuMana();
  const size = useGameStore.use.size();
  const playerDeck = useGameStore.use.deck();

  setSquares(Array(size * size).fill(null));
  setBlockedSquares(Array(size * size).fill(null));
  setSelectedMagic(null);
  setXIsNext(true);
  setPlayerRenCount(0);
  setCpuRenCount(0);
  setFinalWinner(null);
  setPlayerHitPoints(80);
  setCpuHitPoints(80);

  // 新しい初期手札とデッキを生成
  const newPlayerInitialDraw = generateInitialHand(playerDeck);
  const newCpuInitialDraw = generateInitialHand(CPU_INITIAL_DECK);

  // デッキと手札をリセット
  setPlayerDeck(newPlayerInitialDraw.remainingDeck);
  setPlayerHand(newPlayerInitialDraw.hand);
  setCpuDeck(newCpuInitialDraw.remainingDeck);
  setCpuHand(newCpuInitialDraw.hand);
  setPlayerMana(INITIAL_MANA);
  setCpuMana(INITIAL_MANA);
}

// 初期手札を生成する関数
function generateInitialHand(deck: Card[]): {
  hand: Card[];
  remainingDeck: Card[];
} {
  const deckCopy = [...deck];
  const hand: Card[] = [];

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
