import Dexie, { Table } from 'dexie';
import {
  Unit,
  Phrase,
  MathProblem,
  SessionLog,
  Reward,
  AppSettings,
  ReadingComprehensionPassage,
  ComprehensionQuestion,
  ComprehensionAttempt,
  ReadingStrategy,
  VocabularyTerm
} from './types';

export class LearningAppDatabase extends Dexie {
  units!: Table<Unit, string>;
  phrases!: Table<Phrase, string>;
  mathProblems!: Table<MathProblem, string>;
  sessionLogs!: Table<SessionLog, string>;
  rewards!: Table<Reward, string>;
  settings!: Table<AppSettings, string>;
  comprehensionPassages!: Table<ReadingComprehensionPassage, string>;
  comprehensionQuestions!: Table<ComprehensionQuestion, string>;
  comprehensionAttempts!: Table<ComprehensionAttempt, string>;
  readingStrategies!: Table<ReadingStrategy, string>;
  vocabularyTerms!: Table<VocabularyTerm, string>;

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

    // Add reading comprehension tables in version 2
    this.version(2).stores({
      units: 'id, createdAt',
      phrases: 'id, unitId',
      mathProblems: 'id, unitId, type',
      sessionLogs: 'id, unitId, date, createdAt',
      rewards: 'id, milestone',
      settings: 'id',
      comprehensionPassages: 'id, gradeLevel, genre',
      comprehensionQuestions: 'id, passageId, skill, questionType',
      comprehensionAttempts: 'id, studentId, passageId, questionId, timestamp',
      readingStrategies: 'id, strategyName',
      vocabularyTerms: 'id, passageId, term'
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

  // Initialize reading comprehension data
  const strategiesCount = await db.readingStrategies.count();
  if (strategiesCount === 0) {
    await seedReadingComprehensionData();
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

async function seedReadingComprehensionData() {
  // Seed reading strategies
  const strategies: ReadingStrategy[] = [
    {
      id: 'strategy-preview',
      strategyName: 'Preview',
      description: 'Look at title, pictures, and headings before reading',
      whenToUse: 'Before reading to get ready',
      example: 'Look at the title and pictures. What do you think this will be about?',
      iconUrl: '🔍'
    },
    {
      id: 'strategy-predict',
      strategyName: 'Predict',
      description: 'Think about what will happen next',
      whenToUse: 'Before and during reading',
      example: 'What do you think will happen next in the story?',
      iconUrl: '🔮'
    },
    {
      id: 'strategy-question',
      strategyName: 'Question',
      description: 'Ask who, what, where, when, why, and how',
      whenToUse: 'During reading',
      example: 'Who is the main character? What is happening?',
      iconUrl: '❓'
    },
    {
      id: 'strategy-visualize',
      strategyName: 'Visualize',
      description: 'Make a movie in your mind',
      whenToUse: 'During reading',
      example: 'Close your eyes and picture what is happening',
      iconUrl: '🎬'
    },
    {
      id: 'strategy-summarize',
      strategyName: 'Summarize',
      description: 'Tell the most important parts',
      whenToUse: 'After reading',
      example: 'What were the most important things that happened?',
      iconUrl: '📝'
    },
    {
      id: 'strategy-connect',
      strategyName: 'Connect',
      description: 'How does this relate to your life?',
      whenToUse: 'After reading',
      example: 'Has something like this ever happened to you?',
      iconUrl: '🔗'
    }
  ];

  await db.readingStrategies.bulkAdd(strategies);

  // Seed a sample Grade 1 fiction passage
  const passage1: ReadingComprehensionPassage = {
    id: 'g1-fiction-cat',
    title: 'The Lost Cat',
    genre: 'fiction',
    gradeLevel: 1,
    lexileRange: '200-250L',
    text: `Sam has a cat. The cat is black. The cat's name is Midnight.

One day, Sam cannot find Midnight. Sam looks in the house. No cat! Sam looks in the yard. No cat!

Then Sam hears a sound. "Meow! Meow!" The sound comes from a tree. Sam looks up. There is Midnight! The cat is stuck in the tree.

Sam's dad gets a ladder. He climbs up and gets Midnight. Sam is so happy! He hugs his cat.`,
    wordCount: 78,
    vocabulary: ['midnight', 'sound', 'ladder', 'climbs'],
    comprehensionQuestions: ['g1-cat-q1', 'g1-cat-q2', 'g1-cat-q3', 'g1-cat-q4', 'g1-cat-q5'],
    created: new Date()
  };

  await db.comprehensionPassages.add(passage1);

  // Add questions for passage 1
  const questions1: ComprehensionQuestion[] = [
    {
      id: 'g1-cat-q1',
      passageId: 'g1-fiction-cat',
      questionText: 'What is the cat\'s name?',
      questionType: 'literal',
      skill: 'details',
      correctAnswer: 'Midnight',
      distractors: ['Shadow', 'Blackie', 'Sam'],
      explanation: 'The story says "The cat\'s name is Midnight."',
      textEvidence: 'The cat\'s name is Midnight.',
      scaffoldingLevel: 1,
      hints: [
        'Look at the first paragraph. What does it say the cat\'s name is?',
        'The story says the cat is black. What is the name of the cat?',
        'The cat\'s name starts with M and is something you see at night.'
      ]
    },
    {
      id: 'g1-cat-q2',
      passageId: 'g1-fiction-cat',
      questionText: 'Where did Sam find Midnight?',
      questionType: 'literal',
      skill: 'details',
      correctAnswer: 'In a tree',
      distractors: ['In the house', 'In the yard', 'Under the bed'],
      explanation: 'Sam heard meowing and looked up to find Midnight stuck in the tree.',
      textEvidence: 'Sam looks up. There is Midnight! The cat is stuck in the tree.',
      scaffoldingLevel: 1,
      hints: [
        'Sam heard a meow sound. Where did he look?',
        'Reread the part where Sam finds Midnight. Where was the cat stuck?',
        'The cat was up high. It was in a ____.'
      ]
    },
    {
      id: 'g1-cat-q3',
      passageId: 'g1-fiction-cat',
      questionText: 'How did Sam feel at the end of the story?',
      questionType: 'inferential',
      skill: 'character-analysis',
      correctAnswer: 'Happy',
      distractors: ['Sad', 'Angry', 'Scared'],
      explanation: 'The story says "Sam is so happy!" after he gets his cat back.',
      textEvidence: 'Sam is so happy! He hugs his cat.',
      scaffoldingLevel: 2,
      hints: [
        'Think about how you would feel if you found your lost pet.',
        'Read the last sentences. What does the story say Sam felt?',
        'Sam hugged his cat. Do you hug someone when you are happy or sad?'
      ]
    },
    {
      id: 'g1-cat-q4',
      passageId: 'g1-fiction-cat',
      questionText: 'What is the main problem in this story?',
      questionType: 'inferential',
      skill: 'main-idea',
      correctAnswer: 'The cat was lost and stuck in a tree',
      distractors: ['Sam did not like his cat', 'The cat was hungry', 'Sam broke his ladder'],
      explanation: 'The main problem was that Sam could not find his cat, and then discovered it was stuck in a tree.',
      textEvidence: 'Sam cannot find Midnight... The cat is stuck in the tree.',
      scaffoldingLevel: 2,
      hints: [
        'What problem did Sam have? Think about what was wrong.',
        'Sam was looking for something. What was it?',
        'The cat was lost, and then Sam found it. Where was it stuck?'
      ]
    },
    {
      id: 'g1-cat-q5',
      passageId: 'g1-fiction-cat',
      questionText: 'Who helped Sam get the cat down?',
      questionType: 'literal',
      skill: 'details',
      correctAnswer: 'Sam\'s dad',
      distractors: ['Sam\'s mom', 'Sam\'s friend', 'A firefighter'],
      explanation: 'The story says "Sam\'s dad gets a ladder. He climbs up and gets Midnight."',
      textEvidence: 'Sam\'s dad gets a ladder. He climbs up and gets Midnight.',
      scaffoldingLevel: 1,
      hints: [
        'Who got the ladder to help?',
        'Read the part about getting the cat down. Who climbed up?',
        'Someone in Sam\'s family helped. It was Sam\'s ____.'
      ]
    }
  ];

  await db.comprehensionQuestions.bulkAdd(questions1);

  // Add vocabulary terms for passage 1
  const vocab1: VocabularyTerm[] = [
    {
      id: 'g1-cat-vocab-1',
      passageId: 'g1-fiction-cat',
      term: 'midnight',
      definition: 'The middle of the night; 12:00 at night',
      exampleSentence: 'The cat is named Midnight because it is black like the night sky.'
    },
    {
      id: 'g1-cat-vocab-2',
      passageId: 'g1-fiction-cat',
      term: 'sound',
      definition: 'Something you hear with your ears',
      exampleSentence: 'Sam heard a meowing sound coming from the tree.'
    },
    {
      id: 'g1-cat-vocab-3',
      passageId: 'g1-fiction-cat',
      term: 'ladder',
      definition: 'A tool with steps that helps you climb up high',
      exampleSentence: 'Dad used a ladder to reach the cat in the tree.'
    },
    {
      id: 'g1-cat-vocab-4',
      passageId: 'g1-fiction-cat',
      term: 'climbs',
      definition: 'Goes up something using hands and feet',
      exampleSentence: 'Dad climbs up the ladder to rescue the cat.'
    }
  ];

  await db.vocabularyTerms.bulkAdd(vocab1);

  // Seed a sample Grade 2 nonfiction passage
  const passage2: ReadingComprehensionPassage = {
    id: 'g2-nonfiction-frogs',
    title: 'Amazing Frogs',
    genre: 'nonfiction',
    gradeLevel: 2,
    lexileRange: '350-400L',
    text: `**All About Frogs**

Frogs are amazing animals. They are amphibians. This means they can live in water and on land.

**Where Frogs Live**

Most frogs live near water. They like ponds, lakes, and streams. Frogs need water to keep their skin wet.

**What Frogs Eat**

Frogs eat insects. They catch flies, beetles, and mosquitoes with their long, sticky tongues. A frog can catch a bug in less than one second!

**How Frogs Grow**

Frogs start their lives as tiny eggs in the water. The eggs hatch into tadpoles. Tadpoles look like little fish with tails. Over time, the tadpoles grow legs and lose their tails. Then they become frogs!

Fun Fact: Some frogs can jump 20 times their own body length!`,
    wordCount: 132,
    vocabulary: ['amphibians', 'insects', 'tadpoles', 'hatch'],
    comprehensionQuestions: ['g2-frogs-q1', 'g2-frogs-q2', 'g2-frogs-q3', 'g2-frogs-q4', 'g2-frogs-q5'],
    textFeatures: [
      {
        type: 'heading',
        location: 'Throughout passage',
        purpose: 'Shows different topics about frogs'
      },
      {
        type: 'bold-text',
        location: 'Section headings',
        purpose: 'Highlights important section titles'
      }
    ],
    created: new Date()
  };

  await db.comprehensionPassages.add(passage2);

  // Add questions for passage 2
  const questions2: ComprehensionQuestion[] = [
    {
      id: 'g2-frogs-q1',
      passageId: 'g2-nonfiction-frogs',
      questionText: 'What is the main idea of this passage?',
      questionType: 'inferential',
      skill: 'main-idea',
      correctAnswer: 'Frogs are amazing animals with special features',
      distractors: ['Frogs only live in water', 'Frogs eat plants', 'All frogs look the same'],
      explanation: 'The passage tells about many things that make frogs amazing: where they live, what they eat, and how they grow.',
      textEvidence: 'Frogs are amazing animals. They are amphibians.',
      scaffoldingLevel: 2,
      hints: [
        'What is this passage mostly about? Look at the title.',
        'The passage teaches you many facts. What animal is it teaching you about?',
        'What word does the passage use to describe frogs in the first sentence?'
      ]
    },
    {
      id: 'g2-frogs-q2',
      passageId: 'g2-nonfiction-frogs',
      questionText: 'What does the word "amphibian" mean?',
      questionType: 'vocabulary',
      skill: 'text-features',
      correctAnswer: 'An animal that can live in water and on land',
      distractors: ['An animal that only lives in water', 'An animal that has wings', 'An animal that is very small'],
      explanation: 'The passage explains that amphibian "means they can live in water and on land."',
      textEvidence: 'They are amphibians. This means they can live in water and on land.',
      scaffoldingLevel: 1,
      hints: [
        'Look at the first paragraph. What does it say amphibian means?',
        'The word comes right after "They are amphibians." Read the next sentence.',
        'Frogs can live in two places. Where are those two places?'
      ]
    },
    {
      id: 'g2-frogs-q3',
      passageId: 'g2-nonfiction-frogs',
      questionText: 'How do frogs catch their food?',
      questionType: 'literal',
      skill: 'details',
      correctAnswer: 'With their long, sticky tongues',
      distractors: ['With their hands', 'By jumping on it', 'By swimming after it'],
      explanation: 'The passage says frogs "catch flies, beetles, and mosquitoes with their long, sticky tongues."',
      textEvidence: 'They catch flies, beetles, and mosquitoes with their long, sticky tongues.',
      scaffoldingLevel: 1,
      hints: [
        'Look at the section "What Frogs Eat." How do they catch bugs?',
        'Frogs have something long and sticky. What is it?',
        'The passage says frogs catch bugs with their ____.'
      ]
    },
    {
      id: 'g2-frogs-q4',
      passageId: 'g2-nonfiction-frogs',
      questionText: 'Put the frog life cycle in order: 1. ___, 2. ___, 3. ___',
      questionType: 'inferential',
      skill: 'sequence',
      correctAnswer: 'Eggs, tadpoles, frogs',
      distractors: ['Tadpoles, eggs, frogs', 'Frogs, eggs, tadpoles', 'Eggs, frogs, tadpoles'],
      explanation: 'The passage explains: "Frogs start their lives as tiny eggs... The eggs hatch into tadpoles... Then they become frogs!"',
      textEvidence: 'Frogs start their lives as tiny eggs... The eggs hatch into tadpoles... Then they become frogs!',
      scaffoldingLevel: 2,
      hints: [
        'Read the section "How Frogs Grow." What comes first?',
        'Frogs start as tiny ___ in the water.',
        'First eggs, then tadpoles, then what?'
      ]
    },
    {
      id: 'g2-frogs-q5',
      passageId: 'g2-nonfiction-frogs',
      questionText: 'Why do frogs need to live near water?',
      questionType: 'inferential',
      skill: 'cause-effect',
      correctAnswer: 'To keep their skin wet',
      distractors: ['To hide from other animals', 'To find food', 'To sleep'],
      explanation: 'The passage states: "Frogs need water to keep their skin wet."',
      textEvidence: 'Frogs need water to keep their skin wet.',
      scaffoldingLevel: 2,
      hints: [
        'Look at the "Where Frogs Live" section. Why do they need water?',
        'What does water help keep wet on a frog?',
        'The passage says frogs need water to keep their ___ wet.'
      ]
    }
  ];

  await db.comprehensionQuestions.bulkAdd(questions2);

  // Add vocabulary for passage 2
  const vocab2: VocabularyTerm[] = [
    {
      id: 'g2-frogs-vocab-1',
      passageId: 'g2-nonfiction-frogs',
      term: 'amphibians',
      definition: 'Animals that can live both in water and on land',
      exampleSentence: 'Frogs and toads are amphibians because they live in water and on land.'
    },
    {
      id: 'g2-frogs-vocab-2',
      passageId: 'g2-nonfiction-frogs',
      term: 'insects',
      definition: 'Small animals with six legs, like flies and beetles',
      exampleSentence: 'Frogs eat insects such as flies and mosquitoes.'
    },
    {
      id: 'g2-frogs-vocab-3',
      passageId: 'g2-nonfiction-frogs',
      term: 'tadpoles',
      definition: 'Baby frogs that look like little fish with tails',
      exampleSentence: 'Tadpoles swim in the water before they grow legs and become frogs.'
    },
    {
      id: 'g2-frogs-vocab-4',
      passageId: 'g2-nonfiction-frogs',
      term: 'hatch',
      definition: 'To break out of an egg',
      exampleSentence: 'Frog eggs hatch into tadpoles in the water.'
    }
  ];

  await db.vocabularyTerms.bulkAdd(vocab2);
}
