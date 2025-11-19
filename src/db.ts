import Dexie, { Table } from 'dexie';
import { Unit, Phrase, MathProblem, SessionLog, Reward, AppSettings, SightWord, SightWordAttempt, SightWordProgress } from './types';

export class LearningAppDatabase extends Dexie {
  units!: Table<Unit, string>;
  phrases!: Table<Phrase, string>;
  mathProblems!: Table<MathProblem, string>;
  sessionLogs!: Table<SessionLog, string>;
  rewards!: Table<Reward, string>;
  settings!: Table<AppSettings, string>;
  sightWords!: Table<SightWord, string>;
  sightWordAttempts!: Table<SightWordAttempt, string>;
  sightWordProgress!: Table<SightWordProgress, string>;

  constructor() {
    super('LearningAppDB');

    this.version(1).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id'
    });

    // Version 2: Add Sight Words tables
    this.version(2).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id',
      sightWords: 'id, list, frequency',
      sightWordAttempts: 'id, studentId, wordId, timestamp',
      sightWordProgress: 'id, studentId, wordId, status, nextReview'
    });
  }
}

export const db = new LearningAppDatabase();

export async function initializeDatabase() {
  const settingsCount = await db.settings.count();

  if (settingsCount === 0) {
    await db.settings.add({
      id: 'default',
      autoAdvance: false,
      autoAdvanceDelay: 5,
      breakPromptInterval: 6,
      audioEnabled: false,
      dyslexiaFont: false,
      childAge: 6
    });
  }

  const unitsCount = await db.units.count();

  if (unitsCount === 0) {
    await seedInitialData();
  }

  // Seed sight words if none exist
  const sightWordsCount = await db.sightWords.count();
  if (sightWordsCount === 0) {
    await seedSightWords();
  }
}

async function seedInitialData() {
  const unitId = 'short-a-001';
  const unit: Unit = {
    id: unitId,
    title: 'Short A — Cat, Sat, Mat',
    tags: ['cvc', 'short-a'],
    goalStars: [5, 10],
    createdAt: new Date()
  };

  await db.units.add(unit);

  const phrases: Phrase[] = [
    {
      id: `${unitId}-phrase-1`,
      unitId,
      lines: ['cat']
    },
    {
      id: `${unitId}-phrase-2`,
      unitId,
      lines: ['sat']
    },
    {
      id: `${unitId}-phrase-3`,
      unitId,
      lines: ['mat']
    },
    {
      id: `${unitId}-phrase-4`,
      unitId,
      lines: ['cat', 'cat sat']
    },
    {
      id: `${unitId}-phrase-5`,
      unitId,
      lines: ['cat', 'cat sat', 'cat sat on']
    },
    {
      id: `${unitId}-phrase-6`,
      unitId,
      lines: ['cat', 'cat sat', 'cat sat on', 'cat sat on the']
    },
    {
      id: `${unitId}-phrase-7`,
      unitId,
      lines: ['cat', 'cat sat', 'cat sat on', 'cat sat on the', 'cat sat on the mat']
    }
  ];

  await db.phrases.bulkAdd(phrases);

  const mathProblems: MathProblem[] = [
    { id: `${unitId}-num-1`, unitId, type: 'identification', prompt: '5', answer: 5 },
    { id: `${unitId}-num-2`, unitId, type: 'identification', prompt: '12', answer: 12 },
    { id: `${unitId}-num-3`, unitId, type: 'identification', prompt: '8', answer: 8 },
    { id: `${unitId}-num-4`, unitId, type: 'identification', prompt: '20', answer: 20 },
    { id: `${unitId}-num-5`, unitId, type: 'identification', prompt: '15', answer: 15 },
    { id: `${unitId}-add-1`, unitId, type: 'addition', prompt: '1+1', answer: 2, manipulatives: 'blocks' },
    { id: `${unitId}-add-2`, unitId, type: 'addition', prompt: '2+3', answer: 5, manipulatives: 'blocks' },
    { id: `${unitId}-add-3`, unitId, type: 'addition', prompt: '5+4', answer: 9, manipulatives: 'blocks' },
    { id: `${unitId}-add-4`, unitId, type: 'addition', prompt: '3+2', answer: 5, manipulatives: 'blocks' },
    { id: `${unitId}-add-5`, unitId, type: 'addition', prompt: '4+5', answer: 9, manipulatives: 'blocks' }
  ];

  await db.mathProblems.bulkAdd(mathProblems);

  const rewards: Reward[] = [
    { id: 'reward-1', name: 'Star', iconPath: '⭐', milestone: 0 },
    { id: 'reward-2', name: 'Cat', iconPath: '🐱', milestone: 5 },
    { id: 'reward-3', name: 'Dog', iconPath: '🐶', milestone: 10 },
    { id: 'reward-4', name: 'Tree', iconPath: '🌳', milestone: 15 },
    { id: 'reward-5', name: 'Rocket', iconPath: '🚀', milestone: 20 },
    { id: 'reward-6', name: 'Butterfly', iconPath: '🦋', milestone: 25 }
  ];

  await db.rewards.bulkAdd(rewards);
}

