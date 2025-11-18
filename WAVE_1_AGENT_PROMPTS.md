# WAVE 1 AGENT PROMPTS
## Critical Next Phase: Reading Comprehension, Two-Digit Math, and Science Engagement

**Created**: November 2025
**Purpose**: Detailed implementation prompts for 3 high-priority agents to close critical SOL gaps
**Estimated Total Time**: 200-285 hours
**Dependencies**: Assumes GED Track Agents 1-4 are completed

---

## 🎯 OVERVIEW: Wave 1 Strategic Priorities

### Why These 3 Features?
After completing GED Track Agents 1-4 (phonics, syllables, number sense, and multiplication foundations), the **most critical** remaining gaps for 3rd grade Virginia SOL readiness are:

1. **Reading Comprehension** - Students can decode but can't understand what they read
2. **Two-Digit Math Operations** - THE biggest math gap for functional life skills
3. **Science Engagement** - High-value visual content that drives student engagement

These features represent the **minimum viable product** for true 3rd grade readiness.

---

## 📚 AGENT 5: READING COMPREHENSION SPECIALIST

### Mission
Build a comprehensive reading comprehension system that teaches students to understand, analyze, and respond to text at a 3rd grade level, with scaffolding from 1st grade up.

### Estimated Time
**80-120 hours** (2-3 weeks for experienced developer)

### Virginia SOL Standards Addressed
- **3.5**: Demonstrate comprehension of fiction and nonfiction
- **3.6**: Understand story elements, cause/effect, compare/contrast
- **3.7**: Main idea, supporting details, text features
- **3.8**: Use reading strategies to monitor comprehension

---

### PHASE 1: Data Architecture (15-20 hours)

#### Task 1.1: Create Reading Comprehension Content Schema
**Location**: `src/types.ts`

Add comprehensive types for reading comprehension:

```typescript
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
  comprehensionQuestions: ComprehensionQuestion[];
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
```

#### Task 1.2: Create Dexie Database Tables
**Location**: `src/db.ts`

Add tables for reading comprehension:

```typescript
comprehensionPassages: '++id, gradeLevel, genre',
comprehensionQuestions: '++id, passageId, skill, questionType',
comprehensionAttempts: '++id, studentId, passageId, questionId, timestamp',
readingStrategies: '++id, strategyName'
```

#### Task 1.3: Seed Initial Content Database
**Location**: `src/data/readingComprehension/`

Create folder structure:
```
src/data/readingComprehension/
├── grade1Passages.json (10 passages, 150-200 words each)
├── grade2Passages.json (10 passages, 200-300 words each)
├── grade3Passages.json (10 passages, 300-400 words each)
├── readingStrategies.json
└── questionBank.json (10 questions per passage = 300 total)
```

**Content Requirements**:
- **Fiction passages**: Include clear characters, setting, problem, solution
- **Nonfiction passages**: Include text features (headings, bold words, captions)
- **Diverse topics**: Animals, space, sports, history, science
- **Decodable words**: 85%+ should be within student's phonics level
- **High-interest**: Engaging topics for 7-9 year olds

**Sample Passage Structure** (grade3Passages.json):
```json
{
  "id": "g3-nonfiction-dolphins",
  "title": "Dolphins: Smart Ocean Animals",
  "genre": "nonfiction",
  "gradeLevel": 3,
  "lexileRange": "450-500L",
  "text": "Dolphins are mammals that live in the ocean. They breathe air just like you do! Dolphins are very smart. They can learn tricks and even communicate with each other using clicks and whistles...",
  "wordCount": 287,
  "imageUrl": "/images/dolphins.jpg",
  "vocabulary": ["mammal", "communicate", "intelligent"],
  "textFeatures": [
    {"type": "heading", "location": "line 1", "purpose": "Shows main topic"},
    {"type": "bold-text", "location": "line 3", "purpose": "Highlights key words"}
  ]
}
```

**Sample Question Structure** (questionBank.json):
```json
{
  "id": "g3-dolphins-q1",
  "passageId": "g3-nonfiction-dolphins",
  "questionText": "What is the main idea of this passage?",
  "questionType": "inferential",
  "skill": "main-idea",
  "correctAnswer": "Dolphins are smart ocean mammals",
  "distractors": [
    "Dolphins live in the ocean",
    "Dolphins make clicking sounds",
    "Dolphins can learn tricks"
  ],
  "explanation": "The passage talks about several facts, but the main idea is that dolphins are intelligent ocean mammals. All the details support this main idea.",
  "textEvidence": "Dolphins are very smart. They can learn tricks and even communicate...",
  "scaffoldingLevel": 2
}
```

---

### PHASE 2: Reading Comprehension UI Components (25-35 hours)

#### Task 2.1: Create PassageReader Component
**Location**: `src/components/PassageReader.tsx`

**Features to implement**:
- Display passage with proper formatting
- Text-to-speech option (highlight words as read)
- Adjustable font size (accessibility)
- Vocabulary hover-over definitions
- Progress indicator (% of passage read)
- "Reread" button
- Image/diagram display for nonfiction

**Key user interactions**:
```typescript
- Click word → See definition (for pre-taught vocabulary)
- Click speaker icon → Hear passage read aloud
- Click "+" → Increase font size
- Scroll → Track reading progress
```

**Visual design considerations**:
- Large, readable font (minimum 14pt)
- Adequate line spacing (1.5x)
- Text highlighting for read-aloud
- Colorful, engaging images
- Progress bar at top

#### Task 2.2: Create ComprehensionQuiz Component
**Location**: `src/components/ComprehensionQuiz.tsx`

**Question display features**:
- Multiple choice format (4 options)
- Visual question type indicator (icon for main idea, details, etc.)
- "Go back to passage" button (always available)
- Hint system (3 levels of scaffolding)
- Immediate feedback after answer selection
- Explanation screen after each question

**Scaffolding/Hint System**:
```typescript
// Level 1 hint: "This is a main idea question. Ask yourself: What is this mostly about?"
// Level 2 hint: "Reread the first paragraph. What does the author want you to learn?"
// Level 3 hint: "The answer is in the first two sentences. Dolphins are..."
```

