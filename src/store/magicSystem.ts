import { Magic } from '@/types/game';
import { Player } from '@/types/game';
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
  selectedMagic: Magic | null;
  setPlayerDeck: (newPlayerDeck: Magic[]) => void;
  setCpuDeck: (newCpuDeck: Magic[]) => void;
  setPlayerHand: (newPlayerHand: Magic[]) => void;
  setCpuHand: (newCpuHand: Magic[]) => void;
  setPlayerMana: (newPlayerMana: number) => void;
  setCpuMana: (newCpuMana: number) => void;
  setSelectedMagic: (newSelectedMagic: Magic | null) => void;
  addToPlayerDiscard: (cards: Magic[]) => void;
  addToCpuDiscard: (cards: Magic[]) => void;
  setPlayerDiscard: (newPlayerDiscard: Magic[]) => void;
  setCpuDiscard: (newCpuDiscard: Magic[]) => void;
  reshufflePlayerDiscard: () => void;
  reshuffleCpuDiscard: () => void;
}

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
  setSelectedMagic: (newSelectedMagic: Magic | null) =>
    set(() => ({ selectedMagic: newSelectedMagic })),
  setPlayerDeck: (newPlayerDeck: Magic[]) =>
    set((state) => ({
      playerState: { ...state.playerState, deck: newPlayerDeck },
    })),
  setCpuDeck: (newCpuDeck: Magic[]) =>
    set((state) => ({ cpuState: { ...state.cpuState, deck: newCpuDeck } })),
  setPlayerHand: (newPlayerHand: Magic[]) =>
    set((state) => ({
      playerState: { ...state.playerState, hand: newPlayerHand },
    })),
  setCpuHand: (newCpuHand: Magic[]) =>
    set((state) => ({ cpuState: { ...state.cpuState, hand: newCpuHand } })),
  setPlayerMana: (newPlayerMana: number) =>
    set((state) => ({
      playerState: { ...state.playerState, mana: newPlayerMana },
    })),
  setCpuMana: (newCpuMana: number) =>
    set((state) => ({ cpuState: { ...state.cpuState, mana: newCpuMana } })),
  addToPlayerDiscard: (cards: Magic[]) =>
    set((state) => ({
      playerState: {
        ...state.playerState,
        discardPile: [...state.playerState.discardPile, ...cards],
      },
    })),
  addToCpuDiscard: (cards: Magic[]) =>
    set((state) => ({
      cpuState: {
        ...state.cpuState,
        discardPile: [...state.cpuState.discardPile, ...cards],
      },
    })),
  setPlayerDiscard: (newPlayerDiscard: Magic[]) =>
    set((state) => ({
      playerState: { ...state.playerState, discardPile: newPlayerDiscard },
    })),
  setCpuDiscard: (newCpuDiscard: Magic[]) =>
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
