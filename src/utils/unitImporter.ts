import { Unit, Phrase, MathProblem } from '../types';

interface ParsedUnit {
  unitId: string;
  title: string;
  difficulty?: number;
  goalStars: number[];
  tags: string[];
  cvcWords: string[];
  phrases: string[];
  mathProblems: { prompt: string; answer: number }[];
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
  const mathProblems: { prompt: string; answer: number }[] = [];

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
        const problemMatch = content.match(/^(\d+)\+(\d+)$/);
        if (problemMatch) {
          const num1 = parseInt(problemMatch[1]);
          const num2 = parseInt(problemMatch[2]);
          mathProblems.push({
            prompt: content,
            answer: num1 + num2
          });
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
    tags.push('math', 'addition');
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
