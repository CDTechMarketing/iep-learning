# Wave 1 Agent Prompts - IEP Learning Platform

**Purpose**: This document contains the detailed specifications for all 10 Wave 1 learning agents.
**Audience**: Development team, educational consultants, project managers
**Last Updated**: November 19, 2025

---

## Overview

Wave 1 focuses on foundational academic and life skills for elementary students (K-3) with Individualized Education Programs (IEPs). Each agent is designed to be:

- **Standards-aligned**: Mapped to Virginia Standards of Learning (SOL)
- **IEP-friendly**: Scaffolded, accessible, multi-sensory
- **Data-driven**: Tracks progress and adapts to student needs
- **Engaging**: Game-based elements, rewards, and celebrations

---

## Agent Development Framework

Each agent should include:

### 1. Data Architecture (Phase 1)
- TypeScript interfaces in `src/types.ts`
- Dexie database tables in `src/db.ts`
- Seed data and content structure

### 2. UI Components (Phase 2)
- Interactive learning components
- Practice/assessment interfaces
- Progress visualization
- Accessibility features (font controls, TTS, etc.)

### 3. Logic & Algorithms (Phase 3)
- Adaptive difficulty algorithms
- Mastery tracking (typically 80% threshold)
- Error pattern detection
- Personalized recommendations

### 4. Integration (Phase 4)
- Home screen navigation
- App routing
- Store state management
- Parent dashboard connection

### 5. Content Creation (Phase 5)
- Learning materials
- Assessments
- Vocabulary
- Multimedia resources

### 6. Documentation (Phase 6)
- Teacher guide
- Parent guide
- Developer documentation
- Troubleshooting guide

---

## 🎯 Agent 1: Sight Words Mastery Coach

**Estimated Time**: 40-60 hours
**Priority**: HIGH
**Virginia SOL**: K.6, 1.6, 2.6
**IEP Focus**: Reading fluency, automaticity, memory

### Purpose
Help students achieve automatic recognition of high-frequency sight words through spaced repetition and multi-sensory practice.

### Key Features

#### Word Lists
- **Dolch Lists**: Pre-primer through Grade 3 (315 words)
- **Fry Lists**: First 300 instant words
- **Custom lists**: Teacher/parent can add specific words
- **Organized by frequency and difficulty**

#### Practice Modes
1. **Flashcard Drills**
   - Show word, student reads aloud
   - Optional audio support
   - Timed and untimed modes

2. **Word Hunts**
   - Find target sight words in simple sentences
   - Highlight and click
   - Context reinforcement

3. **Speed Challenges**
   - How many words in 1 minute?
   - Beat your own record
   - Visual timer and celebration

4. **Word Writing**
   - Type or trace the word
   - Kinesthetic reinforcement
   - Spelling practice

5. **Mystery Word**
   - Reveal letters one at a time
   - Encourage prediction
   - Letter pattern awareness

#### Learning Algorithm
- **Spaced Repetition**: Based on Leitner system
  - New words: Practice daily
  - Learning words: Every 2-3 days
  - Mastered words: Weekly review
- **Automaticity Scoring**: Speed + accuracy
  - Instant recognition = mastered
  - 2+ seconds = still learning
  - Incorrect = review needed

#### Scaffolding & Support
- Audio pronunciation for every word
- Picture associations (where applicable)
- Use in sentence context
- Breaking down word parts
- Mnemonics and tricks

#### Progress Tracking
- Words by status: New / Learning / Mastered
- Daily practice streak
- Speed improvement over time
- Parent dashboard: Weekly report

### Data Schema

```typescript
interface SightWord {
  id: string;
  word: string;
  list: 'dolch-preprimer' | 'dolch-primer' | 'dolch-1' | 'dolch-2' | 'dolch-3' | 'fry-1-100' | 'fry-101-200' | 'fry-201-300' | 'custom';
  frequency: number; // 1-300
  imageUrl?: string; // Optional picture association
  exampleSentence: string;
}

interface SightWordAttempt {
  id: string;
  studentId: string;
  wordId: string;
  timestamp: Date;
  correct: boolean;
  responseTime: number; // milliseconds
  mode: 'flashcard' | 'word-hunt' | 'speed-challenge' | 'writing';
}

interface SightWordProgress {
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
```

### Implementation Phases

**Phase 1**: Data & Basic Flashcards (8-10 hours)
- Set up word lists and database
- Create basic flashcard component
- Implement spaced repetition logic

**Phase 2**: Multiple Practice Modes (12-15 hours)
- Word hunt in sentences
- Speed challenge mode
- Word writing/tracing

**Phase 3**: Progress Tracking (10-12 hours)
- Automaticity calculations
- Progress dashboard
- Parent reports

**Phase 4**: Enhancements (10-15 hours)
- Audio support
- Picture associations
- Celebration animations
- Streak tracking

**Phase 5**: Polish & Testing (5-8 hours)
- Accessibility audit
- User testing
- Bug fixes

---

## 🎯 Agent 2: Phonics Pattern Detective

**Estimated Time**: 50-70 hours
**Priority**: HIGH
**Virginia SOL**: K.5, 1.5, 2.5
**IEP Focus**: Decoding, phonological awareness, reading fluency

### Purpose
Teach systematic phonics patterns through explicit instruction and engaging practice to build decoding skills.

### Key Features

#### Phonics Progression
1. **Letter Sounds** (26 letters + sounds)
2. **CVC Words** (consonant-vowel-consonant: cat, dog, sit)
3. **Digraphs** (ch, sh, th, wh, ph)
4. **Blends** (bl, cl, fl, br, cr, dr, etc.)
5. **Long Vowel Patterns**:
   - CVCe (magic e): cake, bike, rope
   - Vowel teams: ai, ay, ea, ee, oa, ow
