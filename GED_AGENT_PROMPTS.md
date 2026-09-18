# GED-Track Agent Prompts for Parallel Development

## Overview

This document contains **4 detailed agent prompts** for parallel development of priority modules essential for GED readiness. Each agent can work independently with minimal coordination needed.

**Goal**: Build foundational math and reading skills to keep student on track for GED credential (not certificate of completion).

**Student Context**:
- Current grade: 3rd
- Current reading level: Kindergarten (CVC words)
- Current math level: Counting 20-39, single-digit addition
- Diagnosed needs: Autism, learning disabilities, IEP accommodations
- Ultimate goal: GED credential

**Development Timeline**: 6-8 weeks (parallel execution)

**Total Effort**: 135-170 hours across 4 agents

---

## 🎨 DESIGN PRINCIPLES (All Agents Must Follow)

### 1. Evidence-Based Practices for Autism & Learning Disabilities:

**Multi-Sensory Learning**:
- Visual supports (images, icons, color coding)
- Audio supports (text-to-speech, sound effects)
- Interactive/tactile (drag-and-drop, touch counting)

**Errorless Learning Hierarchy**:
- Start with full prompts/supports
- Gradually fade to partial prompts
- Eventually move to independent practice
- Immediate corrective feedback
- Multiple opportunities for success

**Clear Structure & Predictability**:
- Consistent UI patterns across all activities
- Visual progress indicators
- Clear instructions with audio support
- Predictable activity flow

**Motivation & Engagement**:
- Token economy (star rewards)
- Immediate positive feedback
- Visual progress tracking
- Choice-making opportunities
- Celebration animations

### 2. Technical Standards:

**Stack**:
- React 18.3 + TypeScript
- Zustand for state management
- Dexie (IndexedDB) for local storage
- Tailwind CSS for styling
- Vite for build

**Code Quality**:
- TypeScript strict mode
- Proper error handling
- Console logging for debugging
- Accessibility (ARIA labels, keyboard navigation)
- Responsive design (works on tablets)

**Database Pattern**:
- Units contain multiple activities
- Problems/phrases linked to units via `unitId`
- Session logs track progress
- All data stored locally (privacy-first)

### 3. UI/UX Standards:

**Color Palette**:
- Primary: Blue gradients (learning activities)
- Success: Green (correct answers)
- Accent: Purple/Pink (special features)
- Warning: Yellow (break prompts)
- Neutral: Gray (text, backgrounds)

**Typography**:
- Large, clear fonts (minimum 18px)
- Optional dyslexia-friendly font mode
- High contrast for readability

**Animations**:
- Reduced motion option available
- Gentle, purposeful animations
- Celebration effects for success

**Layout**:
- Generous spacing
- Uncluttered screens
- One clear action at a time
- Visual hierarchy

---

# 📐 AGENT 1: MATH FOUNDATION SPECIALIST

**Assigned Modules**: Numbers 40-60 + Basic Fractions
**Estimated Effort**: 40-55 hours
**Timeline**: 5-7 weeks
**Priority**: HIGH (Math foundation)

---

## Module 1A: Numbers 40-60 (Place Value Foundation)

### Objectives:
1. Count from 40 to 60 with one-to-one correspondence
2. Identify numbers 40-60 in isolation
3. Understand place value (4 tens and 3 ones = 43)
4. Compare numbers 40-60 using >, <, =
5. Order numbers 40-60 from least to greatest

### Technical Implementation:

#### Database Schema:

```typescript
// Add to src/types.ts
interface MathProblem {
  id: string;
  unitId: string;
  type: 'number-line' | 'ten-frame' | 'touch-count' | 'place-value' | 'identification' | 'comparison' | 'ordering';
  prompt: string;
  answer: number;
  options?: number[];

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

  // Existing fields
  manipulatives?: string;
  createdAt?: Date;
}
```

#### Seed Data:

```typescript
// Add to src/db.ts in seedInitialData()

// Counting 40-49 Unit
const counting4049UnitId = 'counting-40-49-001';
const counting4049Unit: Unit = {
  id: counting4049UnitId,
  title: 'Counting 40-49',
  tags: ['counting', 'number-sense', '40-49', 'place-value'],
  goalStars: [5, 10, 15],
  createdAt: new Date()
};
await db.units.add(counting4049Unit);

const counting4049Problems: MathProblem[] = [
  // Number Line Activities (5 problems)
  { id: `${counting4049UnitId}-nl-1`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 43', answer: 43, rangeStart: 40, rangeEnd: 49 },
  { id: `${counting4049UnitId}-nl-2`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 46', answer: 46, rangeStart: 40, rangeEnd: 49 },
  { id: `${counting4049UnitId}-nl-3`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 41', answer: 41, rangeStart: 40, rangeEnd: 49 },
  { id: `${counting4049UnitId}-nl-4`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 48', answer: 48, rangeStart: 40, rangeEnd: 49 },
  { id: `${counting4049UnitId}-nl-5`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 44', answer: 44, rangeStart: 40, rangeEnd: 49 },

  // Ten Frame Activities (5 problems)
  { id: `${counting4049UnitId}-tf-1`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 43, options: [41, 43, 45, 33] },
  { id: `${counting4049UnitId}-tf-2`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 45, options: [45, 44, 46, 35] },
  { id: `${counting4049UnitId}-tf-3`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 47, options: [47, 46, 48, 37] },
  { id: `${counting4049UnitId}-tf-4`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 42, options: [42, 41, 43, 32] },
  { id: `${counting4049UnitId}-tf-5`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 49, options: [49, 48, 47, 39] },

  // Touch Count Activities (5 problems)
  { id: `${counting4049UnitId}-tc-1`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 43, manipulatives: 'stars' },
  { id: `${counting4049UnitId}-tc-2`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the bears!', answer: 45, manipulatives: 'animals' },
  { id: `${counting4049UnitId}-tc-3`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 47, manipulatives: 'stars' },
  { id: `${counting4049UnitId}-tc-4`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the bears!', answer: 41, manipulatives: 'animals' },
  { id: `${counting4049UnitId}-tc-5`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 49, manipulatives: 'stars' },

  // Place Value Activities (5 problems)
  { id: `${counting4049UnitId}-pv-1`, unitId: counting4049UnitId, type: 'place-value', prompt: '4 tens and 3 ones equals?', answer: 43, options: [43, 34, 7, 40], tens: 4, ones: 3 },
  { id: `${counting4049UnitId}-pv-2`, unitId: counting4049UnitId, type: 'place-value', prompt: '4 tens and 7 ones equals?', answer: 47, options: [47, 74, 11, 40], tens: 4, ones: 7 },
  { id: `${counting4049UnitId}-pv-3`, unitId: counting4049UnitId, type: 'place-value', prompt: '40 + 5 = ?', answer: 45, options: [45, 54, 9, 40] },
  { id: `${counting4049UnitId}-pv-4`, unitId: counting4049UnitId, type: 'place-value', prompt: '40 + 9 = ?', answer: 49, options: [49, 94, 13, 40] },
  { id: `${counting4049UnitId}-pv-5`, unitId: counting4049UnitId, type: 'place-value', prompt: '40 + 2 = ?', answer: 42, options: [42, 24, 6, 40] },

  // Number Identification (5 problems)
  { id: `${counting4049UnitId}-id-1`, unitId: counting4049UnitId, type: 'identification', prompt: '43', answer: 43, options: [43, 34, 40, 45] },
  { id: `${counting4049UnitId}-id-2`, unitId: counting4049UnitId, type: 'identification', prompt: '47', answer: 47, options: [47, 74, 45, 49] },
  { id: `${counting4049UnitId}-id-3`, unitId: counting4049UnitId, type: 'identification', prompt: '41', answer: 41, options: [41, 14, 40, 43] },
  { id: `${counting4049UnitId}-id-4`, unitId: counting4049UnitId, type: 'identification', prompt: '49', answer: 49, options: [49, 94, 47, 40] },
  { id: `${counting4049UnitId}-id-5`, unitId: counting4049UnitId, type: 'identification', prompt: '45', answer: 45, options: [45, 54, 43, 47] },

  // Comparison Activities (5 problems)
  { id: `${counting4049UnitId}-cmp-1`, unitId: counting4049UnitId, type: 'comparison', prompt: '43 ___ 47', answer: 0, options: ['<', '>', '='], correctSymbol: '<', number1: 43, number2: 47 },
  { id: `${counting4049UnitId}-cmp-2`, unitId: counting4049UnitId, type: 'comparison', prompt: '49 ___ 45', answer: 1, options: ['<', '>', '='], correctSymbol: '>', number1: 49, number2: 45 },
  { id: `${counting4049UnitId}-cmp-3`, unitId: counting4049UnitId, type: 'comparison', prompt: '42 ___ 48', answer: 0, options: ['<', '>', '='], correctSymbol: '<', number1: 42, number2: 48 },
  { id: `${counting4049UnitId}-cmp-4`, unitId: counting4049UnitId, type: 'comparison', prompt: '46 ___ 41', answer: 1, options: ['<', '>', '='], correctSymbol: '>', number1: 46, number2: 41 },
  { id: `${counting4049UnitId}-cmp-5`, unitId: counting4049UnitId, type: 'comparison', prompt: '44 ___ 44', answer: 2, options: ['<', '>', '='], correctSymbol: '=', number1: 44, number2: 44 },
];
await db.mathProblems.bulkAdd(counting4049Problems);

// Counting 50-60 Unit (similar structure)
const counting5060UnitId = 'counting-50-60-001';
const counting5060Unit: Unit = {
  id: counting5060UnitId,
  title: 'Counting 50-60',
  tags: ['counting', 'number-sense', '50-60', 'place-value'],
  goalStars: [5, 10, 15],
  createdAt: new Date()
};
await db.units.add(counting5060Unit);

// Similar problems for 50-60 range (30 problems total)
```

#### New Components to Create:

