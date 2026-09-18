# GED-Track Implementation Roadmap

## Mission Statement

**Goal**: Provide comprehensive, IEP-adapted instruction to keep student on track for a **General Educational Development (GED) credential** rather than a certificate of completion.

**Student Profile**:
- Current grade: 3rd
- Current reading level: Kindergarten (CVC words)
- Current math level: Counting 20-39, single-digit addition
- Diagnosed needs: Autism, learning disabilities
- Ultimate goal: GED credential (requires functional literacy and numeracy)

---

## 🎯 PRIORITY MODULES (GED-Track Essentials)

This roadmap focuses on the **critical foundation skills** needed for long-term GED success, starting from the student's current level and building systematically.

---

## 📐 MATHEMATICS - Priority Modules

### Module 1: Numbers 40-60 (Place Value Foundation)

**Why This Matters for GED**: Understanding two-digit numbers is foundational for all higher math, including GED-level algebra, data analysis, and real-world problem solving.

**SOL Alignment**: 3.NS.1 (Place Value)

**Development Estimate**: 15-20 hours

#### Learning Objectives:
1. Count from 40 to 60 with one-to-one correspondence
2. Identify numbers 40-60 in isolation
3. Understand place value (4 tens and 3 ones = 43)
4. Compare numbers 40-60 using >, <, =
5. Order numbers 40-60 from least to greatest

#### Activity Types:

**1. Number Line Activities** (src/components/math/NumberLineActivity.tsx - ALREADY EXISTS)
- Extend existing component to support 40-60 range
- "Find the number 47" on a number line
- "Which number comes next?" (52, 53, ?)

**2. Ten Frame Activities** (src/components/math/TenFrameActivity.tsx - ALREADY EXISTS)
- Extend to show 4-6 complete ten frames
- Count by tens, then ones: "10, 20, 30, 40... 41, 42, 43"
- Visual representation of place value

**3. Touch Count Activities** (src/components/math/TouchCountActivity.tsx - ALREADY EXISTS)
- Count 40-60 objects by touching
- Group objects by tens for easier counting

**4. NEW: Place Value Builder**
- Interactive base-10 blocks
- Drag tens rods and ones cubes
- Build numbers 40-60
- Show expanded form (43 = 40 + 3)

**5. NEW: Number Identification Practice**
- "What number is this?" with large numerals
- Multiple choice options
- Audio support for number names

**6. NEW: Comparison Practice**
- Present two numbers (47 vs 52)
- Select correct symbol (>, <, =)
- Visual support with ten frames or number lines

#### Database Schema:

```typescript
// Extend existing MathProblem type
interface NumberSenseProblem extends MathProblem {
  type: 'number-line' | 'ten-frame' | 'touch-count' | 'place-value' | 'identification' | 'comparison' | 'ordering';
  rangeStart: number; // 40
  rangeEnd: number;   // 60

  // For place value activities
  placeValueType?: 'build' | 'identify' | 'expanded-form';

  // For comparison activities
  comparisonType?: 'greater' | 'less' | 'equal';
  number1?: number;
  number2?: number;

  // For ordering activities
  numbersToOrder?: number[];
  orderDirection?: 'ascending' | 'descending';
}
```

#### New Components Needed:

```
src/components/math/
  ├── PlaceValueBuilder.tsx (NEW - 8-12h)
  ├── NumberIdentification.tsx (NEW - 4-6h)
  ├── NumberComparison.tsx (NEW - 4-6h)
  └── NumberOrdering.tsx (NEW - 4-6h)
```

#### Seed Data Example:

```typescript
// Counting 40-60 Unit
const counting4060UnitId = 'counting-40-60-001';
const counting4060Unit: Unit = {
  id: counting4060UnitId,
  title: 'Counting 40-60',
  tags: ['counting', 'number-sense', '40-60', 'place-value'],
  goalStars: [5, 10, 15, 20],
  createdAt: new Date()
};

const counting4060Problems: MathProblem[] = [
  // Number Line (5 problems)
  { id: `${counting4060UnitId}-nl-1`, unitId: counting4060UnitId, type: 'number-line', prompt: 'Find 43', answer: 43, rangeStart: 40, rangeEnd: 60 },
  { id: `${counting4060UnitId}-nl-2`, unitId: counting4060UnitId, type: 'number-line', prompt: 'Find 56', answer: 56, rangeStart: 40, rangeEnd: 60 },

  // Ten Frame (5 problems)
  { id: `${counting4060UnitId}-tf-1`, unitId: counting4060UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 47, options: [45, 47, 49, 37] },

  // Touch Count (5 problems)
  { id: `${counting4060UnitId}-tc-1`, unitId: counting4060UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 48, manipulatives: 'stars' },

  // Place Value (5 problems)
  { id: `${counting4060UnitId}-pv-1`, unitId: counting4060UnitId, type: 'place-value', prompt: '4 tens and 5 ones equals?', answer: 45, options: [45, 54, 9, 40] },
  { id: `${counting4060UnitId}-pv-2`, unitId: counting4060UnitId, type: 'place-value', prompt: '50 + 7 = ?', answer: 57, options: [57, 75, 12, 50] },

  // Identification (5 problems)
  { id: `${counting4060UnitId}-id-1`, unitId: counting4060UnitId, type: 'identification', prompt: '52', answer: 52, options: [52, 25, 50, 55] },

  // Comparison (5 problems)
  { id: `${counting4060UnitId}-cmp-1`, unitId: counting4060UnitId, type: 'comparison', prompt: '47 ___ 52', answer: 0, options: ['<', '>', '='], correctSymbol: '<', number1: 47, number2: 52 },
];
```