async function seedSightWords() {
  const sightWords: SightWord[] = [
    // Dolch Pre-Primer (40 words)
    { id: 'sw-001', word: 'a', list: 'dolch-preprimer', frequency: 1, exampleSentence: 'I see a cat.' },
    { id: 'sw-002', word: 'and', list: 'dolch-preprimer', frequency: 2, exampleSentence: 'I like dogs and cats.' },
    { id: 'sw-003', word: 'away', list: 'dolch-preprimer', frequency: 3, exampleSentence: 'The bird flew away.' },
    { id: 'sw-004', word: 'big', list: 'dolch-preprimer', frequency: 4, exampleSentence: 'That is a big house.' },
    { id: 'sw-005', word: 'blue', list: 'dolch-preprimer', frequency: 5, exampleSentence: 'The sky is blue.' },
    { id: 'sw-006', word: 'can', list: 'dolch-preprimer', frequency: 6, exampleSentence: 'I can run fast.' },
    { id: 'sw-007', word: 'come', list: 'dolch-preprimer', frequency: 7, exampleSentence: 'Come here please.' },
    { id: 'sw-008', word: 'down', list: 'dolch-preprimer', frequency: 8, exampleSentence: 'The ball rolled down the hill.' },
    { id: 'sw-009', word: 'find', list: 'dolch-preprimer', frequency: 9, exampleSentence: 'Can you find your shoes?' },
    { id: 'sw-010', word: 'for', list: 'dolch-preprimer', frequency: 10, exampleSentence: 'This gift is for you.' },
    { id: 'sw-011', word: 'funny', list: 'dolch-preprimer', frequency: 11, exampleSentence: 'That joke was funny.' },
    { id: 'sw-012', word: 'go', list: 'dolch-preprimer', frequency: 12, exampleSentence: 'Let us go to the park.' },
    { id: 'sw-013', word: 'help', list: 'dolch-preprimer', frequency: 13, exampleSentence: 'Can you help me?' },
    { id: 'sw-014', word: 'here', list: 'dolch-preprimer', frequency: 14, exampleSentence: 'Put the book here.' },
    { id: 'sw-015', word: 'I', list: 'dolch-preprimer', frequency: 15, exampleSentence: 'I am happy today.' },
    { id: 'sw-016', word: 'in', list: 'dolch-preprimer', frequency: 16, exampleSentence: 'The toy is in the box.' },
    { id: 'sw-017', word: 'is', list: 'dolch-preprimer', frequency: 17, exampleSentence: 'This is my friend.' },
    { id: 'sw-018', word: 'it', list: 'dolch-preprimer', frequency: 18, exampleSentence: 'Look at it!' },
    { id: 'sw-019', word: 'jump', list: 'dolch-preprimer', frequency: 19, exampleSentence: 'I can jump high.' },
    { id: 'sw-020', word: 'little', list: 'dolch-preprimer', frequency: 20, exampleSentence: 'I have a little dog.' },
    { id: 'sw-021', word: 'look', list: 'dolch-preprimer', frequency: 21, exampleSentence: 'Look at the rainbow!' },
    { id: 'sw-022', word: 'make', list: 'dolch-preprimer', frequency: 22, exampleSentence: 'Let us make cookies.' },
    { id: 'sw-023', word: 'me', list: 'dolch-preprimer', frequency: 23, exampleSentence: 'Give it to me.' },
    { id: 'sw-024', word: 'my', list: 'dolch-preprimer', frequency: 24, exampleSentence: 'This is my backpack.' },
    { id: 'sw-025', word: 'not', list: 'dolch-preprimer', frequency: 25, exampleSentence: 'I am not sleepy.' },
    { id: 'sw-026', word: 'one', list: 'dolch-preprimer', frequency: 26, exampleSentence: 'I have one apple.' },
    { id: 'sw-027', word: 'play', list: 'dolch-preprimer', frequency: 27, exampleSentence: 'Can we play outside?' },
    { id: 'sw-028', word: 'red', list: 'dolch-preprimer', frequency: 28, exampleSentence: 'I like your red shirt.' },
    { id: 'sw-029', word: 'run', list: 'dolch-preprimer', frequency: 29, exampleSentence: 'The children run fast.' },
    { id: 'sw-030', word: 'said', list: 'dolch-preprimer', frequency: 30, exampleSentence: 'She said hello to me.' },
    { id: 'sw-031', word: 'see', list: 'dolch-preprimer', frequency: 31, exampleSentence: 'I see a bird.' },
    { id: 'sw-032', word: 'the', list: 'dolch-preprimer', frequency: 32, exampleSentence: 'The sun is bright.' },
    { id: 'sw-033', word: 'three', list: 'dolch-preprimer', frequency: 33, exampleSentence: 'I have three pencils.' },
    { id: 'sw-034', word: 'to', list: 'dolch-preprimer', frequency: 34, exampleSentence: 'I go to school.' },
    { id: 'sw-035', word: 'two', list: 'dolch-preprimer', frequency: 35, exampleSentence: 'There are two cats.' },
    { id: 'sw-036', word: 'up', list: 'dolch-preprimer', frequency: 36, exampleSentence: 'Look up at the sky.' },
    { id: 'sw-037', word: 'we', list: 'dolch-preprimer', frequency: 37, exampleSentence: 'We are friends.' },
    { id: 'sw-038', word: 'where', list: 'dolch-preprimer', frequency: 38, exampleSentence: 'Where is my book?' },
    { id: 'sw-039', word: 'yellow', list: 'dolch-preprimer', frequency: 39, exampleSentence: 'The sun is yellow.' },
    { id: 'sw-040', word: 'you', list: 'dolch-preprimer', frequency: 40, exampleSentence: 'I like you.' },

    // Dolch Primer (52 words) - adding first 20
    { id: 'sw-041', word: 'all', list: 'dolch-primer', frequency: 41, exampleSentence: 'We all went home.' },
    { id: 'sw-042', word: 'am', list: 'dolch-primer', frequency: 42, exampleSentence: 'I am six years old.' },
    { id: 'sw-043', word: 'are', list: 'dolch-primer', frequency: 43, exampleSentence: 'You are my friend.' },
    { id: 'sw-044', word: 'at', list: 'dolch-primer', frequency: 44, exampleSentence: 'Look at me!' },
    { id: 'sw-045', word: 'ate', list: 'dolch-primer', frequency: 45, exampleSentence: 'I ate lunch.' },
    { id: 'sw-046', word: 'be', list: 'dolch-primer', frequency: 46, exampleSentence: 'I want to be first.' },
    { id: 'sw-047', word: 'black', list: 'dolch-primer', frequency: 47, exampleSentence: 'My shoes are black.' },
    { id: 'sw-048', word: 'brown', list: 'dolch-primer', frequency: 48, exampleSentence: 'The bear is brown.' },
    { id: 'sw-049', word: 'but', list: 'dolch-primer', frequency: 49, exampleSentence: 'I like dogs but not cats.' },
    { id: 'sw-050', word: 'came', list: 'dolch-primer', frequency: 50, exampleSentence: 'My friend came to visit.' },
    { id: 'sw-051', word: 'did', list: 'dolch-primer', frequency: 51, exampleSentence: 'Did you see that?' },
    { id: 'sw-052', word: 'do', list: 'dolch-primer', frequency: 52, exampleSentence: 'What do you want?' },
    { id: 'sw-053', word: 'eat', list: 'dolch-primer', frequency: 53, exampleSentence: 'Let us eat lunch.' },
    { id: 'sw-054', word: 'four', list: 'dolch-primer', frequency: 54, exampleSentence: 'I have four books.' },
    { id: 'sw-055', word: 'get', list: 'dolch-primer', frequency: 55, exampleSentence: 'I will get my coat.' },
    { id: 'sw-056', word: 'good', list: 'dolch-primer', frequency: 56, exampleSentence: 'That is a good idea.' },
    { id: 'sw-057', word: 'have', list: 'dolch-primer', frequency: 57, exampleSentence: 'I have a new toy.' },
    { id: 'sw-058', word: 'he', list: 'dolch-primer', frequency: 58, exampleSentence: 'He is my brother.' },
    { id: 'sw-059', word: 'into', list: 'dolch-primer', frequency: 59, exampleSentence: 'Jump into the pool.' },
    { id: 'sw-060', word: 'like', list: 'dolch-primer', frequency: 60, exampleSentence: 'I like ice cream.' }
  ];

  await db.sightWords.bulkAdd(sightWords);
}