**1. PlaceValueBuilder.tsx** (8-12h)
- Location: `src/components/math/PlaceValueBuilder.tsx`
- Interactive base-10 blocks (tens rods and ones cubes)
- Drag-and-drop interface
- Visual representation: 4 tens rods + 3 ones cubes = 43
- Show expanded form: "40 + 3 = 43"
- Audio support
- Multiple choice answer selection

**2. NumberComparison.tsx** (4-6h)
- Location: `src/components/math/NumberComparison.tsx`
- Display two numbers side-by-side
- Show comparison symbols as buttons (<, >, =)
- Visual support with number lines or ten frames
- Immediate feedback
- Audio support for reading numbers

**3. NumberOrdering.tsx** (4-6h)
- Location: `src/components/math/NumberOrdering.tsx`
- Display 3-4 numbers out of order
- Drag-and-drop to arrange
- Or tap/click to select order
- Visual feedback
- Celebration on correct ordering

**Example Component Structure** (PlaceValueBuilder.tsx):

```typescript
import { useState } from 'react';
import { MathProblem } from '../types';

interface PlaceValueBuilderProps {
  problem: MathProblem;
  onAnswer: (correct: boolean) => void;
  audioEnabled: boolean;
}

export function PlaceValueBuilder({ problem, onAnswer, audioEnabled }: PlaceValueBuilderProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    const correct = answer === problem.answer;
    setShowFeedback(true);
    onAnswer(correct);
  };

  // Render base-10 blocks visual
  const renderTensRods = () => {
    if (!problem.tens) return null;
    return (
      <div className="flex gap-2">
        {Array.from({ length: problem.tens }).map((_, i) => (
          <div key={i} className="w-12 h-32 bg-blue-400 border-2 border-blue-600 rounded">
            {/* Ten marks inside */}
            <div className="grid grid-rows-10 h-full p-1 gap-0.5">
              {Array.from({ length: 10 }).map((_, j) => (
                <div key={j} className="bg-blue-600 rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOnesCubes = () => {
    if (!problem.ones) return null;
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: problem.ones }).map((_, i) => (
          <div key={i} className="w-12 h-12 bg-yellow-400 border-2 border-yellow-600 rounded" />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-4xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {problem.prompt}
      </h2>

      {/* Visual Base-10 Blocks */}
      <div className="mb-8 flex justify-center gap-8">
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Tens</p>
          {renderTensRods()}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Ones</p>
          {renderOnesCubes()}
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        {problem.options?.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={showFeedback}
            className={`p-8 text-5xl font-bold rounded-2xl transition-all transform hover:scale-105 ${
              showFeedback && option === problem.answer
                ? 'bg-green-500 text-white shadow-2xl'
                : showFeedback && option === selectedAnswer
                ? 'bg-red-400 text-white'
                : 'bg-white border-4 border-gray-300 text-gray-800 hover:border-blue-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-8 text-center">
          <p className="text-3xl font-bold text-green-600">
            {selectedAnswer === problem.answer ? '🎉 Great job!' : '👍 Try again!'}
          </p>
        </div>
      )}
    </div>
  );
}
```

#### Extend Existing Components:

**Update MathPractice.tsx**:
- Add routing for new problem types ('place-value', 'comparison', 'ordering')
- Import and render new components
- Ensure existing number-line, ten-frame, touch-count work with 40-60 range

```typescript
// In MathPractice.tsx renderActivityContent()
case 'place-value':
  return (
    <PlaceValueBuilder
      problem={currentProblem}
      onAnswer={handleNewActivityAnswer}
      audioEnabled={audioEnabled}
    />
  );

case 'comparison':
  return (
    <NumberComparison
      problem={currentProblem}
      onAnswer={handleNewActivityAnswer}
      audioEnabled={audioEnabled}
    />
  );

case 'ordering':
  return (
    <NumberOrdering
      problem={currentProblem}
      onAnswer={handleNewActivityAnswer}
      audioEnabled={audioEnabled}
    />
  );
```

---

## Module 1B: Basic Fractions

### Objectives:
1. Recognize and name fractions: 1/2, 1/3, 1/4, 1/5, 1/6, 1/8, 1/10
2. Identify fractions from visual models (circles, rectangles)
3. Compare unit fractions (1/2 vs 1/4)
4. Understand fractions as parts of a whole
5. Match fractions to real-world examples

### Technical Implementation:

#### Database Schema:

```typescript
// Add to src/types.ts
interface FractionProblem {
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
```

#### Add FractionProblem Table to Database:

```typescript
// In src/db.ts
export class LearningAppDatabase extends Dexie {
  units!: Table<Unit, string>;
  phrases!: Table<Phrase, string>;
  mathProblems!: Table<MathProblem, string>;
  fractionProblems!: Table<FractionProblem, string>; // NEW
  scienceProblems!: Table<ScienceProblem, string>;
  sessionLogs!: Table<SessionLog, string>;
  rewards!: Table<Reward, string>;
  settings!: Table<AppSettings, string>;
  logs!: Table<LogEntry, number>;

  constructor() {
    super('LearningAppDB');

    // Version 4: Add fraction problems
    this.version(4).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      fractionProblems: 'id, unitId, type, denominator', // NEW
      scienceProblems: 'id, unitId, type, machineType',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id',
      logs: '++id, timestamp, level, category'
    });
  }
}

export const db = new LearningAppDatabase();
```

#### Seed Data Example:

```typescript
// Add to seedInitialData() in src/db.ts

// Fractions Unit 1: Introduction to Halves (1/2)
const fractionHalfUnitId = 'fractions-half-001';
const fractionHalfUnit: Unit = {
  id: fractionHalfUnitId,
  title: 'Fractions: One Half (1/2)',
  tags: ['fractions', 'half', 'visual-math'],
  goalStars: [5, 10],
  createdAt: new Date()
};
await db.units.add(fractionHalfUnit);

const fractionHalfProblems: FractionProblem[] = [
  // Identification with circles (5 problems)
  {
    id: `${fractionHalfUnitId}-id-1`,
    unitId: fractionHalfUnitId,
    type: 'fraction-identification',
    prompt: 'What fraction is shaded?',
    answer: 0, // Index of "1/2" in options
    numerator: 1,
    denominator: 2,
    visualType: 'circle',
    shadedParts: 1,
    totalParts: 2,
    options: ['1/2', '1/3', '1/4', '2/2']
  },
  {
    id: `${fractionHalfUnitId}-id-2`,
    unitId: fractionHalfUnitId,
    type: 'fraction-identification',
    prompt: 'What fraction is shaded?',
    answer: 0,
    numerator: 1,
    denominator: 2,
    visualType: 'rectangle',
    shadedParts: 1,
    totalParts: 2,
    options: ['1/2', '1/4', '2/2', '1/3']
  },

  // Real-world examples (3 problems)
  {
    id: `${fractionHalfUnitId}-rw-1`,
    unitId: fractionHalfUnitId,
    type: 'fraction-real-world',
    prompt: 'What fraction of the pizza is left?',
    answer: 0,
    numerator: 1,
    denominator: 2,
    visualType: 'real-world',
    shadedParts: 1,
    totalParts: 2,
    realWorldContext: 'pizza',
    options: ['1/2', '1/4', '1/3', '2/2']
  },

  // Matching (2 problems)
  {
    id: `${fractionHalfUnitId}-match-1`,
    unitId: fractionHalfUnitId,
    type: 'fraction-matching',
    prompt: 'Which picture shows 1/2?',
    answer: 0, // Index of correct visual
    numerator: 1,
    denominator: 2,
    visualType: 'circle',
    shadedParts: 1,
    totalParts: 2,
    options: ['Circle with 1/2 shaded', 'Circle with 1/4 shaded', 'Circle with 3/4 shaded', 'Circle all shaded']
  },
];
await db.fractionProblems.bulkAdd(fractionHalfProblems);

// Fractions Unit 2: Introduction to Fourths (1/4)
// Similar structure...

// Fractions Unit 3: Comparing Halves and Fourths
const fractionCompareUnitId = 'fractions-compare-001';
const fractionCompareUnit: Unit = {
  id: fractionCompareUnitId,
  title: 'Compare Fractions: 1/2 vs 1/4',
  tags: ['fractions', 'comparison', 'visual-math'],
  goalStars: [5, 10],
  createdAt: new Date()
};
await db.units.add(fractionCompareUnit);

const fractionCompareProblems: FractionProblem[] = [
  {
    id: `${fractionCompareUnitId}-cmp-1`,
    unitId: fractionCompareUnitId,
    type: 'fraction-comparison',
    prompt: 'Which is more?',
    answer: 0, // Index of 1/2
    numerator: 1,
    denominator: 2,
    visualType: 'circle',
    shadedParts: 1,
    totalParts: 2,
    fraction2: {
      numerator: 1,
      denominator: 4,
      shadedParts: 1
    },
    options: ['1/2', '1/4']
  },
  // More comparison problems...
];
await db.fractionProblems.bulkAdd(fractionCompareProblems);
```

#### New Components to Create:

**1. FractionCircleVisual.tsx** (4-6h)
- Reusable SVG component for circular fraction models
- Props: totalParts, shadedParts, size, colors
- Draws pie slices
- Used across all fraction activities

```typescript
interface FractionCircleProps {
  totalParts: number; // 2, 3, 4, etc.
  shadedParts: number; // How many to shade
  size?: number; // Diameter in pixels
  shadedColor?: string;
  unshadedColor?: string;
}

