# Agent Prompts for Parallel Development

## Context for All Agents

**Application:** IEP Learning App - Special needs education tool for a 3rd grader with autism and learning disabilities
**Tech Stack:** React 18.3 + TypeScript, Vite, Tailwind CSS, Dexie (IndexedDB), Zustand (state)
**Current Branch:** `claude/special-needs-education-01T9bKL1BjS6S3bpkcBG96Sd`

**Key Design Principles:**
- Kid-friendly UI (large buttons, bright colors, encouraging messages)
- Privacy-first (all data local, no external services)
- Evidence-based practices for autism and learning disabilities
- Positive-only feedback (no penalties or negative messages)
- Multi-sensory learning (visual, auditory, kinesthetic)

**Important Files:**
- `src/db.ts` - Dexie database schema
- `src/types.ts` - TypeScript interfaces
- `src/store.ts` - Zustand global state
- `src/components/` - React components
- `src/utils/logger.ts` - Logging system (just implemented)

---

## 🎯 TIER 1 PROMPT #1: Mastery Tracking & IEP Goal Progress

### Agent Mission
Implement a comprehensive skill mastery tracking and IEP goal progress monitoring system. This is **critical** for IEP meetings and data-driven instruction.

### Background
Parents and teachers need to track student progress toward IEP goals and identify when skills are mastered. Currently, the app tracks session data (see `SessionLog` in types.ts) but doesn't analyze it to detect mastery or link to IEP goals.

### Requirements

#### 1. Database Schema (Extend `src/db.ts`)
Add version 4 with two new tables:

```typescript
// Add to src/types.ts
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

// Add to db.ts version 4
this.version(4).stores({
  // ... existing tables ...
  skillMastery: 'id, skillId, category, masteryLevel, dateAchievedMastery',
  iepGoals: 'id, category, targetDate, createdAt'
});
```

#### 2. Mastery Detection Service (`src/utils/masteryTracker.ts`)
Create a service that analyzes session logs to detect mastery:

**Features:**
- **Auto-detect skills** from session logs (group by unitId + problem type)
- **Calculate mastery level** based on accuracy trends
  - Emerging: <60% accuracy
  - Progressing: 60-79% accuracy
  - Mastered: ≥80% accuracy for 3+ consecutive sessions
- **Track accuracy history** (last 10 sessions per skill)
- **Detect mastery achievement** (trigger when criteria met)
- **Configurable criteria** (parents can adjust thresholds)

**Key Functions:**
```typescript
async function analyzeSkillMastery(unitId: string): Promise<SkillMastery>
async function updateMasteryFromSession(sessionLog: SessionLog): Promise<void>
async function getMasteryByCategory(category: string): Promise<SkillMastery[]>
async function getRecentlyMasteredSkills(days: number): Promise<SkillMastery[]>
```

#### 3. IEP Goal Tracker (`src/utils/iepGoalTracker.ts`)

**Features:**
- Link IEP goals to related skills
- Calculate goal progress from skill mastery data
- Project mastery dates based on trends
- Generate alerts for goals at risk (not on track)

**Key Functions:**
```typescript
async function createIEPGoal(goal: Omit<IEPGoal, 'id' | 'createdAt'>): Promise<IEPGoal>
async function updateGoalProgress(goalId: string): Promise<void>
async function getGoalsByCategory(category: string): Promise<IEPGoal[]>
async function getGoalsAtRisk(): Promise<IEPGoal[]> // Behind schedule
async function projectMasteryDate(skillId: string): Promise<Date | null>
```

#### 4. UI Components

**a) IEP Goals Dashboard (`src/components/IEPGoalsDashboard.tsx`)**
- Create/edit IEP goals with form
- List all goals with progress bars
- Color-coded status (on track, at risk, achieved)
- Link goals to existing skills
- Filtering by category and date range

**b) Skill Mastery View (`src/components/SkillMasteryView.tsx`)**
- Grid of all skills grouped by category
- Visual mastery indicators (🌱 emerging, 📈 progressing, ✅ mastered)
- Accuracy trend charts (mini line charts)
- Click to see detailed history
- Recently mastered skills celebration section

**c) Progress Reports (`src/components/ProgressReport.tsx`)**
- Printable/PDF-ready layout
- IEP goal summary with progress
- Skill mastery summary by category
- Accuracy trends over time
- Recommendations based on data
- Date range selector
- Export to PDF button

#### 5. Integration Points

**Modify `src/components/ParentDashboard.tsx`:**
- Add tabs: "Analytics" (current), "IEP Goals", "Skill Mastery", "Reports"
- Or add new navigation buttons to access new components

**Modify session completion handlers:**
- After each session, call `updateMasteryFromSession(sessionLog)`
- Show celebration modal when skill is newly mastered

**Add to `src/store.ts`:**
```typescript
interface AppState {
  // ... existing ...
  currentView: '...' | 'iep-goals' | 'skill-mastery' | 'reports';
}
```

#### 6. Settings Configuration (`src/components/Settings.tsx`)

Add mastery criteria settings:
```typescript
interface AppSettings {
  // ... existing ...
  masteryCriteria: {
    accuracyThreshold: number; // Default 80
    consecutiveSessionsRequired: number; // Default 3
    minSessionsBeforeMastery: number; // Default 5
  };
}
```

### Deliverables

1. ✅ Database schema (v4) with SkillMastery and IEPGoal tables
2. ✅ masteryTracker.ts service with auto-detection logic
3. ✅ iepGoalTracker.ts service with goal management
4. ✅ IEPGoalsDashboard.tsx component
5. ✅ SkillMasteryView.tsx component
6. ✅ ProgressReport.tsx component (print/PDF ready)
7. ✅ Integration into ParentDashboard with tabs/navigation
8. ✅ Session completion hook to update mastery
9. ✅ Settings for mastery criteria
10. ✅ Documentation in new file: `MASTERY_TRACKING_GUIDE.md`

### Testing Criteria

