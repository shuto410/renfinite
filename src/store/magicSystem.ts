import { Card } from '@/types';
import { Player } from '@/types';
import { StateCreator } from 'zustand';
import {
  PLAYER_INITIAL_DECK,
  CPU_INITIAL_DECK,
  INITIAL_HAND_SIZE,
  INITIAL_MANA,
} from '@/constants/decks';

export interface MagicSystemState {
  playerState: Player;
  cpuState: Player;
  selectedMagic: Card | null;
  setPlayerDeck: (newPlayerDeck: Card[]) => void;
  setCpuDeck: (newCpuDeck: Card[]) => void;
  setPlayerHand: (newPlayerHand: Card[]) => void;
  setCpuHand: (newCpuHand: Card[]) => void;
  setPlayerMana: (newPlayerMana: number) => void;
  setCpuMana: (newCpuMana: number) => void;
  setSelectedMagic: (newSelectedMagic: Card | null) => void;
  addToPlayerDiscard: (cards: Card[]) => void;
  addToCpuDiscard: (cards: Card[]) => void;
  setPlayerDiscard: (newPlayerDiscard: Card[]) => void;
  setCpuDiscard: (newCpuDiscard: Card[]) => void;
  reshufflePlayerDiscard: () => void;
  reshuffleCpuDiscard: () => void;
}

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

const playerInitialDraw = generateInitialHand(PLAYER_INITIAL_DECK);
const cpuInitialDraw = generateInitialHand(CPU_INITIAL_DECK);

export const createMagicSystemSlice: StateCreator<MagicSystemState> = (
  set,
) => ({
  playerState: {
    deck: playerInitialDraw.remainingDeck,
    hand: playerInitialDraw.hand,
    mana: INITIAL_MANA,
    discardPile: [],
  },
  cpuState: {
    deck: cpuInitialDraw.remainingDeck,
    hand: cpuInitialDraw.hand,
    mana: INITIAL_MANA,
    discardPile: [],
  },
  selectedMagic: null,
  setSelectedMagic: (newSelectedMagic: Card | null) =>
    set(() => ({ selectedMagic: newSelectedMagic })),
  setPlayerDeck: (newPlayerDeck: Card[]) =>
    set((state) => ({
      playerState: { ...state.playerState, deck: newPlayerDeck },
    })),
  setCpuDeck: (newCpuDeck: Card[]) =>
    set((state) => ({ cpuState: { ...state.cpuState, deck: newCpuDeck } })),
  setPlayerHand: (newPlayerHand: Card[]) =>
    set((state) => ({
      playerState: { ...state.playerState, hand: newPlayerHand },
    })),
  setCpuHand: (newCpuHand: Card[]) =>
    set((state) => ({ cpuState: { ...state.cpuState, hand: newCpuHand } })),
  setPlayerMana: (newPlayerMana: number) =>
    set((state) => ({
      playerState: { ...state.playerState, mana: newPlayerMana },
    })),
  setCpuMana: (newCpuMana: number) =>
    set((state) => ({ cpuState: { ...state.cpuState, mana: newCpuMana } })),
  addToPlayerDiscard: (cards: Card[]) =>
    set((state) => ({
      playerState: {
        ...state.playerState,
        discardPile: [...state.playerState.discardPile, ...cards],
      },
    })),
  addToCpuDiscard: (cards: Card[]) =>
    set((state) => ({
      cpuState: {
        ...state.cpuState,
        discardPile: [...state.cpuState.discardPile, ...cards],
      },
    })),
  setPlayerDiscard: (newPlayerDiscard: Card[]) =>
    set((state) => ({
      playerState: { ...state.playerState, discardPile: newPlayerDiscard },
    })),
  setCpuDiscard: (newCpuDiscard: Card[]) =>
    set((state) => ({
      cpuState: { ...state.cpuState, discardPile: newCpuDiscard },
    })),
  reshufflePlayerDiscard: () =>
    set((state) => {
      const newDeck = [
        ...state.playerState.deck,
        ...state.playerState.discardPile,
      ];
      return {
        playerState: { ...state.playerState, deck: newDeck, discardPile: [] },
      };
    }),
  reshuffleCpuDiscard: () =>
    set((state) => {
      const newDeck = [...state.cpuState.deck, ...state.cpuState.discardPile];
      return {
        cpuState: { ...state.cpuState, deck: newDeck, discardPile: [] },
      };
    }),
});