export function FractionCircleVisual({
  totalParts,
  shadedParts,
  size = 200,
  shadedColor = '#60A5FA', // blue-400
  unshadedColor = '#E5E7EB' // gray-200
}: FractionCircleProps) {
  // SVG circle with pie slices
  // Calculate angles for each slice
  // Render with proper shading
}
```

**2. FractionRectangleVisual.tsx** (4-6h)
- Reusable component for rectangular fraction models
- Draw rectangle divided into equal parts
- Shade specified number of parts

**3. FractionIdentification.tsx** (6-8h)
- Location: `src/components/math/fractions/FractionIdentification.tsx`
- Display visual (circle or rectangle)
- Ask "What fraction is shaded?"
- Multiple choice answers
- Immediate feedback

**4. FractionComparison.tsx** (6-8h)
- Display two fractions side-by-side
- Visual models for each
- Ask "Which is more?"
- Buttons for selection
- Clear visual feedback

**5. FractionRealWorld.tsx** (8-10h)
- Show real-world images (pizza, cookies, etc.)
- Some portions consumed/gone
- Ask "What fraction is left?"
- Multiple choice answers
- Engaging visuals

**6. FractionPractice.tsx** (8-10h)
- Main component orchestrating fraction activities
- Similar to MathPractice.tsx but for fractions
- Routes to appropriate fraction activity components
- Tracks progress
- Awards stars

#### Example Component (FractionIdentification.tsx):

```typescript
import { useState } from 'react';
import { FractionProblem } from '../../types';
import { FractionCircleVisual } from './FractionCircleVisual';
import { FractionRectangleVisual } from './FractionRectangleVisual';

interface FractionIdentificationProps {
  problem: FractionProblem;
  onAnswer: (correct: boolean) => void;
  audioEnabled: boolean;
}

