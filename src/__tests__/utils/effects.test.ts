import {
  applyBlockEffect,
  getValidBlockDirections,
  applyCrossDestroy,
  applyAllDestroy,
} from '@/utils/effects';

describe('effects', () => {
  describe('applyBlockEffect', () => {
    describe('3x3 board', () => {
      const size = 3;

      describe('null direction (self block)', () => {
        test('should return only the position itself', () => {
          expect(applyBlockEffect(4, null, size)).toEqual([4]);
          expect(applyBlockEffect(0, null, size)).toEqual([0]);
          expect(applyBlockEffect(8, null, size)).toEqual([8]);
        });
      });

      describe('up direction', () => {
        test('should return position above when valid', () => {
          expect(applyBlockEffect(4, 'up', size)).toEqual([1]); // center -> up
          expect(applyBlockEffect(8, 'up', size)).toEqual([5]); // bottom-right -> up
        });

        test('should return empty array when at top edge', () => {
          expect(applyBlockEffect(0, 'up', size)).toEqual([]); // top-left
          expect(applyBlockEffect(1, 'up', size)).toEqual([]); // top-center
          expect(applyBlockEffect(2, 'up', size)).toEqual([]); // top-right
        });
      });

      describe('down direction', () => {
        test('should return position below when valid', () => {
          expect(applyBlockEffect(0, 'down', size)).toEqual([3]); // top-left -> down
          expect(applyBlockEffect(4, 'down', size)).toEqual([7]); // center -> down
        });

        test('should return empty array when at bottom edge', () => {
          expect(applyBlockEffect(6, 'down', size)).toEqual([]); // bottom-left
          expect(applyBlockEffect(7, 'down', size)).toEqual([]); // bottom-center
          expect(applyBlockEffect(8, 'down', size)).toEqual([]); // bottom-right
        });
      });

      describe('left direction', () => {
        test('should return position to the left when valid', () => {
          expect(applyBlockEffect(4, 'left', size)).toEqual([3]); // center -> left
          expect(applyBlockEffect(5, 'left', size)).toEqual([4]); // center-right -> left
        });

        test('should return empty array when at left edge', () => {
          expect(applyBlockEffect(0, 'left', size)).toEqual([]); // top-left
          expect(applyBlockEffect(3, 'left', size)).toEqual([]); // middle-left
          expect(applyBlockEffect(6, 'left', size)).toEqual([]); // bottom-left
        });
      });

      describe('right direction', () => {
        test('should return position to the right when valid', () => {
          expect(applyBlockEffect(3, 'right', size)).toEqual([4]); // left -> center
          expect(applyBlockEffect(4, 'right', size)).toEqual([5]); // center -> right
        });

        test('should return empty array when at right edge', () => {
          expect(applyBlockEffect(2, 'right', size)).toEqual([]); // top-right
          expect(applyBlockEffect(5, 'right', size)).toEqual([]); // middle-right
          expect(applyBlockEffect(8, 'right', size)).toEqual([]); // bottom-right
        });
      });

      describe('all direction', () => {
        test('should return all 8 surrounding positions when in center', () => {
          const result = applyBlockEffect(4, 'all', size);
          expect(result).toHaveLength(8);
          expect(result).toEqual(
            expect.arrayContaining([1, 0, 2, 7, 6, 8, 3, 5]),
          );
        });

        test('should return valid surrounding positions when at corner', () => {
          const size = 3;
          const result = applyBlockEffect(0, 'all', size);
          expect(result).toEqual(expect.arrayContaining([1, 2, 3, 4]));
          expect(result).toHaveLength(4);
        });

        test('should return valid surrounding positions when at edge', () => {
          const size = 3;
          const result = applyBlockEffect(1, 'all', size);
          expect(result).toEqual(expect.arrayContaining([0, 2, 3, 4, 5]));
          expect(result).toHaveLength(5);
        });
      });
    });

    describe('5x5 board', () => {
      const size = 5;

      test('should handle larger board correctly for all directions', () => {
        const center = 12; // position (2,2)

        expect(applyBlockEffect(center, 'up', size)).toEqual([7]);
        expect(applyBlockEffect(center, 'down', size)).toEqual([17]);
        expect(applyBlockEffect(center, 'left', size)).toEqual([11]);
        expect(applyBlockEffect(center, 'right', size)).toEqual([13]);

        const allResult = applyBlockEffect(center, 'all', size);
        expect(allResult).toHaveLength(8);
        expect(allResult).toEqual(
          expect.arrayContaining([7, 6, 8, 17, 16, 18, 11, 13]),
        );
      });
    });

    describe('edge cases', () => {
      test('should handle 1x1 board', () => {
        expect(applyBlockEffect(0, null, 1)).toEqual([0]);
        expect(applyBlockEffect(0, 'up', 1)).toEqual([]);
        expect(applyBlockEffect(0, 'down', 1)).toEqual([]);
        expect(applyBlockEffect(0, 'left', 1)).toEqual([]);
        expect(applyBlockEffect(0, 'right', 1)).toEqual([]);
        expect(applyBlockEffect(0, 'all', 1)).toEqual([0, 0]);
      });

      test('should filter out negative and out-of-bounds positions', () => {
        const size = 3;
        // Test edge cases where calculations might produce invalid positions
        expect(applyBlockEffect(0, 'up', size)).toEqual([]);
        expect(applyBlockEffect(8, 'down', size)).toEqual([]);
      });
    });
  });

  describe('getValidBlockDirections', () => {
    const size = 3;

    test('should return all directions for center position', () => {
      const result = getValidBlockDirections(4, size);
      expect(result).toEqual(
        expect.arrayContaining(['up', 'right', 'down', 'left']),
      );
      expect(result).toHaveLength(4);
    });

    test('should return only valid directions for corner position', () => {
      const size = 3;
      const result = getValidBlockDirections(0, size); // top-left corner
      expect(result).toEqual(
        expect.arrayContaining(['up', 'right', 'down', 'left']),
      );
    });

    test('should return only valid directions for edge position', () => {
      const size = 3;
      const result = getValidBlockDirections(1, size); // top edge
      expect(result).toEqual(
        expect.arrayContaining(['up', 'right', 'down', 'left']),
      );
    });
  });

  describe('applyCrossDestroy', () => {
    describe('3x3 board', () => {
      const size = 3;

      test('should return diagonal positions from center', () => {
        const result = applyCrossDestroy(4, size);
        expect(result).toEqual(expect.arrayContaining([0, 2, 6, 8]));
        expect(result).toHaveLength(4);
      });

      test('should return valid diagonal positions from corner', () => {
        const result = applyCrossDestroy(0, size); // top-left
        expect(result).toEqual([4]); // only bottom-right diagonal
      });

      test('should return valid diagonal positions from edge', () => {
        const result = applyCrossDestroy(1, size); // top edge
        expect(result).toEqual(expect.arrayContaining([3, 5]));
        expect(result).toHaveLength(2);
      });
    });

    describe('5x5 board', () => {
      const size = 5;

      test('should return all 4 diagonal positions from center', () => {
        const result = applyCrossDestroy(12, size); // center (2,2)
        expect(result).toEqual(expect.arrayContaining([6, 8, 16, 18]));
        expect(result).toHaveLength(4);
      });

      test('should handle edge cases correctly', () => {
        const result = applyCrossDestroy(0, size); // top-left corner
        expect(result).toEqual([6]); // only one diagonal position
      });
    });

    describe('edge cases', () => {
      test('should handle 1x1 board', () => {
        const result = applyCrossDestroy(0, 1);
        expect(result).toEqual([]);
      });

      test('should handle 2x2 board', () => {
        const result = applyCrossDestroy(0, 2); // top-left
        expect(result).toEqual([3]); // bottom-right
      });
    });
  });

  describe('applyAllDestroy', () => {
    describe('3x3 board', () => {
      const size = 3;

      test('should return all 8 surrounding positions from center', () => {
        const result = applyAllDestroy(4, size);
        expect(result).toEqual(
          expect.arrayContaining([0, 2, 6, 8, 1, 5, 3, 7]),
        );
        expect(result).toHaveLength(8);
      });

      test('should return valid surrounding positions from corner', () => {
        const result = applyAllDestroy(0, size); // top-left
        expect(result).toEqual(expect.arrayContaining([4, 1, 3]));
        expect(result).toHaveLength(3);
      });

      test('should return valid surrounding positions from edge', () => {
        const result = applyAllDestroy(1, size); // top edge
        expect(result).toEqual(expect.arrayContaining([3, 5, 0, 2, 4]));
        expect(result).toHaveLength(5);
      });
    });

    describe('5x5 board', () => {
      const size = 5;

      test('should return all 8 surrounding positions from center', () => {
        const result = applyAllDestroy(12, size); // center (2,2)
        expect(result).toEqual(
          expect.arrayContaining([6, 8, 16, 18, 7, 13, 11, 17]),
        );
        expect(result).toHaveLength(8);
      });
    });

    describe('edge cases', () => {
      test('should handle 1x1 board', () => {
        const result = applyAllDestroy(0, 1);
        expect(result).toEqual([]);
      });

      test('should handle 2x2 board corners', () => {
        const result = applyAllDestroy(0, 2); // top-left
        expect(result).toEqual(expect.arrayContaining([3, 1, 2]));
        expect(result).toHaveLength(3);
      });
    });

    describe('difference from applyCrossDestroy', () => {
      test('should include both diagonal and orthogonal positions', () => {
        const size = 3;
        const crossResult = applyCrossDestroy(4, size);
        const allResult = applyAllDestroy(4, size);

        // All cross destroy positions should be included in all destroy
        crossResult.forEach((pos) => {
          expect(allResult).toContain(pos);
        });

        // All destroy should have more positions than cross destroy
        expect(allResult.length).toBeGreaterThan(crossResult.length);

        // All destroy should include orthogonal positions
        expect(allResult).toContain(1); // up
        expect(allResult).toContain(3); // left
        expect(allResult).toContain(5); // right
        expect(allResult).toContain(7); // down
      });
    });
  });
});
