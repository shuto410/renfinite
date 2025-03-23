/**
 * Converts a board position to human-readable coordinates
 * @param position - The linear position on the board
 * @param size - The size of the board (width/height)
 * @returns A string representation of coordinates in the format "(row, col)"
 */
export function positionToCoordinates(position: number, size: number): string {
  const row = Math.floor(position / size);
  const col = position % size;
  return `(${row}, ${col})`;
}

/**
 * Calculates the Manhattan distance from the center of the board
 * @param position - The linear position on the board
 * @param size - The size of the board (width/height)
 * @returns The Manhattan distance from the center
 */
export function distanceFromCenter(position: number, size: number): number {
  const row = Math.floor(position / size);
  const col = position % size;
  const center = Math.floor(size / 2);
  return Math.abs(row - center) + Math.abs(col - center);
}