#### GED Connection:
- GED Math requires working with multi-digit numbers
- Place value understanding is essential for decimals, percentages
- Two-digit numbers appear in real-world contexts (money, measurements, data)

---

### Module 2: Basic Fractions

**Why This Matters for GED**: Fractions are heavily tested on GED Math (ratios, percentages, measurement, data interpretation). Early mastery is critical.

**SOL Alignment**: 3.NS.3 (Fractions)

**Development Estimate**: 25-35 hours

#### Learning Objectives:
1. Recognize and name fractions: 1/2, 1/3, 1/4, 1/5, 1/6, 1/8, 1/10
2. Identify fractions from visual models (circles, rectangles, sets)
3. Compare unit fractions (1/2 vs 1/4)
4. Understand fractions as parts of a whole
5. Match fractions to real-world examples (pizza slices, cookies)

#### Activity Types:

**1. Fraction Introduction (Visual Models)**
- Circles divided into parts (pizza model)
- Rectangles divided into parts (chocolate bar model)
- Sets of objects (4 apples, 1 red → 1/4)
- Color the fraction activities
- Tap/select the fraction activities

**2. Fraction Identification**
- "What fraction is shaded?" with multiple choice
- Visual: 1 out of 2 parts shaded → 1/2
- Support with audio: "one half", "one quarter"

**3. Fraction Matching**
- Match fraction symbol to visual
- Match fraction word to visual
- Match equivalent representations

**4. Fraction Comparison (Unit Fractions Only)**
- Compare 1/2 vs 1/4 visually
- "Which is more?" with side-by-side circles
- Concrete understanding that 1/2 > 1/4

**5. Real-World Fractions**
- Pizza slices (1/2, 1/4, 1/8)
- Cookies (1/2, 1/3, 1/4)
- Shapes (1/2, 1/3, 1/4)

#### Visual Design Philosophy:
- **Concrete → Pictorial → Abstract** progression
- Start with real images (pizza photo)
- Move to pictorial representations (drawn circles)
- Eventually introduce symbols (1/2, 1/4)
- Heavy use of color (shaded vs unshaded)

#### Database Schema:

```typescript
interface FractionProblem extends MathProblem {
  type: 'fraction-identification' | 'fraction-comparison' | 'fraction-matching' | 'fraction-real-world';

  // Fraction data
  numerator: number;
  denominator: number; // Limited to: 2, 3, 4, 5, 6, 8, 10

  // Visual representation
  visualType: 'circle' | 'rectangle' | 'bar' | 'set' | 'real-world';
  visualData?: {
    totalParts: number;
    shadedParts: number;
    colorShaded: string;
    colorUnshaded: string;
  };

  // For comparison activities
  fraction2?: {
    numerator: number;
    denominator: number;
  };

  // For real-world activities
  realWorldContext?: 'pizza' | 'cookies' | 'shapes' | 'fruit';
}
```

#### New Components:

```
src/components/math/fractions/
  ├── FractionIntro.tsx (NEW - 6-8h)
  ├── FractionCircleVisual.tsx (NEW - 4-6h)
  ├── FractionRectangleVisual.tsx (NEW - 4-6h)
  ├── FractionIdentification.tsx (NEW - 6-8h)
  ├── FractionComparison.tsx (NEW - 6-8h)
  └── FractionRealWorld.tsx (NEW - 8-10h)
```

#### Sample Unit Structure:

**Unit 1: Introduction to Halves (1/2)**
- What is one half?
- Visual circle models
- Real-world: pizza cut in half
- Identify 1/2 in different shapes
- 5-7 activities, earn 10 stars

