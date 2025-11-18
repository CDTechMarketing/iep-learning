import { db } from '../db';
import { Unit, MultisyllabicWord, SyllableProblem } from '../types';

/**
 * Agent 3: Reading Syllables Specialist
 * Multi-Syllabic Words Module
 * Target: 20-25 hours, ~55-70 activities
 *
 * Units:
 * 1. Syllable Awareness (counting only) - 10 activities
 * 2. Compound Words - 16 activities
 * 3. Two-Syllable Closed - 15 activities
 * 4. Two-Syllable Open - 15 activities
 * 5. Mixed Two-Syllable - 12 activities
 *
 * Total: ~68 activities
 */

export async function seedAgent3SyllablesUnits() {
  // ==========================================================================
  // UNIT 1: SYLLABLE AWARENESS (Counting Only - No Reading Yet)
  // ==========================================================================

  const syllableIntroUnitId = 'syllable-intro-001';
  const syllableIntroUnit: Unit = {
    id: syllableIntroUnitId,
    title: 'What is a Syllable?',
    tags: ['reading', 'syllables', 'phonological-awareness', 'agent-3'],
    goalStars: [5, 10],
    createdAt: new Date()
  };
  await db.units.add(syllableIntroUnit);

  const syllableIntroProblems: SyllableProblem[] = [
    { id: `${syllableIntroUnitId}-1`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'cat', correctSyllableCount: 1, options: [1, 2, 3], answer: 1 },
    { id: `${syllableIntroUnitId}-2`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'robot', correctSyllableCount: 2, options: [1, 2, 3], answer: 2 },
    { id: `${syllableIntroUnitId}-3`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'banana', correctSyllableCount: 3, options: [1, 2, 3], answer: 3 },
    { id: `${syllableIntroUnitId}-4`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'tiger', correctSyllableCount: 2, options: [1, 2, 3], answer: 2 },
    { id: `${syllableIntroUnitId}-5`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'dog', correctSyllableCount: 1, options: [1, 2, 3], answer: 1 },
    { id: `${syllableIntroUnitId}-6`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'elephant', correctSyllableCount: 3, options: [1, 2, 3], answer: 3 },
    { id: `${syllableIntroUnitId}-7`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'happy', correctSyllableCount: 2, options: [1, 2, 3], answer: 2 },
    { id: `${syllableIntroUnitId}-8`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'sun', correctSyllableCount: 1, options: [1, 2, 3], answer: 1 },
    { id: `${syllableIntroUnitId}-9`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'pencil', correctSyllableCount: 2, options: [1, 2, 3], answer: 2 },
    { id: `${syllableIntroUnitId}-10`, unitId: syllableIntroUnitId, type: 'syllable-count', prompt: 'How many syllables?', spokenWord: 'butterfly', correctSyllableCount: 3, options: [1, 2, 3], answer: 3 },
  ];
  await db.syllableProblems.bulkAdd(syllableIntroProblems);

  // ==========================================================================
  // UNIT 2: COMPOUND WORDS
  // ==========================================================================

  const compoundWordsUnitId = 'compound-words-001';
  const compoundWordsUnit: Unit = {
    id: compoundWordsUnitId,
    title: 'Compound Words',
    tags: ['reading', 'compound-words', 'multisyllabic', 'agent-3'],
    goalStars: [5, 10, 15],
    createdAt: new Date()
  };
  await db.units.add(compoundWordsUnit);

  const compoundWords: MultisyllabicWord[] = [
    {
      id: `${compoundWordsUnitId}-word-1`,
      unitId: compoundWordsUnitId,
      word: 'sunshine',
      syllables: ['sun', 'shine'],
      syllableCount: 2,
      syllableTypes: ['compound', 'compound'],
      isCompound: true,
      compoundParts: ['sun', 'shine']
    },
    {
      id: `${compoundWordsUnitId}-word-2`,
      unitId: compoundWordsUnitId,
      word: 'rainbow',
      syllables: ['rain', 'bow'],
      syllableCount: 2,
      syllableTypes: ['compound', 'compound'],
      isCompound: true,
      compoundParts: ['rain', 'bow']
    },
    {
      id: `${compoundWordsUnitId}-word-3`,
      unitId: compoundWordsUnitId,
      word: 'baseball',
      syllables: ['base', 'ball'],
      syllableCount: 2,
      syllableTypes: ['compound', 'compound'],
      isCompound: true,
      compoundParts: ['base', 'ball']
    },
    {
      id: `${compoundWordsUnitId}-word-4`,
      unitId: compoundWordsUnitId,
      word: 'cupcake',
      syllables: ['cup', 'cake'],
      syllableCount: 2,
      syllableTypes: ['compound', 'compound'],
      isCompound: true,
      compoundParts: ['cup', 'cake']
    },
    {
      id: `${compoundWordsUnitId}-word-5`,
      unitId: compoundWordsUnitId,
      word: 'doghouse',
      syllables: ['dog', 'house'],
      syllableCount: 2,
      syllableTypes: ['compound', 'compound'],
      isCompound: true,
      compoundParts: ['dog', 'house']
    },
    {
      id: `${compoundWordsUnitId}-word-6`,
      unitId: compoundWordsUnitId,
      word: 'sunflower',
      syllables: ['sun', 'flower'],
      syllableCount: 2,
      syllableTypes: ['compound', 'compound'],
      isCompound: true,
      compoundParts: ['sun', 'flower']
    },
    {
      id: `${compoundWordsUnitId}-word-7`,
      unitId: compoundWordsUnitId,
      word: 'football',
      syllables: ['foot', 'ball'],
      syllableCount: 2,
      syllableTypes: ['compound', 'compound'],
      isCompound: true,
      compoundParts: ['foot', 'ball']
    },
    {
      id: `${compoundWordsUnitId}-word-8`,
      unitId: compoundWordsUnitId,
      word: 'bedroom',
      syllables: ['bed', 'room'],
      syllableCount: 2,
      syllableTypes: ['compound', 'compound'],
      isCompound: true,
      compoundParts: ['bed', 'room']
    },
  ];
  await db.multisyllabicWords.bulkAdd(compoundWords);

  const compoundProblems: SyllableProblem[] = [];

  // Compound word building activities (8 activities)
  compoundWords.forEach((word, index) => {
    compoundProblems.push({
      id: `${compoundWordsUnitId}-build-${index + 1}`,
      unitId: compoundWordsUnitId,
      type: 'compound-building',
      prompt: 'Put the words together!',
      compoundParts: word.compoundParts,
      compoundResult: word.word,
      answer: word.word
    });
  });

  // Compound word reading activities (8 activities)
  compoundWords.forEach((word, index) => {
    compoundProblems.push({
      id: `${compoundWordsUnitId}-read-${index + 1}`,
      unitId: compoundWordsUnitId,
      type: 'multisyllabic-reading',
      prompt: 'Read this word:',
      word: word.word,
      multisyllabicWord: word,
      answer: word.word
    });
  });

  await db.syllableProblems.bulkAdd(compoundProblems);

  // ==========================================================================
  // UNIT 3: TWO-SYLLABLE CLOSED (CVC-CVC)
  // ==========================================================================

  const twoSyllableClosedUnitId = 'two-syllable-closed-001';
  const twoSyllableClosedUnit: Unit = {
    id: twoSyllableClosedUnitId,
    title: 'Two-Syllable Words (napkin, rabbit)',
    tags: ['reading', 'two-syllable', 'closed-syllables', 'agent-3'],
    goalStars: [5, 10, 15],
    createdAt: new Date()
  };
  await db.units.add(twoSyllableClosedUnit);

  const twoSyllableClosedWords: MultisyllabicWord[] = [
    { id: `${twoSyllableClosedUnitId}-word-1`, unitId: twoSyllableClosedUnitId, word: 'napkin', syllables: ['nap', 'kin'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${twoSyllableClosedUnitId}-word-2`, unitId: twoSyllableClosedUnitId, word: 'rabbit', syllables: ['rab', 'bit'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${twoSyllableClosedUnitId}-word-3`, unitId: twoSyllableClosedUnitId, word: 'basket', syllables: ['bas', 'ket'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${twoSyllableClosedUnitId}-word-4`, unitId: twoSyllableClosedUnitId, word: 'kitten', syllables: ['kit', 'ten'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${twoSyllableClosedUnitId}-word-5`, unitId: twoSyllableClosedUnitId, word: 'mitten', syllables: ['mit', 'ten'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${twoSyllableClosedUnitId}-word-6`, unitId: twoSyllableClosedUnitId, word: 'pumpkin', syllables: ['pump', 'kin'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${twoSyllableClosedUnitId}-word-7`, unitId: twoSyllableClosedUnitId, word: 'picnic', syllables: ['pic', 'nic'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${twoSyllableClosedUnitId}-word-8`, unitId: twoSyllableClosedUnitId, word: 'magnet', syllables: ['mag', 'net'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
  ];
  await db.multisyllabicWords.bulkAdd(twoSyllableClosedWords);

  const twoSyllableClosedProblems: SyllableProblem[] = [];

  // Syllable division activities (7 activities - subset of words)
  const divisionWords = twoSyllableClosedWords.slice(0, 7);
  divisionWords.forEach((word, index) => {
    twoSyllableClosedProblems.push({
      id: `${twoSyllableClosedUnitId}-div-${index + 1}`,
      unitId: twoSyllableClosedUnitId,
      type: 'syllable-division',
      prompt: 'Where should we divide this word?',
      word: word.word,
      correctDivision: word.syllables.join('-'),
      answer: word.syllables.join('-')
    });
  });

  // Reading activities (8 activities)
  twoSyllableClosedWords.forEach((word, index) => {
    twoSyllableClosedProblems.push({
      id: `${twoSyllableClosedUnitId}-read-${index + 1}`,
      unitId: twoSyllableClosedUnitId,
      type: 'multisyllabic-reading',
      prompt: 'Read this word:',
      word: word.word,
      multisyllabicWord: word,
      answer: word.word
    });
  });

  await db.syllableProblems.bulkAdd(twoSyllableClosedProblems);

  // ==========================================================================
  // UNIT 4: TWO-SYLLABLE OPEN (CV-CV)
  // ==========================================================================

  const twoSyllableOpenUnitId = 'two-syllable-open-001';
  const twoSyllableOpenUnit: Unit = {
    id: twoSyllableOpenUnitId,
    title: 'Two-Syllable Words (robot, baby, tiger)',
    tags: ['reading', 'two-syllable', 'open-syllables', 'agent-3'],
    goalStars: [5, 10, 15],
    createdAt: new Date()
  };
  await db.units.add(twoSyllableOpenUnit);

  const twoSyllableOpenWords: MultisyllabicWord[] = [
    { id: `${twoSyllableOpenUnitId}-word-1`, unitId: twoSyllableOpenUnitId, word: 'robot', syllables: ['ro', 'bot'], syllableCount: 2, syllableTypes: ['open', 'closed'], isCompound: false },
    { id: `${twoSyllableOpenUnitId}-word-2`, unitId: twoSyllableOpenUnitId, word: 'baby', syllables: ['ba', 'by'], syllableCount: 2, syllableTypes: ['open', 'open'], isCompound: false },
    { id: `${twoSyllableOpenUnitId}-word-3`, unitId: twoSyllableOpenUnitId, word: 'tiger', syllables: ['ti', 'ger'], syllableCount: 2, syllableTypes: ['open', 'closed'], isCompound: false },
    { id: `${twoSyllableOpenUnitId}-word-4`, unitId: twoSyllableOpenUnitId, word: 'music', syllables: ['mu', 'sic'], syllableCount: 2, syllableTypes: ['open', 'closed'], isCompound: false },
    { id: `${twoSyllableOpenUnitId}-word-5`, unitId: twoSyllableOpenUnitId, word: 'paper', syllables: ['pa', 'per'], syllableCount: 2, syllableTypes: ['open', 'closed'], isCompound: false },
    { id: `${twoSyllableOpenUnitId}-word-6`, unitId: twoSyllableOpenUnitId, word: 'lazy', syllables: ['la', 'zy'], syllableCount: 2, syllableTypes: ['open', 'open'], isCompound: false },
    { id: `${twoSyllableOpenUnitId}-word-7`, unitId: twoSyllableOpenUnitId, word: 'final', syllables: ['fi', 'nal'], syllableCount: 2, syllableTypes: ['open', 'closed'], isCompound: false },
    { id: `${twoSyllableOpenUnitId}-word-8`, unitId: twoSyllableOpenUnitId, word: 'tulip', syllables: ['tu', 'lip'], syllableCount: 2, syllableTypes: ['open', 'closed'], isCompound: false },
  ];
  await db.multisyllabicWords.bulkAdd(twoSyllableOpenWords);

  const twoSyllableOpenProblems: SyllableProblem[] = [];

  // Syllable division activities (7 activities)
  const divisionOpenWords = twoSyllableOpenWords.slice(0, 7);
  divisionOpenWords.forEach((word, index) => {
    twoSyllableOpenProblems.push({
      id: `${twoSyllableOpenUnitId}-div-${index + 1}`,
      unitId: twoSyllableOpenUnitId,
      type: 'syllable-division',
      prompt: 'Where should we divide this word?',
      word: word.word,
      correctDivision: word.syllables.join('-'),
      answer: word.syllables.join('-')
    });
  });

  // Reading activities (8 activities)
  twoSyllableOpenWords.forEach((word, index) => {
    twoSyllableOpenProblems.push({
      id: `${twoSyllableOpenUnitId}-read-${index + 1}`,
      unitId: twoSyllableOpenUnitId,
      type: 'multisyllabic-reading',
      prompt: 'Read this word:',
      word: word.word,
      multisyllabicWord: word,
      answer: word.word
    });
  });

  await db.syllableProblems.bulkAdd(twoSyllableOpenProblems);

  // ==========================================================================
  // UNIT 5: MIXED TWO-SYLLABLE
  // ==========================================================================

  const mixedTwoSyllableUnitId = 'mixed-two-syllable-001';
  const mixedTwoSyllableUnit: Unit = {
    id: mixedTwoSyllableUnitId,
    title: 'Mixed Two-Syllable Words',
    tags: ['reading', 'two-syllable', 'mixed', 'agent-3'],
    goalStars: [5, 10],
    createdAt: new Date()
  };
  await db.units.add(mixedTwoSyllableUnit);

  const mixedWords: MultisyllabicWord[] = [
    { id: `${mixedTwoSyllableUnitId}-word-1`, unitId: mixedTwoSyllableUnitId, word: 'table', syllables: ['ta', 'ble'], syllableCount: 2, syllableTypes: ['open', 'closed'], isCompound: false },
    { id: `${mixedTwoSyllableUnitId}-word-2`, unitId: mixedTwoSyllableUnitId, word: 'able', syllables: ['a', 'ble'], syllableCount: 2, syllableTypes: ['open', 'closed'], isCompound: false },
    { id: `${mixedTwoSyllableUnitId}-word-3`, unitId: mixedTwoSyllableUnitId, word: 'apple', syllables: ['ap', 'ple'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${mixedTwoSyllableUnitId}-word-4`, unitId: mixedTwoSyllableUnitId, word: 'purple', syllables: ['pur', 'ple'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${mixedTwoSyllableUnitId}-word-5`, unitId: mixedTwoSyllableUnitId, word: 'turtle', syllables: ['tur', 'tle'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
    { id: `${mixedTwoSyllableUnitId}-word-6`, unitId: mixedTwoSyllableUnitId, word: 'little', syllables: ['lit', 'tle'], syllableCount: 2, syllableTypes: ['closed', 'closed'], isCompound: false },
  ];
  await db.multisyllabicWords.bulkAdd(mixedWords);

  const mixedProblems: SyllableProblem[] = [];

  // Syllable division (6 activities)
  mixedWords.forEach((word, index) => {
    mixedProblems.push({
      id: `${mixedTwoSyllableUnitId}-div-${index + 1}`,
      unitId: mixedTwoSyllableUnitId,
      type: 'syllable-division',
      prompt: 'Where should we divide this word?',
      word: word.word,
      correctDivision: word.syllables.join('-'),
      answer: word.syllables.join('-')
    });
  });

  // Reading activities (6 activities)
  mixedWords.forEach((word, index) => {
    mixedProblems.push({
      id: `${mixedTwoSyllableUnitId}-read-${index + 1}`,
      unitId: mixedTwoSyllableUnitId,
      type: 'multisyllabic-reading',
      prompt: 'Read this word:',
      word: word.word,
      multisyllabicWord: word,
      answer: word.word
    });
  });

  await db.syllableProblems.bulkAdd(mixedProblems);

  console.log('✅ Agent 3 Syllables units seeded successfully!');
  console.log('   - 5 units created');
  console.log('   - Unit 1: Syllable Awareness (10 activities)');
  console.log('   - Unit 2: Compound Words (16 activities)');
  console.log('   - Unit 3: Two-Syllable Closed (15 activities)');
  console.log('   - Unit 4: Two-Syllable Open (15 activities)');
  console.log('   - Unit 5: Mixed Two-Syllable (12 activities)');
  console.log('   - Total: 68 activities');
}