- [ ] Mastery auto-detects from existing session logs
- [ ] Progress bars update correctly as sessions complete
- [ ] IEP goals link to skills and calculate progress
- [ ] Progress reports are printable and well-formatted
- [ ] Recently mastered skills trigger celebration
- [ ] Settings allow customizing criteria (80% default works)
- [ ] No conflicts with existing code

### UI Guidelines

- Use Tailwind for styling (match existing components)
- Kid-friendly celebration when skill mastered (confetti, stars, "You did it!")
- Professional reports for parents/teachers (printable, charts)
- Color coding: 🟢 Green = mastered, 🟡 Yellow = progressing, 🔴 Red = emerging
- Large, clear charts (use recharts library like existing dashboard)

### Logging

Use the logging system:
```typescript
import { logger } from '../utils/logger';

logger.info('mastery-tracker', 'Skill mastery updated', { skillId, newLevel });
logger.warn('iep-goals', 'Goal at risk', { goalId, daysRemaining });
```

---

## 🎯 TIER 1 PROMPT #2: Enhanced Error Correction (Model-Lead-Test)

### Agent Mission
Implement evidence-based error correction using the Model-Lead-Test approach from Applied Behavior Analysis (ABA). This significantly improves learning from mistakes.

### Background
Currently, when a student answers incorrectly, the app shows "Keep trying!" and lets them retry. This doesn't **teach** the correct response. The Model-Lead-Test approach is evidence-based for autism:
1. **Model:** Show the correct answer
2. **Lead:** Guide the student to the correct answer
3. **Test:** Give immediate retry opportunity

### Requirements

#### 1. Error Correction Flow

**Current behavior (INCORRECT):**
```
Student picks wrong answer → "Keep trying!" → Try again
```

**New behavior (CORRECT):**
```
Student picks wrong answer → MODEL (show correct) → LEAD (guide to it) → TEST (retry)
```

#### 2. Implementation in Practice Components

**Modify these files:**
- `src/components/ReadingPractice.tsx`
- `src/components/MathPractice.tsx`
- `src/components/SciencePractice.tsx` (if exists)

#### 3. Error Correction Component (`src/components/ErrorCorrection.tsx`)

Create a reusable component:

```typescript
interface ErrorCorrectionProps {
  problemType: 'reading' | 'math' | 'science';
  correctAnswer: string | number;
  incorrectAnswer: string | number;
  question: string;
  visualAid?: React.ReactNode; // Optional visual (ten-frame, number line, etc.)
  onComplete: () => void; // Called when correction complete
}

export function ErrorCorrection(props: ErrorCorrectionProps) {
  // 3-step flow: Model → Lead → Test
}
```

**Flow Details:**

**Step 1: MODEL (Show correct answer) - 3 seconds**
```tsx
<div className="p-8 bg-blue-50 rounded-3xl border-4 border-blue-300">
  <h2 className="text-4xl font-bold text-blue-900 mb-4">Let me show you!</h2>
  <p className="text-2xl text-gray-700 mb-6">{question}</p>

  {/* Highlight correct answer */}
  <div className="text-center">
    <div className="inline-block p-8 bg-green-300 rounded-2xl border-4 border-green-500 animate-pulse">
      <p className="text-6xl font-bold text-green-900">{correctAnswer}</p>
    </div>
  </div>

  {/* Visual aid if provided (number line, ten-frame, etc.) */}
  {visualAid}

  <p className="text-xl text-gray-600 mt-6">
    The answer is <strong>{correctAnswer}</strong>
  </p>
</div>
```

**Step 2: LEAD (Guide to answer) - 3 seconds**
```tsx
<div className="p-8 bg-purple-50 rounded-3xl border-4 border-purple-300">
  <h2 className="text-4xl font-bold text-purple-900 mb-4">Let's do it together!</h2>
  <p className="text-2xl text-gray-700 mb-6">{question}</p>

  {/* Animated arrow or hand pointing to correct answer */}
  <div className="relative">
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div className="text-6xl">👇</div>
    </div>

    <button className="p-8 bg-purple-300 rounded-2xl border-4 border-purple-500 text-6xl font-bold">
      {correctAnswer}
    </button>
  </div>

  <p className="text-xl text-gray-600 mt-6">
    Tap here! ⬆️
  </p>
</div>
```

**Step 3: TEST (Independent retry) - Wait for response**
```tsx
<div className="p-8 bg-yellow-50 rounded-3xl border-4 border-yellow-300">
  <h2 className="text-4xl font-bold text-yellow-900 mb-4">Now you try!</h2>
  <p className="text-2xl text-gray-700 mb-6">{question}</p>

  {/* Show all options again (same as original question) */}
  {/* Student selects answer */}

  {/* If correct: "🎉 You found it! Great job! ⭐" */}
  {/* If still wrong: Repeat cycle (limit to 2 cycles max) */}
</div>
```

#### 4. Data Tracking

Track error correction effectiveness:

```typescript
// Add to types.ts
interface ErrorCorrectionLog {
  id: string;
  sessionLogId: string;
  problemId: string;
  problemType: string;
  incorrectAnswer: string | number;
  correctAnswer: string | number;
  correctionCyclesNeeded: number; // How many Model-Lead-Test cycles
  finallyCorrect: boolean;
  timestamp: Date;
}

// Add to db.ts version 4 (or 5 if mastery tracker uses 4)
errorCorrections: 'id, sessionLogId, problemType, timestamp'
```

#### 5. Settings

Add to `src/components/Settings.tsx`:

```typescript
interface AppSettings {
  // ... existing ...
  errorCorrection: {
    enabled: boolean; // Default true
    showModel: boolean; // Show correct answer (default true)
    showLead: boolean; // Guide to answer (default true)
    modelDuration: number; // Seconds (default 3)
    leadDuration: number; // Seconds (default 3)
    maxCycles: number; // Max correction cycles (default 2)
    celebrateCorrection: boolean; // Celebrate when corrected (default true)
  };
}
```

