import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  test('should combine simple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  test('should handle undefined and null values', () => {
    expect(cn('class1', undefined, 'class2', null)).toBe('class1 class2');
  });

  test('should handle empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });

  test('should handle conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  test('should handle arrays', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
  });

  test('should handle objects', () => {
    expect(cn({
      'class1': true,
      'class2': false,
      'class3': true
    })).toBe('class1 class3');
  });

  test('should handle Tailwind CSS merge conflicts', () => {
    // This tests the tailwind-merge functionality
    expect(cn('px-2 py-1', 'px-3')).toBe('py-1 px-3');
  });

  test('should handle complex combinations', () => {
    expect(cn(
      'base-class',
      {
        'conditional-class': true,
        'false-class': false
      },
      ['array-class1', 'array-class2'],
      undefined,
      'final-class'
    )).toBe('base-class conditional-class array-class1 array-class2 final-class');
  });

  test('should handle no arguments', () => {
    expect(cn()).toBe('');
  });

  test('should handle only falsy values', () => {
    expect(cn(false, null, undefined, '')).toBe('');
  });

  test('should handle Tailwind CSS responsive and state modifiers', () => {
    expect(cn('sm:px-2', 'hover:bg-blue-500', 'sm:px-4')).toBe('hover:bg-blue-500 sm:px-4');
  });

  test('should handle Tailwind CSS color variants', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  test('should preserve non-conflicting classes', () => {
    expect(cn('flex', 'items-center', 'justify-between', 'p-4')).toBe('flex items-center justify-between p-4');
  });
});