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

// Two-Digit Math Operations Types (Agent 6)
export interface TwoDigitMathProblem {
  id: string;
  operation: 'addition' | 'subtraction';
  operand1: number; // 10-99
  operand2: number; // 10-99
  answer: number;
  requiresRegrouping: boolean;
  regroupingType?: 'ones-to-tens' | 'tens-to-ones' | 'both';
  difficulty: 1 | 2 | 3 | 4 | 5;
  contextType: 'abstract' | 'money' | 'measurement' | 'story-problem';
  storyProblem?: string;
  visualSupport?: 'base-ten-blocks' | 'number-line' | 'hundreds-chart';
  scaffoldingLevel: 1 | 2 | 3; // 1=most support, 3=independent
}

export interface TwoDigitMathAttempt {
  id: string;
  studentId: string;
  problemId: string;
  studentAnswer: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  method: 'standard-algorithm' | 'mental-math' | 'number-line' | 'base-ten-blocks';
  hintsUsed: number;
  regroupingErrors?: RegroupingError[];
  timestamp: Date;
}

export interface RegroupingError {
  type: 'forgot-to-regroup' | 'incorrect-carrying' | 'incorrect-borrowing' |
        'subtracted-smaller-from-larger' | 'place-value-error';
  location: 'ones-place' | 'tens-place';
  studentWork?: string; // Capture their work if possible
}

export interface MathStrategy {
  id: string;
  strategyName: string;
  operation: 'addition' | 'subtraction';
  description: string;
  whenToUse: string;
  steps: string[];
  videoUrl?: string;
  exampleProblem: TwoDigitMathProblem;
}

export interface PlaceValueModel {
  tens: number; // 0-9
  ones: number; // 0-9
  visualRepresentation: 'rods-and-units' | 'stacked-blocks' | 'bundled-straws';
}
