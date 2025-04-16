'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardRarity, MagicType } from '@/types/game';

// モックデータ
interface ShopCard extends Card {
  price: number;
  image: string; // 表示用の画像アイコン
}

// モックカードデータ
const mockCards: Omit<ShopCard, 'price'>[] = [
  {
    id: 'card1',
    name: 'ストライク',
    type: 'normal',
    cardType: 'normal',
    rarity: 'common',
    description: '6ダメージを与える',
    cost: 1,
    endTurn: false,
    attackPower: 6,
    image: '⚔️',
  },
  {
    id: 'card2',
    name: '防御',
    type: 'block',
    cardType: 'block',
    rarity: 'common',
    description: '5ブロックを得る',
    cost: 1,
    endTurn: false,
    image: '🛡️',
  },
  {
    id: 'card3',
    name: '強打',
    type: 'normal',
    cardType: 'normal',
    rarity: 'uncommon',
    description: '12ダメージを与える',
    cost: 2,
    endTurn: false,
    attackPower: 12,
    image: '⚡',
  },
  {
    id: 'card4',
    name: '毒の刃',
    type: 'normal',
    cardType: 'normal',
    rarity: 'uncommon',
    description: '4ダメージを与え、2毒を与える',
    cost: 1,
    endTurn: false,
    attackPower: 4,
    image: '🗡️',
  },
  {
    id: 'card5',
    name: '炎の壁',
    type: 'block',
    cardType: 'block',
    rarity: 'rare',
    description: '8ブロックを得る。次のターン、敵に3ダメージを与える',
    cost: 2,
    endTurn: false,
    image: '🔥',
  },
  {
    id: 'card6',
    name: '癒しの風',
    type: 'normal',
    cardType: 'normal',
    rarity: 'rare',
    description: '3回復する',
    cost: 1,
    endTurn: false,
    image: '💨',
  },
];

// モックプレイヤーデッキ
const mockPlayerDeck: Card[] = [
  {
    id: 'deck1',
    name: 'ストライク',
    type: 'normal',
    cardType: 'normal',
    rarity: 'common',
    description: '6ダメージを与える',
    cost: 1,
    endTurn: false,
    attackPower: 6,
  },
  {
    id: 'deck2',
    name: '防御',
    type: 'block',
    cardType: 'block',
    rarity: 'common',
    description: '5ブロックを得る',
    cost: 1,
    endTurn: false,
  },
  {
    id: 'deck3',
    name: '防御',
    type: 'block',
    cardType: 'block',
    rarity: 'common',
    description: '5ブロックを得る',
    cost: 1,
    endTurn: false,
  },
  {
    id: 'deck4',
    name: '強打',
    type: 'normal',
    cardType: 'normal',
    rarity: 'uncommon',
    description: '12ダメージを与える',
    cost: 2,
    endTurn: false,
    attackPower: 12,
  },
];

