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

// ============================================
// PHONICS PATTERN DETECTIVE INTERFACES
// ============================================

export type PhonicsCategory =
  | 'letter-sounds'
  | 'cvc'
  | 'digraphs'
  | 'blends'
  | 'long-vowels'
  | 'r-controlled'
  | 'diphthongs'
  | 'advanced';

export type PhonicsActivityType =
  | 'sound-isolation'
  | 'blending'
  | 'segmenting'
  | 'word-building'
  | 'sorting'
  | 'decodable-text';

export type ScaffoldLevel = 'high' | 'medium' | 'low';

export type PhonicsProgressStatus = 'not-introduced' | 'learning' | 'mastered';

export type SoundPosition = 'beginning' | 'middle' | 'ending';

// Phonics Pattern Definition
export interface PhonicsPattern {
  id: string;
  name: string; // "CVC", "Digraph ch", "Long a (CVCe)", etc.
  category: PhonicsCategory;
  level: number; // 1-8 (progression order)
  examples: string[]; // ["cat", "bat", "mat"]
  visualCue?: string; // Image URL
  audioUrl?: string; // Pronunciation
  teachingTip: string;
  description?: string; // Detailed explanation
}

// Activity Structure
export interface PhonicsActivity {
  id: string;
  patternId: string;
  type: PhonicsActivityType;
  prompt: string;
  correctAnswer: string | string[];
  distractors?: string[]; // For multiple choice
  scaffoldLevel: ScaffoldLevel; // Amount of support

  // Type-specific fields
  word?: string; // For sound-isolation and word-building
  imageUrl?: string; // Visual support
  audioUrl?: string; // Word pronunciation

  // Blending-specific
  phonemes?: string[]; // ['/c/', '/a/', '/t/']
  audioSlowUrl?: string; // Slow blending
  audioFastUrl?: string; // Fast blending

  // Segmenting-specific
  soundBoxCount?: number; // Number of Elkonin boxes

  // Sound isolation-specific
  soundPosition?: SoundPosition; // beginning, middle, ending

  // Sorting-specific
  categories?: string[]; // Category labels for sorting
}

// Student Attempt Tracking
export interface PhonicsAttempt {
  id: string;
  studentId: string;
  activityId: string;
  patternId: string;
  timestamp: Date;
  correct: boolean;
  studentAnswer: string;
  timeSpent: number; // milliseconds
  hintsUsed: number;
  scaffoldLevel: ScaffoldLevel;
}

// Progress Tracking
export interface PhonicsProgress {
  id: string;
  studentId: string;
  patternId: string;
  status: PhonicsProgressStatus;
  accuracy: number; // 0-100%
  attemptsCount: number;
  correctCount: number;
  lastPracticed: Date;
  masteredDate?: Date;
  currentScaffoldLevel: ScaffoldLevel;
}

// Decodable Text Definition
export interface DecodableText {
  id: string;
  title: string;
  level: number; // 1-8 matching phonics levels
  patternIds: string[]; // Which patterns this text practices
  text: string; // Full text content
  targetWords: string[]; // Words to highlight
  audioUrl?: string; // Full text read-aloud
  wordAudioUrls?: Record<string, string>; // Word-by-word audio
  comprehensionQuestions: ComprehensionQuestion[];
}

// Comprehension Question
export interface ComprehensionQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  type: 'multiple-choice' | 'open-ended';
}

// Fluency Tracking
export interface FluencyAttempt {
  id: string;
  studentId: string;
  textId: string;
  timestamp: Date;
  timeSpent: number; // milliseconds
  wordsRead: number;
  errorsCount: number;
  wordsPerMinute: number;
  accuracy: number; // 0-100%
  comprehensionScore: number; // 0-100%
}

// Letter Tile (for Word Builder)
export interface LetterTile {
  id: string;
  letter: string;
  phoneme?: string; // Pronunciation
  category: 'consonant' | 'vowel' | 'digraph' | 'blend';
  color?: string; // For color coding
}
