import { describe, it, expect } from 'vitest';
import { buildSessionLog } from './session';
import { Unit } from '../types';

describe('session utils', () => {
  const sampleUnit: Unit = {
    id: 'test-unit-001',
    title: 'Test Unit',
    tags: ['math'],
    goalStars: [5, 10, 15],
    createdAt: new Date()
  };

  it('should build a session log correctly with correct milestones', () => {
    // 11 stars should reach milestones 5 and 10, but not 15
    const sessionLog = buildSessionLog(sampleUnit, {
      stars: 11,
      attempts: 15,
      correct: 12
    });

    expect(sessionLog.unitId).toBe('test-unit-001');
    expect(sessionLog.starsEarned).toBe(11);
    expect(sessionLog.attempts).toBe(15);
    expect(sessionLog.correct).toBe(12);
    expect(sessionLog.milestonesReached).toEqual([5, 10]);
    expect(sessionLog.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // yyyy-MM-dd
  });

  it('should build a session log with no milestones reached if stars earned is low', () => {
    const sessionLog = buildSessionLog(sampleUnit, {
      stars: 3,
      attempts: 5,
      correct: 4
    });

    expect(sessionLog.milestonesReached).toEqual([]);
  });

  it('should build a session log with all milestones reached if stars earned is high', () => {
    const sessionLog = buildSessionLog(sampleUnit, {
      stars: 20,
      attempts: 20,
      correct: 20
    });

    expect(sessionLog.milestonesReached).toEqual([5, 10, 15]);
  });
});
