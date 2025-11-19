/**
 * Phonics Progression Map - 8 Levels
 * Based on Science of Reading and systematic phonics instruction
 * Aligned with Virginia SOL K.5, 1.5, 2.5
 */

export interface PhonicsLevel {
  level: number;
  name: string;
  description: string;
  patternIds: string[];
  estimatedWeeks: number;
}

export const PHONICS_PROGRESSION: PhonicsLevel[] = [
  {
    level: 1,
    name: 'Letter Sounds',
    description: 'Master individual letter-sound correspondences for all 26 letters',
    patternIds: [
      'ls-a', 'ls-b', 'ls-c', 'ls-d', 'ls-e', 'ls-f', 'ls-g', 'ls-h',
      'ls-i', 'ls-j', 'ls-k', 'ls-l', 'ls-m', 'ls-n', 'ls-o', 'ls-p',
      'ls-q', 'ls-r', 'ls-s', 'ls-t', 'ls-u', 'ls-v', 'ls-w', 'ls-x',
      'ls-y', 'ls-z'
    ],
    estimatedWeeks: 4
  },
  {
    level: 2,
    name: 'CVC Words',
    description: 'Blend and segment three-sound words (Consonant-Vowel-Consonant)',
    patternIds: [
      'cvc-short-a',
      'cvc-short-e',
      'cvc-short-i',
      'cvc-short-o',
      'cvc-short-u'
    ],
    estimatedWeeks: 6
  },
  {
    level: 3,
    name: 'Digraphs',
    description: 'Learn two letters that make one sound',
    patternIds: [
      'digraph-ch',
      'digraph-sh',
      'digraph-th-voiced',
      'digraph-th-unvoiced',
      'digraph-wh',
      'digraph-ph'
    ],
    estimatedWeeks: 4
  },
  {
    level: 4,
    name: 'Consonant Blends',
    description: 'Two or more consonants that each keep their sound',
    patternIds: [
      'blend-bl', 'blend-cl', 'blend-fl', 'blend-gl', 'blend-pl', 'blend-sl',
      'blend-br', 'blend-cr', 'blend-dr', 'blend-fr', 'blend-gr', 'blend-pr', 'blend-tr',
      'blend-sc', 'blend-sk', 'blend-sm', 'blend-sn', 'blend-sp', 'blend-st', 'blend-sw',
      'blend-nd', 'blend-nt', 'blend-st-end', 'blend-lt', 'blend-mp'
    ],
    estimatedWeeks: 6
  },
  {
    level: 5,
    name: 'Long Vowel Patterns',
    description: 'Vowels that "say their name" in various patterns',
    patternIds: [
      'long-a-cvce', 'long-i-cvce', 'long-o-cvce', 'long-u-cvce',
      'long-ai', 'long-ay', 'long-ea', 'long-ee',
      'long-oa', 'long-ow', 'long-igh', 'long-ie'
    ],
    estimatedWeeks: 8
  },
  {
    level: 6,
    name: 'R-Controlled Vowels',
    description: 'Vowels changed by the letter R (Bossy R)',
    patternIds: [
      'r-controlled-ar',
      'r-controlled-er',
      'r-controlled-ir',
      'r-controlled-or',
      'r-controlled-ur'
    ],
    estimatedWeeks: 4
  },
  {
    level: 7,
    name: 'Diphthongs',
    description: 'Two vowel sounds gliding together',
    patternIds: [
      'diphthong-oi',
      'diphthong-oy',
      'diphthong-ou',
      'diphthong-ow',
      'diphthong-au',
      'diphthong-aw'
    ],
    estimatedWeeks: 3
  },
  {
    level: 8,
    name: 'Advanced Patterns',
    description: 'Complex patterns, silent letters, and exceptions',
    patternIds: [
      'advanced-silent-k',
      'advanced-silent-w',
      'advanced-silent-b',
      'advanced-silent-l',
      'advanced-soft-c',
      'advanced-soft-g',
      'advanced-tion',
      'advanced-le-ending'
    ],
    estimatedWeeks: 4
  }
];

/**
 * Get level information by level number
 */
export function getLevelByNumber(level: number): PhonicsLevel | undefined {
  return PHONICS_PROGRESSION.find(l => l.level === level);
}

/**
 * Get the next level after the current one
 */
export function getNextLevel(currentLevel: number): PhonicsLevel | undefined {
  return PHONICS_PROGRESSION.find(l => l.level === currentLevel + 1);
}

/**
 * Get all pattern IDs up to and including a specific level
 */
export function getAllPatternsUpToLevel(level: number): string[] {
  return PHONICS_PROGRESSION
    .filter(l => l.level <= level)
    .flatMap(l => l.patternIds);
}

/**
 * Find which level a pattern belongs to
 */
export function findLevelForPattern(patternId: string): number | undefined {
  const level = PHONICS_PROGRESSION.find(l => l.patternIds.includes(patternId));
  return level?.level;
}

/**
 * Calculate total estimated weeks for all levels
 */
export function getTotalEstimatedWeeks(): number {
  return PHONICS_PROGRESSION.reduce((sum, level) => sum + level.estimatedWeeks, 0);
}

/**
 * Get color for level (for UI color coding)
 */
export function getLevelColor(level: number): string {
  const colors: Record<number, string> = {
    1: '#3B82F6', // Blue - Letter sounds
    2: '#10B981', // Green - CVC
    3: '#8B5CF6', // Purple - Digraphs
    4: '#F59E0B', // Orange - Blends
    5: '#EC4899', // Pink - Long vowels
    6: '#EF4444', // Red - R-controlled
    7: '#14B8A6', // Teal - Diphthongs
    8: '#6366F1'  // Indigo - Advanced
  };
  return colors[level] || '#6B7280'; // Gray default
}