#### 6. Visual Aids Integration

**For Math (Number Line):**
```tsx
// When showing 23, highlight it on number line
<NumberLineVisual
  range={[20, 29]}
  highlighted={23}
  animated={true}
/>
```

**For Math (Ten Frames):**
```tsx
// When showing 23, show filled ten-frames
<TenFrameVisual
  number={23}
  animated={true}
/>
```

**For Reading (CVC words):**
```tsx
// When showing "cat", show image of cat
<WordVisual
  word="cat"
  showImage={true}
  showPhonics={true} // c-a-t breakdown
/>
```

### Deliverables

1. ✅ ErrorCorrection.tsx component (reusable, 3-step flow)
2. ✅ Integration into ReadingPractice.tsx
3. ✅ Integration into MathPractice.tsx
4. ✅ Integration into SciencePractice.tsx (if exists)
5. ✅ ErrorCorrectionLog table in database
6. ✅ Error correction settings in Settings.tsx
7. ✅ Visual aids for each problem type
8. ✅ Celebration animation when corrected
9. ✅ Analytics in Parent Dashboard (error correction effectiveness)
10. ✅ Documentation: `ERROR_CORRECTION_GUIDE.md`

### Testing Criteria

- [ ] Wrong answer triggers Model step (shows correct answer)
- [ ] After 3 seconds, automatically advances to Lead step
- [ ] Lead step shows animated pointer to correct answer
- [ ] After 3 seconds, advances to Test step
- [ ] Test step allows independent retry
- [ ] If correct after correction, celebrates success
- [ ] If still wrong, repeats cycle (max 2 cycles)
- [ ] Settings allow disabling/customizing error correction
- [ ] Data tracked in errorCorrections table
- [ ] Parent Dashboard shows error correction stats

### UI Guidelines

- Smooth transitions between steps (fade in/out)
- Clear visual distinction (blue=model, purple=lead, yellow=test)
- Large, kid-friendly text and buttons
- Encouraging tone ("Let me show you!" not "You got it wrong")
- Animated elements (pulse, bounce) to maintain attention
- Celebrate correction ("You did it!" even if needed help)

### Logging

```typescript
import { logger } from '../utils/logger';

logger.info('error-correction', 'Correction started', { problemId, incorrectAnswer });
logger.info('error-correction', 'Correction completed', { cyclesNeeded, finallyCorrect });
logger.userError('math-practice', problemId, {
  userAnswer,
  correctAnswer,
  correctionApplied: true
});
```

---

## 🎯 TIER 1 PROMPT #3: Social Stories for Transitions

### Agent Mission
Implement social stories - an evidence-based practice for autism that uses visual narratives to teach expectations, reduce anxiety, and support transitions.

### Background
Students with autism often struggle with transitions and unexpected situations. Social stories use simple, first-person narratives with pictures to prepare students for what will happen and what to expect. This reduces anxiety and improves behavior.

### Requirements

#### 1. Database Schema

Add to `src/types.ts`:
```typescript
export interface SocialStory {
  id: string;
  title: string;
  category: 'transitions' | 'emotions' | 'expectations' | 'skills' | 'custom';
  pages: StoryPage[];
  autoTrigger?: 'first-session' | 'before-break' | 'after-error' | 'on-frustration';
  timesShown: number;
  lastShownAt?: Date;
  createdAt: Date;
  isCustom: boolean; // Parent-created vs. pre-loaded
}

export interface StoryPage {
  pageNumber: number;
  text: string; // First-person, present tense narrative
  emoji: string; // Large emoji as visual
  imageUrl?: string; // Optional custom image
  audioUrl?: string; // Optional narration (future feature)
  backgroundColor?: string; // Page color theme
}
```

Add to `src/db.ts` (version 4 or 5):
```typescript
socialStories: 'id, category, autoTrigger, createdAt, isCustom'
```

#### 2. Pre-loaded Stories

Create 8 social stories (seed data in `src/utils/socialStoriesData.ts`):

**Story 1: "My Learning Time"**
```typescript
{
  id: 'story-learning-time',
  title: 'My Learning Time',
  category: 'expectations',
  autoTrigger: 'first-session',
  pages: [
    {
      pageNumber: 1,
      text: "Sometimes I use my learning app.",
      emoji: "📱",
      backgroundColor: "#E3F2FD"
    },
    {
      pageNumber: 2,
      text: "First, I pick what I want to practice.",
      emoji: "✅",
      backgroundColor: "#F3E5F5"
    },
    {
      pageNumber: 3,
      text: "Then I do reading or math.",
      emoji: "📚",
      backgroundColor: "#E8F5E9"
    },
    {
      pageNumber: 4,
      text: "When I try my best, I earn stars!",
      emoji: "⭐",
      backgroundColor: "#FFF9C4"
    },
    {
      pageNumber: 5,
      text: "At the end, I get a reward!",
      emoji: "🎁",
      backgroundColor: "#FFE0B2"
    },
    {
      pageNumber: 6,
      text: "I feel proud when I learn!",
      emoji: "😊",
      backgroundColor: "#F8BBD0"
    }
  ],
  timesShown: 0,
  createdAt: new Date(),
  isCustom: false
}
```

**Story 2: "When I Need a Break"**
- Page 1: "Sometimes I feel tired or frustrated." 😓
- Page 2: "That's okay! Everyone needs breaks." 👍
- Page 3: "I can tap the break button." 🛑
- Page 4: "I can do breathing, bubbles, or colors." 🧘
- Page 5: "After my break, I feel better!" 🙂
- Page 6: "Then I can keep learning." 💪

**Story 3: "Making Mistakes is Okay"**
- Page 1: "Sometimes I pick the wrong answer." 🤔
- Page 2: "That's how I learn!" 💡
- Page 3: "The app will show me the right answer." 👀
- Page 4: "Then I try again." 🔄
- Page 5: "I still earn stars for trying!" ⭐
- Page 6: "I'm a great learner!" 🌟

