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

export type MagicCardType =
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

export interface Magic {
  type: MagicType;
  cardType: MagicCardType;
  cost: number;
  name: string;
  description: string;
  endTurn: boolean;
  attackPower?: number;
  id: string;
}

export interface Player {
  deck: Magic[];
  hand: Magic[];
  mana: number;
  discardPile: Magic[];
}