**Unit 2: Introduction to Fourths (1/4)**
- What is one fourth?
- Visual models
- Compare 1/2 vs 1/4 (which is bigger?)
- Real-world: 4 friends share a pizza
- 5-7 activities, earn 10 stars

**Unit 3: Thirds and Beyond (1/3, 1/5, 1/6)**
- Similar progression
- Focus on visual recognition
- Less emphasis on comparison at this stage

#### GED Connection:
- GED Math has extensive fraction questions (operations, word problems)
- Percentages are fractions (50% = 1/2)
- Measurement uses fractions (1/4 cup, 1/2 inch)
- Data interpretation uses fractions (1/3 of respondents)

---

### Module 3: Basic Multiplication & Division

**Why This Matters for GED**: Multiplication is foundational for algebra, geometry, data analysis, and all higher math on the GED.

**SOL Alignment**: 3.CE.2 (Multiplication and Division Facts)

**Development Estimate**: 40-50 hours

#### Learning Objectives:
1. Understand multiplication as repeated addition
2. Understand multiplication as equal groups
3. Skip count by 2s, 5s, 10s (foundation for times tables)
4. Know multiplication facts for 0s, 1s, 2s, 5s, 10s
5. Understand division as sharing equally
6. Understand division as repeated subtraction
7. Recognize relationship between multiplication and division

#### Progression Strategy:

**Phase 1: Conceptual Foundation (10-12h)**
- What is multiplication? (3 groups of 4 = 12)
- Arrays (visual rows and columns)
- Skip counting songs/patterns
- Repeated addition (2+2+2+2 = 8 = 4×2)

**Phase 2: Easier Facts (15-18h)**
- 0s and 1s (special rules)
- 2s (doubling, skip count by 2)
- 5s (clock pattern, skip count by 5)
- 10s (easiest pattern, add zero)

**Phase 3: Division Introduction (15-20h)**
- Sharing equally (12 cookies, 4 friends = 3 each)
- Grouping (12 cookies, groups of 3 = 4 groups)
- Relationship to multiplication (if 3×4=12, then 12÷4=3)
- Division facts for 2s, 5s, 10s

#### Activity Types:

**1. Skip Counting Practice**
- Number line hopping (by 2s, 5s, 10s)
- Fill in the missing numbers (2, 4, 6, __, 10)
- Audio-supported counting
- Visual animations

**2. Equal Groups (Concrete)**
- Show 3 plates, 4 cookies on each
- "How many cookies in all?"
- Touch-and-count support
- Transition to multiplication notation

**3. Array Activities**
- Visual grid/array
- "3 rows of 4 = ?"
- Interactive: build your own array
- Connect to multiplication

**4. Multiplication Fact Practice**
- Traditional flashcard style
- Multiple choice answers
- Visual supports (arrays, groups)
- Immediate feedback

**5. Word Problems (Contextual)**
- Simple real-world scenarios
- "You have 5 bags with 2 apples in each. How many apples?"
- Visual supports
- Multiple choice

**6. Division as Sharing**
- "12 cookies, 4 friends, how many each?"
- Drag cookies to plates
- Interactive sharing
- Connect to division notation

**7. Division as Grouping**
- "12 cookies, groups of 3, how many groups?"
- Circle groups of objects
- Count the groups
- Connect to division

#### Database Schema:

```typescript
interface MultiplicationProblem extends MathProblem {
  type: 'skip-count' | 'equal-groups' | 'array' | 'multiplication-fact' | 'multiplication-word-problem';

  // For multiplication
  multiplicand: number; // The number being multiplied (3 in 3×4)
  multiplier: number;   // The number of times (4 in 3×4)
  product: number;      // The answer (12 in 3×4)

  // Visual strategy
  visualStrategy: 'groups' | 'array' | 'number-line' | 'repeated-addition';

  // For skip counting
  skipCountBy?: number; // 2, 5, or 10
  sequence?: number[];  // [2, 4, 6, ?, 10]
  missingIndex?: number;

  // For word problems
  context?: string;
  scenario?: 'bags-of-items' | 'plates-of-food' | 'rows-of-objects';
}

interface DivisionProblem extends MathProblem {
  type: 'sharing' | 'grouping' | 'division-fact' | 'division-word-problem';

  // For division
  dividend: number;  // The total (12 in 12÷4)
  divisor: number;   // What to divide by (4 in 12÷4)
  quotient: number;  // The answer (3 in 12÷4)

  // Division model
  divisionModel: 'sharing' | 'grouping' | 'repeated-subtraction';

  // Related multiplication fact
  relatedMultiplication?: {
    multiplicand: number;
    multiplier: number;
  };

  // For word problems
  context?: string;
  scenario?: 'sharing-equally' | 'making-groups';
}
```