**Feedback after answer**:
- ✅ Correct: "Great job! You found the main idea. Let's see the evidence from the text..."
- ❌ Incorrect: "Not quite. Let's reread this part together and try again."

#### Task 2.3: Create ReadingStrategy Toolbox Component
**Location**: `src/components/ReadingStrategyToolbox.tsx`

Teach 6 essential reading strategies:

1. **Preview** (Before reading): Look at title, pictures, headings
2. **Predict** (Before/during reading): What will happen next?
3. **Question** (During reading): Ask "who, what, where, when, why?"
4. **Visualize** (During reading): Make a movie in your mind
5. **Summarize** (After reading): What were the most important parts?
6. **Connect** (After reading): How does this relate to my life?

**Component features**:
- Visual strategy cards with icons
- "When to use this strategy" guidance
- Interactive examples
- Strategy reminder checklist during reading

#### Task 2.4: Create ComprehensionProgress Component
**Location**: `src/components/ComprehensionProgress.tsx`

**Display metrics**:
- Overall comprehension accuracy (by grade level)
- Performance by question type (literal, inferential, evaluative)
- Performance by skill (main idea, details, cause/effect, etc.)
- Passages completed (count by genre and grade level)
- Growth chart over time
- Recommended next passage (adaptive difficulty)

**Visualization**:
- Bar charts for skill performance
- Line chart for growth over time
- Color-coded skill badges (red/yellow/green)

---

### PHASE 3: Reading Comprehension Logic & Algorithms (20-30 hours)

#### Task 3.1: Implement Adaptive Passage Selection
**Location**: `src/utils/comprehensionEngine.ts`

**Algorithm requirements**:
```typescript
function selectNextPassage(studentHistory: ComprehensionAttempt[]): ReadingComprehensionPassage {
  // 1. Calculate current comprehension level (1-3)
  const currentLevel = calculateComprehensionLevel(studentHistory);

  // 2. Identify weak skills (< 70% accuracy)
  const weakSkills = identifyWeakSkills(studentHistory);

  // 3. Balance genre exposure (alternate fiction/nonfiction)
  const lastGenre = getLastGenre(studentHistory);
  const nextGenre = lastGenre === 'fiction' ? 'nonfiction' : 'fiction';

  // 4. Select passage that targets weak skills at appropriate level
  return findPassage({
    gradeLevel: currentLevel,
    targetSkills: weakSkills,
    genre: nextGenre,
    notRecentlyCompleted: true
  });
}

function calculateComprehensionLevel(history: ComprehensionAttempt[]): 1 | 2 | 3 {
  const recentAttempts = last20Attempts(history);
  const accuracy = calculateAccuracy(recentAttempts);

  // 80%+ = move up, 60-79% = stay, <60% = move down
  if (accuracy >= 0.80) return Math.min(currentLevel + 1, 3);
  if (accuracy < 0.60) return Math.max(currentLevel - 1, 1);
  return currentLevel;
}
```

#### Task 3.2: Implement Question Sequencing Logic
**Location**: `src/utils/questionSequencer.ts`

**Question order strategy**:
1. Start with 2 literal questions (build confidence)
2. Then 2-3 inferential questions (challenge thinking)
3. End with 1 evaluative question (deeper analysis)

**Adaptive difficulty**:
- If student gets 2 wrong in a row → Add scaffolding hint automatically
- If student gets 4+ correct in a row → Reduce scaffolding for next passage
- Track hint usage → Doesn't count toward mastery

#### Task 3.3: Implement Mastery Tracking
**Location**: `src/utils/masteryTracker.ts`

**Mastery criteria per skill**:
- Must answer 80% of questions correctly
- Must demonstrate skill across 3 different passages
- Must show consistency over time (not just one good day)
- Mastery expires if accuracy drops below 70% in subsequent attempts

**Skill progression tree**:
```
Level 1: Literal comprehension (who, what, where, when)
  ↓ (after mastery)
Level 2: Inferential comprehension (why, how, predict)
  ↓ (after mastery)
Level 3: Evaluative comprehension (author's purpose, compare/contrast)
```

#### Task 3.4: Implement Text Evidence Helper
**Location**: `src/utils/textEvidenceHelper.ts`

After student answers a question:
- Highlight relevant sentence(s) in passage
- Explain how the text supports the answer
- Teach students to "prove it" with evidence

Example:
```
Question: "Why do dolphins make clicking sounds?"
Student answer: "To communicate with other dolphins"
Evidence highlight: "They can even communicate with each other using clicks and whistles."
Explanation: "You're right! The passage says dolphins use clicks to communicate. You found the evidence in the text!"
```

---

### PHASE 4: Reading Comprehension Integration (15-20 hours)

#### Task 4.1: Add to Main Navigation
**Location**: `src/components/Home.tsx`

Add "Reading Comprehension" button:
- Icon: Book with magnifying glass
- Show number of new passages available
- Display current comprehension level badge (1, 2, or 3 stars)

#### Task 4.2: Create ReadingComprehensionPractice Component
**Location**: `src/components/ReadingComprehensionPractice.tsx`

**Main workflow**:
1. Display reading strategy reminder
2. Show passage with PassageReader component
3. Transition to questions with ComprehensionQuiz component
4. Show results with explanations and evidence
5. Display growth/celebration screen
6. Return to passage selection

**Session structure**:
- 1 passage per session
- 5-8 questions per passage
- 10-15 minutes total time

#### Task 4.3: Integrate with Reward System
**Location**: `src/components/Rewards.tsx`

**Points earned**:
- Complete passage + questions: 50 points
- 80%+ accuracy: Bonus 25 points
- Use no hints: Bonus 15 points
- Master new skill: Bonus 50 points + badge

**Badges to create**:
- "Detective" - Master finding details
- "Thinker" - Master inferential questions
- "Fact Finder" - Complete 10 nonfiction passages
- "Story Expert" - Complete 10 fiction passages

#### Task 4.4: Add to Parent Dashboard
**Location**: `src/components/ParentDashboard.tsx`

