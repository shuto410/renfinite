export function calculateWinner(
  squares: ('X' | 'O' | null)[],
  size: number,
  winLength: number,
): { winner: 'X' | 'O' | null; completedRen: number[] | null } {
  // Check horizontal
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const startIndex = i * size + j;
      let win = true;
      const positions: number[] = [];

      for (let k = 0; k < winLength; k++) {
        const currentIndex = startIndex + k;
        positions.push(currentIndex);
        if (
          !squares[startIndex] ||
          squares[startIndex] !== squares[currentIndex]
        ) {
          win = false;
          break;
        }
      }

      if (win) {
        return { winner: null, completedRen: positions };
      }
    }
  }

  // Check vertical
  for (let i = 0; i <= size - winLength; i++) {
    for (let j = 0; j < size; j++) {
      const startIndex = i * size + j;
      let win = true;
      const positions: number[] = [];

      for (let k = 0; k < winLength; k++) {
        const currentIndex = startIndex + k * size;
        positions.push(currentIndex);
        if (
          !squares[startIndex] ||
          squares[startIndex] !== squares[currentIndex]
        ) {
          win = false;
          break;
        }
      }

      if (win) {
        return { winner: null, completedRen: positions };
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let i = 0; i <= size - winLength; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const startIndex = i * size + j;
      let win = true;
      const positions: number[] = [];

      for (let k = 0; k < winLength; k++) {
        const currentIndex = startIndex + k * (size + 1);
        positions.push(currentIndex);
        if (
          !squares[startIndex] ||
          squares[startIndex] !== squares[currentIndex]
        ) {
          win = false;
          break;
        }
      }

      if (win) {
        return { winner: null, completedRen: positions };
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let i = 0; i <= size - winLength; i++) {
    for (let j = winLength - 1; j < size; j++) {
      const startIndex = i * size + j;
      let win = true;
      const positions: number[] = [];

      for (let k = 0; k < winLength; k++) {
        const currentIndex = startIndex + k * (size - 1);
        positions.push(currentIndex);
        if (
          !squares[startIndex] ||
          squares[startIndex] !== squares[currentIndex]
        ) {
          win = false;
          break;
        }
      }

      if (win) {
        return { winner: null, completedRen: positions };
      }
    }
  }

  return { winner: null, completedRen: null };
}