#### New Components:

```
src/components/math/multiplication/
  ├── SkipCountingPractice.tsx (NEW - 6-8h)
  ├── EqualGroupsActivity.tsx (NEW - 8-10h)
  ├── ArrayBuilder.tsx (NEW - 8-10h)
  ├── MultiplicationFactPractice.tsx (NEW - 6-8h)
  ├── MultiplicationWordProblem.tsx (NEW - 8-10h)

src/components/math/division/
  ├── SharingActivity.tsx (NEW - 8-10h)
  ├── GroupingActivity.tsx (NEW - 8-10h)
  ├── DivisionFactPractice.tsx (NEW - 6-8h)
  └── DivisionWordProblem.tsx (NEW - 6-8h)
```

#### Sample Unit Structure:

**Unit 1: Introduction to Multiplication**
- What is multiplication?
- 3 groups of 2
- Arrays: 3 rows, 2 columns
- Skip counting by 2s
- 8-10 activities

**Unit 2: Multiply by 2s**
- Doubling concept
- Skip count by 2s (2, 4, 6, 8, 10)
- Facts: 2×0 through 2×10
- Word problems
- 10-12 activities

**Unit 3: Multiply by 5s**
- Clock connection (5, 10, 15, 20...)
- Skip count by 5s
- Facts: 5×0 through 5×10
- Word problems
- 10-12 activities

**Unit 4: Multiply by 10s**
- Pattern: just add zero
- Facts: 10×0 through 10×10
- Word problems
- 8-10 activities

**Unit 5: Introduction to Division**
- Sharing equally
- 12 cookies, 4 friends
- Division notation
- 8-10 activities

**Unit 6: Division Facts (2s, 5s, 10s)**
- Related to multiplication
- If 2×5=10, then 10÷5=2
- Practice facts
- 10-12 activities

#### GED Connection:
- GED Math requires fluency with all four operations
- Algebra uses multiplication/division extensively
- Word problems rely on multiplication/division
- Ratios and proportions build on multiplication
- Essential for geometry (area, perimeter)

---

## 📖 READING - Priority Modules

### Module 4: Vowel Teams

**Why This Matters for GED**: Vowel teams appear in thousands of English words. Inability to decode them severely limits reading comprehension and GED test-taking ability.

**SOL Alignment**: 3.FFR.3.A (Vowel Teams and R-Controlled Vowels)

**Development Estimate**: 20-25 hours

#### Learning Objectives:
1. Decode words with long A vowel teams (ai, ay)
2. Decode words with long E vowel teams (ea, ee)
3. Decode words with long O vowel teams (oa, ow)
4. Decode words with long I vowel teams (ie, igh)
5. Read simple sentences using vowel team words
6. Distinguish between vowel teams and single vowels

#### Progression Strategy:

**Phase 1: Long A Vowel Teams (ai, ay)**
- Introduction: "Two vowels go walking, the first one does the talking"
- AI words: rain, train, tail, mail, sail, pain, main, chain
- AY words: play, stay, day, may, way, say, pay, hay
- Rule: AI in middle of words, AY at end
- Simple sentences: "The train is in the rain."

**Phase 2: Long E Vowel Teams (ea, ee)**
- EA words: eat, meat, seat, read, bead, team, bean, sea
- EE words: see, tree, bee, fee, seed, need, feet, meet
- Simple sentences: "I see a bee in the tree."

**Phase 3: Long O Vowel Teams (oa, ow)**
- OA words: boat, coat, road, toad, goat, soap, loaf
- OW words: snow, grow, slow, show, blow, glow, flow
- Note: OW can also make /ow/ sound (cow) - teach separately
- Simple sentences: "The boat is on the road."

**Phase 4: Long I Vowel Teams (ie, igh)**
- IE words: pie, tie, die, lie (limited set)
- IGH words: high, light, night, right, sight, fight, might, bright
- Simple sentences: "I see the light at night."

#### Activity Types:

**1. Sound Introduction**
- Present vowel team (AI)
- Audio: "AI says /ā/ as in rain"
- Visual: Picture of rain
- Repeat sound

**2. Word Building**
- Start with word family: -ain
- Build: rain, main, pain, train, chain
- Audio support for each word
- Student reads word

**3. Word Sorting**
- Present mixed words (CVC vs vowel team)
- "Is this word CAT or RAIN?"
- Sort into categories
- Reinforces pattern recognition

