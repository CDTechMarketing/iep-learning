import { Unit, Phrase, MathProblem } from '../types';
import { db } from '../db';

interface ParsedUnit {
  unit: Unit;
  phrases: Phrase[];
  mathProblems: MathProblem[];
}

export function parseMarkdownUnit(markdown: string): ParsedUnit {
  const lines = markdown.split('\n');
  let currentSection = '';

  const unit: Partial<Unit> = {
    tags: [],
    goalStars: [5, 10],
    createdAt: new Date()
  };

  const phrases: Phrase[] = [];
  const mathProblems: MathProblem[] = [];

  let cvcWords: string[] = [];
  let phraseLines: string[][] = [];
  let mathIdRange = { min: 0, max: 100 };
  let mathIdCount = 10;
  let additionProblems: string[] = [];
  let manipulatives: 'blocks' | 'icons' = 'blocks';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('# Unit:')) {
      unit.title = trimmed.replace('# Unit:', '').trim();
    } else if (trimmed.startsWith('unit-id:')) {
      unit.id = trimmed.replace('unit-id:', '').trim();
    } else if (trimmed.startsWith('goal-stars:')) {
      const starsMatch = trimmed.match(/\[([\d,\s]+)\]/);
      if (starsMatch) {
        unit.goalStars = starsMatch[1].split(',').map(s => parseInt(s.trim()));
      }
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSection = trimmed.slice(1, -1);
    } else if (trimmed.startsWith('- ') && currentSection === 'cvc-words') {
      cvcWords.push(trimmed.slice(2));
    } else if (trimmed.startsWith('- ') && currentSection === 'phrases') {
      const phrase = trimmed.slice(2);
      const words = phrase.split(' ');
      const lines: string[] = [];
      for (let i = 0; i < words.length; i++) {
        lines.push(words.slice(0, i + 1).join(' '));
      }
      phraseLines.push(lines);
    } else if (trimmed.startsWith('range:') && currentSection === 'math-identification') {
      const rangeMatch = trimmed.match(/(\d+)-(\d+)/);
      if (rangeMatch) {
        mathIdRange = { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
      }
    } else if (trimmed.startsWith('count:') && currentSection === 'math-identification') {
      mathIdCount = parseInt(trimmed.replace('count:', '').trim());
    } else if (trimmed.startsWith('- ') && currentSection === 'math-addition') {
      additionProblems.push(trimmed.slice(2));
    } else if (trimmed.startsWith('manipulatives:') && currentSection === 'math-addition') {
      const manip = trimmed.replace('manipulatives:', '').trim();
      if (manip === 'blocks' || manip === 'icons') {
        manipulatives = manip;
      }
    }
  }

  if (!unit.id || !unit.title) {
    throw new Error('Unit must have id and title');
  }

  const fullUnit: Unit = {
    id: unit.id,
    title: unit.title,
    tags: unit.tags || [],
    goalStars: unit.goalStars || [5, 10],
    createdAt: unit.createdAt!
  };

  cvcWords.forEach((word, index) => {
    phrases.push({
      id: `${unit.id}-cvc-${index}`,
      unitId: unit.id!,
      lines: [word]
    });
  });

  phraseLines.forEach((lines, index) => {
    phrases.push({
      id: `${unit.id}-phrase-${index}`,
      unitId: unit.id!,
      lines
    });
  });

  for (let i = 0; i < mathIdCount; i++) {
    const num = Math.floor(Math.random() * (mathIdRange.max - mathIdRange.min + 1)) + mathIdRange.min;
    mathProblems.push({
      id: `${unit.id}-num-${i}`,
      unitId: unit.id!,
      type: 'identification',
      prompt: num.toString(),
      answer: num
    });
  }

  additionProblems.forEach((problem, index) => {
    const [left, right] = problem.split('+').map(s => parseInt(s.trim()));
    mathProblems.push({
      id: `${unit.id}-add-${index}`,
      unitId: unit.id!,
      type: 'addition',
      prompt: problem,
      answer: left + right,
      manipulatives
    });
  });

  return { unit: fullUnit, phrases, mathProblems };
}

export async function importMarkdownUnit(markdown: string): Promise<void> {
  const { unit, phrases, mathProblems } = parseMarkdownUnit(markdown);

  await db.units.put(unit);

  await db.phrases.where('unitId').equals(unit.id).delete();
  await db.phrases.bulkAdd(phrases);

  await db.mathProblems.where('unitId').equals(unit.id).delete();
  await db.mathProblems.bulkAdd(mathProblems);
}
