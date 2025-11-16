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
  duration?: number; // Duration in milliseconds
  problemType?: string; // Type of problems practiced
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
  masteryCriteria?: {
    accuracyThreshold: number; // Default 80
    consecutiveSessionsRequired: number; // Default 3
    minSessionsBeforeMastery: number; // Default 5
  };
}

export interface SkillMastery {
  id: string;
  skillId: string;
  skillName: string;
  category: 'reading' | 'math' | 'science';
  masteryLevel: 'emerging' | 'progressing' | 'mastered';
  accuracyHistory: number[]; // Last 10 sessions
  dateStarted: Date;
  dateAchievedMastery?: Date;
  criteriaType: 'accuracy' | 'consecutive' | 'trials';
  criteriaValue: number; // e.g., 80 for 80% accuracy
  consecutiveSessions: number; // How many consecutive sessions above criteria
}

export interface IEPGoal {
  id: string;
  description: string;
  category: 'reading' | 'math' | 'science' | 'behavior';
  targetDate: Date;
  currentProgress: number; // percentage (0-100)
  relatedSkills: string[]; // skill IDs from SkillMastery
  measurementType: 'accuracy' | 'frequency' | 'duration';
  baselineData: number;
  targetValue: number;
  createdAt: Date;
  notes?: string;
}