**Story 4: "Time to Finish"**
- Page 1: "When I see the timer, I know we're almost done." ⏰
- Page 2: "I can finish the problem I'm working on." ✏️
- Page 3: "Then I'll see how many stars I earned!" ⭐
- Page 4: "I did a great job!" 👏
- Page 5: "Now I can do something else." 🎮
- Page 6: "I'll come back to learn more later!" 📅

**Story 5: "Asking for Help"**
- 6 pages about how to ask for help when stuck

**Story 6: "Sharing My Progress"**
- 6 pages about showing parents/teachers their work

**Story 7: "Trying Something New"**
- 6 pages about starting a new activity

**Story 8: "Taking My Time"**
- 6 pages about working at their own pace

#### 3. Social Story Viewer Component

**`src/components/SocialStoryViewer.tsx`:**

```typescript
interface SocialStoryViewerProps {
  storyId: string;
  onComplete: () => void;
  autoAdvance?: boolean; // Auto-advance pages (default: false)
}

export function SocialStoryViewer(props: SocialStoryViewerProps) {
  // Features:
  // - Large emoji/image at top (60% of screen)
  // - Text in large, dyslexia-friendly font (bottom 40%)
  // - Page number indicator (Page 1 of 6)
  // - Previous/Next buttons (or tap to advance)
  // - Auto-read text option (future: text-to-speech)
  // - "Read Again" button at end
  // - Smooth page transitions (slide animation)
}
```

**Page Layout:**
```tsx
<div className="min-h-screen flex flex-col" style={{ backgroundColor }}>
  {/* Top 60%: Visual */}
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-[20rem]">{emoji}</div>
    {/* Or <img> if imageUrl provided */}
  </div>

  {/* Bottom 40%: Text */}
  <div className="bg-white rounded-t-3xl p-12 shadow-2xl">
    <p className="text-5xl text-center text-gray-800 font-semibold leading-relaxed">
      {text}
    </p>

    {/* Page indicator */}
    <div className="text-center mt-8">
      <span className="text-2xl text-gray-500">
        Page {pageNumber} of {totalPages}
      </span>
    </div>

    {/* Navigation */}
    <div className="flex justify-between mt-8">
      <button onClick={previousPage} disabled={isFirstPage}>
        ← Previous
      </button>
      <button onClick={nextPage}>
        {isLastPage ? 'Finish' : 'Next →'}
      </button>
    </div>
  </div>
</div>
```

#### 4. Social Story Library Component

**`src/components/SocialStoryLibrary.tsx`:**

```typescript
export function SocialStoryLibrary() {
  // Features:
  // - Grid of all available stories
  // - Category filtering (transitions, emotions, etc.)
  // - Preview thumbnail (first page)
  // - "Times read" counter
  // - Click to read story
  // - Create custom story button (parent only)
}
```

**Story Card:**
```tsx
<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
  <div className="text-6xl text-center mb-4">{firstPageEmoji}</div>
  <h3 className="text-2xl font-bold text-center mb-2">{title}</h3>
  <p className="text-sm text-gray-500 text-center">
    Read {timesShown} times
  </p>
  <div className="mt-4">
    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
      {category}
    </span>
  </div>
</div>
```

#### 5. Custom Story Creator (Parent Feature)

**`src/components/CustomStoryCreator.tsx`:**

```typescript
export function CustomStoryCreator() {
  // Simple form:
  // - Story title
  // - Category
  // - Add pages (text + emoji picker)
  // - Preview
  // - Save to database
}
```

#### 6. Auto-Trigger Logic

**Create `src/utils/socialStoryTriggers.ts`:**

```typescript
// Trigger stories automatically based on context
export async function checkStoryTriggers(context: {
  isFirstSession: boolean;
  consecutiveErrors: number;
  lastBreakTime?: Date;
  sessionDuration: number;
}): Promise<SocialStory | null> {
  // If first session ever, show "My Learning Time"
  if (context.isFirstSession) {
    return await getStory('story-learning-time');
  }

  // If 3+ consecutive errors, show "Making Mistakes is Okay"
  if (context.consecutiveErrors >= 3) {
    return await getStory('story-mistakes-okay');
  }

  // If session > 20 min without break, suggest "When I Need a Break"
  if (context.sessionDuration > 1200000 && !context.lastBreakTime) {
    return await getStory('story-need-break');
  }

  return null;
}
```

**Integration points:**
- Check before starting session
- Check after errors
- Check periodically during long sessions

#### 7. Settings

Add to `src/components/Settings.tsx`:

```typescript
interface AppSettings {
  // ... existing ...
  socialStories: {
    enabled: boolean; // Default true
    autoTrigger: boolean; // Auto-show based on context (default true)
    requireCompletion: boolean; // Must finish story before continuing (default false)
  };
}
```

#### 8. Integration with App

**Add to `src/store.ts`:**
```typescript
currentView: '...' | 'social-story' | 'story-library'
currentStoryId?: string;
```

**Add to `src/App.tsx`:**
```typescript
{currentView === 'social-story' && currentStoryId && (
  <SocialStoryViewer
    storyId={currentStoryId}
    onComplete={() => setCurrentView('home')}
  />
)}
{currentView === 'story-library' && <SocialStoryLibrary />}
```

**Add button to Home.tsx:**
```tsx
<button onClick={() => setCurrentView('story-library')}>
  📖 Social Stories
</button>
```

### Deliverables

1. ✅ Database schema (SocialStory, StoryPage)
2. ✅ socialStoriesData.ts with 8 pre-loaded stories
3. ✅ SocialStoryViewer.tsx component (beautiful page transitions)
4. ✅ SocialStoryLibrary.tsx component (grid view)
5. ✅ CustomStoryCreator.tsx (parent feature)
6. ✅ socialStoryTriggers.ts (auto-trigger logic)
7. ✅ Integration into App.tsx and Home.tsx
8. ✅ Settings for social stories
9. ✅ Seed data loaded on database init
10. ✅ Documentation: `SOCIAL_STORIES_GUIDE.md`