export function FractionIdentification({ problem, onAnswer, audioEnabled }: FractionIdentificationProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === problem.answer;
    setShowFeedback(true);

    if (audioEnabled) {
      const audio = new Audio(correct ? '/sounds/correct.mp3' : '/sounds/try-again.mp3');
      audio.play();
    }

    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-4xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {problem.prompt}
      </h2>

      {/* Visual Model */}
      <div className="mb-12 flex justify-center">
        {problem.visualType === 'circle' ? (
          <FractionCircleVisual
            totalParts={problem.totalParts}
            shadedParts={problem.shadedParts}
            size={300}
          />
        ) : (
          <FractionRectangleVisual
            totalParts={problem.totalParts}
            shadedParts={problem.shadedParts}
            width={400}
            height={200}
          />
        )}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        {problem.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showFeedback}
            className={`p-8 text-5xl font-bold rounded-2xl transition-all transform hover:scale-105 ${
              showFeedback && index === problem.answer
                ? 'bg-green-500 text-white shadow-2xl'
                : showFeedback && index === selectedAnswer
                ? 'bg-red-400 text-white'
                : 'bg-white border-4 border-gray-300 text-gray-800 hover:border-blue-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-8 text-center">
          <p className="text-3xl font-bold text-green-600">
            {selectedAnswer === problem.answer ? '🎉 Perfect!' : '👍 Keep trying!'}
          </p>
        </div>
      )}
    </div>
  );
}
```

### Testing Requirements:

1. **Visual Accuracy**: Ensure fractions are visually correct (equal parts)
2. **Accessibility**: High contrast, large touch targets
3. **Audio Support**: Works with audio on/off
4. **Responsiveness**: Works on tablets and desktops
5. **Database**: Verify all fraction problems save and load correctly
6. **Progress**: Stars awarded correctly
7. **Navigation**: Smooth transitions between activities

### Deliverables:

- ✅ 2 units for counting 40-60 with place value
- ✅ 5-6 fraction units (halves, thirds, fourths, fifths, comparison)
- ✅ 3 new components for numbers 40-60
- ✅ 5 new components for fractions
- ✅ Database schema updates
- ✅ Seed data for ~80-100 problems
- ✅ Tests confirming functionality
- ✅ Documentation for maintenance

---

# 📖 AGENT 2: READING PHONICS SPECIALIST

**Assigned Modules**: Vowel Teams + R-Controlled Vowels
**Estimated Effort**: 35-45 hours
**Timeline**: 4-6 weeks
**Priority**: HIGH (Reading breakthrough)

---

## Module 2A: Vowel Teams

### Objectives:
1. Decode words with long A vowel teams (ai, ay)
2. Decode words with long E vowel teams (ea, ee)
3. Decode words with long O vowel teams (oa, ow)
4. Decode words with long I vowel teams (ie, igh)
5. Read simple sentences using vowel team words

### Vowel Teams to Implement:

**Priority Order**:
1. **AI** (rain, train, tail, mail, chain, paint) - 8-10 words
2. **AY** (play, stay, day, may, say, way) - 8-10 words
3. **EA** (eat, meat, read, team, bean, sea) - 8-10 words
4. **EE** (see, tree, bee, feet, need, seed) - 8-10 words
5. **OA** (boat, coat, road, goat, soap) - 8-10 words
6. **OW** (snow, grow, show, glow, flow) - 6-8 words
7. **IGH** (high, light, night, right, sight) - 8-10 words
8. **IE** (pie, tie, die, lie) - 4-6 words (limited set)

### Technical Implementation:

#### Database Schema:

```typescript
// Add to src/types.ts
interface VowelTeamPhrase extends Phrase {
  id: string;
  unitId: string;
  lines: string[];

  // Vowel team specific
  vowelPattern: 'ai' | 'ay' | 'ea' | 'ee' | 'oa' | 'ow' | 'ie' | 'igh';
  targetWords: string[]; // Words featuring the vowel team in this phrase

  // Optional metadata
  wordCount?: number;
  hasSightWords?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface DecodableReader {
  id: string;
  unitId: string;
  title: string;
  vowelPattern: string;
  wordCount: number;
  text: string; // Full passage (50-100 words)
  targetWordCount: number; // How many words use the vowel team

  // Comprehension (optional)
  comprehensionQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];

  // Visual support
  imageUrl?: string;
}
```

#### Seed Data Example:

```typescript
// Unit: Long A with AI
const vowelAiUnitId = 'vowel-ai-001';
const vowelAiUnit: Unit = {
  id: vowelAiUnitId,
  title: 'Long A: AI Words (rain, train)',
  tags: ['reading', 'vowel-teams', 'ai', 'long-a'],
  goalStars: [5, 10, 15],
  createdAt: new Date()
};
await db.units.add(vowelAiUnit);

const vowelAiPhrases: VowelTeamPhrase[] = [
  // Single word practice
  { id: `${vowelAiUnitId}-1`, unitId: vowelAiUnitId, lines: ['rain'], vowelPattern: 'ai', targetWords: ['rain'] },
  { id: `${vowelAiUnitId}-2`, unitId: vowelAiUnitId, lines: ['train'], vowelPattern: 'ai', targetWords: ['train'] },
  { id: `${vowelAiUnitId}-3`, unitId: vowelAiUnitId, lines: ['tail'], vowelPattern: 'ai', targetWords: ['tail'] },
  { id: `${vowelAiUnitId}-4`, unitId: vowelAiUnitId, lines: ['mail'], vowelPattern: 'ai', targetWords: ['mail'] },
  { id: `${vowelAiUnitId}-5`, unitId: vowelAiUnitId, lines: ['chain'], vowelPattern: 'ai', targetWords: ['chain'] },

  // Two-word phrases
  { id: `${vowelAiUnitId}-6`, unitId: vowelAiUnitId, lines: ['the rain'], vowelPattern: 'ai', targetWords: ['rain'], hasSightWords: true },
  { id: `${vowelAiUnitId}-7`, unitId: vowelAiUnitId, lines: ['a train'], vowelPattern: 'ai', targetWords: ['train'], hasSightWords: true },

  // Progressive sentences (like existing CVC model)
  {
    id: `${vowelAiUnitId}-8`,
    unitId: vowelAiUnitId,
    lines: ['The train', 'The train is', 'The train is in', 'The train is in the rain'],
    vowelPattern: 'ai',
    targetWords: ['train', 'rain'],
    hasSightWords: true
  },
  {
    id: `${vowelAiUnitId}-9`,
    unitId: vowelAiUnitId,
    lines: ['I see', 'I see the', 'I see the mail', 'I see the mail on the train'],
    vowelPattern: 'ai',
    targetWords: ['mail', 'train'],
    hasSightWords: true
  },
  {
    id: `${vowelAiUnitId}-10`,
    unitId: vowelAiUnitId,
    lines: ['The dog', 'The dog has', 'The dog has a tail', 'The dog has a long tail'],
    vowelPattern: 'ai',
    targetWords: ['tail'],
    hasSightWords: true
  },
];
await db.phrases.bulkAdd(vowelAiPhrases);

// Optional: Decodable reader for AI
const aiReader: DecodableReader = {
  id: `${vowelAiUnitId}-reader-1`,
  unitId: vowelAiUnitId,
  title: 'The Train in the Rain',
  vowelPattern: 'ai',
  wordCount: 45,
  text: `
    It is a rainy day. The train is on the track.
    The rain falls on the train. The mail is on the train.
    I see the train go by. The train has a long tail of smoke.
    The dog sits and waits for the mail. He wags his tail.
  `,
  targetWordCount: 8,
  comprehensionQuestions: [
    {
      question: 'What is on the train?',
      options: ['The mail', 'A cat', 'A bike', 'Snow'],
      correctAnswer: 0
    },
    {
      question: 'What does the dog wag?',
      options: ['His tail', 'His paw', 'The mail', 'The chain'],
      correctAnswer: 0
    }
  ]
};
// Note: Store in separate decodableReaders table or as special phrase type

// Repeat similar structure for AY, EA, EE, OA, OW, IGH, IE
```

#### New Components to Create:

**1. VowelTeamIntro.tsx** (4-6h)
- Location: `src/components/reading/vowelteams/VowelTeamIntro.tsx`
- Introduction screen for each vowel team
- Show the pattern (AI)
- Explain the sound (/ā/)
- Example word with image (rain + picture)
- Audio: "AI says /ā/ as in rain"
- "Ready to practice?" button

**2. VowelTeamWordBuilder.tsx** (6-8h)
- Word family practice
- Show word family: -ain
- Build: rain, main, pain, train, chain
- Highlight the AI pattern in each word
- Audio support for each word
- Visual: pictures for each word
- Tap to hear, then move to next

**3. VowelTeamSorting.tsx** (4-6h)
- Mixed word sorting activity
- Present words: cat, rain, dog, train, sat, mail
- "Does this word have the AI pattern?"
- Drag to "AI Words" or "Other Words" buckets
- Reinforces pattern recognition
- Immediate feedback

**4. Update ReadingPractice.tsx** (2-3h)
- Extend to support vowelPattern metadata
- Highlight vowel teams in text (different color)
- No other changes needed (existing component works)

**5. DecodableReaderView.tsx** (6-8h)
- New component for longer passages
- Display full text with proper formatting
- Highlight target vowel team words
- Audio support (read aloud)
- Optional comprehension questions at end
- Star reward

#### Example Component (VowelTeamIntro.tsx):

```typescript
import { useState } from 'react';

interface VowelTeamIntroProps {
  vowelPattern: string; // "ai"
  soundDescription: string; // "says /ā/ as in rain"
  exampleWord: string; // "rain"
  exampleImage: string; // "/images/rain.png"
  onComplete: () => void;
}

export function VowelTeamIntro({
  vowelPattern,
  soundDescription,
  exampleWord,
  exampleImage,
  onComplete
}: VowelTeamIntroProps) {
  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(
      `${vowelPattern.toUpperCase()} ${soundDescription}`
    );
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-3xl text-center">
        <h1 className="text-5xl font-bold text-purple-600 mb-4">
          Meet the {vowelPattern.toUpperCase()} Team!
        </h1>

        <div className="mb-8">
          <p className="text-7xl font-bold text-blue-900 mb-4">
            {vowelPattern.toUpperCase()}
          </p>
          <p className="text-3xl text-gray-700">
            {soundDescription}
          </p>
        </div>

        {/* Example Word */}
        <div className="mb-8">
          <img
            src={exampleImage}
            alt={exampleWord}
            className="w-64 h-64 mx-auto rounded-2xl shadow-lg mb-4 object-cover"
          />
          <p className="text-6xl font-bold text-blue-900">
            {exampleWord}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 justify-center">
          <button
            onClick={playSound}
            className="px-8 py-4 bg-purple-100 text-purple-700 text-2xl rounded-2xl hover:bg-purple-200 transition-colors font-semibold"
          >
            🔊 Listen
          </button>
          <button
            onClick={onComplete}
            className="px-12 py-4 bg-blue-500 text-white text-2xl rounded-2xl hover:bg-blue-600 transition-colors shadow-lg font-semibold"
          >
            Start Practice! →
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Content Requirements:

For each vowel team unit, create:
- 1 introduction activity (VowelTeamIntro)
- 1 word-building activity with 8-10 words
- 1 sorting activity (vowel team vs other patterns)
- 5-7 progressive sentence reading activities
- 1 decodable reader passage (optional but recommended)

**Total**: ~8 vowel team units × 10-15 activities = 80-120 activities

### Testing Requirements:

1. **Audio Quality**: Test speech synthesis for all vowel patterns
2. **Visual Clarity**: Ensure vowel teams are highlighted clearly
3. **Progressive Difficulty**: Activities increase in complexity appropriately
4. **Accessibility**: Works with dyslexia font, high contrast
5. **Navigation**: Smooth flow between activities
6. **Database**: All phrases save and load correctly
7. **Existing Compatibility**: Doesn't break existing CVC word reading

---

## Module 2B: R-Controlled Vowels

### Objectives:
1. Recognize that R "controls" the vowel sound
2. Decode AR words (car, star, park)
3. Decode OR words (for, corn, horn)
4. Decode ER, IR, UR words (her, bird, turn)
5. Recognize that ER, IR, UR often sound the same

### R-Controlled Patterns to Implement:

1. **AR** (car, jar, far, star, park, farm, barn, yard) - 10-12 words
2. **OR** (for, or, fork, corn, horn, storm, short) - 8-10 words
3. **ER** (her, fern, herd, term, verb, teacher) - 8-10 words
4. **IR** (bird, girl, first, dirt, shirt, stir) - 8-10 words
5. **UR** (fur, turn, hurt, burn, purse, nurse, turtle) - 8-10 words

### Technical Implementation:

#### Database Schema:

```typescript
// Same Phrase type, add rPattern metadata
interface RControlledPhrase extends Phrase {
  id: string;
  unitId: string;
  lines: string[];

  // R-controlled specific
  rPattern: 'ar' | 'or' | 'er' | 'ir' | 'ur';
  targetWords: string[];

  // Optional
  hasMixedPatterns?: boolean; // Contains multiple r-controlled patterns
}
```

#### Seed Data Example:

```typescript
// Unit: AR - Bossy R with A
const rControlledArUnitId = 'r-controlled-ar-001';
const rControlledArUnit: Unit = {
  id: rControlledArUnitId,
  title: 'Bossy R: AR Words (car, star)',
  tags: ['reading', 'r-controlled', 'ar', 'bossy-r'],
  goalStars: [5, 10, 15],
  createdAt: new Date()
};
await db.units.add(rControlledArUnit);

const rControlledArPhrases: RControlledPhrase[] = [
  // Single words
  { id: `${rControlledArUnitId}-1`, unitId: rControlledArUnitId, lines: ['car'], rPattern: 'ar', targetWords: ['car'] },
  { id: `${rControlledArUnitId}-2`, unitId: rControlledArUnitId, lines: ['jar'], rPattern: 'ar', targetWords: ['jar'] },
  { id: `${rControlledArUnitId}-3`, unitId: rControlledArUnitId, lines: ['far'], rPattern: 'ar', targetWords: ['far'] },
  { id: `${rControlledArUnitId}-4`, unitId: rControlledArUnitId, lines: ['star'], rPattern: 'ar', targetWords: ['star'] },
  { id: `${rControlledArUnitId}-5`, unitId: rControlledArUnitId, lines: ['park'], rPattern: 'ar', targetWords: ['park'] },
  { id: `${rControlledArUnitId}-6`, unitId: rControlledArUnitId, lines: ['farm'], rPattern: 'ar', targetWords: ['farm'] },

  // Progressive sentences
  {
    id: `${rControlledArUnitId}-7`,
    unitId: rControlledArUnitId,
    lines: ['The car', 'The car is', 'The car is far'],
    rPattern: 'ar',
    targetWords: ['car', 'far'],
    hasSightWords: true
  },
  {
    id: `${rControlledArUnitId}-8`,
    unitId: rControlledArUnitId,
    lines: ['I see', 'I see a', 'I see a star', 'I see a star at the farm'],
    rPattern: 'ar',
    targetWords: ['star', 'farm'],
    hasSightWords: true
  },
  {
    id: `${rControlledArUnitId}-9`,
    unitId: rControlledArUnitId,
    lines: ['The jar', 'The jar is', 'The jar is in', 'The jar is in the car'],
    rPattern: 'ar',
    targetWords: ['jar', 'car'],
    hasSightWords: true
  },
  {
    id: `${rControlledArUnitId}-10`,
    unitId: rControlledArUnitId,
    lines: ['We go', 'We go to', 'We go to the park', 'We go to the park in the car'],
    rPattern: 'ar',
    targetWords: ['park', 'car'],
    hasSightWords: true
  },
];
await db.phrases.bulkAdd(rControlledArPhrases);

// Repeat for OR, ER, IR, UR
```

#### New Components to Create:

**1. RControlledIntro.tsx** (4-5h)
- Introduction to "Bossy R"
- R changes the vowel sound
- Show comparison: "cat" vs "car"
- Audio examples
- Pattern explanation

**2. RControlledWordBuilder.tsx** (5-6h)
- Similar to VowelTeamWordBuilder
- Word family practice
- -ar words: car, far, jar, star, tar
- -ark words: park, bark, dark, shark
- Highlight AR pattern
- Audio support

**3. RControlledSorting.tsx** (4-5h)
- Sort words: AR vs regular A
- "Does this have Bossy R?"
- Visual feedback
- Reinforces concept

**4. Update ReadingPractice.tsx** (1-2h)
- Support rPattern metadata
- Highlight r-controlled vowels in text
- Otherwise same flow

### Content Requirements:

For each r-controlled pattern (AR, OR, ER/IR/UR):
- 1 introduction activity
- 1 word-building activity with 8-10 words
- 1 sorting activity
- 5-7 progressive sentence reading activities
- 1 decodable reader (optional)

**Total**: ~5 r-controlled units × 10-15 activities = 50-75 activities

### Special Note on ER/IR/UR:

These three patterns make the **same sound** (/er/). This can be confusing. Create a special unit that teaches:
- "ER, IR, and UR all sound like 'her'"
- Practice reading all three
- **Don't** focus on spelling rules (too complex at this stage)
- Focus on **recognizing and reading** the patterns

### Testing Requirements:

1. **"Bossy R" Concept**: Ensure students understand R changes the vowel
2. **Audio Clarity**: Proper pronunciation of r-controlled vowels
3. **Visual Distinction**: Clear highlighting of AR, OR, ER, IR, UR
4. **ER/IR/UR Equivalence**: Students recognize these sound the same
5. **Progressive Difficulty**: Sentences use increasingly complex AR words
6. **Database**: All r-controlled phrases stored correctly

### Deliverables:

- ✅ 8 vowel team units (ai, ay, ea, ee, oa, ow, igh, ie)
- ✅ 5 r-controlled units (ar, or, er, ir, ur)
- ✅ 3-4 new components for vowel teams
- ✅ 3-4 new components for r-controlled vowels
- ✅ ~130-200 reading activities total
- ✅ Database schema updates
- ✅ Seed data
- ✅ Optional: 8-13 decodable readers
- ✅ Tests and documentation

---

# 📚 AGENT 3: READING SYLLABLES SPECIALIST

**Assigned Modules**: Multi-Syllabic Words
**Estimated Effort**: 20-25 hours
**Timeline**: 3-4 weeks
**Priority**: MEDIUM-HIGH (Reading complexity)

---

## Module 3: Multi-Syllabic Words

### Objectives:
1. Identify syllables in spoken words (clapping)
2. Divide words into syllables visually
3. Decode compound words
4. Decode two-syllable words
5. Read three-syllable words (stretch goal)

### Syllable Types (Simplified):

**1. Compound Words** (Easiest)
- Two words joined: sun + shine = sunshine
- rain + bow = rainbow
- dog + house = doghouse
- cup + cake = cupcake

**2. Closed Syllables (CVC-CVC)**
- Both syllables end with consonants
- Vowels are short
- Examples: nap-kin, rab-bit, bas-ket, kit-ten

**3. Open Syllables (CV-CV)**
- Syllable ends with a vowel
- Vowel is long
- Examples: ro-bot, ba-by, ti-ger, mu-sic

**4. Mixed Syllable Types**
- Combine closed and open
- Examples: ta-ble (open-cle), ti-ger (open-closed)

### Technical Implementation:

#### Database Schema:

```typescript
// Add to src/types.ts
interface MultisyllabicWord {
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

interface SyllableProblem {
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
```

#### Add Tables to Database:

```typescript
// In src/db.ts
export class LearningAppDatabase extends Dexie {
  // ... existing tables
  multisyllabicWords!: Table<MultisyllabicWord, string>;
  syllableProblems!: Table<SyllableProblem, string>;

  constructor() {
    super('LearningAppDB');

    // Version 5: Add syllable tables
    this.version(5).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      fractionProblems: 'id, unitId, type, denominator',
      scienceProblems: 'id, unitId, type, machineType',
      multisyllabicWords: 'id, unitId, syllableCount, isCompound',
      syllableProblems: 'id, unitId, type',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id',
      logs: '++id, timestamp, level, category'
    });
  }
}
```

#### Seed Data Example:

```typescript
// Unit 1: Introduction to Syllables (Counting Only)
const syllableIntroUnitId = 'syllable-intro-001';
const syllableIntroUnit: Unit = {
  id: syllableIntroUnitId,
  title: 'What is a Syllable?',
  tags: ['reading', 'syllables', 'phonological-awareness'],
  goalStars: [5, 10],
  createdAt: new Date()
};
await db.units.add(syllableIntroUnit);

const syllableIntroProblems: SyllableProblem[] = [
  // Syllable counting (no reading yet)
  { id: `${syllableIntroUnitId}-1`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'cat', correctSyllableCount: 1, options: [1, 2, 3], answer: 1 },
  { id: `${syllableIntroUnitId}-2`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'robot', correctSyllableCount: 2, options: [1, 2, 3], answer: 2 },
  { id: `${syllableIntroUnitId}-3`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'banana', correctSyllableCount: 3, options: [1, 2, 3], answer: 3 },
  { id: `${syllableIntroUnitId}-4`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'tiger', correctSyllableCount: 2, options: [1, 2, 3], answer: 2 },
  { id: `${syllableIntroUnitId}-5`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'dog', correctSyllableCount: 1, options: [1, 2, 3], answer: 1 },
  { id: `${syllableIntroUnitId}-6`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'elephant', correctSyllableCount: 3, options: [1, 2, 3], answer: 3 },
  { id: `${syllableIntroUnitId}-7`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'happy', correctSyllableCount: 2, options: [1, 2, 3], answer: 2 },
  { id: `${syllableIntroUnitId}-8`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'sun', correctSyllableCount: 1, options: [1, 2, 3], answer: 1 },
];
await db.syllableProblems.bulkAdd(syllableIntroProblems);

// Unit 2: Compound Words
const compoundWordsUnitId = 'compound-words-001';
const compoundWordsUnit: Unit = {
  id: compoundWordsUnitId,
  title: 'Compound Words',
  tags: ['reading', 'compound-words', 'multisyllabic'],
  goalStars: [5, 10, 15],
  createdAt: new Date()
};
await db.units.add(compoundWordsUnit);

const compoundWords: MultisyllabicWord[] = [
  {
    id: `${compoundWordsUnitId}-word-1`,
    unitId: compoundWordsUnitId,
    word: 'sunshine',
    syllables: ['sun', 'shine'],
    syllableCount: 2,
    syllableTypes: ['compound', 'compound'],
    isCompound: true,
    compoundParts: ['sun', 'shine'],
    compoundImages: ['/images/sun.png', '/images/shine.png'],
    imageUrl: '/images/sunshine.png'
  },
  {
    id: `${compoundWordsUnitId}-word-2`,
    unitId: compoundWordsUnitId,
    word: 'rainbow',
    syllables: ['rain', 'bow'],
    syllableCount: 2,
    syllableTypes: ['compound', 'compound'],
    isCompound: true,
    compoundParts: ['rain', 'bow'],
    compoundImages: ['/images/rain.png', '/images/bow.png'],
    imageUrl: '/images/rainbow.png'
  },
  // Add: baseball, cupcake, doghouse, sunflower, football, butterfly, bedroom, bathroom
];
await db.multisyllabicWords.bulkAdd(compoundWords);

const compoundProblems: SyllableProblem[] = [
  // Compound word building activities
  {
    id: `${compoundWordsUnitId}-prob-1`,
    unitId: compoundWordsUnitId,
    type: 'compound-building',
    prompt: 'Put the words together!',
    compoundParts: ['sun', 'shine'],
    compoundImages: ['/images/sun.png', '/images/shine.png'],
    compoundResult: 'sunshine',
    answer: 'sunshine'
  },
  // More compound building...

  // Compound word reading activities
  {
    id: `${compoundWordsUnitId}-read-1`,
    unitId: compoundWordsUnitId,
    type: 'multisyllabic-reading',
    prompt: 'Read this word:',
    multisyllabicWord: compoundWords[0], // sunshine
    answer: 'sunshine'
  },
];
await db.syllableProblems.bulkAdd(compoundProblems);

// Unit 3: Two-Syllable Closed Words (CVC-CVC)
const twoSyllableClosedUnitId = 'two-syllable-closed-001';
const twoSyllableClosedUnit: Unit = {
  id: twoSyllableClosedUnitId,
  title: 'Two-Syllable Words (napkin, rabbit)',
  tags: ['reading', 'two-syllable', 'closed-syllables'],
  goalStars: [5, 10, 15],
  createdAt: new Date()
};
await db.units.add(twoSyllableClosedUnit);

const twoSyllableWords: MultisyllabicWord[] = [
  {
    id: `${twoSyllableClosedUnitId}-word-1`,
    unitId: twoSyllableClosedUnitId,
    word: 'napkin',
    syllables: ['nap', 'kin'],
    syllableCount: 2,
    syllableTypes: ['closed', 'closed'],
    isCompound: false,
    imageUrl: '/images/napkin.png'
  },
  {
    id: `${twoSyllableClosedUnitId}-word-2`,
    unitId: twoSyllableClosedUnitId,
    word: 'rabbit',
    syllables: ['rab', 'bit'],
    syllableCount: 2,
    syllableTypes: ['closed', 'closed'],
    isCompound: false,
    imageUrl: '/images/rabbit.png'
  },
  // Add: basket, kitten, mitten, pumpkin, picnic, magnet, cactus, insect
];
await db.multisyllabicWords.bulkAdd(twoSyllableWords);

// Similar for open syllables (robot, baby, tiger) and mixed types
```

#### New Components to Create:

**1. SyllableCounter.tsx** (6-8h)
- Location: `src/components/reading/multisyllabic/SyllableCounter.tsx`
- Audio plays word ("robot")
- Visual: animated bouncing balls for each syllable
- Prompt: "How many syllables?"
- Multiple choice: 1, 2, 3
- Clapping animation on answer

**2. CompoundWordBuilder.tsx** (8-10h)
- Show two images (sun, shine)
- Show two words below images
- Drag words together to make compound
- Animation: words merge
- Result image appears (sunshine)
- Audio reads compound word
- Very rewarding, visual

**3. SyllableDivider.tsx** (6-8h)
- Show word: "napkin"
- "Where should we divide it?"
- Tap between letters
- Show divided word: "nap-kin"
- Audio reads each syllable
- Then blend together

**4. MultisyllabicReader.tsx** (8-10h)
- Main reading component for multisyllabic words
- Show word divided: "nap-kin"
- Highlight first syllable: "nap"
- Audio reads "nap"
- Highlight second syllable: "kin"
- Audio reads "kin"
- Blend: "napkin"
- Show image
- Star reward

**5. SyllablePractice.tsx** (6-8h)
- Orchestrating component (like MathPractice/ReadingPractice)
- Routes to appropriate syllable activities
- Tracks progress
- Awards stars

#### Example Component (CompoundWordBuilder.tsx):

```typescript
import { useState } from 'react';
import { SyllableProblem } from '../../types';

interface CompoundWordBuilderProps {
  problem: SyllableProblem;
  onComplete: () => void;
  audioEnabled: boolean;
}

export function CompoundWordBuilder({ problem, onComplete, audioEnabled }: CompoundWordBuilderProps) {
  const [stage, setStage] = useState<'show-parts' | 'merged' | 'complete'>('show-parts');

  const handleMerge = () => {
    setStage('merged');

    if (audioEnabled) {
      // Animate and play sound
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(problem.compoundResult);
        utterance.rate = 0.7;
        window.speechSynthesis.speak(utterance);
      }, 500);
    }

    setTimeout(() => {
      setStage('complete');
    }, 2000);
  };

  const handleContinue = () => {
    onComplete();
  };

  if (stage === 'show-parts') {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Put the words together!
        </h2>

        <div className="flex justify-center gap-8 mb-12">
          {/* Part 1 */}
          <div className="text-center">
            <img
              src={problem.compoundImages?.[0]}
              alt={problem.compoundParts?.[0]}
              className="w-48 h-48 rounded-2xl shadow-lg mb-4 object-cover"
            />
            <p className="text-4xl font-bold text-blue-900">
              {problem.compoundParts?.[0]}
            </p>
          </div>

          {/* Plus Sign */}
          <div className="flex items-center text-6xl text-gray-400">
            +
          </div>

          {/* Part 2 */}
          <div className="text-center">
            <img
              src={problem.compoundImages?.[1]}
              alt={problem.compoundParts?.[1]}
              className="w-48 h-48 rounded-2xl shadow-lg mb-4 object-cover"
            />
            <p className="text-4xl font-bold text-blue-900">
              {problem.compoundParts?.[1]}
            </p>
          </div>
        </div>

        <button
          onClick={handleMerge}
          className="px-12 py-6 bg-green-500 text-white text-2xl rounded-2xl hover:bg-green-600 transition-colors shadow-lg font-semibold mx-auto block"
        >
          Make the Word! →
        </button>
      </div>
    );
  }

  if (stage === 'merged' || stage === 'complete') {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          You made a new word!
        </h2>

        {/* Compound Result */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-purple-600 mb-4 animate-bounce">
            {problem.compoundResult}
          </div>
          <p className="text-2xl text-gray-600">
            {problem.compoundParts?.[0]} + {problem.compoundParts?.[1]} = {problem.compoundResult}
          </p>
        </div>

        {stage === 'complete' && (
          <>
            <div className="text-center mb-8">
              <p className="text-5xl">🎉</p>
              <p className="text-3xl font-bold text-green-600">Great job!</p>
            </div>
            <button
              onClick={handleContinue}
              className="px-12 py-6 bg-blue-500 text-white text-2xl rounded-2xl hover:bg-blue-600 transition-colors shadow-lg font-semibold mx-auto block"
            >
              Next Word →
            </button>
          </>
        )}
      </div>
    );
  }

  return null;
}
```

### Content Requirements:

**Unit 1: Syllable Awareness** (10 activities)
- Count syllables in spoken words
- 1, 2, or 3 syllables
- Audio-based, no reading yet

**Unit 2: Compound Words** (12-15 activities)
- 8-10 compound word building activities
- 8-10 compound word reading activities
- sunshine, rainbow, baseball, cupcake, doghouse, butterfly, bedroom, football

**Unit 3: Two-Syllable Closed** (12-15 activities)
- napkin, rabbit, basket, kitten, mitten, pumpkin, picnic, magnet
- Division practice
- Reading practice

**Unit 4: Two-Syllable Open** (12-15 activities)
- robot, baby, tiger, music, paper, lazy, final, tulip
- Division practice
- Reading practice

**Unit 5: Mixed Two-Syllable** (10-12 activities)
- Combine closed and open
- table, able, apple, purple, turtle, little
- Reading practice with variety

**Total**: ~55-70 syllable activities

### Testing Requirements:

1. **Audio Sync**: Syllable sounds match visual highlights
2. **Animation Quality**: Smooth, not distracting
3. **Touch Targets**: Large enough for fine motor challenges
4. **Progress**: Clear indication of where in word (syllable 1 of 2)
5. **Celebration**: Rewarding feedback for success
6. **Database**: All multisyllabic words and problems stored correctly

### Deliverables:

- ✅ 5 syllable/multisyllabic units
- ✅ 4-5 new components
- ✅ ~55-70 activities
- ✅ Database schema updates (2 new tables)
- ✅ Seed data for 30-40 multisyllabic words
- ✅ Tests and documentation

---

# ✖️➗ AGENT 4: MULTIPLICATION & DIVISION SPECIALIST

**Assigned Module**: Basic Multiplication & Division
**Estimated Effort**: 40-50 hours
**Timeline**: 5-7 weeks
**Priority**: HIGH (Math foundation)

---

## Module 4: Basic Multiplication & Division

### Objectives:
1. Understand multiplication as repeated addition and equal groups
2. Skip count by 2s, 5s, 10s
3. Know multiplication facts for 0s, 1s, 2s, 5s, 10s
4. Understand division as sharing equally and grouping
5. Know division facts related to 2s, 5s, 10s
6. Recognize fact families (3×4=12, 12÷4=3)

### Progression:

**Phase 1: Conceptual Foundation** (10-12h)
- What is multiplication?
- Arrays (rows × columns)
- Equal groups (3 groups of 4)
- Skip counting patterns
- Repeated addition

**Phase 2: Easier Multiplication Facts** (15-18h)
- 0s (anything × 0 = 0)
- 1s (anything × 1 = itself)
- 2s (doubling, skip count by 2)
- 5s (clock pattern, skip count by 5)
- 10s (add a zero)

**Phase 3: Division Introduction** (15-20h)
- Division as sharing
- Division as grouping
- Relationship to multiplication
- Division facts for 2s, 5s, 10s

### Technical Implementation:

#### Database Schema:

```typescript
// Add to src/types.ts
interface MultiplicationProblem {
  id: string;
  unitId: string;
  type: 'skip-count' | 'equal-groups' | 'array' | 'multiplication-fact' | 'multiplication-word-problem';
  prompt: string;
  answer: number;
  options?: number[];