**Parent-facing metrics**:
- Reading comprehension level (grade equivalent)
- Skills mastered / Skills in progress
- Passages completed this week
- Average accuracy by question type
- Recommended home support activities

**Example parent insight**:
> "Jordan is doing well with literal comprehension (85% accuracy) but needs practice with inferential questions (62%). Try asking 'why' and 'how' questions when reading together at home."

---

### PHASE 5: Content Creation & Testing (10-15 hours)

#### Task 5.1: Create 30 High-Quality Passages
- 10 passages at each grade level (1, 2, 3)
- Mix of fiction (50%) and nonfiction (50%)
- Ensure decodability matches phonics instruction
- Align with Virginia SOL science and social studies topics where possible

**Recommended topics**:
- **Grade 1**: Farm animals, seasons, families, simple machines
- **Grade 2**: Community helpers, weather, plants, simple biographies
- **Grade 3**: Water cycle, adaptations, historical figures, geography

#### Task 5.2: Create 300 Comprehension Questions
- 10 questions per passage × 30 passages
- Balance question types across all skills
- Write clear, specific distractors (wrong answers should be plausible)
- Create 3-level scaffolding hints for each question

#### Task 5.3: User Testing
- Test with 3-5 students at different reading levels
- Observe where students get stuck
- Identify passages that are too hard/easy
- Refine hint system based on student needs
- Adjust timing and pacing

#### Task 5.4: Accessibility Audit
- Test text-to-speech functionality
- Verify color contrast for readability
- Test with keyboard navigation only
- Ensure screen reader compatibility
- Test font size adjustment feature

---

### PHASE 6: Documentation & Deployment (5-10 hours)

#### Task 6.1: Create Teacher/Parent Guide
**Document**: `READING_COMPREHENSION_GUIDE.md`

Include:
- How to interpret comprehension reports
- How to select appropriate passages
- How to support struggling readers
- Sample comprehension questions to ask at home
- Alignment with Virginia SOL standards

#### Task 6.2: Code Documentation
- Document all algorithms (adaptive selection, mastery tracking)
- Create component usage examples
- Document data schemas
- Write migration guide if updating existing data

#### Task 6.3: Deployment Checklist
- [ ] All 30 passages loaded and tested
- [ ] All 300 questions validated
- [ ] Text-to-speech working on all passages
- [ ] Images loaded and optimized
- [ ] Database migrations completed
- [ ] Parent dashboard updated
- [ ] Reward system integrated
- [ ] Analytics tracking implemented

---

## 🔢 AGENT 6: TWO-DIGIT MATH OPERATIONS SPECIALIST

### Mission
Build a comprehensive two-digit addition and subtraction system with and without regrouping, enabling students to master the **#1 most critical life math skill** for daily functioning.

### Estimated Time
**60-80 hours** (1.5-2 weeks for experienced developer)

### Virginia SOL Standards Addressed
- **3.3**: Add/subtract whole numbers with and without regrouping
- **3.4**: Represent multiplication as repeated addition
- **3.5**: Solve single-step and multi-step practical problems

---

### PHASE 1: Data Architecture (10-15 hours)

#### Task 1.1: Create Two-Digit Math Content Schema
**Location**: `src/types.ts`

Add comprehensive types:

```typescript
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
```

#### Task 1.2: Create Dexie Database Tables
**Location**: `src/db.ts`

```typescript
twoDigitMathProblems: '++id, operation, difficulty, requiresRegrouping',
twoDigitMathAttempts: '++id, studentId, problemId, timestamp, isCorrect',
mathStrategies: '++id, operation, strategyName',
regroupingErrors: '++id, attemptId, type'
```

#### Task 1.3: Create Problem Generation Engine
**Location**: `src/utils/mathProblemGenerator.ts`

**Generate problems across 5 difficulty levels**:

```typescript
// Level 1: Addition without regrouping (23 + 45)
function generateLevel1Addition(): TwoDigitMathProblem {
  const ones1 = random(1, 4); // Ensure no regrouping
  const ones2 = random(1, 5 - ones1);
  const tens1 = random(1, 5);
  const tens2 = random(1, 5);
  return createProblem(tens1 * 10 + ones1, tens2 * 10 + ones2, 'addition');
}

// Level 2: Addition with regrouping (28 + 47)
function generateLevel2Addition(): TwoDigitMathProblem {
  const ones1 = random(5, 9);
  const ones2 = random(10 - ones1 + 1, 9); // Force regrouping
  const tens1 = random(1, 7);
  const tens2 = random(1, 9 - tens1);
  return createProblem(tens1 * 10 + ones1, tens2 * 10 + ones2, 'addition');
}

// Level 3: Subtraction without regrouping (58 - 23)
function generateLevel3Subtraction(): TwoDigitMathProblem {
  const ones1 = random(4, 9);
  const ones2 = random(1, ones1); // Ensure no regrouping needed
  const tens1 = random(3, 9);
  const tens2 = random(1, tens1);
  return createProblem(tens1 * 10 + ones1, tens2 * 10 + ones2, 'subtraction');
}

// Level 4: Subtraction with regrouping (52 - 27)
function generateLevel4Subtraction(): TwoDigitMathProblem {
  const ones1 = random(0, 4);
  const ones2 = random(ones1 + 1, 9); // Force regrouping
  const tens1 = random(3, 9);
  const tens2 = random(1, tens1);
  return createProblem(tens1 * 10 + ones1, tens2 * 10 + ones2, 'subtraction');
}

// Level 5: Mixed multi-step word problems
function generateLevel5StoryProblem(): TwoDigitMathProblem {
  const templates = [
    "Sarah had {num1} stickers. She bought {num2} more. How many does she have now?",
    "There were {num1} birds in the tree. {num2} flew away. How many are left?",
    "Jake scored {num1} points in the first game and {num2} in the second game. What was his total?"
  ];
  // Generate problem with context
}
```

**Generate 20 problems per level** = 100 total starter problems

---

### PHASE 2: Two-Digit Math UI Components (20-30 hours)

#### Task 2.1: Create VerticalMathProblem Component
**Location**: `src/components/VerticalMathProblem.tsx`

Display problems in standard vertical format:

```
    48
  + 35
  ----
    ??
```

