interface ParsedUnit {
  unitId: string;
  title: string;
  difficulty?: number;
  goalStars: number[];
  tags: string[];
  cvcWords: string[];
  phrases: string[];
  mathProblems: Array<{
    type: 'identification' | 'addition' | 'number-line' | 'ten-frame' | 'touch-count';
    prompt: string;
    answer: number;
    manipulatives?: string;
    rangeStart?: number;
    rangeEnd?: number;
    options?: number[];
  }>;
}

export function parseUnitMarkdown(markdown: string): ParsedUnit {
  const lines = markdown.split('\n');

  let unitId = '';
  let title = '';
  let difficulty: number | undefined;
  let goalStars: number[] = [];
  const tags: string[] = [];
  const cvcWords: string[] = [];
  const phrases: string[] = [];
  const mathProblems: Array<{
    type: 'identification' | 'addition' | 'number-line' | 'ten-frame' | 'touch-count';
    prompt: string;
    answer: number;
    manipulatives?: string;
    rangeStart?: number;
    rangeEnd?: number;
    options?: number[];
  }> = [];

  let inFrontmatter = false;
  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }

    if (inFrontmatter) {
      if (line.startsWith('unit-id:')) {
        unitId = line.replace('unit-id:', '').trim();
      } else if (line.startsWith('title:')) {
        title = line.replace('title:', '').trim().replace(/['"]/g, '');
      } else if (line.startsWith('difficulty:')) {
        difficulty = parseInt(line.replace('difficulty:', '').trim());
      } else if (line.startsWith('goal-stars:')) {
        const starsStr = line.replace('goal-stars:', '').trim();
        const match = starsStr.match(/\[(.*?)\]/);
        if (match) {
          goalStars = match[1].split(',').map(s => parseInt(s.trim()));
        }
      }
      continue;
    }

    if (line.startsWith('## CVC Words')) {
      currentSection = 'cvc';
      continue;
    } else if (line.startsWith('## Phrases')) {
      currentSection = 'phrases';
      continue;
    } else if (line.startsWith('## Math Problems')) {
      currentSection = 'math';
      continue;
    } else if (line.startsWith('###')) {
      continue;
    }

    if (line.startsWith('- ')) {
      const content = line.substring(2).trim();

      if (currentSection === 'cvc') {
        cvcWords.push(content);
      } else if (currentSection === 'phrases') {
        phrases.push(content);
      } else if (currentSection === 'math') {
        // Parse different math problem types
        
        // Addition: 1+1
        const additionMatch = content.match(/^(\d+)\+(\d+)$/);
        if (additionMatch) {
          const num1 = parseInt(additionMatch[1]);
          const num2 = parseInt(additionMatch[2]);
          mathProblems.push({
            type: 'addition',
            prompt: content,
            answer: num1 + num2,
            manipulatives: 'blocks'
          });
          continue;
        }

        // Identification: identify:23
        const identMatch = content.match(/^identify:(\d+)$/);
        if (identMatch) {
          const number = parseInt(identMatch[1]);
          mathProblems.push({
            type: 'identification',
            prompt: number.toString(),
            answer: number
          });
          continue;
        }

        // Number Line: number-line:23 (20-29)
        const numberLineMatch = content.match(/^number-line:(\d+)\s*\((\d+)-(\d+)\)$/);
        if (numberLineMatch) {
          const answer = parseInt(numberLineMatch[1]);
          const rangeStart = parseInt(numberLineMatch[2]);
          const rangeEnd = parseInt(numberLineMatch[3]);
          mathProblems.push({
            type: 'number-line',
            prompt: `Find ${answer}`,
            answer,
            rangeStart,
            rangeEnd
          });
          continue;
        }

        // Ten Frame: ten-frame:23 [21,23,24,13]
        const tenFrameMatch = content.match(/^ten-frame:(\d+)\s*\[([\d,\s]+)\]$/);
        if (tenFrameMatch) {
          const answer = parseInt(tenFrameMatch[1]);
          const options = tenFrameMatch[2].split(',').map(n => parseInt(n.trim()));
          mathProblems.push({
            type: 'ten-frame',
            prompt: 'How many dots?',
            answer,
            options
          });
          continue;
        }

        // Touch Count: touch-count:23 (stars|animals)
        const touchCountMatch = content.match(/^touch-count:(\d+)\s*\((\w+)\)$/);
        if (touchCountMatch) {
          const answer = parseInt(touchCountMatch[1]);
          const manipulatives = touchCountMatch[2];
          mathProblems.push({
            type: 'touch-count',
            prompt: manipulatives === 'stars' ? 'Count the stars!' : 'Count the bears!',
            answer,
            manipulatives
          });
          continue;
        }
      }
    }
  }

  if (!unitId) {
    throw new Error('Missing required field: unit-id');
  }
  if (!title) {
    throw new Error('Missing required field: title');
  }
  if (goalStars.length === 0) {
    throw new Error('Missing required field: goal-stars');
  }

  if (cvcWords.length > 0) {
    tags.push('cvc', 'reading');
  }
  if (mathProblems.length > 0) {
    tags.push('math');
    const hasAddition = mathProblems.some(p => p.type === 'addition');
    const hasNumberSense = mathProblems.some(p =>
      ['identification', 'number-line', 'ten-frame', 'touch-count'].includes(p.type)
    );
    if (hasAddition) {
      tags.push('addition');
    }
    if (hasNumberSense) {
      tags.push('number-sense');
    }
  }

  return {
    unitId,
    title,
    difficulty,
    goalStars,
    tags,
    cvcWords,
    phrases,
    mathProblems
  };
}

export function validateMarkdown(markdown: string): { valid: boolean; error?: string } {
  if (!markdown.trim()) {
    return { valid: false, error: 'Markdown content is empty' };
  }

  if (!markdown.includes('---')) {
    return { valid: false, error: 'Missing frontmatter section (---). Please include unit metadata.' };
  }

  if (!markdown.includes('unit-id:')) {
    return { valid: false, error: 'Missing unit-id in frontmatter' };
  }

  if (!markdown.includes('title:')) {
    return { valid: false, error: 'Missing title in frontmatter' };
  }

  if (!markdown.includes('goal-stars:')) {
    return { valid: false, error: 'Missing goal-stars in frontmatter' };
  }

  const hasCVC = markdown.includes('## CVC Words');
  const hasPhrases = markdown.includes('## Phrases');
  const hasMath = markdown.includes('## Math Problems');

  if (!hasCVC && !hasPhrases && !hasMath) {
    return { valid: false, error: 'No content sections found. Include at least one: ## CVC Words, ## Phrases, or ## Math Problems' };
  }

  return { valid: true };
}
