import { Magic, MagicType } from '@/types/game';

// 魔法カードの基本定義
export const MAGIC_CARDS: Record<MagicType, Omit<Magic, 'id'>> = {
  blockUp: {
    type: 'blockUp',
    name: '上ブロック',
    description: '上方向にブロックを設置',
    cost: 1,
  },
  blockRight: {
    type: 'blockRight',
    name: '右ブロック',
    description: '右方向にブロックを設置',
    cost: 1,
  },
  blockDown: {
    type: 'blockDown',
    name: '下ブロック',
    description: '下方向にブロックを設置',
    cost: 1,
  },
  blockLeft: {
    type: 'blockLeft',
    name: '左ブロック',
    description: '左方向にブロックを設置',
    cost: 1,
  },
  replace: {
    type: 'replace',
    name: '置換',
    description: '相手の石を自分の石に置き換える',
    cost: 2,
  },
  crossDestroy: {
    type: 'crossDestroy',
    name: '十字破壊',
    description: '十字方向のブロックを破壊',
    cost: 3,
  },
  normal: {
    type: 'normal',
    name: '通常石',
    description: '通常の石を置く',
    cost: 0,
  },
};

// IDを自動で割り振る関数
function createMagicCard(
  type: MagicType,
  prefix: string,
  index: number,
): Magic {
  return {
    ...MAGIC_CARDS[type],
    id: `${prefix}${index}`,
  };
}

// デッキを生成する関数
function createDeck(prefix: string, cardTypes: MagicType[]): Magic[] {
  return cardTypes.map((type, index) =>
    createMagicCard(type, prefix, index + 1),
  );
}

// プレイヤー（X）の初期デッキ定義
const PLAYER_DECK_TYPES: MagicType[] = [
  'replace',
  'blockUp',
  'blockRight',
  'blockDown',
  'blockLeft',
  'crossDestroy',
  'replace',
  'blockUp',
  'blockRight',
  'blockDown',
  'normal',
  'normal',
  'normal',
  'normal',
];

// CPU（O）の初期デッキ定義
const CPU_DECK_TYPES: MagicType[] = [
  'replace',
  'blockUp',
  'blockRight',
  'blockDown',
  'blockLeft',
  'crossDestroy',
  'replace',
  'blockUp',
  'blockRight',
  'blockDown',
  'normal',
  'normal',
  'normal',
  'normal',
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