  // Multiplication data
  multiplicand: number; // 3 in 3×4
  multiplier: number;   // 4 in 3×4
  product: number;      // 12 in 3×4

  // Visual strategy
  visualStrategy: 'groups' | 'array' | 'number-line' | 'repeated-addition' | 'none';

  // For skip counting
  skipCountBy?: number; // 2, 5, or 10
  sequence?: number[];  // [2, 4, 6, ?, 10]
  missingIndex?: number; // Index of missing number

  // For word problems
  context?: string; // Full text
  scenario?: 'bags-of-items' | 'plates-of-food' | 'rows-of-objects' | 'groups-of-animals';

  // Visual data for equal groups
  groupCount?: number; // Number of groups
  itemsPerGroup?: number; // Items in each group
  itemImage?: string; // What item to show (cookie, apple, etc.)

  createdAt?: Date;
}

interface DivisionProblem {
  id: string;
  unitId: string;
  type: 'sharing' | 'grouping' | 'division-fact' | 'division-word-problem';
  prompt: string;
  answer: number;
  options?: number[];

  // Division data
  dividend: number;  // 12 in 12÷4
  divisor: number;   // 4 in 12÷4
  quotient: number;  // 3 in 12÷4

  // Division model
  divisionModel: 'sharing' | 'grouping' | 'repeated-subtraction';

