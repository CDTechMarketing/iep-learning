import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { SessionPlan } from './types';

describe('Zustand store', () => {
  beforeEach(() => {
    // Reset state before each test
    useStore.getState().resetSession();
  });

  it('should initialize with correct default state', () => {
    const state = useStore.getState();
    expect(state.sessionStars).toBe(0);
    expect(state.sessionAttempts).toBe(0);
    expect(state.sessionCorrect).toBe(0);
    expect(state.sessionStartTime).toBeNull();
    expect(state.sessionPlan).toBeNull();
  });

  it('should increment attempts and correct count on recordAttempt', () => {
    // Record first attempt: correct
    useStore.getState().recordAttempt(true);
    let state = useStore.getState();
    expect(state.sessionAttempts).toBe(1);
    expect(state.sessionCorrect).toBe(1);

    // Record second attempt: incorrect
    useStore.getState().recordAttempt(false);
    state = useStore.getState();
    expect(state.sessionAttempts).toBe(2);
    expect(state.sessionCorrect).toBe(1);
  });

  it('should increment stars on addStar', () => {
    useStore.getState().addStar();
    let state = useStore.getState();
    expect(state.sessionStars).toBe(1);

    useStore.getState().addStar();
    state = useStore.getState();
    expect(state.sessionStars).toBe(2);
  });

  it('should set start session time', () => {
    const before = Date.now();
    useStore.getState().startSession();
    const state = useStore.getState();
    const after = Date.now();

    expect(state.sessionStartTime).toBeGreaterThanOrEqual(before);
    expect(state.sessionStartTime).toBeLessThanOrEqual(after);
  });

  it('should reset session parameters correctly', () => {
    useStore.getState().addStar();
    useStore.getState().recordAttempt(true);
    useStore.getState().startSession();

    useStore.getState().resetSession();
    const state = useStore.getState();
    expect(state.sessionStars).toBe(0);
    expect(state.sessionAttempts).toBe(0);
    expect(state.sessionCorrect).toBe(0);
    expect(state.sessionStartTime).toBeNull();
  });

  it('should update activity status and transition to next activity', () => {
    const samplePlan: SessionPlan = {
      id: 'plan-1',
      unitId: 'unit-1',
      activities: [
        { id: 'act-1', type: 'reading', title: 'Reading', icon: '📖', estimatedItems: 5, starsToEarn: 3, status: 'pending' },
        { id: 'act-2', type: 'math', title: 'Math', icon: '🔢', estimatedItems: 5, starsToEarn: 3, status: 'pending' }
      ],
      currentActivityIndex: 0,
      createdAt: new Date()
    };

    useStore.getState().setSessionPlan(samplePlan);
    let state = useStore.getState();
    expect(state.sessionPlan).toEqual(samplePlan);

    // Update status
    useStore.getState().updateActivityStatus('act-1', 'in-progress');
    state = useStore.getState();
    expect(state.sessionPlan?.activities[0].status).toBe('in-progress');

    // Next activity
    useStore.getState().nextActivity();
    state = useStore.getState();
    expect(state.sessionPlan?.currentActivityIndex).toBe(1);
  });
});
