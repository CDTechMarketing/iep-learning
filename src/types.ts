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

// Agent 3: Multi-Syllabic Words
export interface MultisyllabicWord {
  id: string;
  unitId: string;
  word: string; // "napkin"
  syllables: string[]; // ["nap", "kin"]
  syllableCount: number; // 2
  syllableTypes: ('closed' | 'open' | 'vce' | 'compound')[]; // ["closed", "closed"]

  // Visual/audio support
  imageUrl?: string;
  audioUrl?: string;

  // Compound word specific
  isCompound: boolean;
  compoundParts?: string[]; // ["sun", "shine"]
  compoundImages?: string[]; // ["/images/sun.png", "/images/shine.png"]
}

export interface SyllableProblem {
  id: string;
  unitId: string;
  type: 'syllable-count' | 'syllable-division' | 'compound-building' | 'multisyllabic-reading';
  prompt: string;
  answer: number | string;

  // For counting
  spokenWord?: string; // Audio or text for TTS
  correctSyllableCount?: number;
  options?: number[]; // [1, 2, 3]

  // For division
  word?: string;
  correctDivision?: string; // "nap-kin"
  divisionOptions?: string[]; // ["nap-kin", "na-pkin", "napk-in"]

  // For compound building
  compoundParts?: string[];
  compoundImages?: string[];
  compoundResult?: string;

  // For reading
  multisyllabicWord?: MultisyllabicWord;
}
