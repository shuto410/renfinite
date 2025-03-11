export function calculateWinner(
  squares: ('X' | 'O' | null)[],
  size: number,
  winLength: number,
): 'X' | 'O' | null {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const startIndex = i * size + j;
      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (
          !squares[startIndex] ||
          squares[startIndex] !== squares[startIndex + k]
        ) {
          win = false;
          break;
        }
      }
      if (win) return squares[startIndex];
    }
  }

  for (let i = 0; i <= size - winLength; i++) {
    for (let j = 0; j < size; j++) {
      const startIndex = i * size + j;
      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (
          !squares[startIndex] ||
          squares[startIndex] !== squares[startIndex + k * size]
        ) {
          win = false;
          break;
        }
      }
      if (win) return squares[startIndex];
    }
  }

  for (let i = 0; i <= size - winLength; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const startIndex = i * size + j;
      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (
          !squares[startIndex] ||
          squares[startIndex] !== squares[startIndex + k * (size + 1)]
        ) {
          win = false;
          break;
        }
      }
      if (win) return squares[startIndex];
    }
  }

  for (let i = 0; i <= size - winLength; i++) {
    for (let j = winLength - 1; j < size; j++) {
      const startIndex = i * size + j;
      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (
          !squares[startIndex] ||
          squares[startIndex] !== squares[startIndex + k * (size - 1)]
        ) {
          win = false;
          break;
        }
      }
      if (win) return squares[startIndex];
    }
  }

  return null;
}
