import { Card, CardType } from '@/types/battle';

// Basic definition of magic cards
export const MAGIC_CARDS: Record<CardType, Omit<Card, 'id'>> = {
  blockUp: {
    type: 'blockUp',
    cardType: 'blockUp',
    name: 'Up Block',
    description: 'Place a block in the upward direction',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
    imageSrc: '/images/block_stone.jpg',
  },
  blockRight: {
    type: 'blockRight',
    cardType: 'blockRight',
    name: 'Right Block',
    description: 'Place a block in the right direction',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
    imageSrc: '/images/block_stone.jpg',
  },
  blockDown: {
    type: 'blockDown',
    cardType: 'blockDown',
    name: 'Down Block',
    description: 'Place a block in the downward direction',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
    imageSrc: '/images/block_stone.jpg',
  },
  blockLeft: {
    type: 'blockLeft',
    cardType: 'blockLeft',
    name: 'Left Block',
    description: 'Place a block in the left direction',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
    imageSrc: '/images/block_stone.jpg',
  },
  block: {
    type: 'block',
    cardType: 'block',
    name: 'Block',
    description: 'Block the specified square',
    cost: 2,
    endTurn: false,
    rarity: 'common',
    imageSrc: '/images/block_stone.jpg',
  },
  replace: {
    type: 'replace',
    cardType: 'replace',
    name: 'Replace',
    description: "Replace opponent's stone with your own",
    cost: 2,
    endTurn: true,
    attackPower: 5,
    rarity: 'rare',
    imageSrc: '/images/replace.jpg',
  },
  crossDestroy: {
    type: 'crossDestroy',
    cardType: 'crossDestroy',
    name: 'Cross Destroy',
    description: 'Destroy blocks in cross directions',
    cost: 3,
    endTurn: true,
    attackPower: 5,
    rarity: 'rare',
    imageSrc: '/images/cross_destroy.jpg',
  },
  normal: {
    type: 'normal',
    cardType: 'normal',
    name: 'Normal Stone',
    description: 'Place a normal stone',
    cost: 0,
    endTurn: true,
    attackPower: 10,
    rarity: 'common',
    imageSrc: '/images/attack_stone.jpg',
  },
  blockUpLight: {
    type: 'blockUp',
    cardType: 'blockUpLight',
    name: 'Up Block',
    description: 'Place a block in the upward direction',
    cost: 0,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockRightLight: {
    type: 'blockRight',
    cardType: 'blockRightLight',
    name: 'Right Block',
    description: 'Place a block in the right direction',
    cost: 0,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockDownLight: {
    type: 'blockDown',
    cardType: 'blockDownLight',
    name: 'Down Block',
    description: 'Place a block in the downward direction',
    cost: 0,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockLeftLight: {
    type: 'blockLeft',
    cardType: 'blockLeftLight',
    name: 'Left Block',
    description: 'Place a block in the left direction',
    cost: 0,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  replaceLight: {
    type: 'replace',
    cardType: 'replaceLight',
    name: 'Replace',
    description: "Replace opponent's stone with your own",
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  destroy: {
    type: 'destroy',
    cardType: 'destroy',
    name: 'Destroy',
    description: 'Destroy the specified square',
    cost: 3,
    endTurn: false,
    rarity: 'uncommon',
    imageSrc: '/images/destroy.jpg',
  },
  crossDestroyLight: {
    type: 'crossDestroy',
    cardType: 'crossDestroyLight',
    name: 'Cross Destroy',
    description: 'Destroy blocks in cross directions',
    cost: 2,
    endTurn: true,
    attackPower: 10,
    rarity: 'rare',
  },
  allDestroy: {
    type: 'allDestroy',
    cardType: 'allDestroy',
    name: 'All Destroy',
    description: 'Destroy all stones',
    cost: 3,
    endTurn: true,
    attackPower: 10,
    rarity: 'superRare',
    imageSrc: '/images/all_destroy.jpg',
  },
  allBlock: {
    type: 'allBlock',
    cardType: 'allBlock',
    name: 'All Block',
    description: 'Block all squares',
    cost: 3,
    endTurn: true,
    attackPower: 10,
    rarity: 'superRare',
    imageSrc: '/images/all_block_stone.jpg',
  },
};

// Function to automatically assign IDs
function createMagicCard(type: CardType, prefix: string, index: number): Card {
  return {
    ...MAGIC_CARDS[type],
    id: `${prefix}${index}`,
  };
}

// Function to generate deck
function createDeck(prefix: string, cardTypes: CardType[]): Card[] {
  return cardTypes.map((type, index) =>
    createMagicCard(type, prefix, index + 1),
  );
}

// Initial deck definition for Player (X)
const PLAYER_DECK_TYPES: CardType[] = [
  'normal',
  'normal',
  'normal',
  'normal',
  'normal',
  'blockRight',
  'blockRight',
  'blockRight',
  'blockUp',
  'blockUp',
];

// Initial deck definition for CPU (O)
const CPU_DECK_TYPES: CardType[] = [
  'blockUp',
  'blockRight',
  'blockDown',
  'blockLeft',
  'blockUpLight',
  'blockRightLight',
  'blockDownLight',
  'blockLeftLight',
  'replaceLight',
  'replaceLight',
  'replaceLight',
  'replaceLight',
  'crossDestroyLight',
  'crossDestroyLight',
  'allDestroy',
  'allBlock',
];

// Initial deck for Player (X)
export const PLAYER_INITIAL_DECK: Card[] = createDeck('p', PLAYER_DECK_TYPES);

// Initial deck for CPU (O)
export const CPU_INITIAL_DECK: Card[] = createDeck('c', CPU_DECK_TYPES);

// Initial hand size
export const INITIAL_HAND_SIZE = 2;

// Maximum hand size
export const MAX_HAND_SIZE = 5;

// Mana regeneration per turn
export const MANA_REGENERATION_PER_TURN = 1;

// Maximum mana
export const MAX_MANA = 10;

// Initial mana
export const INITIAL_MANA = 0;
