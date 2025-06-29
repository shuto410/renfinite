'use client';
import { DialogWindow } from '@/components/DialogWindow';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EventPage() {
  const router = useRouter();
  const [currentDialogue, setCurrentDialogue] = useState(0);

  const dialogues = [
    {
      characterName: 'AI Assistant',
      characterImage: '/images/event_person.jpg',
      dialogue:
        "Commander, we've detected an anomaly in the digital realm. Your presence is required to investigate this mysterious event.",
    },
    {
      characterName: 'AI Assistant',
      characterImage: '/images/event_person.jpg',
      dialogue:
        'The system is showing unusual patterns. We need to analyze the data and make a decision that could affect our entire network.',
    },
    {
      characterName: 'AI Assistant',
      characterImage: '/images/event_person.jpg',
      dialogue:
        'Your next move will be crucial. Choose your path wisely, Commander.',
    },
  ];

  const handleNovelClick = () => {
    if (currentDialogue < dialogues.length - 1) {
      setCurrentDialogue((prev) => prev + 1);
    } else {
      router.push('/');
    }
  };

  return (
    <DialogWindow
      characterName={dialogues[currentDialogue].characterName}
      characterImage={dialogues[currentDialogue].characterImage}
      dialogue={dialogues[currentDialogue].dialogue}
      onClick={handleNovelClick}
    />
  );
}