### Testing Criteria

- [ ] 8 pre-loaded stories appear in library
- [ ] Stories display with large emoji and text
- [ ] Page navigation works (next/previous)
- [ ] Auto-trigger shows appropriate story in context
- [ ] Custom story creator allows parents to make stories
- [ ] Stories can be replayed unlimited times
- [ ] Settings allow disabling auto-trigger
- [ ] Smooth page transitions (no jarring jumps)

### UI Guidelines

- **LARGE everything:** Emoji (20rem), text (5xl), buttons
- **High contrast:** White text on colored background, or dark text on white
- **Simple language:** First-person, present tense, 1-2 sentences per page
- **Positive tone:** "I can..." "I will..." "That's okay!"
- **Consistent structure:** 6 pages per story (can vary)
- **Calming colors:** Pastels, not too bright
- **Smooth animations:** Slide or fade between pages (300ms)

### Evidence Base Notes

Include in documentation:
- Social stories developed by Carol Gray (1991)
- Evidence-based practice recognized by NCAEP
- Most effective when:
  - Written in first-person
  - Present or future tense
  - Positive, descriptive sentences
  - Ratio: 2-5 descriptive for every 1 directive
  - Paired with visuals
  - Read before the activity/situation

### Logging

```typescript
import { logger } from '../utils/logger';

logger.info('social-stories', 'Story viewed', { storyId, timesRead });
logger.info('social-stories', 'Story auto-triggered', { storyId, trigger: 'first-session' });
logger.info('social-stories', 'Custom story created', { storyId, pageCount });
```

---

## ⚡ QUICK WIN PROMPT #1: ChoiceBoards Integration + Session Summary

### Agent Mission
Integrate the existing ChoiceBoards component and add a motivating Session Summary screen. Both are quick, high-impact features.

### Background
ChoiceBoards.tsx already exists but isn't wired into the app. Choice increases autonomy and engagement. Session Summary provides immediate feedback and motivation.

### Requirements

#### Part A: Integrate ChoiceBoards (4-6 hours)

**Current State:**
- `src/components/ChoiceBoards.tsx` exists (232 lines)
- Not currently accessible in the app

**Task:**
1. Add route to App.tsx
2. Add button on Home.tsx to access choice boards
3. Wire selected activities into session flow
4. Store choices in Zustand state

**Implementation:**

**1. Update `src/store.ts`:**
```typescript
interface AppState {
  // ... existing ...
  currentView: '...' | 'choice-boards';
  selectedActivities?: Array<'reading' | 'math' | 'science' | 'break'>;
  activityOrder?: Array<'reading' | 'math' | 'science' | 'break'>;
}

// Add action:
setActivityChoices: (activities: string[], order: string[]) => void;
```

**2. Update `src/App.tsx`:**
```typescript
import { ChoiceBoards } from './components/ChoiceBoards';

// In return:
{currentView === 'choice-boards' && <ChoiceBoards />}
```

**3. Update `src/components/Home.tsx`:**

Add prominent choice board button:
```tsx
{/* After unit selection, before bottom buttons */}
<div className="mb-8">
  <button
    onClick={() => setCurrentView('choice-boards')}
    className="w-full flex items-center justify-center gap-4 p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
  >
    <span className="text-6xl">🎨</span>
    <div className="text-left">
      <div className="text-3xl font-bold">Choose Your Activities</div>
      <div className="text-xl opacity-90">Pick what you want to do today!</div>
    </div>
  </button>
</div>
```

**4. Update `src/components/ChoiceBoards.tsx`:**

Modify the completion handler to use selected activities:
```typescript
const handleFinish = () => {
  // Save to store
  const selectedTypes = choices.filter(c => c.selected).map(c => c.type);
  setActivityChoices(selectedTypes, orderedActivities);

  // Create session plan with chosen activities
  const plan = createCustomSessionPlan(selectedTypes, orderedActivities);
  setSessionPlan(plan);

  // Navigate to schedule
  setCurrentView('schedule');
};
```

**5. Create custom session plan logic:**

In Home.tsx or new util, create session from choices:
```typescript
function createCustomSessionPlan(
  activities: string[],
  order: string[]
): SessionPlan {
  // Map activities to session plan format
  // Similar to existing createSessionPlan but uses chosen activities
}
```

#### Part B: Session Summary Screen (6-8 hours)

**Create `src/components/SessionSummary.tsx`:**

Show motivating stats at end of each session:

```typescript
interface SessionSummaryProps {
  sessionLog: SessionLog;
  starsEarned: number;
  onContinue: () => void;
}

export function SessionSummary(props: SessionSummaryProps) {
  const { sessionLog, starsEarned, onContinue } = props;

  const accuracy = (sessionLog.correct / sessionLog.attempts) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-12">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="text-9xl mb-4">🎉</div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            Amazing Work!
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="⭐"
            value={starsEarned}
            label="Stars Earned"
            color="yellow"
          />
          <StatCard
            icon="✅"
            value={sessionLog.correct}
            label="Correct"
            color="green"
          />
          <StatCard
            icon="📊"
            value={`${Math.round(accuracy)}%`}
            label="Accuracy"
            color="blue"
          />
          <StatCard
            icon="⏱️"
            value={`${Math.round(sessionLog.duration / 60000)}m`}
            label="Time"
            color="purple"
          />
        </div>

        {/* Encouraging Message */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 mb-8">
          <p className="text-3xl text-center text-gray-800">
            {getEncouragingMessage(accuracy)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Your Progress</h3>
          <div className="h-12 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 flex items-center justify-end pr-4"
              style={{ width: `${accuracy}%` }}
            >
              <span className="text-white font-bold text-xl">
                {Math.round(accuracy)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentView('home')}
            className="p-6 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition text-2xl font-bold"
          >
            🏠 Back to Home
          </button>
          <button
            onClick={() => setCurrentView('rewards')}
            className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition text-2xl font-bold"
          >
            🎁 See Rewards
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  const colors = {
    yellow: 'from-yellow-400 to-yellow-500',
    green: 'from-green-400 to-green-500',
    blue: 'from-blue-400 to-blue-500',
    purple: 'from-purple-400 to-purple-500'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white text-center shadow-lg`}>
      <div className="text-5xl mb-2">{icon}</div>
      <div className="text-4xl font-bold mb-1">{value}</div>
      <div className="text-lg opacity-90">{label}</div>
    </div>
  );
}

