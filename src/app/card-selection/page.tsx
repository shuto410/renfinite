'use client';

import { CardSelectionPopup } from '@/components/CardSelectionPopup';
import { DeckButton } from '@/components/DeckButton';
import { useGameStore } from '@/store';
import { Card } from '@/types';
import { useRouter } from 'next/navigation';

export default function CardSelection() {
  const router = useRouter();
  const addCard = useGameStore.use.addCard();

  const handleCardSelect = (card: Card) => {
    // ここで選択したカードの処理を行う
    addCard(card);
    console.log('Selected card:', card);
    // 次の画面へ遷移
    router.push('/');
  };

  return (
    <>
      <CardSelectionPopup onSelect={handleCardSelect} isOpen />
      <DeckButton />
    </>
  );
}