  // Related multiplication
  relatedMultiplication?: {
    multiplicand: number;
    multiplier: number;
  };

  // For sharing activities
  totalItems?: number;
  numberOfGroups?: number;
  itemImage?: string;

  // For grouping activities
  itemsPerGroup?: number;

  // For word problems
  context?: string;
  scenario?: 'sharing-cookies' | 'making-teams' | 'dividing-objects';

  createdAt?: Date;
}
```

#### Add Tables to Database:

```typescript
// In src/db.ts
export class LearningAppDatabase extends Dexie {
  // ... existing tables
  multiplicationProblems!: Table<MultiplicationProblem, string>;
  divisionProblems!: Table<DivisionProblem, string>;

  constructor() {
    super('LearningAppDB');

    // Version 6: Add multiplication/division tables
    this.version(6).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      fractionProblems: 'id, unitId, type, denominator',
      scienceProblems: 'id, unitId, type, machineType',
      multisyllabicWords: 'id, unitId, syllableCount, isCompound',
      syllableProblems: 'id, unitId, type',
      multiplicationProblems: 'id, unitId, type, multiplier',
      divisionProblems: 'id, unitId, type, divisor',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id',
      logs: '++id, timestamp, level, category'
    });
  }
}
```

#### Seed Data Example:

```typescript
// Unit 1: Introduction to Multiplication
const multIntroUnitId = 'multiplication-intro-001';
const multIntroUnit: Unit = {
  id: multIntroUnitId,
  title: 'What is Multiplication?',
  tags: ['math', 'multiplication', 'introduction'],
  goalStars: [5, 10],
  createdAt: new Date()
};
await db.units.add(multIntroUnit);

const multIntroProblems: MultiplicationProblem[] = [
  // Equal groups conceptual
  {
    id: `${multIntroUnitId}-eq-1`,
    unitId: multIntroUnitId,
    type: 'equal-groups',
    prompt: 'How many cookies in all?',
    multiplicand: 3,
    multiplier: 2,
    product: 6,
    answer: 6,
    options: [5, 6, 7, 8],
    visualStrategy: 'groups',
    groupCount: 3,
    itemsPerGroup: 2,
    itemImage: 'cookie',
    context: 'There are 3 plates. Each plate has 2 cookies. How many cookies in all?'
  },
  {
    id: `${multIntroUnitId}-eq-2`,
    unitId: multIntroUnitId,
    type: 'equal-groups',
    prompt: 'How many apples in all?',
    multiplicand: 2,
    multiplier: 4,
    product: 8,
    answer: 8,
    options: [6, 7, 8, 9],
    visualStrategy: 'groups',
    groupCount: 2,
    itemsPerGroup: 4,
    itemImage: 'apple'
  },

  // Array problems
  {
    id: `${multIntroUnitId}-arr-1`,
    unitId: multIntroUnitId,
    type: 'array',
    prompt: 'How many dots in this array?',
    multiplicand: 3,
    multiplier: 4,
    product: 12,
    answer: 12,
    options: [10, 11, 12, 13],
    visualStrategy: 'array'
  },
  // More array problems...

  // Repeated addition
  {
    id: `${multIntroUnitId}-ra-1`,
    unitId: multIntroUnitId,
    type: 'equal-groups',
    prompt: '2 + 2 + 2 = ?',
    multiplicand: 2,
    multiplier: 3,
    product: 6,
    answer: 6,
    options: [4, 5, 6, 7],
    visualStrategy: 'repeated-addition'
  },
];
await db.multiplicationProblems.bulkAdd(multIntroProblems);

// Unit 2: Skip Counting by 2s
const skipCount2UnitId = 'skip-count-2s-001';
const skipCount2Unit: Unit = {
  id: skipCount2UnitId,
  title: 'Skip Counting by 2s',
  tags: ['math', 'skip-counting', '2s'],
  goalStars: [5, 10],
  createdAt: new Date()
};
await db.units.add(skipCount2Unit);