export default function Shop() {
  const router = useRouter();
  const [playerGold, setPlayerGold] = useState(250);
  const [playerDeck, setPlayerDeck] = useState<Card[]>(mockPlayerDeck);
  const [selectedCard, setSelectedCard] = useState<ShopCard | null>(null);
  const [selectedDeckCard, setSelectedDeckCard] = useState<Card | null>(null);
  const [purchasedCards, setPurchasedCards] = useState<string[]>([]);
  const [removedCards, setRemovedCards] = useState<string[]>([]);

  // ショップのカードをランダムに選択（3枚）
  const shopCards: ShopCard[] = React.useMemo(() => {
    const shuffled = [...mockCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((card) => ({
      ...card,
      price:
        card.rarity === 'common' ? 50 : card.rarity === 'uncommon' ? 75 : 100,
    }));
  }, []);

  // カード購入処理
  const handlePurchase = (card: ShopCard) => {
    if (playerGold >= card.price && !purchasedCards.includes(card.id)) {
      setPlayerGold(playerGold - card.price);
      setPurchasedCards([...purchasedCards, card.id]);
      setSelectedCard(null);
    }
  };

  // デッキからカード削除処理
  const handleRemoveCard = (card: Card) => {
    if (!removedCards.includes(card.id)) {
      setPlayerGold(playerGold + 25); // 削除報酬
      setPlayerDeck(playerDeck.filter((c) => c.id !== card.id));
      setRemovedCards([...removedCards, card.id]);
      setSelectedDeckCard(null);
    }
  };

  // カードのレアリティに応じた色を取得
  const getRarityColor = (rarity: CardRarity) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-300';
      case 'uncommon':
        return 'text-green-400';
      case 'rare':
        return 'text-blue-400';
      case 'superRare':
        return 'text-purple-400';
      case 'legendary':
        return 'text-yellow-400';
      default:
        return 'text-gray-300';
    }
  };

  // カードのタイプに応じた色を取得
  const getTypeColor = (type: MagicType) => {
    switch (type) {
      case 'normal':
        return 'bg-red-500';
      case 'block':
        return 'bg-blue-500';
      case 'destroy':
      case 'crossDestroy':
      case 'allDestroy':
        return 'bg-purple-500';
      case 'replace':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='max-w-6xl mx-auto'>
        {/* ヘッダー */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>ショップ</h1>
          <div className='flex items-center'>
            <span className='text-yellow-400 mr-2'>💰</span>
            <span className='text-xl font-bold'>{playerGold}</span>
            <button
              onClick={() => router.back()}
              className='ml-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors'
            >
              戻る
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* 購入可能なカード */}
          <div className='md:col-span-2'>
            <h2 className='text-xl font-bold mb-4'>購入可能なカード</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {shopCards.map((card) => (
                <div
                  key={card.id}
                  className={`relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform ${
                    selectedCard?.id === card.id
                      ? 'scale-105 ring-2 ring-yellow-400'
                      : ''
                  } ${purchasedCards.includes(card.id) ? 'opacity-50' : ''}`}
                  onClick={() =>
                    !purchasedCards.includes(card.id) && setSelectedCard(card)
                  }
                >
                  {/* カードタイプの色帯 */}
                  <div className={`h-2 ${getTypeColor(card.type)}`}></div>

                  <div className='p-4'>
                    <div className='flex justify-between items-start mb-2'>
                      <h3 className='font-bold text-lg'>{card.name}</h3>
                      <div className='flex items-center'>
                        <span className='text-yellow-400 mr-1'>💰</span>
                        <span className='font-bold'>{card.price}</span>
                      </div>
                    </div>

                    <div
                      className={`text-sm mb-2 ${getRarityColor(
                        card.rarity || 'common',
                      )}`}
                    >
                      {card.rarity?.toUpperCase() || 'COMMON'}
                    </div>

                    <div className='text-4xl mb-2'>{card.image}</div>

                    <p className='text-gray-300 text-sm mb-2'>
                      {card.description}
                    </p>

                    <div className='flex justify-between items-center mt-2'>
                      <div className='text-sm text-gray-400'>
                        コスト: {card.cost}
                      </div>
                      {purchasedCards.includes(card.id) ? (
                        <span className='text-green-400 text-sm'>購入済み</span>
                      ) : (
                        <button
                          className={`px-3 py-1 rounded text-sm font-bold ${
                            playerGold >= card.price
                              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(card);
                          }}
                          disabled={playerGold < card.price}
                        >
                          購入
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* デッキ管理 */}
          <div>
            <h2 className='text-xl font-bold mb-4'>デッキ管理</h2>
            <div className='bg-gray-800 rounded-lg p-4'>
              <p className='text-gray-300 mb-4'>
                カードを削除すると <span className='text-yellow-400'>25💰</span>{' '}
                獲得できます
              </p>

              <div className='space-y-3'>
                {playerDeck.map((card) => (
                  <div
                    key={card.id}
                    className={`relative bg-gray-700 rounded-lg p-3 cursor-pointer transition-transform ${
                      selectedDeckCard?.id === card.id
                        ? 'scale-105 ring-2 ring-red-400'
                        : ''
                    } ${removedCards.includes(card.id) ? 'opacity-50' : ''}`}
                    onClick={() =>
                      !removedCards.includes(card.id) &&
                      setSelectedDeckCard(card)
                    }
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold'>{card.name}</h3>
                        <p className='text-xs text-gray-400'>
                          {card.description}
                        </p>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${getRarityColor(
                          card.rarity || 'common',
                        )}`}
                      >
                        {card.rarity || 'common'}
                      </div>
                    </div>

                    {!removedCards.includes(card.id) && (
                      <button
                        className='mt-2 w-full px-3 py-1 bg-red-500 text-white rounded text-sm font-bold hover:bg-red-600'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCard(card);
                        }}
                      >
                        削除
                      </button>
                    )}

                    {removedCards.includes(card.id) && (
                      <div className='mt-2 text-center text-sm text-gray-400'>
                        削除済み
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
