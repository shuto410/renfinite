import { Magic, MagicCardType } from '@/types/game';

// 魔法カードの基本定義
export const MAGIC_CARDS: Record<MagicCardType, Omit<Magic, 'id'>> = {
  blockUp: {
    type: 'blockUp',
    cardType: 'blockUp',
    name: '上ブロック',
    description: '上方向にブロックを設置',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockRight: {
    type: 'blockRight',
    cardType: 'blockRight',
    name: '右ブロック',
    description: '右方向にブロックを設置',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockDown: {
    type: 'blockDown',
    cardType: 'blockDown',
    name: '下ブロック',
    description: '下方向にブロックを設置',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockLeft: {
    type: 'blockLeft',
    cardType: 'blockLeft',
    name: '左ブロック',
    description: '左方向にブロックを設置',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  block: {
    type: 'block',
    cardType: 'block',
    name: 'ブロック',
    description: '指定のマスをブロック',
    cost: 2,
    endTurn: false,
    rarity: 'common',
  },
  replace: {
    type: 'replace',
    cardType: 'replace',
    name: '置換',
    description: '相手の石を自分の石に置き換える',
    cost: 2,
    endTurn: true,
    attackPower: 5,
    rarity: 'rare',
  },
  crossDestroy: {
    type: 'crossDestroy',
    cardType: 'crossDestroy',
    name: '十字破壊',
    description: '十字方向のブロックを破壊',
    cost: 3,
    endTurn: true,
    attackPower: 5,
    rarity: 'rare',
  },
  normal: {
    type: 'normal',
    cardType: 'normal',
    name: '通常石',
    description: '通常の石を置く',
    cost: 0,
    endTurn: true,
    attackPower: 10,
    rarity: 'common',
  },
  blockUpLight: {
    type: 'blockUp',
    cardType: 'blockUpLight',
    name: '上ブロック',
    description: '上方向にブロックを設置',
    cost: 0,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockRightLight: {
    type: 'blockRight',
    cardType: 'blockRightLight',
    name: '右ブロック',
    description: '右方向にブロックを設置',
    cost: 0,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockDownLight: {
    type: 'blockDown',
    cardType: 'blockDownLight',
    name: '下ブロック',
    description: '下方向にブロックを設置',
    cost: 0,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  blockLeftLight: {
    type: 'blockLeft',
    cardType: 'blockLeftLight',
    name: '左ブロック',
    description: '左方向にブロックを設置',
    cost: 0,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  replaceLight: {
    type: 'replace',
    cardType: 'replaceLight',
    name: '置換',
    description: '相手の石を自分の石に置き換える',
    cost: 1,
    endTurn: true,
    attackPower: 5,
    rarity: 'uncommon',
  },
  destroy: {
    type: 'destroy',
    cardType: 'destroy',
    name: '破壊',
    description: '指定のマスを破壊',
    cost: 3,
    endTurn: false,
    rarity: 'uncommon',
  },
  crossDestroyLight: {
    type: 'crossDestroy',
    cardType: 'crossDestroyLight',
    name: '十字破壊',
    description: '十字方向のブロックを破壊',
    cost: 2,
    endTurn: true,
    attackPower: 10,
    rarity: 'rare',
  },
  allDestroy: {
    type: 'allDestroy',
    cardType: 'allDestroy',
    name: '全破壊',
    description: '全ての石を破壊',
    cost: 3,
    endTurn: true,
    attackPower: 10,
    rarity: 'superRare',
  },
  allBlock: {
    type: 'allBlock',
    cardType: 'allBlock',
    name: '全ブロック',
    description: '全てのマスをブロック',
    cost: 3,
    endTurn: true,
    attackPower: 10,
    rarity: 'superRare',
  },
};

// IDを自動で割り振る関数
function createMagicCard(
  type: MagicCardType,
  prefix: string,
  index: number,
): Magic {
  return {
    ...MAGIC_CARDS[type],
    id: `${prefix}${index}`,
  };
}

// デッキを生成する関数
function createDeck(prefix: string, cardTypes: MagicCardType[]): Magic[] {
  return cardTypes.map((type, index) =>
    createMagicCard(type, prefix, index + 1),
  );
}

// プレイヤー（X）の初期デッキ定義
const PLAYER_DECK_TYPES: MagicCardType[] = [
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

// CPU（O）の初期デッキ定義
const CPU_DECK_TYPES: MagicCardType[] = [
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

// プレイヤー（X）の初期デッキ
export const PLAYER_INITIAL_DECK: Magic[] = createDeck('p', PLAYER_DECK_TYPES);

// CPU（O）の初期デッキ
export const CPU_INITIAL_DECK: Magic[] = createDeck('c', CPU_DECK_TYPES);

// 初期手札の枚数
export const INITIAL_HAND_SIZE = 2;

// 最大手札枚数
export const MAX_HAND_SIZE = 5;

// 各ターンのマナ回復量
export const MANA_REGENERATION_PER_TURN = 1;

// 最大マナ
export const MAX_MANA = 10;

// 初期マナ
export const INITIAL_MANA = 0;