**4. Sentence Reading**
- Progressive sentences (like current CVC model)
- Line 1: "rain"
- Line 2: "rain is"
- Line 3: "rain is on"
- Line 4: "rain is on the train"
- Star reward for completion

**5. Decodable Readers**
- Short passages (20-30 words)
- Heavy use of target vowel team
- Comprehension check (1-2 multiple choice)
- Example: "The Rain" - story using AI words

#### Database Schema:

```typescript
interface VowelTeamPhrase extends Phrase {
  id: string;
  unitId: string;
  lines: string[];

  // Vowel team specific
  vowelPattern: 'ai' | 'ay' | 'ea' | 'ee' | 'oa' | 'ow' | 'ie' | 'igh';
  targetWords: string[]; // Words featuring the vowel team

  // Difficulty
  hasSightWords: boolean;
  hasMixedPatterns: boolean; // Contains other vowel teams or CVC
}

interface DecodableReader {
  id: string;
  unitId: string;
  title: string;
  vowelPattern: string;
  wordCount: number;
  text: string; // Full passage
  targetWordCount: number; // How many words use the vowel team

  // Optional comprehension
  comprehensionQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];

  // Optional image
  imageUrl?: string;
}
```

#### New Components:

```
src/components/reading/vowelteams/
  ├── VowelTeamIntro.tsx (NEW - 4-6h)
  ├── VowelTeamWordBuilder.tsx (NEW - 6-8h)
  ├── VowelTeamSorting.tsx (NEW - 4-6h)
  ├── VowelTeamSentences.tsx (NEW - 6-8h) - Extends ReadingPractice
  └── DecodableReaderView.tsx (NEW - 6-8h)
```

#### Sample Unit Structure:

**Unit: Long A with AI**
- Introduction to AI sound
- Build -ain words (5 words)
- Build -ail words (5 words)
- Sort AI vs short A words
- Read AI sentences (5 sentences)
- Decodable reader: "The Train in the Rain"
- 15-20 activities, 15 stars

**Unit: Long A with AY**
- Introduction to AY sound
- Build -ay words (8 words)
- Compare AI vs AY (when to use each)
- Read AY sentences (5 sentences)
- Decodable reader: "A Day to Play"
- 12-15 activities, 15 stars

*Repeat pattern for EA, EE, OA, OW, IE, IGH*

#### GED Connection:
- GED Reading requires decoding complex texts
- Vowel teams appear in 30-40% of English words
- Essential for comprehension of written passages
- Required for workplace documents, forms, instructions

---

### Module 5: R-Controlled Vowels

**Why This Matters for GED**: R-controlled vowels (ar, er, ir, or, ur) are extremely common in English. Inability to decode them creates major reading barriers.

**SOL Alignment**: 3.FFR.3.A (Vowel Teams and R-Controlled Vowels)

**Development Estimate**: 15-20 hours

#### Learning Objectives:
1. Recognize that R "controls" the vowel sound
2. Decode AR words (car, star, park)
3. Decode OR words (for, corn, horn)
4. Decode ER words (her, fern, teacher)
5. Decode IR words (bird, girl, first)
6. Decode UR words (hurt, turn, nurse)
7. Recognize that ER, IR, UR often sound the same

#### Progression Strategy:

**Phase 1: AR (Bossy R with A)**
- Sound: "AR says /ar/ as in car"
- Word families: -ar (car, jar, tar, far), -ark (park, bark, dark, shark), -art (art, cart, part, start)
- High-frequency AR words: are, arm, farm, hard, yard, card, star, barn

**Phase 2: OR (Bossy R with O)**
- Sound: "OR says /or/ as in for"
- Word families: -or (for, or), -orn (corn, horn, torn, born), -ort (short, sport, fort)
- High-frequency OR words: or, for, fork, pork, horse, store, more, shore

**Phase 3: ER, IR, UR (Same Sound!)**
- Sound: All three say /er/ as in her, bird, turn
- ER words: her, fern, germ, term, herd, verb, teacher, water
- IR words: bird, girl, dirt, first, third, shirt, stir, whir
- UR words: fur, turn, hurt, burn, purse, nurse, turtle, purple
- Teach spelling rules (ER most common, IR/UR in specific words)

#### Activity Types:

**1. Sound Introduction**
- "Meet Bossy R!"
- R changes the vowel sound
- Audio and visual support
- Examples: car vs cat (R changes it!)

**2. Word Building**
- Start with word family
- -ar: car, far, jar, star, tar
- Audio for each word
- Visual support (pictures)

**3. R-Controlled vs Regular Vowel Sorting**
- Show two words: "CAR" vs "CAT"
- Which has Bossy R?
- Sort into categories
- Reinforces concept

