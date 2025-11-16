import { create } from 'zustand';
import { Unit, AppSettings } from './types';

interface AppState {
  currentUnit: Unit | null;
  currentView: 'home' | 'reading' | 'math' | 'rewards' | 'dashboard' | 'settings' | 'units' | 'communication' | 'feelings' | 'needs';
  sessionStars: number;
  sessionAttempts: number;
  sessionCorrect: number;
  settings: AppSettings | null;
  setCurrentUnit: (unit: Unit | null) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  addStar: () => void;
  recordAttempt: (correct: boolean) => void;
  resetSession: () => void;
  setSettings: (settings: AppSettings) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUnit: null,
  currentView: 'home',
  sessionStars: 0,
  sessionAttempts: 0,
  sessionCorrect: 0,
  settings: null,

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
      sessionCorrect: 0
    }),

  setSettings: (settings) => set({ settings })
}));