6. **R-Controlled Vowels** (ar, er, ir, or, ur)
7. **Diphthongs** (oi, oy, ou, ow)
8. **Advanced Patterns** (silent letters, soft c/g)

#### Interactive Activities

**Sound Isolation Games**
- Beginning sound: "What sound does 'cat' start with?"
- Ending sound: "What sound does 'cat' end with?"
- Middle sound: "What vowel sound in 'cat'?"

**Blending Practice**
- Show: c-a-t
- Student blends: "cat"
- Visual cues (arrows showing blending)
- Audio support (slow/fast blending)

**Segmenting Activities**
- Hear: "cat"
- Student segments: c-a-t
- Move tokens for each sound
- Sound boxes (Elkonin boxes)

**Word Building**
- Digital letter tiles
- Build words with target patterns
- Change one letter challenges
- Rhyming word families

**Pattern Sorting**
- Sort words by pattern
- Drag and drop into categories
- Real vs. nonsense words

#### Decodable Texts
- Mini-stories using target phonics patterns
- Cumulative (use previously learned patterns)
- Built-in fluency practice
- Comprehension questions

#### Scaffolding
- **Visual Cues**: Letter-keyword-picture (A-apple-🍎)
- **Audio Support**: Hear each sound
- **Blending Support**: Slow motion blending
- **Color Coding**: Different colors for different sounds
- **Hints**: "Remember, 'sh' says /sh/ like shh be quiet!"

#### Mastery Tracking
- Phonics skills by category
- 80% accuracy to move forward
- Regular review of mastered patterns
- Error analysis (common confusions)

### Data Schema

```typescript
interface PhonicsPattern {
  id: string;
  name: string; // "CVC", "Digraph ch", "Long a (CVCe)", etc.
  category: 'letter-sounds' | 'cvc' | 'digraphs' | 'blends' | 'long-vowels' | 'r-controlled' | 'diphthongs' | 'advanced';
  level: number; // 1-8 (progression order)
  examples: string[]; // ["cat", "bat", "mat"]
  visualCue?: string; // Image URL
  audioUrl: string; // Pronunciation
  teachingTip: string;
}

interface PhonicsActivity {
  id: string;
  patternId: string;
  type: 'sound-isolation' | 'blending' | 'segmenting' | 'word-building' | 'sorting' | 'decodable-text';
  prompt: string;
  correctAnswer: string | string[];
  distractors?: string[]; // For multiple choice
  scaffoldLevel: 'high' | 'medium' | 'low'; // Amount of support
}

interface PhonicsAttempt {
  id: string;
  studentId: string;
  activityId: string;
  patternId: string;
  timestamp: Date;
  correct: boolean;
  studentAnswer: string;
  timeSpent: number;
  hintsUsed: number;
}

interface PhonicsProgress {
  id: string;
  studentId: string;
  patternId: string;
  status: 'not-introduced' | 'learning' | 'mastered';
  accuracy: number; // 0-100%
  attemptsCount: number;
  lastPracticed: Date;
  masteredDate?: Date;
}
```

### Implementation Phases

**Phase 1**: Data Architecture & Progression (10-12 hours)
- Phonics pattern database
- Activity structure
- Progression logic

**Phase 2**: Core Activities (20-25 hours)
- Sound isolation games
- Blending practice
- Segmenting activities
- Word building interface

**Phase 3**: Decodable Texts (10-15 hours)
- Text reader component
- Fluency tracking
- Comprehension questions

**Phase 4**: Visual & Audio (8-10 hours)
- Record/source audio for all sounds
- Create visual cues
- Animation and transitions

**Phase 5**: Mastery & Progress (7-10 hours)
- Tracking system
- Adaptive difficulty
- Parent reports

**Phase 6**: Polish (5-8 hours)
- User testing
- Accessibility
- Bug fixes

---

## 🎯 Agent 3: Sentence Building Architect

**Estimated Time**: 50-65 hours
**Priority**: MEDIUM
**Virginia SOL**: 1.10, 2.10, 3.10 (Writing)
**IEP Focus**: Grammar, sentence construction, written expression

### Purpose
Teach sentence structure, grammar basics, and writing conventions through interactive sentence building activities.

### Key Features

#### Grammar Foundations
- **Parts of Speech**:
  - Nouns (person, place, thing)
  - Verbs (action words)
  - Adjectives (describing words)
  - Adverbs (how/when)
  - Articles (a, an, the)

- **Sentence Structure**:
  - Subject + Verb
  - Subject + Verb + Object
  - Compound sentences (and, but, or)

- **Conventions**:
  - Capitalization (beginning, names)
  - End punctuation (. ! ?)
  - Commas in lists

#### Interactive Tools

**Word Bank Builder**
- Drag words to build sentences
- Color-coded by part of speech:
  - Nouns: blue
  - Verbs: red
  - Adjectives: green
  - Adverbs: orange
- Visual sentence structure guide
- Real-time grammar checking

**Sentence Scrambles**
- Mixed-up words to unscramble
- Capital letter and punctuation clues
- Increasing difficulty levels

**Expansion Activities**
- Start with basic sentence: "The dog ran."
- Add an adjective: "The big dog ran."
- Add an adverb: "The big dog ran quickly."
- Add a where/when: "The big dog ran quickly to the park."

**Sentence Combining**
- Two simple sentences given
- Student combines with "and," "but," or "or"
- Example: "The cat is black." + "The cat is fluffy." → "The cat is black and fluffy."

**Error Detection**
- Sentences with grammar errors
- Student identifies and fixes
- Categories:
  - Missing capital letter
  - Missing punctuation
  - Wrong word order
  - Incomplete sentence

