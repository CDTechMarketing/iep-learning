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
  type: 'identification' | 'addition' | 'number-line' | 'ten-frame' | 'touch-count' | 'number-order' | 'one-more-less';
  prompt: string;
  answer: number;
  manipulatives?: 'blocks' | 'icons' | 'stars' | 'animals';
  rangeStart?: number;
  rangeEnd?: number;
  options?: number[];
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
  visualScheduleEnabled: boolean;
  visualTimerEnabled: boolean;
  immediateRewards: boolean;
  promptingLevel: 'full' | 'partial' | 'minimal' | 'independent' | 'adaptive';
  colorScheme: 'default' | 'high-contrast' | 'pastel' | 'grayscale';
  animationLevel: 'full' | 'reduced' | 'none';
}

export interface SessionActivity {
  id: string;
  type: 'reading' | 'math' | 'science' | 'break' | 'rewards';
  title: string;
  icon: string;
  estimatedItems: number;
  starsToEarn: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface SessionPlan {
  id: string;
  unitId: string;
  activities: SessionActivity[];
  currentActivityIndex: number;
  createdAt: Date;
}

export interface ScienceProblem {
  id: string;
  unitId: string;
  type: 'simple-machine' | 'force' | 'compound-machine' | 'machine-identify';
  machineType?: 'lever' | 'wheel-axle' | 'pulley' | 'inclined-plane' | 'wedge' | 'screw';
  prompt: string;
  question: string;
  correctAnswer: string;
  options?: string[];
  description?: string;
  examples?: string[];
}