function getEncouragingMessage(accuracy: number): string {
  if (accuracy >= 90) return "You're a superstar! Outstanding work! 🌟";
  if (accuracy >= 80) return "Excellent job! You're doing great! 🎯";
  if (accuracy >= 70) return "Nice work! Keep it up! 💪";
  if (accuracy >= 60) return "Good effort! You're learning! 📈";
  return "Great job trying! Every practice makes you better! 🌱";
}
```

**Integration:**

Update session completion in ReadingPractice.tsx, MathPractice.tsx:
```typescript
// After session completes, instead of going directly to rewards:
const sessionLog = { /* build session log */ };
setSessionLog(sessionLog); // Add to store
setCurrentView('session-summary');
```

Add to store.ts:
```typescript
interface AppState {
  // ...
  currentView: '...' | 'session-summary';
  currentSessionLog?: SessionLog;
}
```

Add to App.tsx:
```typescript
{currentView === 'session-summary' && currentSessionLog && (
  <SessionSummary
    sessionLog={currentSessionLog}
    starsEarned={sessionStars}
    onContinue={() => setCurrentView('home')}
  />
)}
```

### Deliverables

1. ✅ ChoiceBoards integrated into Home.tsx
2. ✅ Choice board selections flow into session plan
3. ✅ SessionSummary.tsx component (beautiful, motivating)
4. ✅ Session summary shows after every session
5. ✅ Stats displayed: stars, correct, accuracy, time
6. ✅ Encouraging messages based on performance
7. ✅ Store updates (selectedActivities, currentSessionLog)
8. ✅ App.tsx routes updated
9. ✅ Documentation: `CHOICE_BOARDS_AND_SUMMARY.md`

### Testing Criteria

- [ ] Choice board button visible on Home
- [ ] Can select multiple activities
- [ ] Can reorder selected activities
- [ ] Selected activities create proper session plan
- [ ] Session summary shows after completing session
- [ ] All 4 stats display correctly
- [ ] Encouraging message varies by accuracy
- [ ] "Back to Home" and "See Rewards" buttons work

### UI Guidelines

- Large, colorful, celebratory (this is a win!)
- Animated progress bar (fills from 0 to accuracy%)
- Gradient backgrounds and cards
- Clear visual hierarchy (biggest = most important)
- No negative messaging (even for low accuracy)

---

## ⚡ QUICK WIN PROMPT #2: Favorites Tracking + Encouragement Library + Sound Effects

### Agent Mission
Three small, high-impact personalization features: track favorite activities, expand encouragement messages, and add sound effect options.

### Requirements

#### Part A: Favorite Activities Tracking (4-6 hours)

**Goal:** Learn which activities the student prefers and prioritize them in the UI.

**1. Database Schema:**

Add to `src/types.ts`:
```typescript
export interface ActivityPreference {
  id: string;
  activityType: 'reading' | 'math' | 'science' | 'break';
  unitId?: string; // Optional: preference for specific unit
  timesChosen: number;
  timesCompleted: number;
  completionRate: number; // timesCompleted / timesChosen
  lastChosenAt: Date;
  averageStarsEarned: number;
  averageAccuracy: number;
}
```

Add to `src/db.ts` (version 4/5):
```typescript
activityPreferences: 'id, activityType, unitId, timesChosen, lastChosenAt'
```

**2. Tracking Logic (`src/utils/activityPreferences.ts`):**

```typescript
// Increment when activity chosen
export async function trackActivityChoice(
  activityType: string,
  unitId?: string
): Promise<void> {
  const id = unitId ? `${activityType}-${unitId}` : activityType;

  const existing = await db.activityPreferences.get(id);

  if (existing) {
    await db.activityPreferences.update(id, {
      timesChosen: existing.timesChosen + 1,
      lastChosenAt: new Date()
    });
  } else {
    await db.activityPreferences.add({
      id,
      activityType,
      unitId,
      timesChosen: 1,
      timesCompleted: 0,
      completionRate: 0,
      lastChosenAt: new Date(),
      averageStarsEarned: 0,
      averageAccuracy: 0
    });
  }
}

// Update when session completed
export async function trackActivityCompletion(
  activityType: string,
  unitId: string,
  starsEarned: number,
  accuracy: number
): Promise<void> {
  const id = `${activityType}-${unitId}`;
  const pref = await db.activityPreferences.get(id);

  if (pref) {
    const newCompleted = pref.timesCompleted + 1;
    const newAvgStars = (pref.averageStarsEarned * pref.timesCompleted + starsEarned) / newCompleted;
    const newAvgAcc = (pref.averageAccuracy * pref.timesCompleted + accuracy) / newCompleted;

    await db.activityPreferences.update(id, {
      timesCompleted: newCompleted,
      completionRate: newCompleted / pref.timesChosen,
      averageStarsEarned: newAvgStars,
      averageAccuracy: newAvgAcc
    });
  }
}

// Get favorites
export async function getFavoriteActivities(limit = 5): Promise<ActivityPreference[]> {
  return await db.activityPreferences
    .orderBy('timesChosen')
    .reverse()
    .limit(limit)
    .toArray();
}
```

**3. UI Integration:**

**Home.tsx - Show favorites at top:**
```tsx
const [favorites, setFavorites] = useState<ActivityPreference[]>([]);

useEffect(() => {
  async function loadFavorites() {
    const favs = await getFavoriteActivities(3);
    setFavorites(favs);
  }
  loadFavorites();
}, []);

