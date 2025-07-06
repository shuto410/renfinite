'use client';

import { CardSelectionPopup } from '@/components/CardSelectionPopup';
import { DeckButton } from '@/components/DeckButton';
import { useGameStore } from '@/store';
import { Card } from '@/types/battle';
import { useRouter } from 'next/navigation';

export default function CardSelection() {
  const router = useRouter();
  const addCard = useGameStore.use.addCard();

  const handleCardSelect = (card: Card) => {
    // Process selected card here
    addCard(card);
    // Navigate to next screen
    router.push('/');
  };

  return (
    <>
      <CardSelectionPopup onSelect={handleCardSelect} isOpen />
      <DeckButton />
    </>
  );
}
