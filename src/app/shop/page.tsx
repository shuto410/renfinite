'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardRarity } from '@/types/battle';
import { useGameStore } from '@/store';
import { MAGIC_CARDS } from '@/constants/decks';
import { MagicCard } from '@/components/MagicCard';

// Mock data
interface ShopCard extends Card {
  price: number;
}

export default function Shop() {
  const router = useRouter();
  const gold = useGameStore.use.gold();
  const addGold = useGameStore.use.addGold();
  const removeGold = useGameStore.use.removeGold();
  const playerDeck = useGameStore.use.deck();
  const addCard = useGameStore.use.addCard();
  const removeCard = useGameStore.use.removeCard();
  const [selectedDeckCard, setSelectedDeckCard] = useState<Card | null>(null);
  const [purchasedCards, setPurchasedCards] = useState<string[]>([]);
  const [removedCards, setRemovedCards] = useState<string[]>([]);

  const shopCards: ShopCard[] = useMemo(() => {
    const priceByRarity: Record<CardRarity, number> = {
      common: 50,
      uncommon: 75,
      rare: 100,
      superRare: 150,
      legendary: 200,
    };

    const cards = [
      MAGIC_CARDS['block'],
      MAGIC_CARDS['replace'],
      MAGIC_CARDS['normal'],
      MAGIC_CARDS['destroy'],
      MAGIC_CARDS['crossDestroy'],
      MAGIC_CARDS['allBlock'],
      MAGIC_CARDS['allDestroy'],
    ];

    return cards.map((card, idx) => ({
      ...card,
      id: `shop-card-${idx}`,
      price: priceByRarity[card.rarity || 'common'],
    }));
  }, []);

  // Card purchase processing
  const handlePurchase = (card: ShopCard) => {
    if (gold >= card.price && !purchasedCards.includes(card.id)) {
      removeGold(card.price);
      addCard(card);
      setPurchasedCards([...purchasedCards, card.id]);
    }
  };

  // Remove card from deck processing
  const handleRemoveCard = (card: Card) => {
    if (!removedCards.includes(card.id)) {
      addGold(25); // Removal reward
      removeCard(card.id);
      setRemovedCards([...removedCards, card.id]);
      setSelectedDeckCard(null);
    }
  };

  // Get color based on card rarity
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

  return (
    <div className='min-h-screen text-white p-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Shop</h1>
          <div className='flex items-center'>
            <span className='text-yellow-400 mr-2'>💰</span>
            <span className='text-xl font-bold'>{gold}</span>
            <button
              onClick={() => router.back()}
              className='ml-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors'
            >
              Back
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Purchasable cards */}
          <div className='md:col-span-2'>
            <h2 className='text-xl font-bold mb-4'>Available Cards</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {shopCards.map((card) => (
                <div key={card.id} className='space-y-2'>
                  <MagicCard
                    {...card}
                    size='normal'
                    isPurchased={purchasedCards.includes(card.id)}
                  />
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                      <span className='text-yellow-400 mr-1'>💰</span>
                      <span className='font-bold'>{card.price}</span>
                    </div>
                    {purchasedCards.includes(card.id) ? (
                      <span className='text-green-400 text-sm'>Purchased</span>
                    ) : (
                      <button
                        className={`px-3 py-1 rounded text-sm font-bold ${
                          gold >= card.price
                            ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => handlePurchase(card)}
                        disabled={gold < card.price}
                      >
                        Purchase
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deck management */}
          <div>
            <h2 className='text-xl font-bold mb-4'>Deck Management</h2>
            <div className='bg-gray-800 rounded-lg p-4'>
              <p className='text-gray-300 mb-4'>
                Removing cards gives you{' '}
                <span className='text-yellow-400'>25💰</span> as reward
              </p>

              <div className='space-y-3'>
                {playerDeck.map((card: Card) => (
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
                        Remove
                      </button>
                    )}

                    {removedCards.includes(card.id) && (
                      <div className='mt-2 text-center text-sm text-gray-400'>
                        Removed
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
