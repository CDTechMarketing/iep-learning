import Dexie, { Table } from 'dexie';
import { Unit, Phrase, MathProblem, SessionLog, Reward, AppSettings, SkillMastery, IEPGoal, FractionProblem } from './types';

export class LearningAppDatabase extends Dexie {
  units!: Table<Unit, string>;
  phrases!: Table<Phrase, string>;
  mathProblems!: Table<MathProblem, string>;
  fractionProblems!: Table<FractionProblem, string>;
  sessionLogs!: Table<SessionLog, string>;
  rewards!: Table<Reward, string>;
  settings!: Table<AppSettings, string>;
  skillMastery!: Table<SkillMastery, string>;
  iepGoals!: Table<IEPGoal, string>;

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

    // Version 2: Add mastery tracking tables
    this.version(2).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id',
      skillMastery: 'id, skillId, category, masteryLevel, dateAchievedMastery',
      iepGoals: 'id, category, targetDate, createdAt'
    });

    // Version 3: Add fraction problems table for GED Math Foundation
    this.version(3).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      fractionProblems: 'id, unitId, type, denominator',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id',
      skillMastery: 'id, skillId, category, masteryLevel, dateAchievedMastery',
      iepGoals: 'id, category, targetDate, createdAt'
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
      childAge: 6,
      masteryCriteria: {
        accuracyThreshold: 80,
        consecutiveSessionsRequired: 3,
        minSessionsBeforeMastery: 5
      }
    });
  } else {
    // Migrate existing settings to include mastery criteria if not present
    const settings = await db.settings.get('default');
    if (settings && !settings.masteryCriteria) {
      await db.settings.update('default', {
        masteryCriteria: {
          accuracyThreshold: 80,
          consecutiveSessionsRequired: 3,
          minSessionsBeforeMastery: 5
        }
      });
    }
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

  const rewards: Reward[] = [
    { id: 'reward-1', name: 'Star', iconPath: '⭐', milestone: 0 },
    { id: 'reward-2', name: 'Cat', iconPath: '🐱', milestone: 5 },
    { id: 'reward-3', name: 'Dog', iconPath: '🐶', milestone: 10 },
    { id: 'reward-4', name: 'Tree', iconPath: '🌳', milestone: 15 },
    { id: 'reward-5', name: 'Rocket', iconPath: '🚀', milestone: 20 },
    { id: 'reward-6', name: 'Butterfly', iconPath: '🦋', milestone: 25 }
  ];

  await db.rewards.bulkAdd(rewards);

  // GED Math Foundation: Counting 40-49 Unit
  const counting4049UnitId = 'counting-40-49-001';
  const counting4049Unit: Unit = {
    id: counting4049UnitId,
    title: 'Counting 40-49',
    tags: ['counting', 'number-sense', '40-49', 'place-value', 'math'],
    goalStars: [10, 20, 30],
    createdAt: new Date()
  };
  await db.units.add(counting4049Unit);

  const counting4049Problems: MathProblem[] = [
    // Number Line Activities (5 problems)
    { id: `${counting4049UnitId}-nl-1`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 43 on the number line', answer: 43, rangeStart: 40, rangeEnd: 49 },
    { id: `${counting4049UnitId}-nl-2`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 46 on the number line', answer: 46, rangeStart: 40, rangeEnd: 49 },
    { id: `${counting4049UnitId}-nl-3`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 41 on the number line', answer: 41, rangeStart: 40, rangeEnd: 49 },
    { id: `${counting4049UnitId}-nl-4`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 48 on the number line', answer: 48, rangeStart: 40, rangeEnd: 49 },
    { id: `${counting4049UnitId}-nl-5`, unitId: counting4049UnitId, type: 'number-line', prompt: 'Find 44 on the number line', answer: 44, rangeStart: 40, rangeEnd: 49 },

    // Ten Frame Activities (5 problems)
    { id: `${counting4049UnitId}-tf-1`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 43, options: [41, 43, 45, 33] },
    { id: `${counting4049UnitId}-tf-2`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 45, options: [45, 44, 46, 35] },
    { id: `${counting4049UnitId}-tf-3`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 47, options: [47, 46, 48, 37] },
    { id: `${counting4049UnitId}-tf-4`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 42, options: [42, 41, 43, 32] },
    { id: `${counting4049UnitId}-tf-5`, unitId: counting4049UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 49, options: [49, 48, 47, 39] },

    // Touch Count Activities (5 problems)
    { id: `${counting4049UnitId}-tc-1`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 43, manipulatives: 'stars' },
    { id: `${counting4049UnitId}-tc-2`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the animals!', answer: 45, manipulatives: 'animals' },
    { id: `${counting4049UnitId}-tc-3`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 47, manipulatives: 'stars' },
    { id: `${counting4049UnitId}-tc-4`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the animals!', answer: 41, manipulatives: 'animals' },
    { id: `${counting4049UnitId}-tc-5`, unitId: counting4049UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 49, manipulatives: 'stars' },

    // Place Value Activities (5 problems)
    { id: `${counting4049UnitId}-pv-1`, unitId: counting4049UnitId, type: 'place-value', prompt: '4 tens and 3 ones equals?', answer: 43, options: [43, 34, 7, 40], tens: 4, ones: 3, placeValueType: 'build' },
    { id: `${counting4049UnitId}-pv-2`, unitId: counting4049UnitId, type: 'place-value', prompt: '4 tens and 7 ones equals?', answer: 47, options: [47, 74, 11, 40], tens: 4, ones: 7, placeValueType: 'build' },
    { id: `${counting4049UnitId}-pv-3`, unitId: counting4049UnitId, type: 'place-value', prompt: '40 + 5 = ?', answer: 45, options: [45, 54, 9, 40], placeValueType: 'expanded-form' },
    { id: `${counting4049UnitId}-pv-4`, unitId: counting4049UnitId, type: 'place-value', prompt: '40 + 9 = ?', answer: 49, options: [49, 94, 13, 40], placeValueType: 'expanded-form' },
    { id: `${counting4049UnitId}-pv-5`, unitId: counting4049UnitId, type: 'place-value', prompt: '40 + 2 = ?', answer: 42, options: [42, 24, 6, 40], placeValueType: 'expanded-form' },

    // Number Identification (5 problems)
    { id: `${counting4049UnitId}-id-1`, unitId: counting4049UnitId, type: 'identification', prompt: '43', answer: 43, options: [43, 34, 40, 45] },
    { id: `${counting4049UnitId}-id-2`, unitId: counting4049UnitId, type: 'identification', prompt: '47', answer: 47, options: [47, 74, 45, 49] },
    { id: `${counting4049UnitId}-id-3`, unitId: counting4049UnitId, type: 'identification', prompt: '41', answer: 41, options: [41, 14, 40, 43] },
    { id: `${counting4049UnitId}-id-4`, unitId: counting4049UnitId, type: 'identification', prompt: '49', answer: 49, options: [49, 94, 47, 40] },
    { id: `${counting4049UnitId}-id-5`, unitId: counting4049UnitId, type: 'identification', prompt: '45', answer: 45, options: [45, 54, 43, 47] },

    // Comparison Activities (5 problems)
    { id: `${counting4049UnitId}-cmp-1`, unitId: counting4049UnitId, type: 'comparison', prompt: '43 ___ 47', answer: 0, options: ['<', '>', '='], correctSymbol: '<', number1: 43, number2: 47, comparisonType: 'less' },
    { id: `${counting4049UnitId}-cmp-2`, unitId: counting4049UnitId, type: 'comparison', prompt: '49 ___ 45', answer: 1, options: ['<', '>', '='], correctSymbol: '>', number1: 49, number2: 45, comparisonType: 'greater' },
    { id: `${counting4049UnitId}-cmp-3`, unitId: counting4049UnitId, type: 'comparison', prompt: '42 ___ 48', answer: 0, options: ['<', '>', '='], correctSymbol: '<', number1: 42, number2: 48, comparisonType: 'less' },
    { id: `${counting4049UnitId}-cmp-4`, unitId: counting4049UnitId, type: 'comparison', prompt: '46 ___ 41', answer: 1, options: ['<', '>', '='], correctSymbol: '>', number1: 46, number2: 41, comparisonType: 'greater' },
    { id: `${counting4049UnitId}-cmp-5`, unitId: counting4049UnitId, type: 'comparison', prompt: '44 ___ 44', answer: 2, options: ['<', '>', '='], correctSymbol: '=', number1: 44, number2: 44, comparisonType: 'equal' },
  ];
  await db.mathProblems.bulkAdd(counting4049Problems);

  // GED Math Foundation: Counting 50-60 Unit
  const counting5060UnitId = 'counting-50-60-001';
  const counting5060Unit: Unit = {
    id: counting5060UnitId,
    title: 'Counting 50-60',
    tags: ['counting', 'number-sense', '50-60', 'place-value', 'math'],
    goalStars: [10, 20, 30],
    createdAt: new Date()
  };
  await db.units.add(counting5060Unit);

  const counting5060Problems: MathProblem[] = [
    // Number Line Activities (5 problems)
    { id: `${counting5060UnitId}-nl-1`, unitId: counting5060UnitId, type: 'number-line', prompt: 'Find 53 on the number line', answer: 53, rangeStart: 50, rangeEnd: 60 },
    { id: `${counting5060UnitId}-nl-2`, unitId: counting5060UnitId, type: 'number-line', prompt: 'Find 56 on the number line', answer: 56, rangeStart: 50, rangeEnd: 60 },
    { id: `${counting5060UnitId}-nl-3`, unitId: counting5060UnitId, type: 'number-line', prompt: 'Find 51 on the number line', answer: 51, rangeStart: 50, rangeEnd: 60 },
    { id: `${counting5060UnitId}-nl-4`, unitId: counting5060UnitId, type: 'number-line', prompt: 'Find 58 on the number line', answer: 58, rangeStart: 50, rangeEnd: 60 },
    { id: `${counting5060UnitId}-nl-5`, unitId: counting5060UnitId, type: 'number-line', prompt: 'Find 60 on the number line', answer: 60, rangeStart: 50, rangeEnd: 60 },

    // Ten Frame Activities (5 problems)
    { id: `${counting5060UnitId}-tf-1`, unitId: counting5060UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 53, options: [51, 53, 55, 43] },
    { id: `${counting5060UnitId}-tf-2`, unitId: counting5060UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 55, options: [55, 54, 56, 45] },
    { id: `${counting5060UnitId}-tf-3`, unitId: counting5060UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 57, options: [57, 56, 58, 47] },
    { id: `${counting5060UnitId}-tf-4`, unitId: counting5060UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 52, options: [52, 51, 53, 42] },
    { id: `${counting5060UnitId}-tf-5`, unitId: counting5060UnitId, type: 'ten-frame', prompt: 'How many dots?', answer: 60, options: [60, 59, 58, 50] },

    // Touch Count Activities (5 problems)
    { id: `${counting5060UnitId}-tc-1`, unitId: counting5060UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 53, manipulatives: 'stars' },
    { id: `${counting5060UnitId}-tc-2`, unitId: counting5060UnitId, type: 'touch-count', prompt: 'Count the animals!', answer: 55, manipulatives: 'animals' },
    { id: `${counting5060UnitId}-tc-3`, unitId: counting5060UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 57, manipulatives: 'stars' },
    { id: `${counting5060UnitId}-tc-4`, unitId: counting5060UnitId, type: 'touch-count', prompt: 'Count the animals!', answer: 51, manipulatives: 'animals' },
    { id: `${counting5060UnitId}-tc-5`, unitId: counting5060UnitId, type: 'touch-count', prompt: 'Count the stars!', answer: 60, manipulatives: 'stars' },

    // Place Value Activities (5 problems)
    { id: `${counting5060UnitId}-pv-1`, unitId: counting5060UnitId, type: 'place-value', prompt: '5 tens and 3 ones equals?', answer: 53, options: [53, 35, 8, 50], tens: 5, ones: 3, placeValueType: 'build' },
    { id: `${counting5060UnitId}-pv-2`, unitId: counting5060UnitId, type: 'place-value', prompt: '5 tens and 7 ones equals?', answer: 57, options: [57, 75, 12, 50], tens: 5, ones: 7, placeValueType: 'build' },
    { id: `${counting5060UnitId}-pv-3`, unitId: counting5060UnitId, type: 'place-value', prompt: '50 + 5 = ?', answer: 55, options: [55, 505, 10, 50], placeValueType: 'expanded-form' },
    { id: `${counting5060UnitId}-pv-4`, unitId: counting5060UnitId, type: 'place-value', prompt: '50 + 9 = ?', answer: 59, options: [59, 509, 14, 50], placeValueType: 'expanded-form' },
    { id: `${counting5060UnitId}-pv-5`, unitId: counting5060UnitId, type: 'place-value', prompt: '50 + 10 = ?', answer: 60, options: [60, 510, 15, 50], placeValueType: 'expanded-form' },

    // Number Identification (5 problems)
    { id: `${counting5060UnitId}-id-1`, unitId: counting5060UnitId, type: 'identification', prompt: '53', answer: 53, options: [53, 35, 50, 55] },
    { id: `${counting5060UnitId}-id-2`, unitId: counting5060UnitId, type: 'identification', prompt: '57', answer: 57, options: [57, 75, 55, 59] },
    { id: `${counting5060UnitId}-id-3`, unitId: counting5060UnitId, type: 'identification', prompt: '51', answer: 51, options: [51, 15, 50, 53] },
    { id: `${counting5060UnitId}-id-4`, unitId: counting5060UnitId, type: 'identification', prompt: '60', answer: 60, options: [60, 6, 59, 50] },
    { id: `${counting5060UnitId}-id-5`, unitId: counting5060UnitId, type: 'identification', prompt: '55', answer: 55, options: [55, 555, 53, 57] },

    // Comparison Activities (5 problems)
    { id: `${counting5060UnitId}-cmp-1`, unitId: counting5060UnitId, type: 'comparison', prompt: '53 ___ 57', answer: 0, options: ['<', '>', '='], correctSymbol: '<', number1: 53, number2: 57, comparisonType: 'less' },
    { id: `${counting5060UnitId}-cmp-2`, unitId: counting5060UnitId, type: 'comparison', prompt: '60 ___ 55', answer: 1, options: ['<', '>', '='], correctSymbol: '>', number1: 60, number2: 55, comparisonType: 'greater' },
    { id: `${counting5060UnitId}-cmp-3`, unitId: counting5060UnitId, type: 'comparison', prompt: '52 ___ 58', answer: 0, options: ['<', '>', '='], correctSymbol: '<', number1: 52, number2: 58, comparisonType: 'less' },
    { id: `${counting5060UnitId}-cmp-4`, unitId: counting5060UnitId, type: 'comparison', prompt: '59 ___ 51', answer: 1, options: ['<', '>', '='], correctSymbol: '>', number1: 59, number2: 51, comparisonType: 'greater' },
    { id: `${counting5060UnitId}-cmp-5`, unitId: counting5060UnitId, type: 'comparison', prompt: '56 ___ 56', answer: 2, options: ['<', '>', '='], correctSymbol: '=', number1: 56, number2: 56, comparisonType: 'equal' },
  ];
  await db.mathProblems.bulkAdd(counting5060Problems);

  // GED Math Foundation: Fractions - Understanding Halves (1/2)
  const fractionsHalvesUnitId = 'fractions-halves-001';
  const fractionsHalvesUnit: Unit = {
    id: fractionsHalvesUnitId,
    title: 'Understanding Halves (1/2)',
    tags: ['fractions', 'halves', 'visual-learning', 'math'],
    goalStars: [8, 15, 25],
    createdAt: new Date()
  };
  await db.units.add(fractionsHalvesUnit);

  const fractionsHalvesProblems: FractionProblem[] = [
    // Circle-based halves (5 problems)
    { id: `${fractionsHalvesUnitId}-c1`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 1, denominator: 2, visualType: 'circle', shadedParts: 1, totalParts: 2, options: ['1/2', '2/2', '1/4', '2/1'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-c2`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 1, denominator: 2, visualType: 'circle', shadedParts: 1, totalParts: 2, options: ['1/2', '1/3', '1/4', '2/2'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-c3`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What part of the circle is colored?', answer: 0, numerator: 1, denominator: 2, visualType: 'circle', shadedParts: 1, totalParts: 2, options: ['1/2', '2/4', '1/1', '2/3'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-c4`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'How much is shaded?', answer: 0, numerator: 1, denominator: 2, visualType: 'circle', shadedParts: 1, totalParts: 2, options: ['1/2', '1/4', '3/4', '2/2'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-c5`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What fraction is colored?', answer: 0, numerator: 1, denominator: 2, visualType: 'circle', shadedParts: 1, totalParts: 2, options: ['1/2', '2/1', '1/3', '3/2'], createdAt: new Date() },

    // Rectangle-based halves (5 problems)
    { id: `${fractionsHalvesUnitId}-r1`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 1, denominator: 2, visualType: 'rectangle', shadedParts: 1, totalParts: 2, options: ['1/2', '2/2', '1/4', '2/1'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-r2`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 1, denominator: 2, visualType: 'rectangle', shadedParts: 1, totalParts: 2, options: ['1/2', '1/3', '2/4', '3/2'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-r3`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What part of the bar is colored?', answer: 0, numerator: 1, denominator: 2, visualType: 'bar', shadedParts: 1, totalParts: 2, options: ['1/2', '2/2', '1/1', '1/4'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-r4`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'How much is shaded?', answer: 0, numerator: 1, denominator: 2, visualType: 'bar', shadedParts: 1, totalParts: 2, options: ['1/2', '1/3', '3/4', '2/3'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-r5`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What fraction is colored?', answer: 0, numerator: 1, denominator: 2, visualType: 'rectangle', shadedParts: 1, totalParts: 2, options: ['1/2', '2/1', '1/4', '4/2'], createdAt: new Date() },

    // Full circles (both halves shaded) (3 problems)
    { id: `${fractionsHalvesUnitId}-f1`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 2, denominator: 2, visualType: 'circle', shadedParts: 2, totalParts: 2, options: ['2/2', '1/2', '1/1', '2/4'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-f2`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 2, denominator: 2, visualType: 'rectangle', shadedParts: 2, totalParts: 2, options: ['2/2', '1/2', '2/1', '1/4'], createdAt: new Date() },
    { id: `${fractionsHalvesUnitId}-f3`, unitId: fractionsHalvesUnitId, type: 'fraction-identification', prompt: 'How much of the whole is colored?', answer: 0, numerator: 2, denominator: 2, visualType: 'bar', shadedParts: 2, totalParts: 2, options: ['2/2', '1/2', '4/2', '2/4'], createdAt: new Date() },
  ];
  await db.fractionProblems.bulkAdd(fractionsHalvesProblems);

  // GED Math Foundation: Fractions - Understanding Fourths (1/4)
  const fractionsFourthsUnitId = 'fractions-fourths-001';
  const fractionsFourthsUnit: Unit = {
    id: fractionsFourthsUnitId,
    title: 'Understanding Fourths (1/4)',
    tags: ['fractions', 'fourths', 'quarters', 'visual-learning', 'math'],
    goalStars: [10, 20, 30],
    createdAt: new Date()
  };
  await db.units.add(fractionsFourthsUnit);

  const fractionsFourthsProblems: FractionProblem[] = [
    // Circle-based fourths (5 problems)
    { id: `${fractionsFourthsUnitId}-c1`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 1, denominator: 4, visualType: 'circle', shadedParts: 1, totalParts: 4, options: ['1/4', '4/1', '1/2', '2/4'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-c2`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 2, denominator: 4, visualType: 'circle', shadedParts: 2, totalParts: 4, options: ['2/4', '1/4', '3/4', '4/2'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-c3`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What part of the circle is colored?', answer: 0, numerator: 3, denominator: 4, visualType: 'circle', shadedParts: 3, totalParts: 4, options: ['3/4', '1/4', '2/4', '4/3'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-c4`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'How much is shaded?', answer: 0, numerator: 4, denominator: 4, visualType: 'circle', shadedParts: 4, totalParts: 4, options: ['4/4', '1/4', '3/4', '2/4'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-c5`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is colored?', answer: 0, numerator: 1, denominator: 4, visualType: 'circle', shadedParts: 1, totalParts: 4, options: ['1/4', '2/4', '3/4', '1/2'], createdAt: new Date() },

    // Rectangle-based fourths (5 problems)
    { id: `${fractionsFourthsUnitId}-r1`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 1, denominator: 4, visualType: 'rectangle', shadedParts: 1, totalParts: 4, options: ['1/4', '4/1', '1/2', '2/4'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-r2`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 2, denominator: 4, visualType: 'rectangle', shadedParts: 2, totalParts: 4, options: ['2/4', '1/4', '3/4', '4/2'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-r3`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What part of the bar is colored?', answer: 0, numerator: 3, denominator: 4, visualType: 'bar', shadedParts: 3, totalParts: 4, options: ['3/4', '1/4', '2/4', '4/4'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-r4`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'How much is shaded?', answer: 0, numerator: 2, denominator: 4, visualType: 'bar', shadedParts: 2, totalParts: 4, options: ['2/4', '1/4', '3/4', '1/2'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-r5`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is colored?', answer: 0, numerator: 1, denominator: 4, visualType: 'rectangle', shadedParts: 1, totalParts: 4, options: ['1/4', '2/4', '3/4', '4/1'], createdAt: new Date() },

    // Mixed variations (5 problems)
    { id: `${fractionsFourthsUnitId}-m1`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 3, denominator: 4, visualType: 'circle', shadedParts: 3, totalParts: 4, options: ['3/4', '1/4', '2/4', '4/3'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-m2`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 4, denominator: 4, visualType: 'rectangle', shadedParts: 4, totalParts: 4, options: ['4/4', '3/4', '1/4', '2/4'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-m3`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'How much of the whole is colored?', answer: 0, numerator: 2, denominator: 4, visualType: 'circle', shadedParts: 2, totalParts: 4, options: ['2/4', '1/4', '3/4', '4/2'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-m4`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is colored?', answer: 0, numerator: 1, denominator: 4, visualType: 'bar', shadedParts: 1, totalParts: 4, options: ['1/4', '2/4', '1/2', '3/4'], createdAt: new Date() },
    { id: `${fractionsFourthsUnitId}-m5`, unitId: fractionsFourthsUnitId, type: 'fraction-identification', prompt: 'What fraction is shaded?', answer: 0, numerator: 3, denominator: 4, visualType: 'rectangle', shadedParts: 3, totalParts: 4, options: ['3/4', '1/4', '2/4', '4/4'], createdAt: new Date() },
  ];
  await db.fractionProblems.bulkAdd(fractionsFourthsProblems);
}