#### Scaffolding

**Sentence Frames**
- Fill-in-the-blank templates
- "The ____ is ____."
- "I like to ____ with my ____."

**Visual Guides**
- Sentence structure charts
- Parts of speech reference
- Punctuation rules poster

**Writing Support**
- Word choice suggestions
- Synonym finder
- Sentence starters library

**Voice Typing**
- Speak sentences aloud
- System transcribes
- Edit and improve

#### Assessment
- Sentence construction tasks
- Grammar quizzes
- Creative writing prompts with scaffolds
- Portfolio of student writing

### Data Schema

```typescript
interface WordBankWord {
  id: string;
  word: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'article' | 'preposition' | 'conjunction';
  difficulty: number; // 1-5
  imageUrl?: string;
}

interface SentenceActivity {
  id: string;
  type: 'word-bank' | 'scramble' | 'expansion' | 'combining' | 'error-detection';
  prompt: string;
  targetSentence: string;
  wordBank?: string[];
  errors?: { position: number; type: string; correction: string }[];
  scaffoldLevel: 'high' | 'medium' | 'low';
  grammarFocus: string[]; // ["capitalization", "subject-verb-agreement"]
}

interface SentenceAttempt {
  id: string;
  studentId: string;
  activityId: string;
  timestamp: Date;
  studentSentence: string;
  isCorrect: boolean;
  errors: { type: string; description: string }[];
  hintsUsed: number;
  timeSpent: number;
}

interface GrammarProgress {
  id: string;
  studentId: string;
  skill: string; // "capitalization", "punctuation", "subject-verb", etc.
  level: number; // 1-5
  accuracy: number;
  practiceCount: number;
  lastPracticed: Date;
  mastered: boolean;
}
```

### Implementation Phases

**Phase 1**: Data & Word Bank (10-12 hours)
- Word database with parts of speech
- Sentence activity structure
- Grammar rules engine

**Phase 2**: Drag-and-Drop Builder (12-15 hours)
- Interactive sentence construction UI
- Color coding
- Real-time feedback

**Phase 3**: Activity Types (15-20 hours)
- Sentence scrambles
- Expansion activities
- Sentence combining
- Error detection

**Phase 4**: Scaffolding Tools (8-10 hours)
- Sentence frames
- Writing support features
- Voice typing integration

**Phase 5**: Assessment & Progress (5-8 hours)
- Grammar skills tracking
- Writing portfolio
- Progress reports

**Phase 6**: Polish (5-8 hours)
- User testing
- Accessibility
- Bug fixes

---

## 🎯 Agent 4: Story Sequence Navigator

**Estimated Time**: 55-75 hours
**Priority**: MEDIUM
**Virginia SOL**: 1.9, 2.7, 3.6 (Reading/Writing)
**IEP Focus**: Comprehension, sequencing, narrative skills

### Purpose
Develop understanding of story structure, sequencing, and narrative elements through interactive activities and story creation tools.

### Key Features

#### Sequencing Activities

**Picture Sequences**
- 3-6 pictures showing events in order
- Drag and drop to arrange correctly
- Progressive difficulty (3→4→5→6 events)
- Real-world scenarios (making sandwich, getting ready for school)

**Story Event Ordering**
- Text-based events from a story
- Arrange beginning, middle, end
- Use of transition words (first, next, then, finally)

**Step-by-Step Procedures**
- How-to sequences (make a paper airplane, plant a seed)
- Identify missing steps
- Practice procedural writing

**Timeline Creation**
- Place events on a visual timeline
- Understand before/after relationships
- Historical sequences (life cycle, day/night)

#### Story Elements

**Element Identification**
- **Characters**: Who is in the story?
- **Setting**: Where and when does it happen?
- **Problem**: What is the challenge or conflict?
- **Solution**: How is it resolved?
- **Beginning-Middle-End**: Structure of narrative

**Cause and Effect**
- Match cause with effect
- "What happened because...?"
- Chain reactions (A causes B, B causes C)

**Transition Words**
- Practice using: first, next, then, after, finally, before, during
- Fill in the blank in sequences
- Build transition word vocabulary

#### Story Creation Tools

**Digital Storyboard**
- 4-6 panel storyboard template
- Add pictures (upload, draw, or choose from library)
- Write caption for each panel
- Record audio narration (optional)

**Story Mapping**
- Visual organizer with story elements
- Beginning-Middle-End boxes
- Character/setting/problem/solution sections
- Planning tool before writing

**Illustration Options**
- Simple drawing tools
- Stamp library (characters, objects, backgrounds)
- Photo upload option
- AI-generated images (future enhancement)

**Writing Support**
- Sentence starters for each story part
- Transition word suggestions
- Descriptive word banks
- Spell-check and grammar support

#### Comprehension Activities

**Story Retelling**
- Listen to or read a story
- Retell using story map
- Include all key elements
- Scored on completeness and accuracy

**Sequence Questions**
- "What happened first?"
- "What happened after...?"
- "How did the story end?"

**Prediction Practice**
- Stop mid-story: "What will happen next?"
- Use story clues
- Confirm or revise predictions

### Data Schema

