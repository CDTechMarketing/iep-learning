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

export interface AppSettings {
  id: string;
  autoAdvance: boolean;
  autoAdvanceDelay: number;
  breakPromptInterval: number;
  audioEnabled: boolean;
  dyslexiaFont: boolean;
  parentPasscode?: string;
  childAge: number;
}

// Sight Words Mastery Coach Types
export interface SightWord {
  id: string;
  word: string;
  list: 'dolch-preprimer' | 'dolch-primer' | 'dolch-1' | 'dolch-2' | 'dolch-3' | 'fry-1-100' | 'fry-101-200' | 'fry-201-300' | 'custom';
  frequency: number; // 1-300
  imageUrl?: string; // Optional picture association
  exampleSentence: string;
}

export interface SightWordAttempt {
  id: string;
  studentId: string;
  wordId: string;
  timestamp: Date;
  correct: boolean;
  responseTime: number; // milliseconds
  mode: 'flashcard' | 'word-hunt' | 'speed-challenge' | 'writing';
}

export interface SightWordProgress {
  id: string;
  studentId: string;
  wordId: string;
  status: 'new' | 'learning' | 'mastered';
  firstSeen: Date;
  lastPracticed: Date;
  nextReview: Date;
  totalAttempts: number;
  correctAttempts: number;
  averageResponseTime: number;
  masteredDate?: Date;
}
