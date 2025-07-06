import { calculateWinner } from '@/utils';

describe('calculateWinner', () => {
  describe('3x3 board with win length 3', () => {
    const size = 3;
    const winLength = 3;

    describe('horizontal wins', () => {
      test('should detect horizontal win in top row', () => {
        const squares = ['X', 'X', 'X', null, null, null, null, null, null] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe('X');
        expect(result.completedRen).toEqual([0, 1, 2]);
      });

      test('should detect horizontal win in middle row', () => {
        const squares = [null, null, null, 'O', 'O', 'O', null, null, null] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe('O');
        expect(result.completedRen).toEqual([3, 4, 5]);
      });

      test('should detect horizontal win in bottom row', () => {
        const squares = [null, null, null, null, null, null, 'X', 'X', 'X'] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe('X');
        expect(result.completedRen).toEqual([6, 7, 8]);
      });
    });

    describe('vertical wins', () => {
      test('should detect vertical win in left column', () => {
        const squares = ['X', null, null, 'X', null, null, 'X', null, null] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe('X');
        expect(result.completedRen).toEqual([0, 3, 6]);
      });

      test('should detect vertical win in middle column', () => {
        const squares = [null, 'O', null, null, 'O', null, null, 'O', null] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe('O');
        expect(result.completedRen).toEqual([1, 4, 7]);
      });

      test('should detect vertical win in right column', () => {
        const squares = [null, null, 'X', null, null, 'X', null, null, 'X'] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe('X');
        expect(result.completedRen).toEqual([2, 5, 8]);
      });
    });

    describe('diagonal wins', () => {
      test('should detect diagonal win from top-left to bottom-right', () => {
        const squares = ['X', null, null, null, 'X', null, null, null, 'X'] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe('X');
        expect(result.completedRen).toEqual([0, 4, 8]);
      });

      test('should detect diagonal win from top-right to bottom-left', () => {
        const squares = [null, null, 'O', null, 'O', null, 'O', null, null] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe('O');
        expect(result.completedRen).toEqual([2, 4, 6]);
      });
    });

    describe('no winner scenarios', () => {
      test('should return null when no winning condition is met', () => {
        const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as (
          | 'X'
          | 'O'
          | null
        )[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe(null);
        expect(result.completedRen).toBe(null);
      });

      test('should return null for empty board', () => {
        const squares = Array(9).fill(null) as ('X' | 'O' | null)[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe(null);
        expect(result.completedRen).toBe(null);
      });

      test('should return null when only two in a row', () => {
        const squares = [
          'X',
          'X',
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ] as ('X' | 'O' | null)[];
        const result = calculateWinner(squares, size, winLength);
        expect(result.winner).toBe(null);
        expect(result.completedRen).toBe(null);
      });
    });
  });

  describe('5x5 board with win length 4', () => {
    const size = 5;
    const winLength = 4;

    test('should detect horizontal win in first row', () => {
      const squares = Array(25).fill(null) as ('X' | 'O' | null)[];
      squares[0] = 'X';
      squares[1] = 'X';
      squares[2] = 'X';
      squares[3] = 'X';

      const result = calculateWinner(squares, size, winLength);
      expect(result.winner).toBe('X');
      expect(result.completedRen).toEqual([0, 1, 2, 3]);
    });

    test('should detect vertical win in first column', () => {
      const squares = Array(25).fill(null) as ('X' | 'O' | null)[];
      squares[0] = 'O'; // (0,0)
      squares[5] = 'O'; // (1,0)
      squares[10] = 'O'; // (2,0)
      squares[15] = 'O'; // (3,0)

      const result = calculateWinner(squares, size, winLength);
      expect(result.winner).toBe('O');
      expect(result.completedRen).toEqual([0, 5, 10, 15]);
    });

    test('should detect diagonal win', () => {
      const squares = Array(25).fill(null) as ('X' | 'O' | null)[];
      squares[0] = 'X'; // (0,0)
      squares[6] = 'X'; // (1,1)
      squares[12] = 'X'; // (2,2)
      squares[18] = 'X'; // (3,3)

      const result = calculateWinner(squares, size, winLength);
      expect(result.winner).toBe('X');
      expect(result.completedRen).toEqual([0, 6, 12, 18]);
    });

    test('should detect win in middle of board', () => {
      const squares = Array(25).fill(null) as ('X' | 'O' | null)[];
      squares[6] = 'O'; // (1,1)
      squares[7] = 'O'; // (1,2)
      squares[8] = 'O'; // (1,3)
      squares[9] = 'O'; // (1,4)

      const result = calculateWinner(squares, size, winLength);
      expect(result.winner).toBe('O');
      expect(result.completedRen).toEqual([6, 7, 8, 9]);
    });
  });

  describe('different win lengths', () => {
    const size = 5;

    test('should detect win with length 2', () => {
      const winLength = 2;
      const squares = Array(25).fill(null) as ('X' | 'O' | null)[];
      squares[0] = 'X';
      squares[1] = 'X';

      const result = calculateWinner(squares, size, winLength);
      expect(result.winner).toBe('X');
      expect(result.completedRen).toEqual([0, 1]);
    });

    test('should detect win with length 5', () => {
      const winLength = 5;
      const squares = Array(25).fill(null) as ('X' | 'O' | null)[];
      // Fill entire first row
      for (let i = 0; i < 5; i++) {
        squares[i] = 'O';
      }

      const result = calculateWinner(squares, size, winLength);
      expect(result.winner).toBe('O');
      expect(result.completedRen).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('edge cases', () => {
    test('should handle 1x1 board', () => {
      const squares = ['X'] as ('X' | 'O' | null)[];
      const result = calculateWinner(squares, 1, 1);
      expect(result.winner).toBe('X');
      expect(result.completedRen).toEqual([0]);
    });

    test('should handle 2x2 board', () => {
      const squares = ['X', 'X', null, null] as ('X' | 'O' | null)[];
      const result = calculateWinner(squares, 2, 2);
      expect(result.winner).toBe('X');
      expect(result.completedRen).toEqual([0, 1]);
    });

    test('should handle larger board (7x7)', () => {
      const size = 7;
      const winLength = 5;
      const squares = Array(49).fill(null) as ('X' | 'O' | null)[];

      // Create a diagonal win
      for (let i = 0; i < 5; i++) {
        squares[i * size + i] = 'X'; // positions 0, 8, 16, 24, 32
      }

      const result = calculateWinner(squares, size, winLength);
      expect(result.winner).toBe('X');
      expect(result.completedRen).toEqual([0, 8, 16, 24, 32]);
    });

    test('should handle mixed pieces but no winner', () => {
      const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'] as (
        | 'X'
        | 'O'
        | null
      )[];
      const result = calculateWinner(squares, 3, 3);
      expect(result.winner).toBe(null);
      expect(result.completedRen).toBe(null);
    });
  });

  describe('multiple potential wins', () => {
    test('should return first winning pattern found (horizontal precedence)', () => {
      const size = 4;
      const winLength = 3;
      const squares = Array(16).fill(null) as ('X' | 'O' | null)[];

      // Create both horizontal and vertical wins
      squares[0] = 'X';
      squares[1] = 'X';
      squares[2] = 'X'; // horizontal win
      squares[0] = 'X';
      squares[4] = 'X';
      squares[8] = 'X'; // vertical win (same pieces)

      const result = calculateWinner(squares, size, winLength);
      expect(result.winner).toBe('X');
      // Should find horizontal first (algorithm checks horizontal before vertical)
      expect(result.completedRen).toEqual([0, 1, 2]);
    });
  });

  describe('partial sequences', () => {
    test('should not detect win with interrupted sequence', () => {
      const squares = ['X', 'O', 'X', null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const result = calculateWinner(squares, 3, 3);
      expect(result.winner).toBe(null);
      expect(result.completedRen).toBe(null);
    });

    test('should not detect win with different pieces in sequence', () => {
      const squares = ['X', 'O', 'X', null, null, null, null, null, null] as (
        | 'X'
        | 'O'
        | null
      )[];
      const result = calculateWinner(squares, 3, 2);
      expect(result.winner).toBe(null);
      expect(result.completedRen).toBe(null);
    });
  });
});