```typescript
interface SequenceActivity {
  id: string;
  type: 'picture-sequence' | 'text-sequence' | 'procedure' | 'timeline';
  title: string;
  events: SequenceEvent[];
  difficulty: number; // 1-5
  topic: string;
}

interface SequenceEvent {
  id: string;
  order: number; // Correct order
  content: string; // Description
  imageUrl?: string;
  transitionWord?: string; // "First", "Next", "Then", etc.
}

interface StoryActivity {
  id: string;
  title: string;
  type: 'identification' | 'cause-effect' | 'retelling' | 'creation';
  story?: Story; // For identification/retelling activities
  prompt: string;
}

interface Story {
  id: string;
  title: string;
  author: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  elements: {
    characters: string[];
    setting: { where: string; when: string };
    problem: string;
    solution: string;
    events: SequenceEvent[];
  };
}

interface StudentStory {
  id: string;
  studentId: string;
  title: string;
  createdAt: Date;
  lastModified: Date;
  storyboard: {
    panels: {
      order: number;
      imageUrl?: string;
      caption: string;
      audioUrl?: string;
    }[];
  };
  storyMap: {
    beginning: string;
    middle: string;
    end: string;
    characters: string[];
    setting: string;
    problem: string;
    solution: string;
  };
  published: boolean;
}

interface SequencingProgress {
  id: string;
  studentId: string;
  skill: 'picture-sequence' | 'text-sequence' | 'story-elements' | 'cause-effect' | 'retelling' | 'creation';
  level: number;
  accuracy: number;
  activitiesCompleted: number;
  lastPracticed: Date;
  mastered: boolean;
}
```

### Implementation Phases

**Phase 1**: Sequencing Infrastructure (10-12 hours)
- Data models
- Drag-and-drop sequence UI
- Feedback system

**Phase 2**: Sequencing Activities (15-20 hours)
- Picture sequences
- Text sequences
- Procedures and timelines
- Content creation

**Phase 3**: Story Elements (12-15 hours)
- Element identification activities
- Cause and effect
- Story analysis tools

**Phase 4**: Story Creation (15-20 hours)
- Digital storyboard builder
- Story mapping tool
- Drawing/stamping tools
- Audio recording

**Phase 5**: Progress & Assessment (5-8 hours)
- Skill tracking
- Story portfolio
- Rubrics for story evaluation

**Phase 6**: Polish (5-10 hours)
- User testing
- Accessibility
- Bug fixes

---

## 🎯 Agent 5: Reading Comprehension Specialist

**Status**: ✅ COMPLETED
**Time Invested**: ~70-90 hours
**Virginia SOL**: 3.5, 3.6, 3.7, 3.8

### Implementation Summary
Successfully implemented with all planned features including:
- PassageReader with TTS and vocabulary support
- ComprehensionQuiz with 3-level progressive hints
- Adaptive difficulty engine
- Mastery tracking for 9 comprehension skills
- 2 sample passages with 10 questions

### Delivered Components
- `PassageReader.tsx`
- `ComprehensionQuiz.tsx`
- `ReadingComprehensionPractice.tsx`
- `comprehensionEngine.ts`
- `masteryTracker.ts`

### Content Expansion Needed
- Add 28 more passages (target: 30 total, 10 per grade level)
- Create 290 more questions (target: 300 total)
- Add image support for passages
- Build parent progress dashboard
- Implement badges and achievements

**Full specification available in WAVE_1_IMPLEMENTATION_TRACKING.md**

---

## 🎯 Agent 6: Two-Digit Math Operations Specialist

**Status**: ✅ COMPLETED
**Time Invested**: ~60-80 hours
**Virginia SOL**: 3.3, 3.4, 3.5

### Implementation Summary
Successfully implemented comprehensive two-digit math system with:
- 5 difficulty levels (addition/subtraction with/without regrouping)
- Interactive visual manipulatives (base-ten blocks)
- Multiple solving strategies
- Error pattern detection (5 types)
- Adaptive difficulty and interventions

### Delivered Components
- `VerticalMathProblem.tsx`
- `BaseTenBlocks.tsx`
- `RegroupingHelper.tsx`
- `MathStrategySelector.tsx`
- `TwoDigitMathProgress.tsx`
- `TwoDigitMathPractice.tsx`
- `twoDigitMathEngine.ts`
- `errorPatternAnalyzer.ts`
- `mathIntervention.ts`
- `wordProblemHelper.ts`
- `TWO_DIGIT_MATH_GUIDE.md` (40+ pages)

### Enhancement Opportunities
- Video tutorials for regrouping concepts
- Expanded story problem bank
- Parent coaching videos
- User testing with students

**Full specification available in WAVE_1_IMPLEMENTATION_TRACKING.md**

---

## 🎯 Agent 7: Science Engagement Specialist

**Status**: ✅ COMPLETED (Foundation)
**Time Invested**: ~60-85 hours
**Virginia SOL**: 3.4, 3.5, 3.6, 3.9

### Implementation Summary
Successfully created science learning framework with:
- Complete Water Cycle unit (5 lessons, 20 vocab terms, assessments)
- Adaptations unit foundation (Lesson 1 complete)
- Fossils unit structure
- Science practice hub UI
- Comprehensive teacher/parent guide (400+ lines)

### Delivered Components
- `SciencePractice.tsx`
- Water Cycle content (5 complete lessons)
- Vocabulary database (20 terms)
- Pre and summative assessments
- `SCIENCE_CONTENT_GUIDE.md`

### Components Needed for Full Implementation
- `ScienceLesson.tsx` - Lesson delivery component
- `InteractiveDiagram.tsx` - Labeling activities
- `VirtualLab.tsx` - Interactive simulations
- `ScienceVocabulary.tsx` - Flashcard system
- Complete Adaptations and Fossils units
- Data loading system

**Full specification available in WAVE_1_IMPLEMENTATION_TRACKING.md**

---

## 🎯 Agent 8: Time & Money Mastery Coach

**Estimated Time**: 55-75 hours
**Priority**: MEDIUM
**Virginia SOL**: 2.10, 3.11 (Measurement)
**IEP Focus**: Life skills, practical math application

### Purpose
Teach time-telling, elapsed time, money counting, and basic financial literacy through interactive, real-world practice.

