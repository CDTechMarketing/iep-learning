# Agent 2: Phonics Pattern Detective - Implementation Prompt

**Agent**: Phonics Pattern Detective
**Priority**: HIGH
**Estimated Time**: 50-70 hours
**Virginia SOL**: K.5, 1.5, 2.5
**IEP Focus**: Decoding, phonological awareness, reading fluency
**Branch**: `claude/agent-2-prompt-01JnGHCBV8yZCnBH2qps1JFZ`

---

## 🎯 Mission Statement

Build a comprehensive phonics learning system that teaches systematic phonics patterns through explicit instruction, multi-sensory engagement, and adaptive practice. This agent will help students develop strong decoding skills through 8 progressive phonics levels, from basic letter sounds to advanced patterns.

---

## 📋 Complete Specification Reference

The full specification is available in:
- **WAVE_1_AGENT_PROMPTS.md** (lines 195-348)
- **WAVE_1_IMPLEMENTATION_TRACKING.md** (lines 277-315)

This document provides an actionable implementation roadmap.

---

## 🏗️ Implementation Phases Overview

### Phase 1: Data Architecture & Progression (10-12 hours)
**Goal**: Establish the phonics pattern database, activity structure, and progression logic

**Deliverables**:
- [ ] TypeScript interfaces in `src/types.ts`
- [ ] Dexie database tables in `src/db.ts`
- [ ] Phonics progression mapping (8 levels)
- [ ] Seed data for initial patterns

### Phase 2: Core Activities (20-25 hours)
**Goal**: Build the interactive learning activities that form the heart of phonics instruction

**Deliverables**:
- [ ] Sound isolation games
- [ ] Blending practice component
- [ ] Segmenting activities
- [ ] Word building interface with digital letter tiles

### Phase 3: Decodable Texts (10-15 hours)
**Goal**: Create a text reading system with built-in fluency tracking

**Deliverables**:
- [ ] Text reader component
- [ ] Fluency tracking system
- [ ] Comprehension questions for texts
- [ ] 3-5 sample decodable texts

### Phase 4: Visual & Audio Support (8-10 hours)
**Goal**: Add multi-sensory elements for accessibility and engagement

**Deliverables**:
- [ ] Audio recordings for all phonics sounds
- [ ] Visual cue images (letter-keyword-picture associations)
- [ ] Animation and transitions
- [ ] Color coding system for different sound types

### Phase 5: Mastery & Progress Tracking (7-10 hours)
**Goal**: Implement adaptive difficulty and progress monitoring

**Deliverables**:
- [ ] Mastery tracking system (80% threshold)
- [ ] Adaptive difficulty algorithm
- [ ] Progress dashboard
- [ ] Parent report generation

### Phase 6: Polish & Integration (5-8 hours)
**Goal**: Refine, test, and integrate with the platform

**Deliverables**:
- [ ] User testing with sample scenarios
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Bug fixes and refinements
- [ ] Home screen integration
- [ ] Documentation completion

---

## 📊 Data Architecture Deep Dive

### Required TypeScript Interfaces

Add to `src/types.ts`:

```typescript
// Phonics Pattern Definition
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

// Activity Structure
interface PhonicsActivity {
  id: string;
  patternId: string;
  type: 'sound-isolation' | 'blending' | 'segmenting' | 'word-building' | 'sorting' | 'decodable-text';
  prompt: string;
  correctAnswer: string | string[];
  distractors?: string[]; // For multiple choice
  scaffoldLevel: 'high' | 'medium' | 'low'; // Amount of support
}

// Student Attempt Tracking
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

// Progress Tracking
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

### Database Schema

Add to `src/db.ts`:

```typescript
// Add to database version increment
phonicsPatterns: '++id, name, category, level',
phonicsActivities: '++id, patternId, type',
phonicsAttempts: '++id, studentId, activityId, patternId, timestamp',
phonicsProgress: '++id, [studentId+patternId], studentId, status'
```

---

## 🎨 Component Architecture

### Component Hierarchy

```
PhonicsPatternPractice.tsx (Main Container)
├── PatternSelector.tsx
├── SoundIsolationGame.tsx
│   ├── AudioPlayer.tsx
│   └── MultipleChoice.tsx
├── BlendingPractice.tsx
│   ├── LetterTiles.tsx
│   ├── BlendingArrow.tsx
│   └── AudioPlayer.tsx
├── SegmentingActivity.tsx
│   ├── SoundBoxes.tsx (Elkonin boxes)
│   └── TokenMover.tsx
├── WordBuilder.tsx
│   ├── LetterTileBank.tsx
│   ├── BuildingArea.tsx
│   └── FeedbackDisplay.tsx
├── PatternSorting.tsx
│   ├── DragDropZone.tsx
│   └── CategoryBucket.tsx
├── DecodableTextReader.tsx
│   ├── TextDisplay.tsx
│   ├── WordHighlighter.tsx
│   └── ComprehensionQuiz.tsx
└── PhonicsProgress.tsx
    ├── PatternMastery.tsx
    ├── AccuracyChart.tsx
    └── RecommendedFocus.tsx
```

### Key Components to Build

#### 1. **SoundIsolationGame.tsx**
**Purpose**: Help students identify beginning, middle, and ending sounds in words

**Features**:
- Audio playback of target word
- Visual representation (image of word)
- Multiple choice sound options
- Three difficulty levels: beginning → ending → middle
- Immediate feedback with animations

**Example Interaction**:
```
🔊 [Play: "cat"]
🖼️ [Image of cat]
❓ "What sound does 'cat' start with?"
[c] [t] [d] [m]  // clickable options
```

#### 2. **BlendingPractice.tsx**
**Purpose**: Teach students to blend individual sounds into words

**Features**:
- Display individual phonemes: c-a-t
- Visual blending arrows showing left-to-right progression
- Slow/fast blending audio options
- Student attempts blending, gets feedback
- Progressive revelation (sound by sound)

**Example Interaction**:
```
Show: c → a → t
Audio: /c/ ... /a/ ... /t/ → "cat"
Student clicks to hear slow/fast versions
```

#### 3. **SegmentingActivity.tsx**
**Purpose**: Break spoken words into individual sounds (opposite of blending)

**Features**:
- Elkonin sound boxes (3-4 boxes)
- Tokens to move into boxes (one per sound)
- Audio playback of target word
- Visual feedback when correct

**Example Interaction**:
```
🔊 [Play: "cat"]
[_] [_] [_]  // empty sound boxes
🪙🪙🪙  // tokens to drag
Student drags 3 tokens (one per sound)
Result: [c] [a] [t] ✓
```

#### 4. **WordBuilder.tsx**
**Purpose**: Interactive word construction with letter tiles

**Features**:
- Digital letter tile bank (draggable letters)
- Building area (drop zone)
- Real vs. nonsense word detection
- Word family practice (change one letter)
- Audio pronunciation of created words

**Example Interaction**:
```
Letter Bank: [c] [a] [t] [b] [m] [r]
Building Area: [_][_][_]
Challenge: "Make the word 'cat'"
Student drags: [c][a][t]
🔊 Plays "cat" + ✓ feedback
Next: "Change one letter to make 'bat'"
```

#### 5. **DecodableTextReader.tsx**
**Purpose**: Practice reading connected text with target phonics patterns

**Features**:
- Age-appropriate mini-stories (3-5 sentences)
- Highlighted target words containing focus patterns
- Click-to-hear individual words
- Fluency timer (optional)
- Comprehension questions (2-3 per text)

**Example Text** (CVC focus):
```
"The cat sat on a mat.
The cat had a nap.
A rat ran to the mat.
The cat saw the rat and got up."