**Features**:
- Properly aligned place values (ones/tens)
- Visual carrying/borrowing indicators
- Interactive answer input (two separate boxes for tens and ones)
- Real-time error checking
- Color coding for place values (tens=blue, ones=green)

#### Task 2.2: Create BaseTenBlocks Component
**Location**: `src/components/BaseTenBlocks.tsx`

Interactive visual model:

**Features**:
- Draggable rods (tens) and units (ones)
- Click to add/remove blocks
- Automatic bundling (10 ones → 1 ten)
- Automatic unbundling (1 ten → 10 ones)
- Visual representation of regrouping process
- Matches colors with VerticalMathProblem component

**Interaction flow for 28 + 47**:
1. Show 2 tens rods + 8 ones units
2. Show 4 tens rods + 7 ones units
3. Student combines: Gets 6 tens + 15 ones
4. System prompts: "Can you make a bundle? You have 10 ones!"
5. Student clicks "bundle" → 15 ones becomes 1 ten + 5 ones
6. Final answer: 7 tens + 5 ones = 75

#### Task 2.3: Create RegroupingHelper Component
**Location**: `src/components/RegroupingHelper.tsx`

Step-by-step guided practice for regrouping:

**For addition with regrouping** (28 + 47):
```
Step 1: Add the ones: 8 + 7 = 15
Step 2: Can we keep 15 in the ones place? NO! We can only keep 0-9.
Step 3: Regroup! 15 = 1 ten and 5 ones
Step 4: Write 5 in the ones place, carry the 1 ten
Step 5: Add the tens: 2 + 4 + 1 (carried) = 7
Answer: 75
```

**For subtraction with regrouping** (52 - 27):
```
Step 1: Can we subtract the ones? 2 - 7? NO! We don't have enough ones.
Step 2: Borrow! Take 1 ten and make it 10 ones.
Step 3: Now we have 4 tens and 12 ones (instead of 5 tens and 2 ones)
Step 4: Subtract the ones: 12 - 7 = 5
Step 5: Subtract the tens: 4 - 2 = 2
Answer: 25
```

**Component features**:
- Highlight current step
- Require student input at each step
- Show visual model (base-ten blocks) alongside algorithm
- Provide hint button for each step
- Celebrate successful regrouping

#### Task 2.4: Create MathStrategySelector Component
**Location**: `src/components/MathStrategySelector.tsx`

Let students choose their solving method:

1. **Standard Algorithm** (vertical format with carrying/borrowing)
2. **Mental Math** (break apart by place value: 48+35 = 40+30 + 8+5)
3. **Number Line** (jump strategy: 48 +30 +5)
4. **Base-Ten Blocks** (visual/concrete model)

Show example of each strategy, let student pick their favorite.

#### Task 2.5: Create TwoDigitMathProgress Component
**Location**: `src/components/TwoDigitMathProgress.tsx`

**Metrics to display**:
- Overall accuracy by operation (addition vs subtraction)
- Accuracy by difficulty level (1-5)
- Regrouping success rate
- Most common error types
- Problems attempted vs problems mastered
- Growth chart over time
- Next recommended level

**Visual badges**:
- "Addition Ace" - Master levels 1-2 addition
- "Subtraction Star" - Master levels 3-4 subtraction
- "Regrouping Rockstar" - 90%+ accuracy with regrouping
- "Story Problem Solver" - Complete 10 word problems

---

### PHASE 3: Two-Digit Math Logic & Algorithms (15-20 hours)

#### Task 3.1: Implement Adaptive Difficulty Engine
**Location**: `src/utils/twoDigitMathEngine.ts`

```typescript
function selectNextProblem(studentHistory: TwoDigitMathAttempt[]): TwoDigitMathProblem {
  // 1. Determine current level (1-5)
  const currentLevel = calculateMathLevel(studentHistory);

  // 2. Check for mastery at current level
  const hasMastery = checkMastery(studentHistory, currentLevel);

  // 3. If mastery → advance; if struggling → provide more practice
  const targetLevel = hasMastery ? currentLevel + 1 : currentLevel;

  // 4. Identify error patterns
  const commonErrors = analyzeErrors(studentHistory);

  // 5. Generate targeted problem
  return generateTargetedProblem(targetLevel, commonErrors);
}

function checkMastery(history: TwoDigitMathAttempt[], level: number): boolean {
  const levelAttempts = filterByLevel(history, level);

  // Mastery = 80%+ accuracy over 10+ problems
  return levelAttempts.length >= 10 &&
         calculateAccuracy(levelAttempts) >= 0.80 &&
         lastFiveAttempts(levelAttempts).accuracy >= 0.80;
}
```

#### Task 3.2: Implement Error Pattern Detection
**Location**: `src/utils/errorPatternAnalyzer.ts`

Detect specific error types:

```typescript
function analyzeRegroupingErrors(attempt: TwoDigitMathAttempt): RegroupingError[] {
  const errors: RegroupingError[] = [];
  const { problem, studentAnswer } = attempt;

  // Check if they forgot to carry when adding
  if (problem.operation === 'addition') {
    const onesSum = (problem.operand1 % 10) + (problem.operand2 % 10);
    if (onesSum >= 10) {
      // Should have carried
      const expectedTens = Math.floor(problem.operand1/10) + Math.floor(problem.operand2/10) + 1;
      const studentTens = Math.floor(studentAnswer/10);

      if (studentTens !== expectedTens) {
        errors.push({
          type: 'forgot-to-regroup',
          location: 'ones-place'
        });
      }
    }
  }

  // Check if they subtracted smaller from larger when borrowing needed
  if (problem.operation === 'subtraction') {
    const ones1 = problem.operand1 % 10;
    const ones2 = problem.operand2 % 10;

    if (ones1 < ones2) {
      // Should have borrowed
      const studentOnes = studentAnswer % 10;
      const expectedOnes = (ones1 + 10) - ones2;

      if (studentOnes === ones2 - ones1) {
        errors.push({
          type: 'subtracted-smaller-from-larger',
          location: 'ones-place'
        });
      }
    }
  }

  return errors;
}
```