### Key Features

#### Time Skills

**Analog Clock Reading**
- Hour (o'clock)
- Half-hour (30 minutes)
- Quarter-hour (15 minutes)
- 5-minute intervals
- Minute-by-minute

**Interactive Clock**
- Draggable hour and minute hands
- Click-to-set time
- Visual guides (numbers, tick marks)
- Color-coded hands

**Digital Clocks**
- 12-hour format with AM/PM
- 24-hour format (military time)
- Converting analog ↔ digital

**Elapsed Time**
- "It's 2:00. In 30 minutes it will be ___."
- "Start: 3:15. End: 4:45. How long?"
- Visual timeline for understanding
- Real-world scenarios (movie length, travel time)

**Calendar Skills**
- Days of the week
- Months of the year
- Reading dates
- Days in each month
- Before/after date concepts

**Time Management**
- Creating daily schedules
- Estimating task duration
- Planning activities
- Understanding routines

#### Money Skills

**Coin Identification**
- Penny (1¢)
- Nickel (5¢)
- Dime (10¢)
- Quarter (25¢)
- Visual recognition
- Value association

**Counting Coins**
- Like coins (5 pennies = 5¢)
- Mixed coins (2 dimes + 3 pennies = 23¢)
- Efficient counting strategies (start with largest)
- "Count on" method

**Dollar Bills**
- $1, $5, $10, $20
- Bills + coins combinations
- Dollar and cent notation ($1.25)
- Decimal understanding

**Making Change**
- Given: $5.00, Cost: $3.25, Change: $1.75
- Counting up method
- Real-world scenarios

**Money Word Problems**
- "You have 3 quarters. How much money?"
- "You buy a toy for $2.50. You pay with $5. What's your change?"
- Shopping scenarios
- Saving and spending

**Comparison Shopping**
- Which item costs more/less?
- Which is the best deal?
- Do I have enough money?

**Budgeting Basics**
- Setting savings goals
- Needs vs. wants
- Making spending choices
- Tracking money earned/spent

#### Interactive Tools

**Virtual Cash Register**
- Scan items
- Calculate total
- Accept payment
- Give change

**Store Simulation**
- Browse items with prices
- Add to cart
- Check out
- Budget management

**Piggy Bank**
- Save virtual money
- Set goals
- Track progress
- Celebrate reaching goals

**Restaurant Scenario**
- Read menu with prices
- Order within budget
- Calculate tip (advanced)
- Pay and get change

#### Real-World Integration

**Daily Schedule Builder**
- Drag activities onto timeline
- See duration of each activity
- Plan a balanced day
- Time management practice

**Shopping Trip Planner**
- Given budget: $20
- Choose items
- Stay within budget
- Calculate remaining money

**Allowance Tracker**
- Earn money for chores
- Save for goals
- Make spending decisions
- Track over weeks

### Data Schema

```typescript
interface TimeActivity {
  id: string;
  type: 'analog-read' | 'digital-read' | 'set-time' | 'elapsed-time' | 'calendar' | 'schedule';
  difficulty: number; // 1-5
  prompt: string;
  correctAnswer: string;
  visualCue?: string; // Clock image, calendar image
  scenario?: string; // Real-world context
}

interface MoneyActivity {
  id: string;
  type: 'coin-id' | 'count-coins' | 'count-bills' | 'make-change' | 'word-problem' | 'shopping';
  difficulty: number;
  prompt: string;
  correctAnswer: number; // In cents
  coins?: { type: 'penny' | 'nickel' | 'dime' | 'quarter'; count: number }[];
  bills?: { type: 1 | 5 | 10 | 20; count: number }[];
  scenario?: string;
}

interface ShopItem {
  id: string;
  name: string;
  category: string;
  price: number; // In cents
  imageUrl: string;
}

interface TimeMoney Attempt {
  id: string;
  studentId: string;
  activityId: string;
  type: 'time' | 'money';
  timestamp: Date;
  correct: boolean;
  studentAnswer: string;
  timeSpent: number;
  hintsUsed: number;
}

interface TimeMoneyProgress {
  id: string;
  studentId: string;
  skill: string; // "analog-hour", "count-coins", "elapsed-time", etc.
  level: number;
  accuracy: number;
  practiceCount: number;
  lastPracticed: Date;
  mastered: boolean;
}

interface StudentBudget {
  id: string;
  studentId: string;
  balance: number; // In cents
  savingsGoal?: { name: string; target: number; current: number };
  transactions: {
    id: string;
    date: Date;
    type: 'earn' | 'spend' | 'save';
    amount: number;
    description: string;
  }[];
}
```

### Implementation Phases

**Phase 1**: Time Foundation (15-18 hours)
- Interactive clock component
- Analog clock reading activities
- Digital clock practice
- Data structure

**Phase 2**: Elapsed Time & Calendar (10-12 hours)
- Elapsed time calculator
- Timeline visualization
- Calendar activities
- Schedule builder

**Phase 3**: Money Foundation (12-15 hours)
- Coin identification
- Counting activities
- Visual coin manipulatives
- Money notation

**Phase 4**: Real-World Scenarios (12-15 hours)
- Virtual cash register
- Store simulation
- Restaurant scenario
- Making change practice

**Phase 5**: Financial Literacy (8-10 hours)
- Budgeting tools
- Savings goals
- Allowance tracker
- Decision-making activities

**Phase 6**: Progress & Polish (5-8 hours)
- Mastery tracking
- Parent reports
- User testing
- Accessibility

---

## 🎯 Agent 9: Executive Function Companion

**Estimated Time**: 70-95 hours
**Priority**: HIGH (Critical for IEP students)
**IEP Focus**: Organization, planning, time management, self-regulation
**Note**: Not tied to specific SOL standards (process skills)

### Purpose
Support students' executive functioning skills through visual tools, explicit instruction, and practice in organization, planning, time management, and self-regulation.

### Key Features

#### Task Management

**Visual Task Lists**
- Simple, clear display of tasks
- Checkboxes for completion
- Priority indicators (color-coded)
- Due date display
- Visual icons for task types

**Task Breakdown Wizard**
- "Big task" input
- Guided breakdown into steps
- Examples: "Write a story" → "Choose topic" → "Make outline" → "Write draft" → "Add pictures" → "Edit"
- Visual flowchart of steps
- Check off each step

**Task Initiation Support**
- "Just get started" prompts
- First step highlighted
- Timer integration ("Work for 5 minutes")
- Reward for starting

**Priority Setting**
- Must do / Should do / Nice to do
- Color coding (red/yellow/green)
- Visual ranking interface
- Practice scenarios

#### Time Management

**Visual Timers**
- Countdown timer with visual depletion
- Count-up timer for tracking
- Progress bar showing time passing
- Optional audio alerts
- Multiple timer styles (analog, digital, bar, pie)

**Time Estimation**
- "How long will this take?"
- Estimate before, measure actual
- Compare and reflect
- Build time awareness

**Schedule Visualization**
- Daily schedule with time blocks
- Visual now indicator
- Transition warnings
- Color-coded activities

**Break Reminders**
- Automatic break suggestions
- "You've worked for 20 minutes! Take a break?"
- Brain break activity suggestions
- Return to task prompts

#### Organization Tools

**Digital Locker**
- Virtual organization space
- Categories: Math, Reading, Science, etc.
- Store completed work
- Find things easily
- Practice sorting and filing

**Backpack Organizer**
- "Pack your backpack" game
- What do you need for tomorrow?
- Checklist of materials
- Practice routines

**Assignment Tracker**
- Record assignments
- Due dates
- Materials needed
- Completion status
- Parent visibility

**Material Organization**
- "Where does this go?" activities
- Sorting games
- Category practice
- Organization systems

#### Self-Regulation

**Emotion Check-Ins**
- "How are you feeling?" prompts
- Visual emotion scale (1-5)
- Emoji-based or color-based
- Track patterns over time

**Calm-Down Strategies**
- Library of regulation tools:
  - Deep breathing exercises
  - Progressive muscle relaxation
  - Counting strategies
  - Visual calm-down spot
  - Movement breaks
- Choose your strategy
- Guided practice

**Focus Tools**
- Background sounds (white noise, nature sounds)
- Focus timer (Pomodoro technique)
- Distraction blockers
- Focus reminders

**Reward Tracking**
- Connect to points system
- Visual progress toward rewards
- Celebration of achievements
- Motivation boost

#### Planning & Goal Setting

**Goal Setting Wizard**
- "What do you want to accomplish?"
- SMART goal guidance:
  - Specific: What exactly?
  - Measurable: How will you know?
  - Achievable: Is it possible?
  - Relevant: Does it matter?
  - Time-bound: By when?
- Break goal into steps
- Track progress

**Progress Visualization**
- Charts and graphs
- Before/after comparisons
- Celebrate growth
- Growth mindset messaging

**Reflection Prompts**
- "What went well today?"
- "What was challenging?"
- "What will you do differently next time?"
- "What help do you need?"
- Build metacognition

**Strategy Cards**
- "When I feel stuck, I can..."
- "When I feel frustrated, I can..."
- "When I don't understand, I can..."
- Student creates personal strategy library

### Data Schema

```typescript
interface StudentTask {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  category: string;
  steps: { id: string; title: string; completed: boolean }[];
  completed: boolean;
  completedAt?: Date;
  estimatedMinutes?: number;
  actualMinutes?: number;
}

interface TimerSession {
  id: string;
  studentId: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  completed: boolean;
  type: 'work' | 'break';
}

interface EmotionCheckIn {
  id: string;
  studentId: string;
  timestamp: Date;
  emotionLevel: number; // 1-5
  emotionName?: string; // "happy", "frustrated", "calm", etc.
  trigger?: string;
  strategy?: string; // What helped
  context?: string; // What activity
}

interface StudentGoal {
  id: string;
  studentId: string;
  goalText: string;
  category: 'academic' | 'behavioral' | 'social' | 'personal';
  startDate: Date;
  targetDate: Date;
  steps: { id: string; description: string; completed: boolean }[];
  progress: number; // 0-100%
  achieved: boolean;
  achievedDate?: Date;
  reflections: { date: Date; text: string }[];
}

interface OrganizationActivity {
  id: string;
  type: 'backpack' | 'locker' | 'assignment-tracker' | 'sorting';
  prompt: string;
  items: { id: string; name: string; category: string; imageUrl?: string }[];
  correctCategories: { [itemId: string]: string };
}

interface ExecutiveFunctionProgress {
  id: string;
  studentId: string;
  skill: 'task-initiation' | 'time-management' | 'organization' | 'self-regulation' | 'planning' | 'flexibility';
  level: number;
  practiceCount: number;
  successRate: number;
  lastPracticed: Date;
  notes?: string;
}
```

### Implementation Phases

**Phase 1**: Task Management (15-18 hours)
- Task list interface
- Task breakdown wizard
- Priority setting
- Data structure

**Phase 2**: Time Management (12-15 hours)
- Visual timer components
- Time estimation activities
- Schedule visualization
- Break reminders

**Phase 3**: Organization Tools (15-18 hours)
- Digital locker/backpack
- Assignment tracker
- Organization games
- Material management

**Phase 4**: Self-Regulation (12-15 hours)
- Emotion check-ins
- Calm-down strategy library
- Focus tools
- Reward tracking integration

**Phase 5**: Planning & Goals (10-12 hours)
- Goal setting wizard
- Progress visualization
- Reflection prompts
- Strategy cards

**Phase 6**: Integration & Parent Coaching (8-10 hours)
- Parent dashboard integration
- Coaching tips for parents/teachers
- Progress reports
- Collaboration features

**Phase 7**: Polish (5-8 hours)
- User testing with IEP students
- Accessibility audit
- Refinement
- Documentation

---

## 🎯 Agent 10: Social Skills Navigator

**Estimated Time**: 65-85 hours
**Priority**: HIGH (Critical for IEP students)
**IEP Focus**: Social communication, perspective-taking, problem-solving, emotional intelligence
**Note**: Not tied to specific SOL standards (social-emotional learning)

### Purpose
Explicitly teach social skills through interactive scenarios, guided practice, and feedback to help students navigate social situations successfully.

### Key Features

#### Social Scenarios

**Interactive Story-Based Scenarios**
- Visual scenes with characters
- Student makes choices at decision points
- See consequences of choices
- Multiple pathways through scenario
- Feedback on social appropriateness

**Common Scenarios**:
- Meeting someone new
- Joining a group at recess
- Asking for help
- Sharing materials
- Dealing with teasing
- Losing a game
- Group work situations
- Lunchroom navigation
- Waiting in line
- Transitioning between activities

**Choice System**
- 3-4 options at each decision point
- Green choice: Socially appropriate
- Yellow choice: Neutral/okay but not ideal
- Red choice: Socially inappropriate
- Explanation of why for each choice

**Consequence Visualization**
- Show what happens after each choice
- Facial expressions of characters
- Outcome narrative
- Opportunity to try again

#### Emotion Recognition

**Facial Expressions**
- Identify emotions from faces
- Happy, sad, angry, scared, surprised, confused, frustrated
- Multiple examples per emotion
- Real photos and illustrated faces
- Varying intensity levels

**Body Language**
- What does this body position mean?
- Crossed arms, slumped shoulders, hands on hips, etc.
- Context clues
- Multiple interpretation possibilities

**Tone of Voice**
- Audio clips with same words, different tones
- Happy, angry, sarcastic, kind, mean
- "It's not what you say, it's how you say it"

**Context Integration**
- Combine face + body + voice + situation
- "How is she feeling?"
- "What might happen next?"
- Building social perception skills

#### Conversation Skills

**Turn-Taking Practice**
- Visual turn indicators
- "Your turn to talk" / "Your turn to listen"
- Practice back-and-forth exchanges
- Timing awareness

**Topic Maintenance**
- Stay on topic game
- Identify when someone changes topics
- "Does this go with what we're talking about?"
- Practice relevant contributions

**Asking Questions**
- Question words (who, what, when, where, why, how)
- Practice forming questions
- "Ask a question to learn more"
- Follow-up questions

**Active Listening**
- "What did she just say?"
- Looking at the speaker
- Nodding, saying "mm-hmm"
- Repeating back what you heard

**Conversation Starters**
- Library of openers
- Context-appropriate choices
- Practice scenarios
- Building conversation confidence

**Ending Conversations**
- Recognizing when conversation is ending
- Polite exit phrases
- "It was nice talking to you!"
- Reading social cues

#### Problem-Solving

**Conflict Resolution Scenarios**
- Two children want the same toy
- Someone cuts in line
- Disagreement about game rules
- Feeling left out
- Misunderstanding between friends

**Problem-Solving Steps**:
1. **Identify the problem**: "What's wrong?"
2. **Think of solutions**: "What could you do?"
3. **Consider consequences**: "What might happen if you do that?"
4. **Choose best solution**: "What will you try?"
5. **Try it and reflect**: "Did it work?"

**"What Would You Do?" Activities**
- Present social dilemma
- Student suggests solution
- Discuss pros/cons
- Multiple valid approaches
- No single "right" answer for some situations

**Peer Mediation Strategies**
- Compromise
- Taking turns
- Asking for help from adult
- Walking away (when appropriate)
- Using words instead of actions

#### Friendship Skills

**Making Friends**
- Starting conversations
- Finding common interests
- Inviting someone to play
- Joining a group appropriately
- Introducing yourself

**Joining Groups**
- Watch first
- Wait for a pause
- Ask "Can I play?"
- Follow the group's lead
- Contribute positively

**Sharing and Cooperation**
- Taking turns
- Sharing materials
- Working together toward goal
- Celebrating others' success
- Being a team player

**Dealing with Disagreements**
- Friends can disagree
- Using calm voice
- Listening to each other
- Finding middle ground
- It's okay to agree to disagree

**Being a Good Friend**
- What do good friends do?
- Kindness, helping, listening
- Loyalty and trust
- Respecting differences
- Including others

#### Perspective-Taking

**"How Do They Feel?" Activities**
- Given scenario
- Identify character's feelings
- "Why might they feel that way?"
- Consider their point of view

**Point of View Exploration**
- Same situation, different perspectives
- "You think... but they think..."
- Understanding that people see things differently
- No one perspective is always right

**Empathy Building**
- "Have you ever felt like that?"
- Connect to own experiences
- "What would help you feel better?"
- Caring about others' feelings

**Theory of Mind**
- Understanding that others have thoughts/feelings different from yours
- "What does he know?" vs. "What do you know?"
- False belief understanding
- Building social cognition

### Data Schema

```typescript
interface SocialScenario {
  id: string;
  title: string;
  context: string; // Where, who, what's happening
  category: 'making-friends' | 'conflict' | 'conversation' | 'emotion' | 'group-work';
  difficulty: number; // 1-5
  scenes: SocialScene[];
}

interface SocialScene {
  id: string;
  order: number;
  description: string;
  imageUrl?: string;
  audioUrl?: string; // Narration or dialogue
  choices: SocialChoice[];
}

interface SocialChoice {
  id: string;
  text: string;
  type: 'appropriate' | 'neutral' | 'inappropriate';
  nextSceneId?: string; // Where this choice leads
  outcome: {
    description: string;
    characterReactions: { character: string; emotion: string }[];
    teaching: string; // "This is a good choice because..."
  };
  points: number;
}

interface EmotionActivity {
  id: string;
  type: 'facial' | 'body-language' | 'tone' | 'context';
  prompt: string;
  mediaUrl: string; // Image or audio
  correctEmotion: string;
  distractors: string[];
  explanation: string;
}

interface ConversationActivity {
  id: string;
  type: 'turn-taking' | 'topic' | 'questions' | 'listening' | 'starters';
  prompt: string;
  scenario?: string;
  conversation: { speaker: string; text: string }[];
  questions: { question: string; correctAnswer: string; options: string[] }[];
}

interface ProblemSolvingActivity {
  id: string;
  problem: string;
  context: string;
  characters: string[];
  possibleSolutions: {
    solution: string;
    pros: string[];
    cons: string[];
    outcome: string;
  }[];
}

interface SocialSkillsAttempt {
  id: string;
  studentId: string;
  activityId: string;
  type: 'scenario' | 'emotion' | 'conversation' | 'problem-solving';
  timestamp: Date;
  choices: { choiceId: string; choiceType: string }[];
  score: number;
  timeSpent: number;
}

interface SocialSkillsProgress {
  id: string;
  studentId: string;
  skill: 'emotion-recognition' | 'conversation' | 'problem-solving' | 'perspective-taking' | 'friendship';
  level: number;
  practiceCount: number;
  successRate: number;
  lastPracticed: Date;
  notes?: string;
  teacherObservations?: string;
}
```

### Implementation Phases

**Phase 1**: Scenario Engine (15-18 hours)
- Interactive scenario system
- Choice and consequence flow
- Visual scene display
- Data structure

**Phase 2**: Emotion Recognition (12-15 hours)
- Facial expression activities
- Body language practice
- Tone of voice exercises
- Context integration

**Phase 3**: Conversation Skills (12-15 hours)
- Turn-taking interface
- Topic maintenance games
- Question practice
- Active listening activities

**Phase 4**: Problem-Solving (10-12 hours)
- Problem-solving step wizard
- Conflict scenarios
- Solution exploration
- Reflection tools

**Phase 5**: Friendship Skills (10-12 hours)
- Making friends scenarios
- Joining groups practice
- Cooperation activities
- Friendship maintenance

**Phase 6**: Perspective-Taking (8-10 hours)
- "How do they feel?" activities
- Multiple perspective scenarios
- Empathy building
- Theory of mind development

**Phase 7**: Progress & Collaboration (5-8 hours)
- Teacher observation input
- Parent coaching
- Progress reports
- Generalization tracking

**Phase 8**: Polish (5-8 hours)
- User testing with IEP students
- Accessibility audit
- Cultural sensitivity review
- Refinement

---

## 🎓 Cross-Agent Features

These features should be consistent across all agents:

### Universal Design for Learning (UDL)
- Multiple means of representation (text, audio, visual)
- Multiple means of engagement (choice, challenge levels, rewards)
- Multiple means of expression (typing, speaking, clicking, drawing)

### Accessibility
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance (WCAG 2.1 AA)
- Dyslexia-friendly font options
- Adjustable text size
- Audio descriptions
- Closed captions on videos

### Data & Privacy
- Student data encrypted
- FERPA compliant
- Minimal data collection
- Parent access controls
- Secure authentication
- Data export options

### Progress Tracking
- Consistent mastery threshold (typically 80%)
- Regular review of mastered skills
- Skill-specific data collection
- Cross-agent insights (e.g., reading skills supporting science)
- Parent dashboard integration

### Motivation & Engagement
- Points system
- Achievement badges
- Celebration animations
- Progress visualization
- Streak tracking
- Reward options

### Teacher/Parent Tools
- Progress reports
- Skill breakdowns
- Recommended focus areas
- At-home activity suggestions
- Coaching tips
- Communication features

---

## 📐 Technical Standards

### Code Quality
- TypeScript (strict mode)
- React functional components with hooks
- Dexie for IndexedDB database
- Zustand for state management
- Tailwind CSS for styling
- Component documentation (JSDoc)

### Performance
- Lazy loading of components
- Optimized images and media
- Efficient database queries
- Minimal re-renders
- < 2 second load times

### Testing
- Unit tests for utilities
- Component testing
- Accessibility testing
- User acceptance testing
- IEP student testing

### Documentation
- Code comments
- Component documentation
- User guides
- Teacher guides
- Parent guides
- Developer onboarding docs

---

## 🚀 Getting Started with a New Agent

1. **Review specification** in this document
2. **Create feature branch**: `claude/agent-[number]-[name]-[session-id]`
3. **Set up data architecture**:
   - Add types to `src/types.ts`
   - Add tables to `src/db.ts`
   - Create seed data
4. **Build core components** in `src/components/`
5. **Implement algorithms** in `src/utils/`
6. **Integrate**:
   - Add routes in `src/App.tsx`
   - Add navigation in `src/Home.tsx`
   - Update `src/store.ts`
7. **Create documentation**
8. **Test thoroughly**
9. **Commit and push** to feature branch
10. **Create pull request** for review

---

**Document Version**: 1.0
**Created**: November 19, 2025
**Last Updated**: November 19, 2025
**Maintained By**: Development Team