Target words: cat, sat, mat, had, nap, rat, ran, got
Comprehension: "Where did the cat sit?"
```

---

## 🎯 Phonics Progression Map

### Level 1: Letter Sounds (26 letters)
**Goal**: Master individual letter-sound correspondences

**Patterns to Include**:
- All 26 letters with their primary sounds
- Focus on most common sound for each letter
- Special attention to vowels (a, e, i, o, u)

**Sample Activities**:
- Letter identification
- Sound matching
- Picture-sound associations (A-apple, B-ball)

**Seed Data** (example):
```typescript
{
  id: 'ls-a',
  name: 'Letter A',
  category: 'letter-sounds',
  level: 1,
  examples: ['ant', 'apple', 'alligator'],
  visualCue: '/images/phonics/apple.png',
  audioUrl: '/audio/phonics/letter-a.mp3',
  teachingTip: 'The letter A says /a/ as in apple. Focus on the short vowel sound.'
}
```

### Level 2: CVC Words (Consonant-Vowel-Consonant)
**Goal**: Blend three-sound words

**Patterns**:
- Short a: cat, bat, mat, sat, hat
- Short e: bed, red, pet, wet, ten
- Short i: sit, bit, hit, kid, big
- Short o: dog, hot, pot, lot, top
- Short u: bug, cup, run, sun, fun

**Sample Activities**:
- Sound isolation in CVC words
- Blending practice (c-a-t → cat)
- Segmenting practice (cat → c-a-t)
- Word families (-at, -an, -et, -ig, -ot, -un)

### Level 3: Digraphs
**Goal**: Learn two letters that make one sound

**Patterns**:
- ch: chip, chop, chat, much, lunch
- sh: ship, shop, fish, wish, dash
- th (voiced): this, that, them, then
- th (unvoiced): think, thank, path, math
- wh: when, what, where, which, why
- ph: phone, photo, graph (advanced)

### Level 4: Blends
**Goal**: Two or more consonants that each keep their sound

**Beginning Blends**:
- L-blends: bl, cl, fl, gl, pl, sl
- R-blends: br, cr, dr, fr, gr, pr, tr
- S-blends: sc, sk, sm, sn, sp, st, sw

**Ending Blends**:
- -nd: band, sand, hand, pond
- -nt: ant, went, sent, tent
- -st: fast, last, best, rest
- -lt: melt, felt, belt
- -mp: jump, camp, lamp, bump

### Level 5: Long Vowel Patterns
**Goal**: Vowels that "say their name"

**CVCe (Magic E)**:
- Long a: cake, make, lake, tape, game
- Long i: bike, like, hide, time, five
- Long o: hope, rope, home, bone, rose
- Long u: cube, tube, cute, huge, use

**Vowel Teams**:
- ai/ay: rain, wait, play, day, may
- ea/ee: each, read, see, tree, need
- oa/ow: boat, road, show, grow, snow
- igh/ie: high, night, pie, tie

### Level 6: R-Controlled Vowels
**Goal**: Vowels changed by the letter R

**Patterns**:
- ar: car, far, star, park, barn
- er: her, fern, clerk, verb
- ir: bird, girl, first, shirt, stir
- or: for, corn, horn, short, storm
- ur: fur, burn, turn, hurt, nurse

### Level 7: Diphthongs
**Goal**: Two vowel sounds gliding together

**Patterns**:
- oi/oy: coin, oil, join, boy, toy, joy
- ou/ow: out, loud, house, now, cow, how
- au/aw: cause, auto, law, saw, paw

### Level 8: Advanced Patterns
**Goal**: Complex patterns and exceptions

**Patterns**:
- Silent letters: knight, write, lamb, listen
- Soft c: city, cent, circus, race
- Soft g: gem, giant, giraffe, age
- -tion: action, station, vacation
- -le endings: table, apple, little, purple

---

## 🧠 Adaptive Learning Algorithm

### Mastery Criteria
- **80% accuracy** over last 10 attempts for the pattern
- Minimum 10 attempts required before mastery evaluation
- Must demonstrate success across multiple activity types

### Progression Logic

```typescript
function determineNextPattern(studentProgress: PhonicsProgress[]): string {
  // 1. Check for patterns in "learning" status
  const learningPatterns = studentProgress.filter(p => p.status === 'learning');

  // 2. If accuracy < 60%, provide intervention (more scaffolding)
  const needsHelp = learningPatterns.filter(p => p.accuracy < 60);
  if (needsHelp.length > 0) {
    return needsHelp[0].patternId; // Focus on struggling pattern
  }

  // 3. If 60-79% accuracy, continue practice at current level
  const practicing = learningPatterns.filter(p => p.accuracy >= 60 && p.accuracy < 80);
  if (practicing.length > 0) {
    return practicing[0].patternId;
  }

  // 4. If 80%+ accuracy with 10+ attempts, mark as mastered
  const readyForMastery = learningPatterns.filter(p =>
    p.accuracy >= 80 && p.attemptsCount >= 10
  );
  if (readyForMastery.length > 0) {
    markAsMastered(readyForMastery[0]);
  }

  // 5. Introduce next pattern in sequence
  return getNextPatternInProgression(studentProgress);
}
```

### Scaffolding Levels

**High Scaffolding** (for struggling students):
- Audio support always available
- Visual cues prominent
- Multiple choice with 2-3 options (not 4)
- Slower pacing
- More repetition

**Medium Scaffolding** (standard):
- Audio support on request
- Visual cues available but not automatic
- Multiple choice with 3-4 options
- Standard pacing

**Low Scaffolding** (for advanced students):
- Minimal audio support
- Fewer visual cues
- Open-ended responses when possible
- Faster pacing
- More challenging activities

---

## 🎮 Sample Content Library

### Sound Isolation Activities (20 examples per level)

**Beginning Sound - CVC Level**:
```typescript
{
  id: 'si-cvc-001',
  patternId: 'cvc-short-a',
  type: 'sound-isolation',
  prompt: 'What sound does this word start with?',
  correctAnswer: '/c/',
  distractors: ['/t/', '/m/', '/b/'],
  scaffoldLevel: 'medium',
  word: 'cat',
  imageUrl: '/images/words/cat.png',
  audioUrl: '/audio/words/cat.mp3'
}
```

### Blending Activities (15 examples per level)

**CVC Blending**:
```typescript
{
  id: 'blend-cvc-001',
  patternId: 'cvc-short-a',
  type: 'blending',
  prompt: 'Put these sounds together: /c/ /a/ /t/',
  correctAnswer: 'cat',
  phonemes: ['/c/', '/a/', '/t/'],
  audioSlowUrl: '/audio/blending/cat-slow.mp3',
  audioFastUrl: '/audio/blending/cat-fast.mp3',
  scaffoldLevel: 'medium'
}
```

### Decodable Texts (3-5 texts per level)

**CVC Focus Text**:
```typescript
{
  id: 'text-cvc-001',
  title: 'The Cat and the Rat',
  level: 2,
  patternIds: ['cvc-short-a', 'cvc-short-e'],
  text: `The cat sat on a mat.
The cat had a nap.
A rat ran to the mat.
The cat saw the rat and got up.
The rat ran away fast!`,
  targetWords: ['cat', 'sat', 'mat', 'had', 'nap', 'rat', 'ran', 'saw', 'got'],
  comprehensionQuestions: [
    {
      question: 'Where did the cat sit?',
      correctAnswer: 'on a mat',
      options: ['on a mat', 'on a bed', 'on a chair', 'on the floor']
    },
    {
      question: 'What did the rat do?',
      correctAnswer: 'ran away',
      options: ['ran away', 'sat down', 'went to sleep', 'played with the cat']
    }
  ]
}
```

---

## 🎨 Visual Design Guidelines

### Color Coding System

**By Phonics Type**:
- Letter sounds: Blue (#3B82F6)
- CVC words: Green (#10B981)
- Digraphs: Purple (#8B5CF6)
- Blends: Orange (#F59E0B)
- Long vowels: Pink (#EC4899)
- R-controlled: Red (#EF4444)
- Diphthongs: Teal (#14B8A6)
- Advanced: Indigo (#6366F1)

**By Interaction Type**:
- Correct: Green border/background (#10B981)
- Incorrect: Red border/background (#EF4444)
- In-progress: Yellow border/background (#FBBF24)
- Hint available: Blue icon (#3B82F6)

### Animation Guidelines

**Feedback Animations**:
- Correct answer: Bounce + sparkle effect (300ms)
- Incorrect answer: Shake (200ms) + color flash
- Hint reveal: Fade in (400ms)
- Progress update: Slide in from right (500ms)

**Blending Animation**:
- Letters slide together (800ms)
- Arrow draws from left to right (600ms)
- Combined word pulses (200ms)

---

## 🔊 Audio Asset Requirements

### Recording Specifications
- Format: MP3, 192kbps
- Volume: Normalized to -3dB
- Background: Silent/minimal noise
- Voice: Clear, friendly, child-appropriate

### Audio Library Needed

**Individual Letter Sounds** (26 files):
- `/audio/phonics/letter-a.mp3` through `letter-z.mp3`

**Phoneme Sounds** (44 files - all English phonemes):
- `/audio/phonemes/ah.mp3` (short a)
- `/audio/phonemes/ay.mp3` (long a)
- `/audio/phonemes/ch.mp3` (digraph ch)
- ... (all 44 English phonemes)

**Example Words** (100+ files):
- `/audio/words/cat.mp3`
- `/audio/words/dog.mp3`
- ... (organized by pattern)

**Blending Examples** (50+ files):
- `/audio/blending/cat-slow.mp3` (c...a...t)
- `/audio/blending/cat-fast.mp3` (cat)
- ... (slow and fast versions)

**Decodable Texts** (10-15 files):
- `/audio/texts/cat-and-rat.mp3`
- ... (full text read-aloud)

---

## ✅ Integration Checklist

### Code Files to Modify/Create

#### Modify Existing Files:
- [ ] `src/types.ts` - Add phonics interfaces
- [ ] `src/db.ts` - Add phonics tables
- [ ] `src/App.tsx` - Add phonics route
- [ ] `src/components/Home.tsx` - Add "Phonics Detective" button
- [ ] `src/store.ts` - Add phonics view state

#### Create New Files:
- [ ] `src/components/PhonicsPatternPractice.tsx`
- [ ] `src/components/phonics/SoundIsolationGame.tsx`
- [ ] `src/components/phonics/BlendingPractice.tsx`
- [ ] `src/components/phonics/SegmentingActivity.tsx`
- [ ] `src/components/phonics/WordBuilder.tsx`
- [ ] `src/components/phonics/PatternSorting.tsx`
- [ ] `src/components/phonics/DecodableTextReader.tsx`
- [ ] `src/components/phonics/PhonicsProgress.tsx`
- [ ] `src/utils/phonicsEngine.ts`
- [ ] `src/utils/phonicsProgressionMap.ts`
- [ ] `src/data/phonicsPatterns.ts` (seed data)
- [ ] `src/data/phonicsActivities.ts` (seed data)
- [ ] `PHONICS_CONTENT_GUIDE.md` (documentation)

### Navigation Integration

**Add to Home.tsx**:
```typescript
<button
  onClick={() => setView('phonics')}
  className="card bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
