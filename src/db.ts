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
