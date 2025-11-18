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
  type: 'identification' | 'addition' | 'number-line' | 'ten-frame' | 'touch-count' | 'place-value' | 'comparison' | 'ordering';
  prompt: string;
  answer: number;
  manipulatives?: 'blocks' | 'icons' | 'stars' | 'animals';
  options?: number[] | string[];

  // For number range activities
  rangeStart?: number;
  rangeEnd?: number;

  // For place value activities
  placeValueType?: 'build' | 'identify' | 'expanded-form';
  tens?: number;
  ones?: number;

  // For comparison activities
  comparisonType?: 'greater' | 'less' | 'equal';
  number1?: number;
  number2?: number;
  correctSymbol?: string;

  // For ordering activities
  numbersToOrder?: number[];
  orderDirection?: 'ascending' | 'descending';
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

export interface FractionProblem {
  id: string;
  unitId: string;
  type: 'fraction-identification' | 'fraction-comparison' | 'fraction-matching' | 'fraction-real-world' | 'fraction-coloring';
  prompt: string;
  answer: number; // Index of correct answer for multiple choice

  // Fraction data
  numerator: number;
  denominator: number; // Limited to: 2, 3, 4, 5, 6, 8, 10

  // Visual representation
  visualType: 'circle' | 'rectangle' | 'bar' | 'set' | 'real-world';
  shadedParts: number;
  totalParts: number;

  // For comparison activities
  fraction2?: {
    numerator: number;
    denominator: number;
    shadedParts: number;
  };

  // For matching activities
  options?: string[]; // Fraction text options: ["1/2", "1/3", "1/4", "1/5"]

  // For real-world activities
  realWorldContext?: 'pizza' | 'cookies' | 'shapes' | 'fruit';
  imageUrl?: string;

  createdAt?: Date;
}
