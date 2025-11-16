import Dexie, { Table } from 'dexie';
import { Unit, Phrase, MathProblem, ScienceProblem, SessionLog, Reward, AppSettings } from './types';

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

    this.version(1).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      scienceProblems: 'id, unitId, type, topic',
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

  const scienceProblems: ScienceProblem[] = [
    {
      id: `${unitId}-sci-1`,
      unitId,
      type: 'force',
      topic: 'push-pull',
      question: 'What happens when you push a box?',
      demoType: 'interactive',
      correctAnswer: 'moves away',
      options: ['moves away', 'stays still', 'comes closer', 'disappears'],
      explanation: 'When you push something, it moves away from you!'
    },
    {
      id: `${unitId}-sci-2`,
      unitId,
      type: 'force',
      topic: 'push-pull',
      question: 'What happens when you pull a wagon?',
      demoType: 'interactive',
      correctAnswer: 'comes closer',
      options: ['comes closer', 'stays still', 'moves away', 'flies up'],
      explanation: 'When you pull something, it comes toward you!'
    },
    {
      id: `${unitId}-sci-3`,
      unitId,
      type: 'simple-machine',
      topic: 'lever',
      question: 'A seesaw is an example of which simple machine?',
      demoType: 'observation',
      correctAnswer: 'lever',
      options: ['lever', 'pulley', 'wheel and axle', 'wedge'],
      explanation: 'A lever helps us lift things more easily!'
    },
    {
      id: `${unitId}-sci-4`,
      unitId,
      type: 'simple-machine',
      topic: 'pulley',
      question: 'What simple machine helps you raise a flag?',
      demoType: 'observation',
      correctAnswer: 'pulley',
      options: ['pulley', 'lever', 'inclined plane', 'screw'],
      explanation: 'A pulley uses a wheel and rope to lift things!'
    },
    {
      id: `${unitId}-sci-5`,
      unitId,
      type: 'simple-machine',
      topic: 'wheel-axle',
      question: 'What simple machine do we use on cars and bikes?',
      demoType: 'observation',
      correctAnswer: 'wheel and axle',
      options: ['wheel and axle', 'wedge', 'screw', 'lever'],
      explanation: 'Wheels and axles help things roll smoothly!'
    },
    {
      id: `${unitId}-sci-6`,
      unitId,
      type: 'simple-machine',
      topic: 'inclined-plane',
      question: 'A ramp is an example of which simple machine?',
      demoType: 'observation',
      correctAnswer: 'inclined plane',
      options: ['inclined plane', 'pulley', 'lever', 'screw'],
      explanation: 'An inclined plane makes it easier to move things up or down!'
    },
    {
      id: `${unitId}-sci-7`,
      unitId,
      type: 'multiple-choice',
      topic: 'push-pull',
      question: 'Which action is a PUSH?',
      correctAnswer: 'closing a door',
      options: ['closing a door', 'opening a drawer', 'pulling a sled', 'tying a rope'],
      explanation: 'Pushing moves something away from you!'
    },
    {
      id: `${unitId}-sci-8`,
      unitId,
      type: 'multiple-choice',
      topic: 'push-pull',
      question: 'Which action is a PULL?',
      correctAnswer: 'opening a drawer',
      options: ['opening a drawer', 'pushing a swing', 'kicking a ball', 'throwing a toy'],
      explanation: 'Pulling brings something toward you!'
    }
  ];

  await db.scienceProblems.bulkAdd(scienceProblems);

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