// In render:
{favorites.length > 0 && (
  <div className="mb-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Favorites ⭐</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {favorites.map(fav => (
        <FavoriteActivityCard key={fav.id} preference={fav} />
      ))}
    </div>
  </div>
)}
```

**ParentDashboard.tsx - Show preferences analytics:**
```tsx
<div className="bg-white rounded-2xl shadow-lg p-6">
  <h2 className="text-2xl font-bold mb-4">Activity Preferences</h2>
  {/* Bar chart of timesChosen by activity type */}
  {/* Show completion rates */}
  {/* Show average accuracy by activity */}
</div>
```

#### Part B: Encouragement Library (3-4 hours)

**Goal:** Expand variety in positive feedback messages to avoid repetition.

**1. Create `src/utils/encouragementLibrary.ts`:**

```typescript
interface Encouragement {
  category: 'correct' | 'incorrect' | 'trying' | 'milestone' | 'mastery';
  messages: string[];
}

export const ENCOURAGEMENT: Record<string, Encouragement> = {
  correct: {
    category: 'correct',
    messages: [
      "Great job! ⭐",
      "You got it! 🎉",
      "Excellent! 👏",
      "Perfect! 💯",
      "Amazing! 🌟",
      "You're doing great! 🚀",
      "Wonderful! ✨",
      "Fantastic work! 💪",
      "You're a star! ⭐",
      "Keep it up! 🎯",
      "Super work! 🦸",
      "Outstanding! 🏆",
      "Nice job! 👍",
      "You're on fire! 🔥",
      "Brilliant! 💡"
    ]
  },

  incorrect: {
    category: 'incorrect',
    messages: [
      "Keep trying! 💪",
      "You're learning! 📚",
      "Almost there! 🎯",
      "Let's try again! 🔄",
      "You can do it! 💫",
      "Don't give up! 🌈",
      "Every try helps! 🌱",
      "You're getting closer! 📈",
      "Nice effort! ⭐",
      "Keep going! 🚀"
    ]
  },

  trying: {
    category: 'trying',
    messages: [
      "Good try! 💪",
      "I like how you're thinking! 🤔",
      "You're working hard! 💼",
      "Keep thinking! 💭",
      "You're on the right track! 🛤️",
      "Nice effort! 👏",
      "I see you trying! 👀",
      "You're doing your best! ⭐"
    ]
  },

  milestone: {
    category: 'milestone',
    messages: [
      "You earned 5 stars! 🌟🌟🌟🌟🌟",
      "10 stars! You're amazing! ⭐⭐⭐",
      "Wow! 15 stars! 🎉",
      "You're a superstar! 50 stars! 💫",
      "Incredible! 100 stars! 🏆"
    ]
  },

  mastery: {
    category: 'mastery',
    messages: [
      "You mastered this skill! 🎓",
      "You're an expert now! 👨‍🎓",
      "Skill unlocked! 🔓",
      "You've got this down! 💯",
      "Master level achieved! 🏅"
    ]
  }
};

// Get random message from category
export function getEncouragement(category: keyof typeof ENCOURAGEMENT): string {
  const messages = ENCOURAGEMENT[category].messages;
  return messages[Math.floor(Math.random() * messages.length)];
}

// Get message avoiding recent repeats (track last 5)
const recentMessages: string[] = [];

export function getUniqueEncouragement(category: keyof typeof ENCOURAGEMENT): string {
  const messages = ENCOURAGEMENT[category].messages;
  const available = messages.filter(m => !recentMessages.includes(m));

  const selected = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : messages[Math.floor(Math.random() * messages.length)];

  recentMessages.push(selected);
  if (recentMessages.length > 5) recentMessages.shift();

  return selected;
}
```

**2. Replace all hardcoded encouragement:**

Find and replace in:
- ReadingPractice.tsx
- MathPractice.tsx
- SciencePractice.tsx
- ImmediateReward.tsx

Before:
```typescript
<p>Great job! ⭐</p>
```

After:
```typescript
import { getUniqueEncouragement } from '../utils/encouragementLibrary';

<p>{getUniqueEncouragement('correct')}</p>
```

#### Part C: Sound Effect Options (5-7 hours)

**Goal:** Let students pick their preferred celebration sound.

**1. Sound Files:**

Add to `public/sounds/`:
- `celebrate-1.mp3` - Classic "ding"
- `celebrate-2.mp3` - Cheerful "yay!"
- `celebrate-3.mp3` - Magical "sparkle"
- `celebrate-4.mp3` - Fun "woo-hoo!"
- `celebrate-5.mp3` - Upbeat "fanfare"
- `star-earn.mp3` - Quick star sound
- `milestone.mp3` - Big achievement sound
- `wrong.mp3` - Gentle "try again" (optional, only if settings allow)

**2. Audio Manager (`src/utils/audioManager.ts`):**

```typescript
type SoundEffect = 'celebrate' | 'star' | 'milestone' | 'wrong' | 'click';