#### Task 3.3: Implement Targeted Intervention System
**Location**: `src/utils/mathIntervention.ts`

When error patterns detected:

```typescript
function provideIntervention(errorType: string): InterventionPlan {
  const interventions = {
    'forgot-to-regroup': {
      message: "I notice you're forgetting to carry/borrow. Let's practice that!",
      activities: [
        'Watch: Carrying video tutorial',
        'Practice: 5 problems with base-ten blocks',
        'Practice: 5 problems with step-by-step guide',
        'Independent: 5 problems on your own'
      ],
      scaffoldingLevel: 1 // Increase support
    },
    'subtracted-smaller-from-larger': {
      message: "Remember: When the top number is smaller, we need to borrow!",
      activities: [
        'Watch: Borrowing video tutorial',
        'Practice: 5 problems with visual unbundling',
        'Practice: 5 problems with hints available',
        'Independent: 5 problems on your own'
      ],
      scaffoldingLevel: 1
    }
  };

  return interventions[errorType];
}
```

#### Task 3.4: Implement Multi-Step Word Problem Solver
**Location**: `src/utils/wordProblemHelper.ts`

Teach problem-solving process:

```
Step 1: READ - Read the problem twice
Step 2: KNOW - What do I know? (Underline important numbers)
Step 3: NEED - What do I need to find? (Circle the question)
Step 4: PLAN - Add or subtract? Why?
Step 5: SOLVE - Do the math
Step 6: CHECK - Does my answer make sense?
```

Provide sentence frames:
- "I know that _____"
- "I need to find _____"
- "I will _____ (add/subtract) because _____"
- "My answer is _____"

---

### PHASE 4: Two-Digit Math Integration (10-12 hours)

#### Task 4.1: Add to Main Navigation
**Location**: `src/components/Home.tsx`

Add "Two-Digit Math" section:
- Icon: Two stacked numbers with + or - sign
- Show current level (1-5)
- Display mastery badge

#### Task 4.2: Create TwoDigitMathPractice Component
**Location**: `src/components/TwoDigitMathPractice.tsx`

**Main practice flow**:
1. Strategy selection screen (choose your method)
2. Problem presentation (with chosen visual support)
3. Student work area (answer input)
4. Immediate feedback (with error explanation if needed)
5. Progress celebration (points, badges, next level unlock)

**Session structure**:
- 10 problems per session
- Adaptive difficulty (adjust based on accuracy)
- Mix of operations (60% addition, 40% subtraction initially)
- Include 2 word problems per session at levels 4-5

#### Task 4.3: Integrate with Reward System
**Location**: `src/components/Rewards.tsx`

**Points**:
- Correct answer: 10 points
- Correct with no hints: +5 bonus
- 80%+ accuracy in session: +25 bonus
- Master new level: +50 bonus

**Badges**:
- Complete all 5 levels with mastery
- Solve 50 problems total
- Perfect session (10/10 correct)

#### Task 4.4: Add to Parent Dashboard
**Location**: `src/components/ParentDashboard.tsx`

**Parent insights**:
- Current level and operation mastery
- Regrouping accuracy
- Common error patterns with explanations
- Practice recommendations
- Connection to real-life math (money, measuring)

---

### PHASE 5: Content Creation & Testing (5-10 hours)

#### Task 5.1: Create Video Tutorials
- Record 2-minute tutorial for addition with regrouping
- Record 2-minute tutorial for subtraction with borrowing
- Record 1-minute tutorial for each strategy (4 videos)

#### Task 5.2: Create Word Problem Bank
Create 50 story problems across difficulty levels:
- **Levels 1-2**: Single-step addition (join/combine scenarios)
- **Levels 3-4**: Single-step subtraction (separate/compare scenarios)
- **Level 5**: Multi-step mixed operations

**Ensure diverse contexts**:
- Money (shopping, saving)
- Measurement (length, weight, capacity)
- Time (elapsed time, schedules)
- Real-world scenarios (sports scores, collections, recipes)

#### Task 5.3: User Testing
- Test with students who struggle with regrouping
- Observe error patterns
- Refine error detection algorithms
- Adjust scaffolding based on student feedback

---

### PHASE 6: Documentation & Deployment (5-8 hours)

#### Task 6.1: Create Teacher Guide
**Document**: `TWO_DIGIT_MATH_GUIDE.md`

- Explanation of 5 difficulty levels
- How to interpret error reports
- Intervention strategies for common errors
- Home practice activities
- Alignment with Virginia SOL 3.3

#### Task 6.2: Create Parent Resource
- "How to help with two-digit math at home"
- Real-world practice opportunities (grocery shopping math)
- Common mistakes and how to address them
- When to use calculator vs mental math

#### Task 6.3: Deployment Checklist
- [ ] All 5 difficulty levels tested
- [ ] Error detection working accurately
- [ ] Visual models (base-ten blocks) functioning
- [ ] Word problem bank loaded (50 problems)
- [ ] Video tutorials embedded
- [ ] Parent dashboard updated
- [ ] Reward system integrated

---

## 🔬 AGENT 7: SCIENCE ENGAGEMENT SPECIALIST

### Mission
Build high-engagement, visually rich science content for water cycle and animal adaptations, creating the "hook" that keeps students excited about learning.

### Estimated Time
**60-85 hours** (1.5-2 weeks for experienced developer)

### Virginia SOL Standards Addressed
- **3.9**: Water cycle and weather patterns
- **3.4**: Life cycles and inherited characteristics
- **3.5**: Adaptations allow animals to survive
- **3.6**: Fossils provide information about past life

---

### PHASE 1: Data Architecture (12-18 hours)

#### Task 1.1: Create Science Content Schema
**Location**: `src/types.ts`

```typescript
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
```

#### Task 1.2: Create Dexie Database Tables
**Location**: `src/db.ts`

```typescript
scienceUnits: '++id, topic, gradeLevel',
scienceLessons: '++id, unitId, lessonNumber',
scienceVocabulary: '++id, term, unitId',
scienceAssessments: '++id, unitId, assessmentType',
scienceQuestions: '++id, assessmentId, questionType',
scienceAttempts: '++id, studentId, lessonId, timestamp',
virtualLabActivities: '++id, topic'
```