const skipCount2Problems: MultiplicationProblem[] = [
  {
    id: `${skipCount2UnitId}-sc-1`,
    unitId: skipCount2UnitId,
    type: 'skip-count',
    prompt: 'What comes next? 2, 4, 6, __',
    skipCountBy: 2,
    sequence: [2, 4, 6, null, 10],
    missingIndex: 3,
    answer: 8,
    options: [7, 8, 9, 10],
    multiplicand: 2,
    multiplier: 4,
    product: 8,
    visualStrategy: 'number-line'
  },
  {
    id: `${skipCount2UnitId}-sc-2`,
    unitId: skipCount2UnitId,
    type: 'skip-count',
    prompt: 'Fill in the blank: 2, __, 6, 8',
    skipCountBy: 2,
    sequence: [2, null, 6, 8],
    missingIndex: 1,
    answer: 4,
    options: [3, 4, 5, 6],
    multiplicand: 2,
    multiplier: 2,
    product: 4,
    visualStrategy: 'number-line'
  },
  // More skip counting...
];
await db.multiplicationProblems.bulkAdd(skipCount2Problems);

// Unit 3: Multiply by 2s (Facts)
const multiply2UnitId = 'multiply-2s-001';
const multiply2Unit: Unit = {
  id: multiply2UnitId,
  title: 'Multiply by 2s',
  tags: ['math', 'multiplication', '2s', 'facts'],
  goalStars: [5, 10, 15],
  createdAt: new Date()
};
await db.units.add(multiply2Unit);

