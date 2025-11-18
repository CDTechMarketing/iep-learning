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

// Reading Comprehension Types
export interface ReadingComprehensionPassage {
  id: string;
  title: string;
  genre: 'fiction' | 'nonfiction' | 'poetry' | 'informational';
  gradeLevel: 1 | 2 | 3;
  lexileRange: string; // e.g., "400-500L"
  text: string;
  wordCount: number;
  imageUrl?: string;
  audioUrl?: string; // For text-to-speech support
  vocabulary: string[]; // Key words to pre-teach
  comprehensionQuestions: string[]; // Question IDs
  textFeatures?: TextFeature[]; // For nonfiction
  created: Date;
  lastPracticed?: Date;
}

export interface ComprehensionQuestion {
  id: string;
  passageId: string;
  questionText: string;
  questionType: 'literal' | 'inferential' | 'evaluative' | 'vocabulary';
  skill: 'main-idea' | 'details' | 'sequence' | 'cause-effect' |
         'compare-contrast' | 'character-analysis' | 'prediction' |
         'author-purpose' | 'text-features';
  correctAnswer: string;
  distractors: string[]; // 3 incorrect options
  explanation: string; // Why this answer is correct
  textEvidence?: string; // Quote from passage supporting answer
  scaffoldingLevel: 1 | 2 | 3; // 1=most support, 3=least
  hints?: string[]; // Progressive hints
}

export interface TextFeature {
  type: 'heading' | 'caption' | 'diagram' | 'chart' | 'bold-text' | 'glossary';
  location: string; // Where in passage
  purpose: string; // What it teaches
}

export interface ComprehensionAttempt {
  id: string;
  studentId: string;
  passageId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  scaffoldUsed: boolean; // Did they use hints?
  hintsUsed: number;
  timestamp: Date;
}

export interface ReadingStrategy {
  id: string;
  strategyName: string;
  description: string;
  whenToUse: string;
  example: string;
  iconUrl: string;
}

export interface VocabularyTerm {
  id: string;
  passageId: string;
  term: string;
  definition: string;
  exampleSentence: string;
  imageUrl?: string;
}
