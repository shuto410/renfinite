import { Magic } from '@/types/game';
import { StateCreator } from 'zustand';
import { PLAYER_INITIAL_DECK } from '@/constants/decks';

export interface PlayerDeckState {
  deck: Magic[]; // 現在のデッキ構成
  addCard: (card: Magic) => void; // デッキにカードを追加
  removeCard: (cardId: string) => void; // デッキからカードを削除
  updateCard: (cardId: string, updatedCard: Partial<Magic>) => void; // カードの情報を更新
  resetDeck: () => void; // デッキを初期状態に戻す
  getDeckSize: () => number; // デッキの枚数を取得
  getCardById: (cardId: string) => Magic | undefined; // IDでカードを検索
}

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