#### Task 1.3: Create Content Structure

Create folder structure:
```
src/data/science/
├── waterCycle/
│   ├── unit.json
│   ├── lessons/
│   │   ├── lesson1-intro-to-water.json
│   │   ├── lesson2-evaporation.json
│   │   ├── lesson3-condensation.json
│   │   ├── lesson4-precipitation.json
│   │   └── lesson5-collection.json
│   ├── vocabulary.json (20 terms)
│   ├── assessments/
│   │   ├── pre-assessment.json
│   │   ├── formative-checks.json (5)
│   │   └── unit-test.json
│   └── multimedia/
│       ├── videos/ (links or embedded)
│       ├── images/
│       └── interactives/
├── adaptations/
│   ├── unit.json
│   ├── lessons/
│   │   ├── lesson1-what-are-adaptations.json
│   │   ├── lesson2-physical-adaptations.json
│   │   ├── lesson3-behavioral-adaptations.json
│   │   ├── lesson4-habitat-match.json
│   │   └── lesson5-adaptations-for-survival.json
│   ├── vocabulary.json (20 terms)
│   ├── assessments/
│   └── multimedia/
└── fossils/
    ├── unit.json
    ├── lessons/ (3 lessons)
    ├── vocabulary.json (15 terms)
    └── multimedia/
```

---

### PHASE 2: Water Cycle Content Creation (15-20 hours)

#### Task 2.1: Create Water Cycle Unit (5 Lessons)

**Lesson 1: Introduction to Water**
- **Objective**: Students will identify the three states of water
- **Activities**:
  - Watch 3-minute video: "Water All Around Us"
  - Interactive: Sort images into solid/liquid/gas
  - Vocabulary: solid, liquid, gas, water vapor
- **Exit ticket**: "Circle all the places you see water" (image)

**Lesson 2: Evaporation**
- **Objective**: Students will explain how water evaporates
- **Activities**:
  - Watch 3-minute animation: "Water Disappears into the Air"
  - Interactive: Use slider to add heat → watch water evaporate
  - Draw: Show the sun heating up a puddle
  - Vocabulary: evaporation, heat, sun energy, water vapor
- **Exit ticket**: "Where does puddle water go? Draw and label."

**Lesson 3: Condensation**
- **Objective**: Students will describe how clouds form
- **Activities**:
  - Watch 4-minute video: "How Clouds Are Made"
  - Interactive: Click to cool down water vapor → see droplets form
  - Label diagram: Parts of a cloud
  - Vocabulary: condensation, water droplets, clouds, cooling
- **Exit ticket**: "What do you need to make a cloud? Check all that apply."

**Lesson 4: Precipitation**
- **Objective**: Students will identify types of precipitation
- **Activities**:
  - Photo gallery: Rain, snow, sleet, hail
  - Interactive: Match weather conditions to precipitation type
  - Sort: Which is precipitation? (fog, dew, rain, steam)
  - Vocabulary: precipitation, rain, snow, sleet, hail
- **Exit ticket**: "Draw a picture showing precipitation"

**Lesson 5: The Water Cycle Process**
- **Objective**: Students will describe the water cycle sequence
- **Activities**:
  - Watch 5-minute video: "The Water Cycle Journey"
  - Interactive: Drag arrows to show water cycle flow
  - Label diagram: Complete water cycle with 6 labels
  - Virtual lab: "Be a Water Droplet" - click through the cycle
- **Exit ticket**: "Put the water cycle steps in order: ___, ___, ___, ___"

#### Task 2.2: Create Water Cycle Vocabulary (20 terms)

For each term, create:
- Student-friendly definition
- Visual representation (photo or diagram)
- Example sentence
- Audio pronunciation

**Key terms**:
evaporation, condensation, precipitation, collection, water vapor, liquid, solid, gas, cloud, rain, snow, hail, sleet, sun, heat, energy, groundwater, ocean, lake, river

#### Task 2.3: Create Water Cycle Assessments

**Pre-assessment** (5 questions):
- What are clouds made of?
- Where does rain come from?
- Can water change from liquid to gas?
- Draw the water cycle (baseline)
- What makes water evaporate?

**Formative checks** (1 per lesson, 5 total):
- Quick 2-3 question checks after each lesson
- Provide immediate feedback
- Identify misconceptions early

**Summative assessment** (10 questions):
- Label water cycle diagram (4 labels)
- Sequence water cycle steps (drag and drop)
- Match vocabulary to definitions (5 terms)
- Identify precipitation types (true/false)
- Apply knowledge: "Why do puddles dry up on hot days?"

---

### PHASE 3: Adaptations Content Creation (15-20 hours)

#### Task 3.1: Create Adaptations Unit (5 Lessons)

**Lesson 1: What Are Adaptations?**
- **Objective**: Students will define adaptation
- **Activities**:
  - Watch 4-minute video: "Animals Are Built to Survive"
  - Photo gallery: 10 animals with unique features
  - Discussion prompt: "How do polar bears stay warm?"
  - Vocabulary: adaptation, survive, environment, habitat
- **Exit ticket**: "An adaptation helps animals ___"

**Lesson 2: Physical Adaptations**
- **Objective**: Students will identify physical adaptations
- **Activities**:
  - Interactive: Click on animal body parts to learn their function
  - Examples: giraffe neck, elephant trunk, bird beak, camel hump
  - Match game: Animal to its physical adaptation
  - Vocabulary: physical adaptation, camouflage, mimicry, body structure
- **Exit ticket**: "Circle the physical adaptations: long neck, hiding, sharp teeth, running fast"

**Lesson 3: Behavioral Adaptations**
- **Objective**: Students will identify behavioral adaptations
- **Activities**:
  - Watch 5-minute video: "What Animals Do to Survive"
  - Examples: migration, hibernation, nocturnal, pack hunting
  - Sort: Physical vs behavioral adaptations
  - Vocabulary: behavioral adaptation, migration, hibernation, instinct
- **Exit ticket**: "Name one thing animals do to survive winter"

