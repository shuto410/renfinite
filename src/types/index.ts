export type BlockDirection = 'up' | 'right' | 'down' | 'left' | 'all' | null;

export type MagicType =
  | 'block'
  | 'blockUp'
  | 'blockRight'
  | 'blockDown'
  | 'blockLeft'
  | 'replace'
  | 'destroy'
  | 'crossDestroy'
  | 'allDestroy'
  | 'allBlock'
  | 'normal';

export type CardType =
  | 'block'
  | 'blockUp'
  | 'blockRight'
  | 'blockDown'
  | 'blockLeft'
  | 'replace'
  | 'destroy'
  | 'crossDestroy'
  | 'blockUpLight'
  | 'blockRightLight'
  | 'blockDownLight'
  | 'blockLeftLight'
  | 'replaceLight'
  | 'crossDestroyLight'
  | 'allDestroy'
  | 'allBlock'
  | 'normal';

export interface Card {
  type: MagicType;
  cardType: CardType;
  cost: number;
  name: string;
  description: string;
  endTurn: boolean;
  attackPower?: number;
  rarity?: CardRarity;
  imageSrc?: string;
  id: string;
}

export type CardRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'superRare'
  | 'legendary';

export interface Player {
  deck: Card[];
  hand: Card[];
  mana: number;
  discardPile: Card[];
}

export type NodeType = 'enemy' | 'event' | 'shop' | 'boss';
