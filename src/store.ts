import { create } from 'zustand';
import { Unit, AppSettings, SessionPlan, SessionActivity, SessionLog } from './types';

interface AppState {
  currentUnit: Unit | null;
  currentView: 'home' | 'reading' | 'math' | 'science' | 'break' | 'rewards' | 'progress' | 'dashboard' | 'settings' | 'units' | 'preview' | 'schedule' | 'choice-boards' | 'session-summary';
  sessionStars: number;
  sessionAttempts: number;
  sessionCorrect: number;
  sessionStartTime: number | null;
  settings: AppSettings | null;
  sessionPlan: SessionPlan | null;
  showImmediateReward: boolean;
  selectedActivities: Array<'reading' | 'math' | 'science' | 'break'>;
  activityOrder: Array<'reading' | 'math' | 'science' | 'break'>;
  currentSessionLog: SessionLog | null;
  setCurrentUnit: (unit: Unit | null) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  addStar: () => void;
  recordAttempt: (correct: boolean) => void;
  resetSession: () => void;
  setSettings: (settings: AppSettings) => void;
  setSessionPlan: (plan: SessionPlan | null) => void;
  updateActivityStatus: (activityId: string, status: SessionActivity['status']) => void;
  nextActivity: () => void;
  setShowImmediateReward: (show: boolean) => void;
  setActivityChoices: (activities: Array<'reading' | 'math' | 'science' | 'break'>, order: Array<'reading' | 'math' | 'science' | 'break'>) => void;
  setCurrentSessionLog: (log: SessionLog | null) => void;
  startSession: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentUnit: null,
  currentView: 'home',
  sessionStars: 0,
  sessionAttempts: 0,
  sessionCorrect: 0,
  sessionStartTime: null,
  settings: null,
  sessionPlan: null,
  showImmediateReward: false,
  selectedActivities: [],
  activityOrder: [],
  currentSessionLog: null,

  setCurrentUnit: (unit) => set({ currentUnit: unit }),

  setCurrentView: (view) => set({ currentView: view }),

  addStar: () => set((state) => ({ sessionStars: state.sessionStars + 1 })),

  recordAttempt: (correct) =>
    set((state) => ({
      sessionAttempts: state.sessionAttempts + 1,
      sessionCorrect: state.sessionCorrect + (correct ? 1 : 0)
    })),

  resetSession: () =>
    set({
      sessionStars: 0,
      sessionAttempts: 0,
      sessionCorrect: 0,
      sessionStartTime: null,
      sessionPlan: null,
      currentSessionLog: null
    }),

  setSettings: (settings) => set({ settings }),

  setSessionPlan: (plan) => set({ sessionPlan: plan }),

  updateActivityStatus: (activityId, status) =>
    set((state) => {
      if (!state.sessionPlan) return state;

      const updatedActivities = state.sessionPlan.activities.map(activity =>
        activity.id === activityId ? { ...activity, status } : activity
      );

      return {
        sessionPlan: {
          ...state.sessionPlan,
          activities: updatedActivities
        }
      };
    }),

  nextActivity: () =>
    set((state) => {
      if (!state.sessionPlan) return state;

      const nextIndex = state.sessionPlan.currentActivityIndex + 1;

      return {
        sessionPlan: {
          ...state.sessionPlan,
          currentActivityIndex: nextIndex
        }
      };
    }),

  setShowImmediateReward: (show) => set({ showImmediateReward: show }),

  setActivityChoices: (activities, order) =>
    set({ selectedActivities: activities, activityOrder: order }),

  setCurrentSessionLog: (log) => set({ currentSessionLog: log }),

  startSession: () => set({ sessionStartTime: Date.now() })
}));