**Lesson 4: Habitat Match**
- **Objective**: Students will match animals to habitats based on adaptations
- **Activities**:
  - Virtual field trip: 4 habitats (desert, ocean, arctic, rainforest)
  - Interactive: Drag animals to their correct habitat
  - Explain: "Why does this animal live here?" (sentence frame)
  - Vocabulary: habitat, desert, rainforest, arctic, ocean, climate
- **Exit ticket**: "Draw an animal and its habitat. Label 1 adaptation."

**Lesson 5: Adaptations for Survival**
- **Objective**: Students will explain how specific adaptations help survival
- **Activities**:
  - Case studies: 5 animals with amazing adaptations
    - Chameleon (camouflage)
    - Hummingbird (beak shape)
    - Bat (echolocation)
    - Cactus (water storage)
    - Arctic fox (thick fur + color change)
  - Design challenge: "Create an animal for the desert. What adaptations does it need?"
  - Virtual lab: "Adaptation Simulator" - change features, test survival
- **Exit ticket**: "Describe how one adaptation helps an animal survive"

#### Task 3.2: Create Adaptations Vocabulary (20 terms)

**Key terms**:
adaptation, physical adaptation, behavioral adaptation, camouflage, mimicry, habitat, environment, survive, migration, hibernation, nocturnal, predator, prey, instinct, inherited traits, learned behaviors, climate, desert, rainforest, arctic

#### Task 3.3: Create Adaptations Assessments

**Pre-assessment**:
- What does adaptation mean?
- How do animals survive in cold places?
- Name an animal with a special body part
- Draw an animal (observe baseline detail)

**Summative assessment**:
- Define adaptation (multiple choice)
- Sort 8 adaptations: physical or behavioral
- Match animals to habitats (drag and drop)
- Explain: Why do polar bears have thick fur? (sentence frame)
- Design: Create an animal for the ocean with 3 adaptations

---

### PHASE 4: Science UI Components (15-20 hours)

#### Task 4.1: Create ScienceLesson Component
**Location**: `src/components/ScienceLesson.tsx`

**Features**:
- Lesson title and objective display
- Step-by-step guided instruction
- Multimedia player (video, animation, interactive)
- Progress indicator (Step 3 of 6)
- Vocabulary sidebar (hover for definitions)
- "Exit Ticket" quiz at end
- "Next Lesson" unlock after 80%+ on exit ticket

#### Task 4.2: Create InteractiveDiagram Component
**Location**: `src/components/InteractiveDiagram.tsx`

For label-diagram activities:

**Water cycle diagram**:
- Show water cycle illustration
- Provide draggable labels: evaporation, condensation, precipitation, collection
- Drag labels to correct positions
- Check answer button
- Show correct answers with arrows and animations

**Adaptation matching**:
- Show 4 habitat images
- Show 12 animal cards
- Drag animals to correct habitat
- Provide feedback for each placement

#### Task 4.3: Create VirtualLab Component
**Location**: `src/components/VirtualLab.tsx`

**Water Cycle Virtual Lab**: "Be a Water Droplet"
- Student controls a water droplet
- Click buttons to: evaporate, condense, precipitate, collect
- See animations and environment changes
- Track: How many times through the cycle?
- Unlock achievement: Complete 3 full cycles

**Adaptation Simulator**:
- Choose a habitat (desert, arctic, rainforest, ocean)
- Select animal features: fur type, color, size, special adaptations
- Click "Test Survival" → See if animal survives
- Feedback: "Your animal is too hot because it has thick fur in the desert. Try again!"

#### Task 4.4: Create ScienceVocabulary Component
**Location**: `src/components/ScienceVocabulary.tsx`

Digital vocabulary notebook:

**Features**:
- Flashcard mode: Term on front, definition on back
- Image gallery: Visual for each term
- Audio pronunciation: Click to hear
- Quiz mode: Match terms to definitions
- Student notes: "Draw your own picture" option
- Word wall: Display all learned terms

#### Task 4.5: Create ScienceProgress Component
**Location**: `src/components/ScienceProgress.tsx`

**Show**:
- Units completed / in progress
- Lessons completed per unit
- Vocabulary mastery (% of terms known)
- Assessment scores (pre vs post)
- Time spent on science
- Badges earned

**Visual display**:
- Unit progress bars
- Vocabulary word wall (highlight known words)
- Badge showcase
- Certificate of completion for each unit

---

### PHASE 5: Science Integration & Gamification (8-12 hours)

#### Task 5.1: Add to Main Navigation
**Location**: `src/components/Home.tsx`

Add "Science Explorer" section:
- Icon: Microscope or magnifying glass
- Show available units (water cycle, adaptations, fossils)
- Display current lesson or "Start Unit" button
- Show science level/badges

#### Task 5.2: Create SciencePractice Component
**Location**: `src/components/SciencePractice.tsx`

Main science hub:
- Unit selection menu
- Lesson browser (show locked/unlocked)
- Vocabulary practice
- Virtual labs access
- Assessment center
- Science badges/achievements

#### Task 5.3: Gamification & Rewards
**Location**: `src/components/Rewards.tsx`

**Points**:
- Complete lesson: 30 points
- Pass exit ticket (80%+): 20 points
- Learn new vocabulary word: 5 points
- Complete virtual lab: 40 points
- Pass unit assessment: 100 points

**Badges**:
- "Water Cycle Expert" - Complete water cycle unit
- "Adaptation Detective" - Complete adaptations unit
- "Vocabulary Master" - Know 40+ science terms
- "Lab Scientist" - Complete 5 virtual labs
- "Perfect Score" - 100% on unit assessment

#### Task 5.4: Cross-Curricular Connections

**Link to reading comprehension**:
- Use science passages for reading practice
- Science vocabulary = reading vocabulary
- Informational text practice with science content

**Link to math**:
- Measure precipitation (measurement)
- Graph: Animal adaptations by habitat (data)
- Water cycle diagram = spatial reasoning

---

### PHASE 6: Multimedia & Accessibility (5-10 hours)

#### Task 6.1: Source or Create Videos
- Water cycle: 5 videos (3-5 min each)
- Adaptations: 5 videos (3-5 min each)
- Fossils: 3 videos (3-4 min each)