**4. Sentence Reading**
- Progressive sentences
- "The car is far."
- "The bird is on the fern."
- Heavy use of target pattern

**5. Decodable Readers**
- Short passages focused on one r-controlled pattern
- Example: "The Farm" (AR words)
- Example: "The Bird and the Girl" (IR words)

#### Database Schema:

```typescript
interface RControlledPhrase extends Phrase {
  id: string;
  unitId: string;
  lines: string[];

  // R-controlled specific
  rPattern: 'ar' | 'or' | 'er' | 'ir' | 'ur';
  targetWords: string[];

  // Difficulty
  hasMixedPatterns: boolean;
}
```

#### New Components:

```
src/components/reading/rcontrolled/
  ├── RControlledIntro.tsx (NEW - 4-5h)
  ├── RControlledWordBuilder.tsx (NEW - 5-6h)
  ├── RControlledSorting.tsx (NEW - 4-5h)
  └── RControlledSentences.tsx (NEW - 5-6h)
```

#### Sample Unit Structure:

**Unit: AR - Bossy R with A**
- Introduction to Bossy R
- Build -ar words (car, jar, far, star, tar)
- Build -ark words (park, bark, dark, shark)
- Sort AR vs short A
- Read AR sentences
- Decodable reader: "A Trip to the Farm"
- 12-15 activities, 15 stars

**Unit: OR - Bossy R with O**
- OR sound introduction
- Build -or and -orn words
- Read OR sentences
- Decodable reader: "Corn on the Farm"
- 10-12 activities, 12 stars

**Unit: ER, IR, UR - The /er/ Sound**
- All three make same sound!
- Build words with each pattern
- Spelling practice (which pattern?)
- Read mixed sentences
- Decodable reader: "The Girl and Her Purple Shirt"
- 15-18 activities, 18 stars

#### GED Connection:
- R-controlled vowels in ~25% of English words
- Essential for reading comprehension
- Appears in academic vocabulary (research, format, purpose)
- Required for workplace texts

---

### Module 6: Multi-Syllabic Words

**Why This Matters for GED**: GED reading passages use complex, multi-syllabic words. Inability to decode them halts comprehension completely.

**SOL Alignment**: 3.FFR.3.B (Syllabication and Multisyllabic Words)

**Development Estimate**: 20-25 hours

#### Learning Objectives:
1. Identify syllables in spoken words (clapping)
2. Understand that each syllable has one vowel sound
3. Divide words into syllables visually
4. Decode two-syllable words
5. Recognize syllable types (closed, open, magic E)
6. Decode compound words
7. Read three-syllable words (stretch goal)

#### Syllable Types (Simplified for Autism/LD):

**1. Closed Syllable** (consonant closes the vowel)
- Vowel is short
- Examples: nap, kit, sun
- In 2-syllable words: nap-kin, rab-bit, pic-nic

**2. Open Syllable** (ends with vowel)
- Vowel is long
- Examples: go, me, hi
- In 2-syllable words: ro-bot, ba-by, ti-ger

**3. Magic E Syllable** (VCe)
- Silent E makes vowel long
- Examples: cake, bike, home
- In 2-syllable words: cup-cake, base-ball

**4. Compound Words** (two words together)
- Easiest multi-syllabic words
- Examples: sun-shine, rain-bow, base-ball, dog-house

#### Progression Strategy:

**Phase 1: Syllable Awareness (No Reading Yet)**
- What is a syllable?
- Clap syllables in spoken words
- Count syllables (1, 2, or 3?)
- Audio support
- Visual: dots or boxes for each syllable

**Phase 2: Compound Words (Easiest Multi-Syllabic)**
- Two words you already know!
- sun + shine = sunshine
- rain + bow = rainbow
- Visual: two pictures merge into compound word
- High success rate, builds confidence

**Phase 3: Two-Syllable Words with Closed Syllables**
- Pattern: CVC-CVC
- Examples: nap-kin, bas-ket, rab-bit, kit-ten
- Divide between consonants
- Read each syllable, then blend

**Phase 4: Two-Syllable Words with Open Syllables**
- Pattern: CV-CV or V-CV
- Examples: ro-bot, ba-by, ti-ger, mu-sic
- First syllable ends with vowel (long sound)
- Read each syllable, then blend

**Phase 5: Mixed Syllable Types**
- Combine closed and open
- Examples: ti-ger (open-closed), ro-bot (open-closed)
- Magic E words: cup-cake, base-ball

**Phase 6: Three-Syllable Words (Advanced)**
- Pattern: usually 3 closed syllables
- Examples: bas-ket-ball, fan-tas-tic, to-geth-er
- Break into parts, read each, blend

