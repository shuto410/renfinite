export type BlockDirection = 'up' | 'right' | 'down' | 'left' | null;

export type MagicType =
  | 'blockUp'
  | 'blockRight'
  | 'blockDown'
  | 'blockLeft'
  | 'replace'
  | 'crossDestroy'
  | 'normal';

export type MagicCardType =
  | 'blockUp'
  | 'blockRight'
  | 'blockDown'
  | 'blockLeft'
  | 'replace'
  | 'crossDestroy'
  | 'blockUpLight'
  | 'blockRightLight'
  | 'blockDownLight'
  | 'blockLeftLight'
  | 'replaceLight'
  | 'crossDestroyLight'
  | 'normal';

export interface Magic {
  type: MagicType;
  cardType: MagicCardType;
  cost: number;
  name: string;
  description: string;
  id: string;
}

export interface Player {
  deck: Magic[]; // デッキ
  hand: Magic[]; // 手札
  mana: number; // マナ
  discardPile: Magic[]; // 捨て札
}
