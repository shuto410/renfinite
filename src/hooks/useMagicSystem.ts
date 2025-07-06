import {
  MANA_REGENERATION_PER_TURN,
  MAX_HAND_SIZE,
  MAX_MANA,
} from '@/constants/decks';
import { useGameStore } from '@/store';
import { Card } from '@/types/battle';
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

  // Replenish hand at turn start
  useEffect(() => {
    // Don't replenish hand if there's a winner
    if (finalWinner) return;

    // Replenish if current player's hand is below maximum
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
      // If deck is empty and discard pile exists, shuffle discard pile back to deck
      if (xIsNext) {
        reshufflePlayerDiscard();
        // Draw card after shuffling
        setTimeout(() => drawCard(true), 0);
      } else {
        reshuffleCpuDiscard();
        // Draw card after shuffling
        setTimeout(() => drawCard(false), 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, finalWinner]);

  // Replenish mana by 1 at turn start
  useEffect(() => {
    // Don't replenish mana if there's a winner
    if (finalWinner) return;

    // Replenish current player's mana
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

  // Replenish hand
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

  // Cast magic
  function castMagic(magic: Card, position: number) {
    const isPlayer = xIsNext;
    const state = isPlayer ? playerState : cpuState;
    const setHand = isPlayer ? setPlayerHand : setCpuHand;
    const setMana = isPlayer ? setPlayerMana : setCpuMana;
    const addToDiscard = isPlayer ? addToPlayerDiscard : addToCpuDiscard;

    if (state.mana >= magic.cost && position >= 0) {
      // Remove from hand and add to discard pile
      const newHand = state.hand.filter((m: Card) => m !== magic);
      setHand(newHand);
      setMana(state.mana - magic.cost);

      // Add used card to discard pile
      addToDiscard([magic]);

      // Apply effect
      switch (magic.type) {
        case 'block':
          placeBlock(position, null);
          break;
        case 'blockUp':
          placeBlock(position, 'up');
          placePiece(position, 'blockUp');
          break;
        case 'blockRight':
          placeBlock(position, 'right');
          placePiece(position, 'blockRight');
          break;
        case 'blockDown':
          placeBlock(position, 'down');
          placePiece(position, 'blockDown');
          break;
        case 'blockLeft':
          placeBlock(position, 'left');
          placePiece(position, 'blockLeft');
          break;
        case 'replace':
          placePiece(position, 'replace');
          break;
        case 'destroy':
          destroyPiece(position);
          break;
        case 'crossDestroy':
          crossDestroyAndPlace(position, 'crossDestroy');
          break;
        case 'normal':
          placePiece(position, 'normal');
          break;
        case 'allDestroy':
          allDestroyAndPlace(position, 'allDestroy');
          break;
        case 'allBlock':
          placeBlock(position, 'all');
          placePiece(position, 'allBlock');
          break;
      }
    }
  }

  return {
    playerState,
    cpuState,
    selectedMagic,
    setPlayerMana,
    setCpuMana,
    setSelectedMagic,
    castMagic,
  };
}
