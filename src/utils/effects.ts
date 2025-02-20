import type { BlockDirection } from '@/types/game';

export function applyBlockEffect(
  position: number,
  direction: BlockDirection,
  size: number,
): number | null {
  let blockIndex: number | null = null;

  switch (direction) {
    case 'up':
      blockIndex = position - size;
      break;
    case 'right':
      blockIndex = position + 1;
      if (Math.floor(position / size) !== Math.floor(blockIndex / size)) blockIndex = null;
      break;
    case 'down':
      blockIndex = position + size;
      break;
    case 'left':
      blockIndex = position - 1;
      if (Math.floor(position / size) !== Math.floor(blockIndex / size)) blockIndex = null;
      break;
  }

  if (blockIndex !== null && blockIndex >= 0 && blockIndex < size * size) {
    return blockIndex;
  }
  return null;
}

export function getValidBlockDirections(
  position: number,
  size: number,
  squares: ('X' | 'O' | null)[]
): BlockDirection[] {
  const directions: BlockDirection[] = ['up', 'right', 'down', 'left'];
  return directions.filter(dir => {
    const blockIndex = applyBlockEffect(position, dir, size);
    return blockIndex !== null;
  });
} 