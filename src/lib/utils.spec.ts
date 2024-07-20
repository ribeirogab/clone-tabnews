import { describe, it, expect } from 'vitest';

import { cn } from './utils';

describe('file with general utility functions', () => {
  describe('cn', () => {
    it('should return an empty string when no arguments are passed', () => {
      expect(cn()).toBe('');
    });

    it('should concatenate class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('class1', false && 'class2', true && 'class3')).toBe(
        'class1 class3',
      );
    });

    it('should merge Tailwind classes correctly', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('should handle arrays of class names', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });

    it('should handle objects with true/false values', () => {
      expect(cn({ class1: true, class2: false, class3: true })).toBe(
        'class1 class3',
      );
    });

    it('should handle a mix of arrays, objects, and strings', () => {
      expect(
        cn('class1', ['class2', 'class3'], { class4: true, class5: false }),
      ).toBe('class1 class2 class3 class4');
    });
  });
});
