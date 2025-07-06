import type { BlockDirection } from '@/types/battle';

export function applyBlockEffect(
  position: number,
  direction: BlockDirection,
  size: number,
): number[] {
  let blockIndexes: number[] = [];

  switch (direction) {
    case null:
      blockIndexes = [position];
      break;
    case 'up':
      blockIndexes = [position - size];
      break;
    case 'right':
      blockIndexes = [position + 1];
      if (Math.floor(position / size) !== Math.floor(blockIndexes[0] / size))
        blockIndexes = [];
      break;
    case 'down':
      blockIndexes = [position + size];
      break;
    case 'left':
      blockIndexes = [position - 1];
      if (Math.floor(position / size) !== Math.floor(blockIndexes[0] / size))
        blockIndexes = [];
      break;
    case 'all':
      blockIndexes = [
        position - size,
        position - size - 1,
        position - size + 1,
        position + size,
        position + size - 1,
        position + size + 1,
        position - 1,
        position + 1,
      ];
      break;
  }

  return blockIndexes.filter(
    (blockIndex) =>
      blockIndex !== null && blockIndex >= 0 && blockIndex < size * size,
  );
}

export function getValidBlockDirections(
  position: number,
  size: number,
): BlockDirection[] {
  const directions: BlockDirection[] = ['up', 'right', 'down', 'left'];
  return directions.filter((dir) => {
    const blockIndex = applyBlockEffect(position, dir, size);
    return blockIndex !== null;
  });
}

export function applyCrossDestroy(position: number, size: number): number[] {
  const row = Math.floor(position / size);
  const col = position % size;
  const targets: number[] = [];

  // Check diagonal four directions
  const directions = [
    [-1, -1], // Top-left
    [-1, 1], // Top-right
    [1, -1], // Bottom-left
    [1, 1], // Bottom-right
  ];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < size && c >= 0 && c < size) {
      targets.push(r * size + c);
    }
  }

  return targets;
}

export function applyAllDestroy(position: number, size: number): number[] {
  const row = Math.floor(position / size);
  const col = position % size;
  const targets: number[] = [];

  // Check diagonal four directions
  const directions = [
    [-1, -1], // Top-left
    [-1, 1], // Top-right
    [1, -1], // Bottom-left
    [1, 1], // Bottom-right
    [0, -1], // Left
    [0, 1], // Right
    [-1, 0], // Up
    [1, 0], // Down
  ];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < size && c >= 0 && c < size) {
      targets.push(r * size + c);
    }
  }

  return targets;
}
