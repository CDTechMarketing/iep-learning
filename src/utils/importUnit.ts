import { db } from '../db';
import { Unit, Phrase, MathProblem } from '../types';
import { parseUnitMarkdown, validateMarkdown } from './unitImporter';

export async function importUnitFromMarkdown(markdown: string): Promise<{ title: string }> {
  const validation = validateMarkdown(markdown);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid markdown format');
  }

  const parsed = parseUnitMarkdown(markdown);

  const existingUnit = await db.units.get(parsed.unitId);
  if (existingUnit) {
    throw new Error(`A unit with ID "${parsed.unitId}" already exists. Please use a different unit-id.`);
  }

  const unit: Unit = {
    id: parsed.unitId,
    title: parsed.title,
    tags: parsed.tags,
    goalStars: parsed.goalStars,
    createdAt: new Date()
  };

  await db.units.add(unit);

  if (parsed.cvcWords.length > 0 || parsed.phrases.length > 0) {
    const phrasesToAdd: Phrase[] = [];

    parsed.cvcWords.forEach((word, idx) => {
      phrasesToAdd.push({
        id: `${parsed.unitId}-cvc-${idx + 1}`,
        unitId: parsed.unitId,
        lines: [word]
      });
    });

    parsed.phrases.forEach((phrase, idx) => {
      // Split by spaces, reconstruct progressively
      const words = phrase.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      for (let i = 0; i < words.length; i++) {
        lines.push(words.slice(0, i + 1).join(' '));
      }

      phrasesToAdd.push({
        id: `${parsed.unitId}-phrase-${idx + 1}`,
        unitId: parsed.unitId,
        lines
      });
    });

    if (phrasesToAdd.length > 0) {
      await db.phrases.bulkAdd(phrasesToAdd);
    }
  }

  if (parsed.mathProblems.length > 0) {
    const mathToAdd: MathProblem[] = parsed.mathProblems.map((prob, idx) => {
      const mathProblem: MathProblem = {
        id: `${parsed.unitId}-prob-${idx + 1}`,
        unitId: parsed.unitId,
        type: prob.type,
        prompt: prob.prompt,
        answer: prob.answer,
      };

      if (prob.manipulatives) {
        if (['blocks', 'icons', 'stars', 'animals'].includes(prob.manipulatives)) {
          mathProblem.manipulatives = prob.manipulatives as 'blocks' | 'icons' | 'stars' | 'animals';
        }
      }

      if (prob.rangeStart !== undefined) mathProblem.rangeStart = prob.rangeStart;
      if (prob.rangeEnd !== undefined) mathProblem.rangeEnd = prob.rangeEnd;
      if (prob.options !== undefined) mathProblem.options = prob.options;

      return mathProblem;
    });

    await db.mathProblems.bulkAdd(mathToAdd);
  }

  return { title: parsed.title };
}
