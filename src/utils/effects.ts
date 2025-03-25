import type { BlockDirection } from '@/types/game';

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
        position,
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

  // 斜め四方向のチェック
  const directions = [
    [-1, -1], // 左上
    [-1, 1], // 右上
    [1, -1], // 左下
    [1, 1], // 右下
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

  // 斜め四方向のチェック
  const directions = [
    [-1, -1], // 左上
    [-1, 1], // 右上
    [1, -1], // 左下
    [1, 1], // 右下
    [0, -1], // 左
    [0, 1], // 右
    [-1, 0], // 上
    [1, 0], // 下
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
