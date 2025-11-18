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

// Science Learning Types (Agent 7)

export interface ScienceUnit {
  id: string;
  title: string;
  topic: 'water-cycle' | 'adaptations' | 'fossils' | 'life-cycles';
  gradeLevel: 1 | 2 | 3;
  estimatedMinutes: number;
  standards: string[]; // Virginia SOL codes
  lessons: ScienceLesson[];
  vocabulary: VocabularyTerm[];
  assessments: ScienceAssessment[];
}

export interface ScienceLesson {
  id: string;
  unitId: string;
  lessonNumber: number;
  title: string;
  learningObjective: string;
  materials: string[]; // "If doing hands-on: paper, cup, ice"
  procedure: LessonStep[];
  multimediaResources: MultimediaResource[];
  exitTicket: ScienceQuestion;
}

export interface LessonStep {
  stepNumber: number;
  instruction: string;
  duration: number; // minutes
  studentAction: 'watch' | 'read' | 'draw' | 'label' | 'predict' | 'observe' | 'sort' | 'match';
  scaffoldingSupports: string[];
}

export interface MultimediaResource {
  id: string;
  type: 'video' | 'animation' | 'interactive-diagram' | 'photo-gallery' | 'virtual-lab';
  url: string;
  duration?: number; // for videos
  caption: string;
  accessibilityDescription: string;
}

export interface VocabularyTerm {
  term: string;
  studentDefinition: string; // Child-friendly
  technicalDefinition: string; // Accurate scientific
  imageUrl: string;
  exampleSentence: string;
  relatedTerms: string[];
}

export interface ScienceAssessment {
  id: string;
  unitId: string;
  assessmentType: 'pre-assessment' | 'formative' | 'summative';
  questions: ScienceQuestion[];
}

export interface ScienceQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple-choice' | 'label-diagram' | 'drag-and-drop' | 'draw-and-explain' | 'true-false';
  correctAnswer: string | string[]; // Array for label-diagram
  distractors?: string[];
  imageUrl?: string; // For diagram questions
  explanation: string;
  solStandard: string;
}

export interface ScienceAttempt {
  id: string;
  studentId: string;
  lessonId: string;
  questionId: string;
  studentAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface VirtualLabActivity {
  id: string;
  title: string;
  topic: string;
  scenario: string;
  interactiveElements: InteractiveElement[];
  completionCriteria: string[];
}

export interface InteractiveElement {
  id: string;
  type: 'draggable' | 'clickable' | 'slider' | 'timer';
  initialState: any;
  targetState: any;
  feedback: { correct: string; incorrect: string };
}
