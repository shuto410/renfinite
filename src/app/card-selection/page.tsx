'use client';

import { CardSelectionView } from '@/components/CardSelectionView';
import { DeckButton } from '@/components/DeckButton';
import { Magic } from '@/types/game';
import { useRouter } from 'next/navigation';

export default function CardSelection() {
  const router = useRouter();

  const handleCardSelect = (card: Magic) => {
    // ここで選択したカードの処理を行う
    console.log('Selected card:', card);
    // 次の画面へ遷移
    router.push('/');
  };

  return (
    <>
      <CardSelectionView onSelect={handleCardSelect} />;
      <DeckButton />
    </>
  );
}
