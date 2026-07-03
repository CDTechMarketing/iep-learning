import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { parseUnitMarkdown, validateMarkdown } from './unitImporter';
import { importUnitFromMarkdown } from './importUnit';
import { db } from '../db';

describe('unitImporter & importUnit', () => {
  beforeEach(async () => {
    // Clear databases before each test
    await db.units.clear();
    await db.phrases.clear();
    await db.mathProblems.clear();
  });

  const validMarkdown = `---
unit-id: test-unit-001
title: "Test Unit"
goal-stars: [5, 10]
---

## CVC Words
- cat
- sat

## Phrases
- the cat sat

## Math Problems
- 1+1
- identify:5
- number-line:23 (20-29)
- ten-frame:23 [21,23,24,13]
- touch-count:23 (stars)
`;

  it('should parse math formats with correct fields', () => {
    const parsed = parseUnitMarkdown(validMarkdown);
    expect(parsed.unitId).toBe('test-unit-001');
    expect(parsed.title).toBe('Test Unit');
    expect(parsed.goalStars).toEqual([5, 10]);

    // Check tags: both math, addition, and number-sense should be present
    expect(parsed.tags).toContain('math');
    expect(parsed.tags).toContain('addition');
    expect(parsed.tags).toContain('number-sense');

    // 5 math problems
    expect(parsed.mathProblems).toHaveLength(5);

    const [add, ident, nl, tf, tc] = parsed.mathProblems;

    expect(add).toEqual({
      type: 'addition',
      prompt: '1+1',
      answer: 2,
      manipulatives: 'blocks'
    });

    expect(ident).toEqual({
      type: 'identification',
      prompt: '5',
      answer: 5
    });

    expect(nl).toEqual({
      type: 'number-line',
      prompt: 'Find 23',
      answer: 23,
      rangeStart: 20,
      rangeEnd: 29
    });

    expect(tf).toEqual({
      type: 'ten-frame',
      prompt: 'How many dots?',
      answer: 23,
      options: [21, 23, 24, 13]
    });

    expect(tc).toEqual({
      type: 'touch-count',
      prompt: 'Count the stars!',
      answer: 23,
      manipulatives: 'stars'
    });
  });

  it('should parse ten-frame options array with 4 entries', () => {
    const parsed = parseUnitMarkdown(validMarkdown);
    const tfProblem = parsed.mathProblems.find(p => p.type === 'ten-frame');
    expect(tfProblem?.options).toBeDefined();
    expect(tfProblem?.options).toHaveLength(4);
    expect(tfProblem?.options).toEqual([21, 23, 24, 13]);
  });

  it('should build phrases cumulatively', async () => {
    await importUnitFromMarkdown(validMarkdown);

    // CVC words are single-line
    const catPhrase = await db.phrases.where('id').equals('test-unit-001-cvc-1').first();
    expect(catPhrase?.lines).toEqual(['cat']);

    // Phrases are progressive
    const progressivePhrase = await db.phrases.where('id').equals('test-unit-001-phrase-1').first();
    expect(progressivePhrase?.lines).toEqual(['the', 'the cat', 'the cat sat']);
  });

  it('should throw error for missing unit-id, title, or goal-stars', () => {
    const missingId = `---
title: "Test Unit"
goal-stars: [5, 10]
---
## CVC Words
- cat`;

    const missingTitle = `---
unit-id: test-001
goal-stars: [5, 10]
---
## CVC Words
- cat`;

    const missingGoal = `---
unit-id: test-001
title: "Test"
---
## CVC Words
- cat`;

    expect(() => parseUnitMarkdown(missingId)).toThrow('Missing required field: unit-id');
    expect(() => parseUnitMarkdown(missingTitle)).toThrow('Missing required field: title');
    expect(() => parseUnitMarkdown(missingGoal)).toThrow('Missing required field: goal-stars');
  });

  it('should reject invalid markdown with validateMarkdown', () => {
    const emptyMarkdown = '   ';
    const noFrontmatter = `## CVC Words\n- cat`;
    const noId = `---\ntitle: "Test"\ngoal-stars: [5]\n---\n## CVC Words\n- cat`;
    const noContent = `---\nunit-id: test\ntitle: "Test"\ngoal-stars: [5]\n---`;

    expect(validateMarkdown(emptyMarkdown).valid).toBe(false);
    expect(validateMarkdown(noFrontmatter).valid).toBe(false);
    expect(validateMarkdown(noFrontmatter).error).toContain('frontmatter');
    expect(validateMarkdown(noId).valid).toBe(false);
    expect(validateMarkdown(noId).error).toContain('unit-id');
    expect(validateMarkdown(noContent).valid).toBe(false);
    expect(validateMarkdown(noContent).error).toContain('No content sections found');
  });
});