#### Activity Types:

**1. Syllable Counting**
- Audio: word spoken ("robot")
- Student claps syllables
- "How many syllables?" (multiple choice: 1, 2, 3)
- Visual feedback (bouncing balls for each syllable)

**2. Compound Word Building**
- Show two pictures: sun + shine
- Drag together to make "sunshine"
- Audio: "sun...shine...sunshine!"
- Rewarding, visual

**3. Syllable Division Practice**
- Show word: "napkin"
- "Where should we divide it?"
- Tap between p and k
- Visual line appears: "nap-kin"
- Read each part

**4. Two-Syllable Word Reading**
- Show divided word: "rab-bit"
- Read first syllable (highlight "rab")
- Read second syllable (highlight "bit")
- Blend together: "rabbit"
- Picture of rabbit appears (reward)

**5. Syllable Type Sorting**
- Present words
- "Is this open or closed?"
- Sort into categories
- Reinforces syllable patterns

**6. Decodable Sentences**
- Sentences with 2-syllable words
- "The rabbit is on the napkin."
- "The robot likes music."
- Progressive difficulty

#### Database Schema:

```typescript
interface MultisyllabicWord {
  id: string;
  unitId: string;
  word: string; // "napkin"
  syllables: string[]; // ["nap", "kin"]
  syllableCount: number; // 2
  syllableTypes: ('closed' | 'open' | 'vce' | 'vowelteam' | 'r-controlled' | 'cle')[]; // ["closed", "closed"]

  // Visual support
  imageUrl?: string; // Picture of a napkin

  // Audio support
  audioUrl?: string;

  // Compound word?
  isCompound: boolean;
  compoundParts?: string[]; // ["sun", "shine"]
}

interface SyllableProblem extends MathProblem {
  type: 'syllable-count' | 'syllable-division' | 'syllable-type' | 'compound-building' | 'multisyllabic-reading';

  word: string;
  spokenAudio?: string;

  // For counting
  correctSyllableCount?: number;

  // For division
  divisionPoints?: number[]; // Indices where to divide

  // For type identification
  syllableType?: 'closed' | 'open';

  // For compound building
  compoundParts?: string[];
  compoundImages?: string[];
}
```

#### New Components:

```
src/components/reading/multisyllabic/
  ├── SyllableCounter.tsx (NEW - 6-8h)
  ├── CompoundWordBuilder.tsx (NEW - 8-10h)
  ├── SyllableDivider.tsx (NEW - 6-8h)
  ├── MultisyllabicReader.tsx (NEW - 8-10h)
  └── SyllableTypeSorter.tsx (NEW - 4-6h)
```

#### Sample Unit Structure:

**Unit 1: Introduction to Syllables**
- What is a syllable?
- Clap and count (10 words)
- Sort by syllable count
- No reading yet, just awareness
- 8-10 activities, 10 stars

**Unit 2: Compound Words**
- Two words = one word
- Build: sunshine, rainbow, baseball, doghouse, cupcake
- Read compound words
- Sentences with compound words
- 10-12 activities, 12 stars

**Unit 3: Two-Syllable Closed Words**
- CVC-CVC pattern
- Divide: nap-kin, rab-bit, bas-ket
- Read each syllable
- Blend together
- Decodable reader: "The Rabbit and the Napkin"
- 12-15 activities, 15 stars

**Unit 4: Two-Syllable Open Words**
- CV-CV pattern
- Divide: ro-bot, ba-by, ti-ger
- First syllable is open (long vowel)
- Read and blend
- Decodable reader: "The Robot Baby"
- 12-15 activities, 15 stars

**Unit 5: Mixed Two-Syllable Words**
- Combine closed and open
- Practice division
- Read a variety
- 15-18 activities, 18 stars

#### GED Connection:
- GED passages use academic vocabulary (3-4 syllables)
- Workplace documents use technical terms (multi-syllabic)
- Inability to decode = failed comprehension
- Essential for test-taking success across all subjects

---

## 🔬 SCIENCE - Priority Note

**Current Status**: You mentioned they're working on forces, simple machines, and complex machines.

**Recommendation**: Let that workstream continue independently. Science content is valuable but less critical for GED than math and reading fundamentals.

**If Additional Science Needed**, prioritize:
1. Water Cycle (visual, cyclical, engaging for autism)
2. Adaptations & Fossils (high interest, visual)

But focus development effort on Math and Reading first.

---

## 📊 IMPLEMENTATION PLAN

### Option A: Sequential Development (Solo Developer)