>
  <BookOpen className="w-8 h-8 mb-2" />
  <h3 className="text-xl font-bold">Phonics Detective 🔍</h3>
  <p className="text-sm opacity-90">
    Crack the reading code! Practice letter sounds, blending, and phonics patterns.
  </p>
  {phonicsProgress && (
    <div className="mt-2 text-sm">
      <span className="font-semibold">{phonicsProgress.mastered}</span> patterns mastered
    </div>
  )}
</button>
```

**Add to App.tsx**:
```typescript
{view === 'phonics' && <PhonicsPatternPractice />}
```

---

## 📈 Success Metrics

### Student Learning Outcomes
- [ ] 80%+ of students show measurable progress in decoding
- [ ] Average of 2 new phonics patterns mastered per week
- [ ] Fluency improvement in decodable text reading
- [ ] 85%+ accuracy on phonics pattern assessments

### Engagement Metrics
- [ ] 15+ minutes average session length
- [ ] 3+ activities completed per session
- [ ] Return rate: 70%+ of students use weekly

### Technical Metrics
- [ ] All interactions respond within 200ms
- [ ] Audio loads and plays within 500ms
- [ ] Zero accessibility violations (WCAG 2.1 AA)
- [ ] Works on tablet and desktop

---

## 🧪 Testing Scenarios

### Scenario 1: New Student - Letter Sounds
1. Student launches Phonics Detective
2. System assesses: no prior progress
3. Presents Level 1: Letter A
4. Student completes sound isolation activity
5. System tracks attempt and accuracy
6. Provides immediate feedback
7. Progresses to next letter

**Expected**: Smooth progression through alphabet, 80% accuracy to advance

### Scenario 2: Struggling with CVC Words
1. Student at Level 2 (CVC)
2. Accuracy drops to 50% on blending
3. System detects struggle
4. Increases scaffolding level to "high"
5. Provides additional visual cues
6. Offers more audio support
7. Simplifies word choices

**Expected**: Accuracy improves to 70%+ with scaffolding

### Scenario 3: Advanced Student - Skip Ahead
1. Student masters Level 1 quickly (95% accuracy)
2. System evaluates: ready for acceleration
3. Offers Level 2 assessment
4. Student passes with 90%
5. Jumps to Level 3 (digraphs)

**Expected**: Adaptive system allows advancement without boredom

---

## 📚 Documentation Requirements

### Create PHONICS_CONTENT_GUIDE.md

**Contents**:
1. **Overview**: What is Phonics Detective?
2. **For Teachers**:
   - How to use the system
   - Understanding the progression
   - Interpreting student data
   - Classroom integration tips
3. **For Parents**:
   - Supporting phonics at home
   - Understanding progress reports
   - Practice activities offline
4. **For Developers**:
   - System architecture
   - Adding new patterns
   - Creating activities
   - Audio asset guidelines
5. **Virginia SOL Alignment**:
   - K.5, 1.5, 2.5 standard mapping
   - Assessment correlation

---

## 🚀 Implementation Sequence

### Week 1: Foundation (Day 1-5)
**Days 1-2**: Data architecture
- Define all TypeScript interfaces
- Set up database tables
- Create phonics progression map

**Days 3-4**: Seed data
- Create 26 letter sound patterns
- Create 50 CVC words
- Write 5 example activities per level

**Day 5**: Basic UI scaffolding
- Main PhonicsPatternPractice component
- Navigation integration
- Basic layout and routing

### Week 2: Core Activities (Day 6-12)
**Days 6-7**: Sound Isolation Game
- Multiple choice interface
- Audio integration
- Feedback system

**Days 8-9**: Blending Practice
- Letter tile display
- Blending animation
- Slow/fast audio playback

**Days 10-11**: Segmenting Activity
- Elkonin boxes UI
- Token drag-and-drop
- Validation logic

**Day 12**: Word Builder
- Letter tile bank
- Building area
- Word validation

### Week 3: Reading & Progress (Day 13-18)
**Days 13-14**: Pattern Sorting
- Drag-and-drop categories
- Real vs. nonsense word detection
- Immediate feedback

**Days 15-16**: Decodable Text Reader
- Text display with highlighting
- Word-by-word audio
- Comprehension questions

**Days 17-18**: Progress Dashboard
- Pattern mastery display
- Accuracy charts
- Recommended focus areas

### Week 4: Enhancement & Polish (Day 19-25)
**Days 19-20**: Audio & Visual Assets
- Record/source audio files
- Create visual cues
- Implement animations

**Days 21-22**: Adaptive Algorithm
- Implement progression logic
- Scaffolding levels
- Mastery detection

**Days 23-24**: Testing & Accessibility
- User testing
- Accessibility audit
- Bug fixes

**Day 25**: Documentation
- Complete content guide
- Add code comments
- Create teacher/parent guides

### Week 5: Final Integration (Day 26-28)
**Days 26-27**: Integration
- Final Home screen polish
- Parent dashboard connection
- Points/rewards integration

**Day 28**: Review & Deploy
- Final testing
- Update tracking document
- Commit and push
- Create pull request

---

## 💡 Tips for Success

### 1. **Start with Letter Sounds**
The foundation of phonics. Get this right, and everything else flows naturally.

### 2. **Use Real Phonics Research**
Reference Orton-Gillingham, Wilson Reading System, and Science of Reading best practices.

### 3. **Multi-Sensory is Key**
IEP students benefit hugely from:
- Visual (seeing letters/words)
- Auditory (hearing sounds)
- Kinesthetic (dragging tiles, tapping)
- Tactile (future: could add real tracing)

### 4. **Immediate Feedback**
Don't make students wait. Instant feedback keeps engagement high.

### 5. **Celebrate Small Wins**
Every pattern mastered deserves celebration. Use animations, sounds, points.

### 6. **Consistency with Existing Agents**
Review Agent 5 (Reading Comprehension) and Agent 6 (Math) for:
- UI patterns
- Progress tracking
- Adaptive difficulty
- Parent dashboard integration

### 7. **Accessibility First**
- Keyboard navigation
- Screen reader support
- Color contrast
- Font size options
- Audio alternatives for all visual content

---

## 📞 Questions or Blockers?

If you encounter challenges:

### Technical Questions
- Review existing agent implementations (5, 6, 7)
- Check the integration checklist
- Refer to TypeScript/React documentation

### Content Questions
- Consult Virginia SOL standards (K.5, 1.5, 2.5)
- Reference phonics scope and sequence
- Review Science of Reading literature

### Design Questions
- Follow UDL guidelines
- Maintain WCAG 2.1 AA standards
- Keep IEP accommodations in mind

---

## ✅ Final Checklist Before Completion

### Functionality
- [ ] All 8 phonics levels represented
- [ ] All 5 activity types functional
- [ ] Audio plays correctly
- [ ] Progress saves and persists
- [ ] Adaptive difficulty works
- [ ] Decodable texts load and track fluency

### Data
- [ ] At least 50 phonics patterns in database
- [ ] At least 100 activities created
- [ ] Seed data imports correctly
- [ ] Progress tracking accurate

### UI/UX
- [ ] Responsive design (tablet + desktop)
- [ ] Animations smooth (60fps)
- [ ] Color coding consistent
- [ ] Visual feedback immediate
- [ ] Navigation intuitive

### Integration
- [ ] Routes working in App.tsx
- [ ] Home screen button present
- [ ] Store state connected
- [ ] Parent dashboard shows phonics data

### Accessibility
- [ ] Keyboard navigation complete
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Audio alternatives provided
- [ ] Font size adjustable

### Documentation
- [ ] PHONICS_CONTENT_GUIDE.md complete
- [ ] Code comments thorough
- [ ] Teacher guide written
- [ ] Parent guide written
- [ ] Developer notes included

### Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] All edge cases handled
- [ ] Error boundaries implemented
- [ ] Loading states present

---

## 🎉 Ready to Begin!

You now have a comprehensive roadmap for implementing Agent 2: Phonics Pattern Detective. This agent will be a cornerstone of the literacy pathway, bridging the gap between letter recognition and fluent reading.

**Remember**: The goal is systematic, explicit, multi-sensory phonics instruction that adapts to each student's needs. Follow the Science of Reading, implement with care, and create something that will truly help students crack the reading code.

Good luck, and happy coding! 🚀📚

---

**Document Version**: 1.0
**Created**: November 19, 2025
**Branch**: `claude/agent-2-prompt-01JnGHCBV8yZCnBH2qps1JFZ`
**Estimated Completion**: 50-70 hours over 4-5 weeks
**Next Update**: Upon completion of Phase 1
