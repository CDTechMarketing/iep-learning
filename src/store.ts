import { create } from 'zustand';
import { Unit, AppSettings, SessionPlan, SessionActivity } from './types';

interface AppState {
  currentUnit: Unit | null;
  currentView: 'home' | 'reading' | 'math' | 'science' | 'break' | 'rewards' | 'progress' | 'dashboard' | 'settings' | 'units' | 'preview' | 'schedule';
  sessionStars: number;
  sessionAttempts: number;
  sessionCorrect: number;
  settings: AppSettings | null;
  sessionPlan: SessionPlan | null;
  showImmediateReward: boolean;
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
}

export const useStore = create<AppState>((set) => ({
  currentUnit: null,
  currentView: 'home',
  sessionStars: 0,
  sessionAttempts: 0,
  sessionCorrect: 0,
  settings: null,
  sessionPlan: null,
  showImmediateReward: false,

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
      sessionPlan: null
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

  setShowImmediateReward: (show) => set({ showImmediateReward: show })
}));
