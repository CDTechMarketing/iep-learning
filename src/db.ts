import Dexie, { Table } from 'dexie';
import { Unit, Phrase, MathProblem, SessionLog, Reward, AppSettings } from './types';

export class LearningAppDatabase extends Dexie {
  units!: Table<Unit, string>;
  phrases!: Table<Phrase, string>;
  mathProblems!: Table<MathProblem, string>;
  sessionLogs!: Table<SessionLog, string>;
  rewards!: Table<Reward, string>;
  settings!: Table<AppSettings, string>;

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

    // Version 2: Add support for multiplication and division
    this.version(2).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id'
    }).upgrade(async tx => {
      // Add multiplication and division units
      await seedMultiplicationDivisionData(tx);
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

async function seedMultiplicationDivisionData(tx: any) {
  // Multiplication Units - Progressive difficulty (2x through 10x tables)
  const multiplicationUnits = [
    { id: 'mult-2x-001', title: 'Multiplication by 2 — Doubles', tags: ['multiplication', '2x-table', 'doubles'] },
    { id: 'mult-5x-001', title: 'Multiplication by 5 — Count by 5s', tags: ['multiplication', '5x-table', 'skip-counting'] },
    { id: 'mult-10x-001', title: 'Multiplication by 10 — Easy Tens', tags: ['multiplication', '10x-table', 'place-value'] },
    { id: 'mult-3x-001', title: 'Multiplication by 3 — Triple It', tags: ['multiplication', '3x-table'] },
    { id: 'mult-4x-001', title: 'Multiplication by 4 — Double Doubles', tags: ['multiplication', '4x-table'] },
    { id: 'mult-6x-001', title: 'Multiplication by 6', tags: ['multiplication', '6x-table'] },
    { id: 'mult-7x-001', title: 'Multiplication by 7', tags: ['multiplication', '7x-table'] },
    { id: 'mult-8x-001', title: 'Multiplication by 8', tags: ['multiplication', '8x-table'] },
    { id: 'mult-9x-001', title: 'Multiplication by 9 — Finger Trick', tags: ['multiplication', '9x-table'] },
    { id: 'mult-mixed-001', title: 'Mixed Multiplication Practice', tags: ['multiplication', 'mixed-practice'] }
  ];

  // Division Units - Related to multiplication (fact families)
  const divisionUnits = [
    { id: 'div-2-001', title: 'Division by 2 — Share in Half', tags: ['division', 'divide-by-2', 'halving'] },
    { id: 'div-5-001', title: 'Division by 5', tags: ['division', 'divide-by-5'] },
    { id: 'div-10-001', title: 'Division by 10', tags: ['division', 'divide-by-10'] },
    { id: 'div-3-001', title: 'Division by 3 — Share in Thirds', tags: ['division', 'divide-by-3'] },
    { id: 'div-4-001', title: 'Division by 4 — Share in Fourths', tags: ['division', 'divide-by-4'] },
    { id: 'div-mixed-001', title: 'Mixed Division Practice', tags: ['division', 'mixed-practice'] }
  ];

  // Add all units
  for (const unitData of [...multiplicationUnits, ...divisionUnits]) {
    const unit: Unit = {
      id: unitData.id,
      title: unitData.title,
      tags: unitData.tags,
      goalStars: [10, 20, 30],
      createdAt: new Date()
    };
    await tx.table('units').add(unit);
  }

  // Seed multiplication problems for 2x table
  await seedMultiplicationTable(tx, 'mult-2x-001', 2);
  await seedMultiplicationTable(tx, 'mult-5x-001', 5);
  await seedMultiplicationTable(tx, 'mult-10x-001', 10);
  await seedMultiplicationTable(tx, 'mult-3x-001', 3);
  await seedMultiplicationTable(tx, 'mult-4x-001', 4);
  await seedMultiplicationTable(tx, 'mult-6x-001', 6);
  await seedMultiplicationTable(tx, 'mult-7x-001', 7);
  await seedMultiplicationTable(tx, 'mult-8x-001', 8);
  await seedMultiplicationTable(tx, 'mult-9x-001', 9);

  // Seed division problems
  await seedDivisionTable(tx, 'div-2-001', 2);
  await seedDivisionTable(tx, 'div-5-001', 5);
  await seedDivisionTable(tx, 'div-10-001', 10);
  await seedDivisionTable(tx, 'div-3-001', 3);
  await seedDivisionTable(tx, 'div-4-001', 4);

  // Mixed practice units
  await seedMixedMultiplication(tx, 'mult-mixed-001');
  await seedMixedDivision(tx, 'div-mixed-001');
}

async function seedMultiplicationTable(tx: any, unitId: string, factor: number) {
  const problems: MathProblem[] = [];

  // Generate problems for 0-12 times the factor
  for (let i = 0; i <= 12; i++) {
    const answer = factor * i;
    problems.push({
      id: `${unitId}-mult-${factor}x${i}`,
      unitId,
      type: 'multiplication',
      prompt: `${factor} × ${i}`,
      answer,
      manipulatives: 'array',
      metadata: {
        factor1: factor,
        factor2: i
      }
    });

    // Also add commutative property (except when same)
    if (i !== factor && i <= 10) {
      problems.push({
        id: `${unitId}-mult-${i}x${factor}`,
        unitId,
        type: 'multiplication',
        prompt: `${i} × ${factor}`,
        answer,
        manipulatives: 'array',
        metadata: {
          factor1: i,
          factor2: factor
        }
      });
    }
  }

  await tx.table('mathProblems').bulkAdd(problems);
}

async function seedDivisionTable(tx: any, unitId: string, divisor: number) {
  const problems: MathProblem[] = [];

  // Generate division problems using multiplication facts
  for (let quotient = 0; quotient <= 12; quotient++) {
    const dividend = divisor * quotient;
    problems.push({
      id: `${unitId}-div-${dividend}by${divisor}`,
      unitId,
      type: 'division',
      prompt: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      manipulatives: 'groups',
      metadata: {
        dividend,
        divisor,
        quotient
      }
    });
  }

  await tx.table('mathProblems').bulkAdd(problems);
}

async function seedMixedMultiplication(tx: any, unitId: string) {
  const problems: MathProblem[] = [];
  const factors = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Generate 50 mixed problems
  for (let i = 0; i < 50; i++) {
    const factor1 = factors[Math.floor(Math.random() * factors.length)];
    const factor2 = Math.floor(Math.random() * 11); // 0-10
    const answer = factor1 * factor2;

    problems.push({
      id: `${unitId}-mixed-${i}`,
      unitId,
      type: 'multiplication',
      prompt: `${factor1} × ${factor2}`,
      answer,
      manipulatives: 'array',
      metadata: {
        factor1,
        factor2
      }
    });
  }

  await tx.table('mathProblems').bulkAdd(problems);
}

async function seedMixedDivision(tx: any, unitId: string) {
  const problems: MathProblem[] = [];
  const divisors = [2, 3, 4, 5, 10];

  // Generate 40 mixed problems
  for (let i = 0; i < 40; i++) {
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    const quotient = Math.floor(Math.random() * 11); // 0-10
    const dividend = divisor * quotient;

    problems.push({
      id: `${unitId}-mixed-${i}`,
      unitId,
      type: 'division',
      prompt: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      manipulatives: 'groups',
      metadata: {
        dividend,
        divisor,
        quotient
      }
    });
  }

  await tx.table('mathProblems').bulkAdd(problems);
}