class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private celebrateVariant: number = 1; // 1-5
  private volume: number = 0.7;
  private enabled: boolean = true;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    // Preload all sounds
    for (let i = 1; i <= 5; i++) {
      const audio = new Audio(`/sounds/celebrate-${i}.mp3`);
      audio.volume = this.volume;
      this.sounds.set(`celebrate-${i}`, audio);
    }

    this.sounds.set('star', new Audio('/sounds/star-earn.mp3'));
    this.sounds.set('milestone', new Audio('/sounds/milestone.mp3'));
    this.sounds.set('wrong', new Audio('/sounds/wrong.mp3'));
  }

  public play(effect: SoundEffect) {
    if (!this.enabled) return;

    let soundKey = effect;
    if (effect === 'celebrate') {
      soundKey = `celebrate-${this.celebrateVariant}`;
    }

    const audio = this.sounds.get(soundKey);
    if (audio) {
      audio.currentTime = 0; // Reset to start
      audio.play().catch(err => {
        logger.warn('audio', 'Failed to play sound', { effect, error: err.message });
      });
    }
  }

  public setCelebrateVariant(variant: number) {
    if (variant >= 1 && variant <= 5) {
      this.celebrateVariant = variant;
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public previewSound(variant: number) {
    const audio = this.sounds.get(`celebrate-${variant}`);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }
}

export const audioManager = new AudioManager();
```

**3. Settings UI:**

Add to `src/components/Settings.tsx`:

```tsx
<div className="bg-white rounded-2xl shadow-lg p-6">
  <h2 className="text-2xl font-bold mb-4">Sound Effects</h2>

  {/* Enable/Disable */}
  <label className="flex items-center gap-3 mb-6">
    <input
      type="checkbox"
      checked={settings.audioEnabled}
      onChange={(e) => {
        updateSettings({ audioEnabled: e.target.checked });
        audioManager.setEnabled(e.target.checked);
      }}
      className="w-8 h-8"
    />
    <span className="text-xl">Enable sound effects</span>
  </label>

  {/* Volume Slider */}
  <div className="mb-6">
    <label className="block text-xl mb-2">Volume</label>
    <input
      type="range"
      min="0"
      max="100"
      value={settings.soundVolume || 70}
      onChange={(e) => {
        const vol = parseInt(e.target.value);
        updateSettings({ soundVolume: vol });
        audioManager.setVolume(vol / 100);
      }}
      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  </div>

  {/* Celebration Sound Picker */}
  <div>
    <label className="block text-xl mb-4">Celebration Sound</label>
    <div className="grid grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5].map(variant => (
        <button
          key={variant}
          onClick={() => {
            updateSettings({ celebrateSoundVariant: variant });
            audioManager.setCelebrateVariant(variant);
            audioManager.previewSound(variant);
          }}
          className={`p-4 rounded-xl border-4 transition ${
            settings.celebrateSoundVariant === variant
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-blue-300'
          }`}
        >
          <div className="text-4xl mb-2">🔊</div>
          <div className="text-sm font-semibold">Sound {variant}</div>
        </button>
      ))}
    </div>
    <p className="text-sm text-gray-500 mt-2">
      Click a sound to preview it
    </p>
  </div>
</div>
```

**4. Integration:**

Replace audio calls throughout app:

Before:
```typescript
const audio = new Audio('/correct.mp3');
audio.play();
```

After:
```typescript
import { audioManager } from '../utils/audioManager';

audioManager.play('celebrate');
```

Use in:
- ImmediateReward.tsx: `audioManager.play('star')`
- Milestone rewards: `audioManager.play('milestone')`
- Correct answers: `audioManager.play('celebrate')`

**5. Update Settings Types:**

```typescript
interface AppSettings {
  // ... existing ...
  soundVolume?: number; // 0-100, default 70
  celebrateSoundVariant?: number; // 1-5, default 1
}
```

### Deliverables

**Part A:**
1. ✅ ActivityPreference schema in database
2. ✅ activityPreferences.ts tracking logic
3. ✅ Favorites section on Home.tsx
4. ✅ Preferences analytics in ParentDashboard

**Part B:**
5. ✅ encouragementLibrary.ts with 50+ messages
6. ✅ Messages integrated into all practice components
7. ✅ Anti-repetition logic (track last 5)

**Part C:**
8. ✅ 5 celebration sound files in public/sounds/
9. ✅ audioManager.ts for sound management
10. ✅ Sound settings in Settings.tsx (picker + preview)
11. ✅ Audio calls replaced throughout app

**Documentation:**
12. ✅ `PERSONALIZATION_FEATURES.md`

### Testing Criteria

- [ ] Favorite activities appear on Home after sessions
- [ ] Activity preferences tracked in database
- [ ] Parent Dashboard shows preference analytics
- [ ] Encouragement messages vary (no repetition)
- [ ] Sound effects play on correct answers
- [ ] Can select different celebration sounds
- [ ] Sound preview works in settings
- [ ] Volume slider adjusts sound level
- [ ] Disabling audio stops all sounds

### UI Guidelines

- Favorites clearly highlighted on Home (distinct section)
- Sound picker visual (buttons with icons)
- Preview sounds immediately on click
- Volume slider responsive and smooth

---

## 🚀 COORDINATION NOTES FOR ALL AGENTS

### Before Starting:
1. Pull latest from `claude/special-needs-education-01T9bKL1BjS6S3bpkcBG96Sd`
2. Create your own branch: `claude/[feature-name]-[session-id]`
3. Review existing code structure and patterns

### Database Version Numbers:
- **Current:** Version 3 (includes logs table)
- **Mastery Tracking:** Use version 4
- **Error Correction:** Use version 4 or 5 (coordinate with Mastery agent)
- **Social Stories:** Use version 4/5/6 (coordinate)
- **Quick Wins:** Use appropriate version

If multiple agents add database schemas, coordinate version numbers:
- Agent 1 (Mastery): v4
- Agent 2 (Error Correction): v5
- Agent 3 (Social Stories): v6
- Agent 4 (Quick Win 1): v7
- Agent 5 (Quick Win 2): v8

Or combine into one version if coordinating.

### Logging:
All agents should use the logging system:
```typescript
import { logger } from '../utils/logger';
logger.info('feature-name', 'message', { context });
```

### Code Style:
- Match existing patterns (see App.tsx, Home.tsx)
- Use Tailwind CSS (no custom CSS files)
- TypeScript strict mode
- Kid-friendly UI (large text, bright colors, positive messages)
- Privacy-first (local storage only)

### Testing:
- Build with `npm run build` before committing
- Test in browser with `npm run dev`
- Verify no TypeScript errors
- Check mobile responsiveness

### Commits:
- Descriptive commit messages
- Reference feature in commit
- Build must succeed before pushing

### When Done:
1. Commit all changes
2. Push to your branch
3. Report completion with summary of what was implemented
4. Notify if any conflicts or issues

---

**Good luck, agents! You're building something that will genuinely help a child learn and grow. 🌟**
