import { positionToCoordinates, distanceFromCenter } from '@/utils/boardUtils';

describe('boardUtils', () => {
  describe('positionToCoordinates', () => {
    describe('3x3 board', () => {
      const size = 3;

      test('should convert position 0 to (0, 0)', () => {
        expect(positionToCoordinates(0, size)).toBe('(0, 0)');
      });

      test('should convert position 1 to (0, 1)', () => {
        expect(positionToCoordinates(1, size)).toBe('(0, 1)');
      });

      test('should convert position 2 to (0, 2)', () => {
        expect(positionToCoordinates(2, size)).toBe('(0, 2)');
      });

      test('should convert position 3 to (1, 0)', () => {
        expect(positionToCoordinates(3, size)).toBe('(1, 0)');
      });

      test('should convert position 4 to (1, 1) - center', () => {
        expect(positionToCoordinates(4, size)).toBe('(1, 1)');
      });

      test('should convert position 8 to (2, 2) - bottom right', () => {
        expect(positionToCoordinates(8, size)).toBe('(2, 2)');
      });
    });

    describe('5x5 board', () => {
      const size = 5;

      test('should convert position 0 to (0, 0)', () => {
        expect(positionToCoordinates(0, size)).toBe('(0, 0)');
      });

      test('should convert position 12 to (2, 2) - center', () => {
        expect(positionToCoordinates(12, size)).toBe('(2, 2)');
      });

      test('should convert position 24 to (4, 4) - bottom right', () => {
        expect(positionToCoordinates(24, size)).toBe('(4, 4)');
      });

      test('should convert position 10 to (2, 0) - left edge middle', () => {
        expect(positionToCoordinates(10, size)).toBe('(2, 0)');
      });

      test('should convert position 14 to (2, 4) - right edge middle', () => {
        expect(positionToCoordinates(14, size)).toBe('(2, 4)');
      });
    });

    describe('edge cases', () => {
      test('should handle 1x1 board', () => {
        expect(positionToCoordinates(0, 1)).toBe('(0, 0)');
      });

      test('should handle 2x2 board', () => {
        expect(positionToCoordinates(0, 2)).toBe('(0, 0)');
        expect(positionToCoordinates(1, 2)).toBe('(0, 1)');
        expect(positionToCoordinates(2, 2)).toBe('(1, 0)');
        expect(positionToCoordinates(3, 2)).toBe('(1, 1)');
      });

      test('should handle large board (10x10)', () => {
        const size = 10;
        expect(positionToCoordinates(0, size)).toBe('(0, 0)');
        expect(positionToCoordinates(99, size)).toBe('(9, 9)');
        expect(positionToCoordinates(55, size)).toBe('(5, 5)');
      });
    });
  });

  describe('distanceFromCenter', () => {
    describe('3x3 board', () => {
      const size = 3;

      test('should return 0 for center position (4)', () => {
        expect(distanceFromCenter(4, size)).toBe(0);
      });

      test('should return 1 for positions adjacent to center', () => {
        expect(distanceFromCenter(1, size)).toBe(1); // (0, 1)
        expect(distanceFromCenter(3, size)).toBe(1); // (1, 0)
        expect(distanceFromCenter(5, size)).toBe(1); // (1, 2)
        expect(distanceFromCenter(7, size)).toBe(1); // (2, 1)
      });

      test('should return 2 for corner positions', () => {
        expect(distanceFromCenter(0, size)).toBe(2); // (0, 0)
        expect(distanceFromCenter(2, size)).toBe(2); // (0, 2)
        expect(distanceFromCenter(6, size)).toBe(2); // (2, 0)
        expect(distanceFromCenter(8, size)).toBe(2); // (2, 2)
      });
    });

    describe('5x5 board', () => {
      const size = 5;

      test('should return 0 for center position (12)', () => {
        expect(distanceFromCenter(12, size)).toBe(0);
      });

      test('should return 1 for positions adjacent to center', () => {
        expect(distanceFromCenter(7, size)).toBe(1);  // (1, 2)
        expect(distanceFromCenter(11, size)).toBe(1); // (2, 1)
        expect(distanceFromCenter(13, size)).toBe(1); // (2, 3)
        expect(distanceFromCenter(17, size)).toBe(1); // (3, 2)
      });

      test('should return 2 for positions two steps from center', () => {
        expect(distanceFromCenter(2, size)).toBe(2);  // (0, 2)
        expect(distanceFromCenter(10, size)).toBe(2); // (2, 0)
        expect(distanceFromCenter(14, size)).toBe(2); // (2, 4)
        expect(distanceFromCenter(22, size)).toBe(2); // (4, 2)
      });

      test('should return 4 for corner positions', () => {
        expect(distanceFromCenter(0, size)).toBe(4);  // (0, 0)
        expect(distanceFromCenter(4, size)).toBe(4);  // (0, 4)
        expect(distanceFromCenter(20, size)).toBe(4); // (4, 0)
        expect(distanceFromCenter(24, size)).toBe(4); // (4, 4)
      });
    });

    describe('even-sized boards', () => {
      test('should handle 4x4 board correctly', () => {
        const size = 4;
        // Center is at (1.5, 1.5), so we use floor(size/2) = 2 as center
        expect(distanceFromCenter(5, size)).toBe(2);  // (1, 1) -> |1-2| + |1-2| = 2
        expect(distanceFromCenter(6, size)).toBe(1);  // (1, 2) -> |1-2| + |2-2| = 1
        expect(distanceFromCenter(10, size)).toBe(0); // (2, 2) -> |2-2| + |2-2| = 0
      });

      test('should handle 6x6 board correctly', () => {
        const size = 6;
        // Center is at floor(6/2) = 3
        expect(distanceFromCenter(21, size)).toBe(0); // (3, 3) -> |3-3| + |3-3| = 0
        expect(distanceFromCenter(0, size)).toBe(6);  // (0, 0) -> |0-3| + |0-3| = 6
        expect(distanceFromCenter(35, size)).toBe(4); // (5, 5) -> |5-3| + |5-3| = 4
      });
    });

    describe('edge cases', () => {
      test('should handle 1x1 board', () => {
        expect(distanceFromCenter(0, 1)).toBe(0);
      });

      test('should handle 2x2 board', () => {
        const size = 2;
        // Center is at floor(2/2) = 1
        expect(distanceFromCenter(0, size)).toBe(2); // (0, 0) -> |0-1| + |0-1| = 2
        expect(distanceFromCenter(3, size)).toBe(0); // (1, 1) -> |1-1| + |1-1| = 0
      });
    });
  });
});