const multiply2Problems: MultiplicationProblem[] = [
  // 2×0 through 2×10
  { id: `${multiply2UnitId}-fact-0`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 0 = ?', multiplicand: 2, multiplier: 0, product: 0, answer: 0, options: [0, 1, 2, 3], visualStrategy: 'none' },
  { id: `${multiply2UnitId}-fact-1`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 1 = ?', multiplicand: 2, multiplier: 1, product: 2, answer: 2, options: [1, 2, 3, 4], visualStrategy: 'none' },
  { id: `${multiply2UnitId}-fact-2`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 2 = ?', multiplicand: 2, multiplier: 2, product: 4, answer: 4, options: [2, 3, 4, 5], visualStrategy: 'groups' },
  { id: `${multiply2UnitId}-fact-3`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 3 = ?', multiplicand: 2, multiplier: 3, product: 6, answer: 6, options: [4, 5, 6, 7], visualStrategy: 'groups' },
  { id: `${multiply2UnitId}-fact-4`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 4 = ?', multiplicand: 2, multiplier: 4, product: 8, answer: 8, options: [6, 7, 8, 9], visualStrategy: 'groups' },
  { id: `${multiply2UnitId}-fact-5`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 5 = ?', multiplicand: 2, multiplier: 5, product: 10, answer: 10, options: [8, 9, 10, 11], visualStrategy: 'groups' },
  { id: `${multiply2UnitId}-fact-6`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 6 = ?', multiplicand: 2, multiplier: 6, product: 12, answer: 12, options: [10, 11, 12, 13], visualStrategy: 'groups' },
  { id: `${multiply2UnitId}-fact-7`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 7 = ?', multiplicand: 2, multiplier: 7, product: 14, answer: 14, options: [12, 13, 14, 15], visualStrategy: 'groups' },
  { id: `${multiply2UnitId}-fact-8`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 8 = ?', multiplicand: 2, multiplier: 8, product: 16, answer: 16, options: [14, 15, 16, 17], visualStrategy: 'groups' },
  { id: `${multiply2UnitId}-fact-9`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 9 = ?', multiplicand: 2, multiplier: 9, product: 18, answer: 18, options: [16, 17, 18, 19], visualStrategy: 'groups' },
  { id: `${multiply2UnitId}-fact-10`, unitId: multiply2UnitId, type: 'multiplication-fact', prompt: '2 × 10 = ?', multiplicand: 2, multiplier: 10, product: 20, answer: 20, options: [18, 19, 20, 21], visualStrategy: 'groups' },

  // Word problems
  {
    id: `${multiply2UnitId}-word-1`,
    unitId: multiply2UnitId,
    type: 'multiplication-word-problem',
    prompt: 'Sara has 5 bags. Each bag has 2 apples. How many apples does she have?',
    multiplicand: 2,
    multiplier: 5,
    product: 10,
    answer: 10,
    options: [8, 9, 10, 11],
    visualStrategy: 'groups',
    context: 'Sara has 5 bags. Each bag has 2 apples. How many apples does she have?',
    scenario: 'bags-of-items'
  },
];
await db.multiplicationProblems.bulkAdd(multiply2Problems);

// Similar for 5s and 10s, then 0s and 1s

// Division Units
const divisionIntroUnitId = 'division-intro-001';
const divisionIntroUnit: Unit = {
  id: divisionIntroUnitId,
  title: 'Introduction to Division',
  tags: ['math', 'division', 'sharing'],
  goalStars: [5, 10],
  createdAt: new Date()
};
await db.units.add(divisionIntroUnit);

const divisionIntroProblems: DivisionProblem[] = [
  // Sharing problems
  {
    id: `${divisionIntroUnitId}-share-1`,
    unitId: divisionIntroUnitId,
    type: 'sharing',
    prompt: '12 cookies, 4 friends. How many cookies for each friend?',
    dividend: 12,
    divisor: 4,
    quotient: 3,
    answer: 3,
    options: [2, 3, 4, 5],
    divisionModel: 'sharing',
    totalItems: 12,
    numberOfGroups: 4,
    itemImage: 'cookie',
    context: 'You have 12 cookies to share equally among 4 friends. How many cookies does each friend get?'
  },
  {
    id: `${divisionIntroUnitId}-share-2`,
    unitId: divisionIntroUnitId,
    type: 'sharing',
    prompt: '10 apples, 2 baskets. How many apples in each basket?',
    dividend: 10,
    divisor: 2,
    quotient: 5,
    answer: 5,
    options: [4, 5, 6, 7],
    divisionModel: 'sharing',
    totalItems: 10,
    numberOfGroups: 2,
    itemImage: 'apple'
  },

  // Grouping problems
  {
    id: `${divisionIntroUnitId}-group-1`,
    unitId: divisionIntroUnitId,
    type: 'grouping',
    prompt: '12 cookies. Make groups of 3. How many groups?',
    dividend: 12,
    divisor: 3,
    quotient: 4,
    answer: 4,
    options: [3, 4, 5, 6],
    divisionModel: 'grouping',
    totalItems: 12,
    itemsPerGroup: 3,
    itemImage: 'cookie',
    context: 'You have 12 cookies. You want to make groups of 3. How many groups can you make?'
  },
];
await db.divisionProblems.bulkAdd(divisionIntroProblems);

// Division facts for 2s, 5s, 10s with related multiplication
```

#### New Components to Create:

**1. SkipCountingPractice.tsx** (6-8h)
- Show number line or sequence
- Highlight pattern (2, 4, 6, __)
- Fill in the blank
- Visual animation (hopping by 2s)
- Audio support

**2. EqualGroupsActivity.tsx** (8-10h)
- Show groups of items
- 3 plates, 4 cookies on each
- "How many cookies in all?"
- Interactive: tap/touch to count
- Transition to multiplication notation

**3. ArrayBuilder.tsx** (8-10h)
- Visual grid/array
- 3 rows × 4 columns
- Interactive: build your own array
- Connect to multiplication
- "3 rows of 4 = 12"

**4. MultiplicationFactPractice.tsx** (6-8h)
- Traditional flashcard format
- Multiple choice answers
- Optional visual supports (groups, arrays)
- Spaced repetition (harder facts repeat)
- Progress tracking

**5. MultiplicationWordProblem.tsx** (8-10h)
- Display word problem text
- Visual support (groups of items)
- Multiple choice answers
- Immediate feedback
- Celebration animation

**6. SharingActivity.tsx** (8-10h)
- Show items to share
- Show plates/groups
- Drag items to plates (equal distribution)
- "How many on each plate?"
- Connect to division notation

**7. GroupingActivity.tsx** (8-10h)
- Show total items
- "Make groups of __"
- Circle/drag items into groups
- "How many groups?"
- Connect to division

**8. DivisionFactPractice.tsx** (6-8h)
- Flashcard format for division facts
- Show related multiplication (fact family)
- Multiple choice
- Visual supports

**9. MultiplicationPractice.tsx** (8-10h)
- Main orchestrating component
- Routes to appropriate multiplication/division activities
- Tracks progress
- Awards stars
- Similar to MathPractice.tsx

#### Example Component (EqualGroupsActivity.tsx):

```typescript
import { useState } from 'react';
import { MultiplicationProblem } from '../../types';

interface EqualGroupsActivityProps {
  problem: MultiplicationProblem;
  onAnswer: (correct: boolean) => void;
  audioEnabled: boolean;
}

export function EqualGroupsActivity({ problem, onAnswer, audioEnabled }: EqualGroupsActivityProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [touchedItems, setTouchedItems] = useState<Set<string>>(new Set());

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    const correct = answer === problem.answer;
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };

  const handleItemTouch = (groupIndex: number, itemIndex: number) => {
    const key = `${groupIndex}-${itemIndex}`;
    setTouchedItems(prev => new Set([...prev, key]));
  };

  const renderGroups = () => {
    const groups = [];
    for (let g = 0; g < problem.groupCount!; g++) {
      const items = [];
      for (let i = 0; i < problem.itemsPerGroup!; i++) {
        const key = `${g}-${i}`;
        const isTouched = touchedItems.has(key);
        items.push(
          <button
            key={key}
            onClick={() => handleItemTouch(g, i)}
            className={`text-5xl transition-all transform ${
              isTouched ? 'scale-125 opacity-100' : 'scale-100 opacity-70'
            }`}
          >
            {problem.itemImage === 'cookie' ? '🍪' :
             problem.itemImage === 'apple' ? '🍎' :
             problem.itemImage === 'star' ? '⭐' : '🔵'}
          </button>
        );
      }
      groups.push(
        <div key={g} className="bg-blue-100 rounded-2xl p-6 shadow-md">
          <div className="flex flex-wrap gap-3 justify-center">
            {items}
          </div>
        </div>
      );
    }
    return groups;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-5xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        {problem.prompt}
      </h2>

      {problem.context && (
        <p className="text-xl text-gray-600 mb-8 text-center">
          {problem.context}
        </p>
      )}

      {/* Visual Groups */}
      <div className="grid grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        {renderGroups()}
      </div>

      {/* Helper Text */}
      <p className="text-center text-lg text-gray-600 mb-6">
        Tap to count: {touchedItems.size} / {problem.product}
      </p>

      {/* Answer Options */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {problem.options?.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={showFeedback}
            className={`p-6 text-4xl font-bold rounded-2xl transition-all transform hover:scale-105 ${
              showFeedback && option === problem.answer
                ? 'bg-green-500 text-white shadow-2xl'
                : showFeedback && option === selectedAnswer
                ? 'bg-red-400 text-white'
                : 'bg-white border-4 border-gray-300 text-gray-800 hover:border-blue-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-8 text-center">
          <p className="text-3xl font-bold text-green-600">
            {selectedAnswer === problem.answer ? '🎉 Excellent!' : '👍 Good try!'}
          </p>
          {selectedAnswer === problem.answer && (
            <p className="text-2xl text-gray-700 mt-2">
              {problem.groupCount} × {problem.itemsPerGroup} = {problem.product}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

### Content Requirements:

**Phase 1: Conceptual Understanding**
- Unit 1: Introduction to Multiplication (10-12 activities)
- Unit 2: Skip Counting by 2s (8-10 activities)
- Unit 3: Skip Counting by 5s (8-10 activities)
- Unit 4: Skip Counting by 10s (8-10 activities)

**Phase 2: Multiplication Facts**
- Unit 5: Multiply by 0s and 1s (10-12 activities)
- Unit 6: Multiply by 2s (15-18 activities) - facts 2×0 through 2×10 + word problems
- Unit 7: Multiply by 5s (15-18 activities) - facts 5×0 through 5×10 + word problems
- Unit 8: Multiply by 10s (12-15 activities) - facts 10×0 through 10×10 + word problems

**Phase 3: Division**
- Unit 9: Introduction to Division (10-12 activities)
- Unit 10: Division Facts - 2s (12-15 activities)
- Unit 11: Division Facts - 5s (12-15 activities)
- Unit 12: Division Facts - 10s (12-15 activities)
- Unit 13: Fact Families (10-12 activities) - connecting multiplication and division

**Total**: ~140-170 multiplication/division activities

### Testing Requirements:

1. **Visual Accuracy**: Arrays show correct rows × columns
2. **Interactive Elements**: Touch counting works smoothly
3. **Skip Counting Animation**: Number line hopping is clear
4. **Audio Support**: Reads problems aloud when enabled
5. **Fact Fluency**: Spaced repetition works correctly
6. **Division Models**: Sharing vs grouping is clear visually
7. **Fact Families**: Connection between mult/div is explicit
8. **Database**: All problems save and load correctly

### Deliverables:

- ✅ 13 multiplication/division units
- ✅ 9 new components
- ✅ ~140-170 activities
- ✅ Database schema updates (2 new tables)
- ✅ Seed data for all multiplication/division facts (0s, 1s, 2s, 5s, 10s)
- ✅ Tests and documentation

---

## 🤝 COORDINATION BETWEEN AGENTS

### Database Migrations:

Agents will be updating the database schema. **Coordinate schema versions**:
- Agent 1 (Math): Uses version 4 (adds fractionProblems table)
- Agent 2 (Reading Phonics): No new tables, uses existing phrases table
- Agent 3 (Reading Syllables): Uses version 5 (adds multisyllabicWords, syllableProblems tables)
- Agent 4 (Multiplication): Uses version 6 (adds multiplicationProblems, divisionProblems tables)

**Final Consolidated Schema** (All agents merge to this):

```typescript
// Version 7: Full GED-Track Schema
this.version(7).stores({
  units: 'id, createdAt',
  phrases: 'id, unitId',
  mathProblems: 'id, unitId, type',
  fractionProblems: 'id, unitId, type, denominator',
  scienceProblems: 'id, unitId, type, machineType',
  multisyllabicWords: 'id, unitId, syllableCount, isCompound',
  syllableProblems: 'id, unitId, type',
  multiplicationProblems: 'id, unitId, type, multiplier',
  divisionProblems: 'id, unitId, type, divisor',
  sessionLogs: 'id, unitId, date, createdAt',
  rewards: 'id, milestone',
  settings: 'id',
  logs: '++id, timestamp, level, category'
});
```

### Shared Components:

Some components may be reusable:
- Audio/TTS utilities (all agents)
- Feedback animations (all agents)
- Progress tracking (all agents)

**Recommendation**: Create a shared `src/components/shared/` folder for common UI elements.

### Git Workflow:

1. **Each agent works on their own feature branch**:
   - Agent 1: `feature/math-numbers-fractions`
   - Agent 2: `feature/reading-vowel-teams-r-controlled`
   - Agent 3: `feature/reading-multisyllabic`
   - Agent 4: `feature/math-multiplication-division`

2. **Merge order** (to avoid conflicts):
   - Agent 2 (no schema changes) → main
   - Agent 1 (version 4) → main
   - Agent 3 (version 5) → main
   - Agent 4 (version 6) → main
   - Final consolidation (version 7) → main

3. **Testing after each merge**: Ensure no breaking changes

### Component Routing:

Each agent adds routes to appropriate practice components:
- Agent 1: Extends `MathPractice.tsx`, creates `FractionPractice.tsx`
- Agent 2: Extends `ReadingPractice.tsx`
- Agent 3: Creates `SyllablePractice.tsx`
- Agent 4: Creates `MultiplicationPractice.tsx`

**Main App.tsx** will need to route to these new practice modes. Final integration task.

---

## 📋 FINAL INTEGRATION & TESTING

Once all agents complete their modules, a final integration phase is needed:

### Integration Tasks (4-6 hours):

1. **Merge all branches** following the order above
2. **Resolve any conflicts** in shared files
3. **Consolidate database schema** to final version 7
4. **Update navigation** in Home.tsx to show new units
5. **Test end-to-end** user flows
6. **Visual polish** (ensure consistent styling)
7. **Performance optimization** (lazy loading, code splitting)
8. **Final bug fixes**

### Testing Checklist:

- ✅ All units load correctly
- ✅ Activities progress smoothly
- ✅ Stars awarded correctly
- ✅ Database persists data
- ✅ Audio works in all activities
- ✅ Visual timers and progress indicators function
- ✅ Break prompts work
- ✅ Session summaries display
- ✅ No console errors
- ✅ Responsive on tablets
- ✅ Works with dyslexia font mode
- ✅ Works with audio on/off
- ✅ Navigation flows logically

---

## 🎯 SUCCESS CRITERIA

### Module Completion Checklist:

**Agent 1 - Math Foundation**:
- ✅ 2 units for numbers 40-60 (30+ problems)
- ✅ 5-6 fraction units (40-50 problems)
- ✅ All components built and tested
- ✅ Database working
- ✅ Documentation complete

**Agent 2 - Reading Phonics**:
- ✅ 8 vowel team units (80-100 activities)
- ✅ 5 r-controlled units (50-75 activities)
- ✅ All components built and tested
- ✅ Database working
- ✅ Documentation complete

**Agent 3 - Reading Syllables**:
- ✅ 5 syllable units (55-70 activities)
- ✅ All components built and tested
- ✅ Database working
- ✅ Documentation complete

**Agent 4 - Multiplication/Division**:
- ✅ 13 multiplication/division units (140-170 activities)
- ✅ All components built and tested
- ✅ Database working
- ✅ Documentation complete

### Overall Project Success:

- ✅ All 4 modules integrated smoothly
- ✅ No breaking changes to existing features (CVC reading, counting 20-39)
- ✅ Build succeeds with no errors
- ✅ Application runs on localhost
- ✅ All tests pass
- ✅ Student can access and use new content
- ✅ Progress toward GED readiness is measurable

---

## 📅 TIMELINE SUMMARY

**Parallel Development** (All agents work simultaneously):

**Weeks 1-2**:
- All agents: Setup, schema design, first components

**Weeks 3-4**:
- Agent 1: Numbers 40-60 complete, fractions in progress
- Agent 2: Vowel teams complete, r-controlled in progress
- Agent 3: Syllable awareness complete, compound words in progress
- Agent 4: Skip counting complete, multiplication facts in progress

**Weeks 5-6**:
- Agent 1: Fractions complete, testing
- Agent 2: R-controlled complete, testing
- Agent 3: Two-syllable words complete, testing
- Agent 4: Multiplication complete, division in progress

**Weeks 7-8**:
- Agent 4: Division complete, testing
- All agents: Documentation, bug fixes
- Integration: Merge branches, final testing

**Week 9** (optional buffer):
- Polish, performance optimization
- User testing with student
- Final adjustments

**Total Timeline**: 6-9 weeks for complete GED-track foundation

---

## 🚀 READY TO START?

Each agent should:

1. **Fork/branch** from main
2. **Read this full prompt** carefully
3. **Set up development environment** (npm install, npm run dev)
4. **Create database schema** for your module
5. **Build components** incrementally
6. **Test frequently** (don't wait until the end)
7. **Document your code** with clear comments
8. **Commit often** with descriptive messages
9. **Coordinate with other agents** on shared components
10. **Signal when complete** for integration

**Questions?** Refer back to this prompt. All technical specifications, examples, and requirements are documented here.

**Let's build a path to the GED! 🎓**
