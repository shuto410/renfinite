import {
  MANA_REGENERATION_PER_TURN,
  MAX_HAND_SIZE,
  MAX_MANA,
} from '@/constants/decks';
import { useGameStore } from '@/store';
import { Magic } from '@/types/game';
import { useEffect } from 'react';

export function useMagicSystem() {
  const playerState = useGameStore.use.playerState();
  const cpuState = useGameStore.use.cpuState();
  const selectedMagic = useGameStore.use.selectedMagic();
  const setPlayerDeck = useGameStore.use.setPlayerDeck();
  const setCpuDeck = useGameStore.use.setCpuDeck();
  const setPlayerHand = useGameStore.use.setPlayerHand();
  const setCpuHand = useGameStore.use.setCpuHand();
  const setPlayerMana = useGameStore.use.setPlayerMana();
  const setCpuMana = useGameStore.use.setCpuMana();
  const setSelectedMagic = useGameStore.use.setSelectedMagic();
  const addToPlayerDiscard = useGameStore.use.addToPlayerDiscard();
  const addToCpuDiscard = useGameStore.use.addToCpuDiscard();
  const reshufflePlayerDiscard = useGameStore.use.reshufflePlayerDiscard();
  const reshuffleCpuDiscard = useGameStore.use.reshuffleCpuDiscard();
  const finalWinner = useGameStore.use.finalWinner();
  const xIsNext = useGameStore.use.xIsNext();
  const playerRenCount = useGameStore.use.playerRenCount();
  const cpuRenCount = useGameStore.use.cpuRenCount();

  const placePiece = useGameStore.use.placePiece();
  const placeBlock = useGameStore.use.placeBlock();
  const destroyPiece = useGameStore.use.destroyPiece();
  const crossDestroyAndPlace = useGameStore.use.crossDestroyAndPlace();
  const allDestroyAndPlace = useGameStore.use.allDestroyAndPlace();

  // ターン開始時に手札を補充
  useEffect(() => {
    // 勝者がいる場合は手札を補充しない
    if (finalWinner) return;

    // 現在のプレイヤーの手札が最大数より少ない場合に補充
    const currentState = xIsNext ? playerState : cpuState;
    if (
      currentState.hand.length < MAX_HAND_SIZE &&
      currentState.deck.length > 0
    ) {
      drawCard(xIsNext);
    } else if (
      currentState.hand.length < MAX_HAND_SIZE &&
      currentState.deck.length === 0 &&
      currentState.discardPile.length > 0
    ) {
      // デッキが空で捨て札があれば、捨て札をデッキに戻してシャッフル
      if (xIsNext) {
        reshufflePlayerDiscard();
        // シャッフル後にカードを引く
        setTimeout(() => drawCard(true), 0);
      } else {
        reshuffleCpuDiscard();
        // シャッフル後にカードを引く
        setTimeout(() => drawCard(false), 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, finalWinner]);

  // ターン開始時にマナを1補充
  useEffect(() => {
    // 勝者がいる場合はマナを補充しない
    if (finalWinner) return;

    // 現在のプレイヤーのマナを補充
    if (xIsNext) {
      setPlayerMana(
        Math.min(
          MAX_MANA,
          playerState.mana + MANA_REGENERATION_PER_TURN + playerRenCount,
        ),
      );
    } else {
      setCpuMana(
        Math.min(
          MAX_MANA,
          cpuState.mana + MANA_REGENERATION_PER_TURN + cpuRenCount,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, finalWinner]);

  // 手札を補充
  function drawCard(isPlayer: boolean) {
    const state = isPlayer ? playerState : cpuState;
    const setHand = isPlayer ? setPlayerHand : setCpuHand;
    const setDeck = isPlayer ? setPlayerDeck : setCpuDeck;

    if (state.hand.length < MAX_HAND_SIZE && state.deck.length > 0) {
      const randomIndex = Math.floor(Math.random() * state.deck.length);
      const drawnCard = state.deck[randomIndex];
      const newDeck = [...state.deck];
      newDeck.splice(randomIndex, 1);
      const newHand = [...state.hand, drawnCard];

      setHand(newHand);
      setDeck(newDeck);
    }
  }

  // 魔法を使用
  function castMagic(magic: Magic, position: number) {
    console.log('castMagic: ', magic, position);
    const isPlayer = xIsNext;
    const state = isPlayer ? playerState : cpuState;
    const setHand = isPlayer ? setPlayerHand : setCpuHand;
    const setMana = isPlayer ? setPlayerMana : setCpuMana;
    const addToDiscard = isPlayer ? addToPlayerDiscard : addToCpuDiscard;

    if (state.mana >= magic.cost && position >= 0) {
      // 手札から削除して捨て札に追加
      const newHand = state.hand.filter((m) => m !== magic);
      setHand(newHand);
      setMana(state.mana - magic.cost);

      // 使用したカードを捨て札に追加
      addToDiscard([magic]);

      // 効果を適用
      switch (magic.type) {
        case 'block':
          placeBlock(position, null);
          break;
        case 'blockUp':
          placeBlock(position, 'up');
          placePiece(position);
          break;
        case 'blockRight':
          placeBlock(position, 'right');
          placePiece(position);
          break;
        case 'blockDown':
          placeBlock(position, 'down');
          placePiece(position);
          break;
        case 'blockLeft':
          placeBlock(position, 'left');
          placePiece(position);
          break;
        case 'replace':
          placePiece(position);
          break;
        case 'destroy':
          destroyPiece(position);
          break;
        case 'crossDestroy':
          crossDestroyAndPlace(position);
          break;
        case 'normal':
          placePiece(position);
          break;
        case 'allDestroy':
          allDestroyAndPlace(position);
          break;
        case 'allBlock':
          placeBlock(position, 'all');
          placePiece(position);
          break;
      }
    }
  }

  return {
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
    drawCard,
    addToPlayerDiscard,
    addToCpuDiscard,
    reshufflePlayerDiscard,
    reshuffleCpuDiscard,
  };
}