**Options**:
- License existing educational videos (YouTube, educational sites)
- Create animated videos using tools like Animoto, Powtoon
- Use public domain NASA, NOAA, or NPS content

#### Task 6.2: Create or Source Images
- Minimum 10 high-quality images per lesson (130+ images total)
- Water cycle diagrams (3-4 versions)
- Animal photos (50+ animals across habitats)
- Habitat photos (15-20 diverse ecosystems)

**Image sources**:
- Creative Commons (Flickr, Pixabay, Unsplash)
- Public domain (USGS, NOAA, NPS)
- Educational licenses (purchase if needed)

#### Task 6.3: Accessibility Features
- Add alt text to all images
- Add closed captions to all videos
- Add audio descriptions where appropriate
- Ensure interactive elements are keyboard navigable
- Test with screen reader
- Add read-aloud for all text content

---

### PHASE 7: Assessment & Analytics (5-8 hours)

#### Task 7.1: Implement Progress Tracking
**Location**: `src/utils/scienceProgressTracker.ts`

Track:
- Lessons started vs completed
- Time spent per lesson
- Vocabulary retention over time
- Pre-assessment vs post-assessment growth
- Most engaging lessons (by time and completion)

#### Task 7.2: Create Parent Science Report
**Location**: `src/components/ParentDashboard.tsx`

**Science section includes**:
- Units completed and scores
- Vocabulary learned
- Strengths: "Strong understanding of water cycle"
- Areas for growth: "Needs more practice with behavioral adaptations"
- Home extension activities:
  - "Observe the water cycle: Leave a cup of water outside. What happens?"
  - "Go on a nature walk: Find 5 animals and describe their adaptations"

#### Task 7.3: IEP Goal Alignment
Show how science lessons support IEP goals:
- Reading comprehension: Science passages
- Vocabulary: Science terms
- Following multi-step directions: Lesson procedures
- Visual processing: Diagrams and images

---

### PHASE 8: Documentation & Deployment (5-7 hours)

#### Task 8.1: Create Teacher Guide
**Document**: `SCIENCE_CONTENT_GUIDE.md`

Include:
- Lesson overview and pacing guide
- Vocabulary lists
- Assessment rubrics
- Extension activities
- Hands-on lab ideas (if materials available)
- Alignment with Virginia SOL science standards

#### Task 8.2: Create Parent Science Guide
- How to support science learning at home
- Vocabulary practice activities
- Outdoor observation activities
- Science-related books and videos
- Science museums and nature centers in Virginia

#### Task 8.3: Deployment Checklist
- [ ] All 13 lessons created and tested
- [ ] 55+ vocabulary terms with images and audio
- [ ] 13+ videos embedded or linked
- [ ] 150+ images loaded and optimized
- [ ] 5+ interactive diagrams functional
- [ ] 2 virtual labs working
- [ ] All assessments (pre, formative, summative) loaded
- [ ] Parent dashboard science section complete
- [ ] Reward system integrated
- [ ] Accessibility audit complete

---

## 📊 WAVE 1 SUCCESS METRICS

After completing Agents 5, 6, and 7, measure success by:

### Student Engagement
- **Science engagement rate**: 80%+ of students complete water cycle unit
- **Math practice frequency**: Students attempt 2-digit math 3+ times per week
- **Reading comprehension time**: Students spend 15+ min per session

### Academic Progress
- **Comprehension growth**: 20% increase in comprehension accuracy after 4 weeks
- **Math fact mastery**: 80%+ accuracy on two-digit addition/subtraction
- **Science vocabulary**: Students learn 40+ new science terms

### Virginia SOL Readiness
- **Reading**: Can comprehend 3rd grade texts (literal, inferential, evaluative)
- **Math**: Can solve two-digit addition/subtraction with and without regrouping
- **Science**: Can explain water cycle and adaptations

### Parent & Teacher Satisfaction
- **Parent dashboard usage**: 60%+ of parents check dashboard weekly
- **Teacher feedback**: Teachers report students are better prepared
- **IEP goal progress**: Measurable progress toward IEP reading, math, and science goals

---

## 🚀 NEXT STEPS AFTER WAVE 1

Once Agents 5, 6, and 7 are complete, prioritize:

### Wave 2 (Critical Math & Reading Extensions)
- **Agent 8**: Numbers 60-99 & Place Value Mastery (30h)
- **Agent 9**: Advanced Multiplication Facts (3s, 4s, 6s-9s) (40h)
- **Agent 10**: Sight Words Expansion (50-75 additional words) (30h)

### Wave 3 (Life Skills & Infrastructure)
- **Agent 11**: Money Skills (counting coins, making change) (35h)
- **Agent 12**: Time & Elapsed Time (40h)
- **Agent 13**: Mastery Tracking Dashboard (50h)
- **Agent 14**: Enhanced Error Correction System (Model-Lead-Test) (40h)

---

## ✅ SUMMARY: WHAT THESE 3 AGENTS DELIVER

| Feature | Impact | Time Investment |
|---------|--------|----------------|
| **Agent 5: Reading Comprehension** | Closes the #1 reading gap - students can now understand what they read | 80-120h |
| **Agent 6: Two-Digit Math** | Closes the #1 math gap - students can do real-world addition/subtraction | 60-80h |
| **Agent 7: Science Engagement** | Creates excitement and visual learning that hooks struggling learners | 60-85h |
| **TOTAL WAVE 1** | Minimum viable 3rd grade readiness achieved | 200-285h |

---

## 💡 IMPLEMENTATION TIPS FOR DEVELOPERS

1. **Start with data architecture** - Get schemas right first, UI follows
2. **Build incrementally** - Don't wait to test until everything is done
3. **User test early** - Get real student feedback on usability
4. **Prioritize accessibility** - IEP students often have visual, auditory, or motor needs
5. **Make it fun** - Engagement is everything for struggling learners
6. **Track everything** - Data drives adaptive learning and IEP progress monitoring

---

**Document Version**: 1.0
**Created by**: Claude Agent via IEP Learning Development Session
**Date**: November 18, 2025
**Next Review**: After Wave 1 completion