**Month 1: Math Foundation**
- Week 1-2: Numbers 40-60 (15-20h)
- Week 3-4: Basic Fractions (25-35h)
- **Deliverable**: 2 new math modules, ~20-25 new practice units

**Month 2: Multiplication & Division**
- Week 1-4: Basic Multiplication/Division (40-50h)
- **Deliverable**: Multiplication module (0s, 1s, 2s, 5s, 10s), Division intro

**Month 3: Reading - Vowel Teams**
- Week 1-2: Vowel Teams (20-25h)
- Week 3: R-Controlled Vowels (15-20h)
- **Deliverable**: 8-10 vowel team units (ai, ay, ea, ee, oa, ow, ie, igh, ar, or, er, ir, ur)

**Month 4: Reading - Multi-Syllabic**
- Week 1-3: Multi-Syllabic Words (20-25h)
- Week 4: Testing, refinement, bug fixes
- **Deliverable**: 5-6 syllable units, compound words through 3-syllable words

**Total Timeline**: 4 months
**Total Development Hours**: 135-175 hours

---

### Option B: Parallel Development (3 Agents)

**Agent 1 - Math Specialist** (60-75h over 6-8 weeks)
- Numbers 40-60
- Basic Fractions
- Multiplication/Division

**Agent 2 - Reading Phonics Specialist** (35-45h over 4-6 weeks)
- Vowel Teams
- R-Controlled Vowels

**Agent 3 - Reading Syllables Specialist** (20-25h over 3-4 weeks)
- Multi-Syllabic Words
- Compound words
- Syllable instruction

**Total Timeline**: 6-8 weeks (parallel)
**Total Development Hours**: 115-145 hours (same work, faster delivery)

---

### Option C: Hybrid Approach (Recommended)

**Phase 1 (Weeks 1-4): You + 1 Agent in Parallel**
- **You**: Numbers 40-60 + Start Fractions (20-30h)
- **Agent 1**: Vowel Teams + R-Controlled (35-45h)

**Phase 2 (Weeks 5-8): You + 1 Agent in Parallel**
- **You**: Finish Fractions + Start Multiplication (30-40h)
- **Agent 2**: Multi-Syllabic Words (20-25h)

**Phase 3 (Weeks 9-12): You Solo**
- Finish Multiplication/Division (20-30h)
- Testing, refinement, bug fixes
- Integration and polish

**Total Timeline**: 12 weeks (3 months)
**Total Development Hours**: Same, but balanced workload

---

## 🎯 SUCCESS METRICS

### How to Measure Progress Toward GED:

**Math Metrics:**
- ✅ Can count and identify numbers 0-60
- ✅ Understands place value (tens and ones)
- ✅ Can recognize fractions 1/2, 1/3, 1/4 visually
- ✅ Knows multiplication facts for 0s, 1s, 2s, 5s, 10s
- ✅ Understands division as sharing/grouping
- 📈 Next: Expand to 100, add/subtract two digits, more multiplication facts

**Reading Metrics:**
- ✅ Can decode CVC words (current)
- ✅ Can decode vowel team words (ai, ay, ea, ee, oa, ow, ie, igh)
- ✅ Can decode r-controlled words (ar, or, er, ir, ur)
- ✅ Can decode two-syllable words
- ✅ Can read simple sentences with 2-syllable words
- 📈 Next: Reading comprehension, longer passages, 3-syllable words

**Long-Term GED Readiness Markers:**
- By 5th grade: Reading at 2nd-3rd grade level (decodable)
- By 6th grade: Math facts fluent, two-digit operations, basic fractions
- By 7th grade: Reading comprehension improving, multi-paragraph texts
- By 8th grade: Pre-algebra concepts, fraction operations
- By 9th-10th grade: Functional literacy, GED prep courses viable

---

## 📋 NEXT STEPS - YOUR DECISION

Please let me know which approach you prefer:

**Option 1**: I start building immediately
- Which module first? (Numbers 40-60, Fractions, Multiplication, Vowel Teams, R-Controlled, or Multi-Syllabic?)
- Solo or do you have agents available for parallel work?

**Option 2**: Create detailed agent prompts for parallel development
- I'll create 3 detailed prompts (like AGENT_PROMPTS.md)
- You assign to agents
- I coordinate and integrate

**Option 3**: Start with prototypes
- I build quick prototypes (2-3h each) for each module
- You review and approve approach
- Then full implementation

**What would you like to do?**

---

**Document Version**: 1.0
**Date Created**: 2025-11-17
**Focus**: GED-Track Academic Foundation
**Total Estimated Development**: 135-175 hours for all 6 priority modules
