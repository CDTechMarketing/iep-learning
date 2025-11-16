import Dexie, { Table } from 'dexie';
import { Unit, Phrase, MathProblem, SessionLog, Reward, AppSettings, ScienceProblem } from './types';

export class LearningAppDatabase extends Dexie {
  units!: Table<Unit, string>;
  phrases!: Table<Phrase, string>;
  mathProblems!: Table<MathProblem, string>;
  scienceProblems!: Table<ScienceProblem, string>;
  sessionLogs!: Table<SessionLog, string>;
  rewards!: Table<Reward, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('LearningAppDB');

    // Version 1 schema
    this.version(1).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id'
    });

    // Version 2: Add science problems
    this.version(2).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      scienceProblems: 'id, unitId, type, machineType',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id'
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
      childAge: 8,
      visualScheduleEnabled: true,
      visualTimerEnabled: true,
      immediateRewards: true,
      promptingLevel: 'adaptive',
      colorScheme: 'default',
      animationLevel: 'reduced'
    });
  }

  const unitsCount = await db.units.count();

  if (unitsCount === 0) {
    await seedInitialData();
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

  // Create a special unit for counting 20-29
  const counting2029UnitId = 'counting-20-29-001';
  const counting2029Unit: Unit = {
    id: counting2029UnitId,
    title: 'Counting 20-29',
    tags: ['counting', 'number-sense', '20-29', 'place-value'],
    goalStars: [5, 10, 15],
    createdAt: new Date()
  };

  await db.units.add(counting2029Unit);

  const counting2029Problems: MathProblem[] = [
    // Number Line Activities
    { id: `${counting2029UnitId}-nl-1`, unitId: counting2029UnitId, type: 'number-line', prompt: 'Find 23', answer: 23, rangeStart: 20, rangeEnd: 29 },
    { id: `${counting2029UnitId}-nl-2`, unitId: counting2029UnitId, type: 'number-line', prompt: 'Find 26', answer: 26, rangeStart: 20, rangeEnd: 29 },
    { id: `${counting2029UnitId}-nl-3`, unitId: counting2029UnitId, type: 'number-line', prompt: 'Find 21', answer: 21, rangeStart: 20, rangeEnd: 29 },
    { id: `${counting2029UnitId}-nl-4`, unitId: counting2029UnitId, type: 'number-line', prompt: 'Find 28', answer: 28, rangeStart: 20, rangeEnd: 29 },
    { id: `${counting2029UnitId}-nl-5`, unitId: counting2029UnitId, type: 'number-line', prompt: 'Find 24', answer: 24, rangeStart: 20, rangeEnd: 29 },

    // Ten Frame Activities
    { id: `${counting2029UnitId}-tf-1`, unitId: counting2029UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 23, options: [21, 23, 24, 13] },
    { id: `${counting2029UnitId}-tf-2`, unitId: counting2029UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 25, options: [25, 24, 26, 15] },
    { id: `${counting2029UnitId}-tf-3`, unitId: counting2029UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 27, options: [27, 26, 28, 17] },
    { id: `${counting2029UnitId}-tf-4`, unitId: counting2029UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 22, options: [22, 21, 23, 12] },
    { id: `${counting2029UnitId}-tf-5`, unitId: counting2029UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 29, options: [29, 28, 27, 19] },

    // Touch and Count Activities
    { id: `${counting2029UnitId}-tc-1`, unitId: counting2029UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 23, manipulatives: 'stars' },
    { id: `${counting2029UnitId}-tc-2`, unitId: counting2029UnitId, type: 'touch-count', prompt: 'Count the bears!', answer: 25, manipulatives: 'animals' },
    { id: `${counting2029UnitId}-tc-3`, unitId: counting2029UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 27, manipulatives: 'stars' },
    { id: `${counting2029UnitId}-tc-4`, unitId: counting2029UnitId, type: 'touch-count', prompt: 'Count the bears!', answer: 21, manipulatives: 'animals' },
    { id: `${counting2029UnitId}-tc-5`, unitId: counting2029UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 29, manipulatives: 'stars' }
  ];

  await db.mathProblems.bulkAdd(counting2029Problems);

  // Additional CVC Reading Units - Short A (-an family)
  const shortAnUnitId = 'short-a-an-001';
  const shortAnUnit: Unit = {
    id: shortAnUnitId,
    title: 'Short A — Can, Man, Fan',
    tags: ['cvc', 'short-a', '-an'],
    goalStars: [5, 10],
    createdAt: new Date()
  };
  await db.units.add(shortAnUnit);

  const shortAnPhrases: Phrase[] = [
    { id: `${shortAnUnitId}-phrase-1`, unitId: shortAnUnitId, lines: ['can'] },
    { id: `${shortAnUnitId}-phrase-2`, unitId: shortAnUnitId, lines: ['man'] },
    { id: `${shortAnUnitId}-phrase-3`, unitId: shortAnUnitId, lines: ['fan'] },
    { id: `${shortAnUnitId}-phrase-4`, unitId: shortAnUnitId, lines: ['the', 'the man'] },
    { id: `${shortAnUnitId}-phrase-5`, unitId: shortAnUnitId, lines: ['the', 'the man', 'the man can'] },
    { id: `${shortAnUnitId}-phrase-6`, unitId: shortAnUnitId, lines: ['a fan', 'the man', 'the man can'] },
    { id: `${shortAnUnitId}-phrase-7`, unitId: shortAnUnitId, lines: ['I can', 'I can see', 'I can see the fan'] }
  ];
  await db.phrases.bulkAdd(shortAnPhrases);

  // Short I (-ig family)
  const shortIgUnitId = 'short-i-ig-001';
  const shortIgUnit: Unit = {
    id: shortIgUnitId,
    title: 'Short I — Pig, Dig, Big',
    tags: ['cvc', 'short-i', '-ig'],
    goalStars: [5, 10],
    createdAt: new Date()
  };
  await db.units.add(shortIgUnit);

  const shortIgPhrases: Phrase[] = [
    { id: `${shortIgUnitId}-phrase-1`, unitId: shortIgUnitId, lines: ['pig'] },
    { id: `${shortIgUnitId}-phrase-2`, unitId: shortIgUnitId, lines: ['dig'] },
    { id: `${shortIgUnitId}-phrase-3`, unitId: shortIgUnitId, lines: ['big'] },
    { id: `${shortIgUnitId}-phrase-4`, unitId: shortIgUnitId, lines: ['a pig', 'a big pig'] },
    { id: `${shortIgUnitId}-phrase-5`, unitId: shortIgUnitId, lines: ['the pig', 'the pig can dig'] },
    { id: `${shortIgUnitId}-phrase-6`, unitId: shortIgUnitId, lines: ['see the', 'see the big', 'see the big pig'] },
    { id: `${shortIgUnitId}-phrase-7`, unitId: shortIgUnitId, lines: ['I see', 'I see a', 'I see a big pig dig'] }
  ];
  await db.phrases.bulkAdd(shortIgPhrases);

  // Short O (-og family)
  const shortOgUnitId = 'short-o-og-001';
  const shortOgUnit: Unit = {
    id: shortOgUnitId,
    title: 'Short O — Dog, Log, Frog',
    tags: ['cvc', 'short-o', '-og'],
    goalStars: [5, 10],
    createdAt: new Date()
  };
  await db.units.add(shortOgUnit);

  const shortOgPhrases: Phrase[] = [
    { id: `${shortOgUnitId}-phrase-1`, unitId: shortOgUnitId, lines: ['dog'] },
    { id: `${shortOgUnitId}-phrase-2`, unitId: shortOgUnitId, lines: ['log'] },
    { id: `${shortOgUnitId}-phrase-3`, unitId: shortOgUnitId, lines: ['frog'] },
    { id: `${shortOgUnitId}-phrase-4`, unitId: shortOgUnitId, lines: ['a dog', 'on a log'] },
    { id: `${shortOgUnitId}-phrase-5`, unitId: shortOgUnitId, lines: ['the frog', 'the frog and', 'the frog and dog'] },
    { id: `${shortOgUnitId}-phrase-6`, unitId: shortOgUnitId, lines: ['the dog', 'the dog is on', 'the dog is on the log'] },
    { id: `${shortOgUnitId}-phrase-7`, unitId: shortOgUnitId, lines: ['I see a', 'I see a frog', 'I see a frog on a log'] }
  ];
  await db.phrases.bulkAdd(shortOgPhrases);

  // Short U (-ug family)
  const shortUgUnitId = 'short-u-ug-001';
  const shortUgUnit: Unit = {
    id: shortUgUnitId,
    title: 'Short U — Bug, Hug, Rug',
    tags: ['cvc', 'short-u', '-ug'],
    goalStars: [5, 10],
    createdAt: new Date()
  };
  await db.units.add(shortUgUnit);

  const shortUgPhrases: Phrase[] = [
    { id: `${shortUgUnitId}-phrase-1`, unitId: shortUgUnitId, lines: ['bug'] },
    { id: `${shortUgUnitId}-phrase-2`, unitId: shortUgUnitId, lines: ['hug'] },
    { id: `${shortUgUnitId}-phrase-3`, unitId: shortUgUnitId, lines: ['rug'] },
    { id: `${shortUgUnitId}-phrase-4`, unitId: shortUgUnitId, lines: ['a bug', 'on the rug'] },
    { id: `${shortUgUnitId}-phrase-5`, unitId: shortUgUnitId, lines: ['I see', 'I see the bug'] },
    { id: `${shortUgUnitId}-phrase-6`, unitId: shortUgUnitId, lines: ['the bug', 'the bug is', 'the bug is on the rug'] },
    { id: `${shortUgUnitId}-phrase-7`, unitId: shortUgUnitId, lines: ['give me', 'give me a hug'] }
  ];
  await db.phrases.bulkAdd(shortUgPhrases);

  // Counting 30-39 Unit
  const counting3039UnitId = 'counting-30-39-001';
  const counting3039Unit: Unit = {
    id: counting3039UnitId,
    title: 'Counting 30-39',
    tags: ['counting', 'number-sense', '30-39', 'place-value'],
    goalStars: [5, 10, 15],
    createdAt: new Date()
  };
  await db.units.add(counting3039Unit);

  const counting3039Problems: MathProblem[] = [
    // Number Line Activities
    { id: `${counting3039UnitId}-nl-1`, unitId: counting3039UnitId, type: 'number-line', prompt: 'Find 33', answer: 33, rangeStart: 30, rangeEnd: 39 },
    { id: `${counting3039UnitId}-nl-2`, unitId: counting3039UnitId, type: 'number-line', prompt: 'Find 36', answer: 36, rangeStart: 30, rangeEnd: 39 },
    { id: `${counting3039UnitId}-nl-3`, unitId: counting3039UnitId, type: 'number-line', prompt: 'Find 31', answer: 31, rangeStart: 30, rangeEnd: 39 },
    { id: `${counting3039UnitId}-nl-4`, unitId: counting3039UnitId, type: 'number-line', prompt: 'Find 38', answer: 38, rangeStart: 30, rangeEnd: 39 },
    { id: `${counting3039UnitId}-nl-5`, unitId: counting3039UnitId, type: 'number-line', prompt: 'Find 35', answer: 35, rangeStart: 30, rangeEnd: 39 },

    // Ten Frame Activities
    { id: `${counting3039UnitId}-tf-1`, unitId: counting3039UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 33, options: [31, 33, 34, 23] },
    { id: `${counting3039UnitId}-tf-2`, unitId: counting3039UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 35, options: [35, 34, 36, 25] },
    { id: `${counting3039UnitId}-tf-3`, unitId: counting3039UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 37, options: [37, 36, 38, 27] },
    { id: `${counting3039UnitId}-tf-4`, unitId: counting3039UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 32, options: [32, 31, 33, 22] },
    { id: `${counting3039UnitId}-tf-5`, unitId: counting3039UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 39, options: [39, 38, 37, 29] },

    // Touch and Count Activities
    { id: `${counting3039UnitId}-tc-1`, unitId: counting3039UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 33, manipulatives: 'stars' },
    { id: `${counting3039UnitId}-tc-2`, unitId: counting3039UnitId, type: 'touch-count', prompt: 'Count the bears!', answer: 35, manipulatives: 'animals' },
    { id: `${counting3039UnitId}-tc-3`, unitId: counting3039UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 37, manipulatives: 'stars' },
    { id: `${counting3039UnitId}-tc-4`, unitId: counting3039UnitId, type: 'touch-count', prompt: 'Count the bears!', answer: 31, manipulatives: 'animals' },
    { id: `${counting3039UnitId}-tc-5`, unitId: counting3039UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 39, manipulatives: 'stars' }
  ];
  await db.mathProblems.bulkAdd(counting3039Problems);

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
