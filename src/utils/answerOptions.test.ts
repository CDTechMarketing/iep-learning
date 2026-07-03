import { describe, it, expect } from 'vitest';
import { generateAnswerOptions } from './answerOptions';

describe('generateAnswerOptions', () => {
  const testCases = [
    { answer: 2, type: 'addition' },
    { answer: 9, type: 'addition' },
    { answer: 23, type: 'addition' },
    { answer: 47, type: 'addition' },
    { answer: 2, type: 'identification' },
    { answer: 9, type: 'identification' },
    { answer: 23, type: 'identification' },
    { answer: 47, type: 'identification' }
  ];

  testCases.forEach(({ answer, type }) => {
    it(`should generate options for answer ${answer} and type ${type} instantly and correctly`, () => {
      const startTime = performance.now();
      const options = generateAnswerOptions(answer, type);
      const duration = performance.now() - startTime;

      // Completes instantly (rejection sampling used to freeze, this should be well under 10ms)
      expect(duration).toBeLessThan(50);

      // Returns 4 options
      expect(options).toHaveLength(4);

      // Options are distinct
      const uniqueOptions = new Set(options);
      expect(uniqueOptions.size).toBe(4);

      // Includes the correct answer
      expect(options).toContain(answer);

      // All options are non-negative
      options.forEach(opt => {
        expect(opt).toBeGreaterThanOrEqual(0);
      });

      // Options are sorted ascending
      const sortedOptions = [...options].sort((a, b) => a - b);
      expect(options).toEqual(sortedOptions);
    });
  });
});
