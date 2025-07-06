import { PlayerDeckState } from '@/types/store';
import { StateCreator } from 'zustand';
import { PLAYER_INITIAL_DECK } from '@/constants/decks';

export const createPlayerDeckSlice: StateCreator<PlayerDeckState> = (
  set,
  get,
) => ({
  deck: [...PLAYER_INITIAL_DECK],

  addCard: (card) => {
    set((state) => ({
      deck: [...state.deck, card],
    }));
  },

  removeCard: (cardId) => {
    set((state) => ({
      deck: state.deck.filter((card) => card.id !== cardId),
    }));
  },

  updateCard: (cardId, updatedCard) => {
    set((state) => ({
      deck: state.deck.map((card) =>
        card.id === cardId ? { ...card, ...updatedCard } : card,
      ),
    }));
  },

  resetDeck: () => {
    set({
      deck: [...PLAYER_INITIAL_DECK],
    });
  },

  getDeckSize: () => {
    return get().deck.length;
  },

  getCardById: (cardId) => {
    return get().deck.find((card) => card.id === cardId);
  },
});
