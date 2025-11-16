export interface Unit {
  id: string;
  title: string;
  tags: string[];
  goalStars: number[];
  createdAt: Date;
}

export interface Phrase {
  id: string;
  unitId: string;
  lines: string[];
}

export interface MathProblem {
  id: string;
  unitId: string;
  type: 'identification' | 'addition';
  prompt: string;
  answer: number;
  manipulatives?: 'blocks' | 'icons';
}

export interface SessionLog {
  id: string;
  unitId: string;
  date: string;
  starsEarned: number;
  attempts: number;
  correct: number;
  milestonesReached: number[];
  createdAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  iconPath: string;
  milestone: number;
}

export interface ErrorCorrectionLog {
  id: string;
  sessionLogId: string;
  problemId: string;
  problemType: string;
  incorrectAnswer: string | number;
  correctAnswer: string | number;
  correctionCyclesNeeded: number;
  finallyCorrect: boolean;
  timestamp: Date;
}

export interface AppSettings {
  id: string;
  autoAdvance: boolean;
  autoAdvanceDelay: number;
  breakPromptInterval: number;
  audioEnabled: boolean;
  dyslexiaFont: boolean;
  parentPasscode?: string;
  childAge: number;
  errorCorrection?: {
    enabled: boolean;
    showModel: boolean;
    showLead: boolean;
    modelDuration: number;
    leadDuration: number;
    maxCycles: number;
    celebrateCorrection: boolean;
  };
}
