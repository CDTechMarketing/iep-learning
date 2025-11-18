import { db } from '../db';

export interface SkillMastery {
  skill: string;
  isMastered: boolean;
  accuracy: number;
  attemptsCount: number;
  passagesCount: number; // Number of different passages where skill was practiced
  lastAttempt: Date;
  trend: 'improving' | 'declining' | 'stable';
}

/**
 * Check if a student has mastered a specific skill
 * Mastery criteria:
 * - 80%+ accuracy
 * - Demonstrated across 3+ different passages
 * - Consistent performance (recent attempts also good)
 */
export async function checkSkillMastery(
  studentId: string,
  skill: string
): Promise<SkillMastery> {
  // Get all attempts for this skill
  const allAttempts = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  // Get questions to map to skills
  const questionIds = allAttempts.map(a => a.questionId);
  const questions = await db.comprehensionQuestions
    .where('id')
    .anyOf(questionIds)
    .toArray();

  const questionMap = new Map(questions.map(q => [q.id, q]));

  // Filter attempts for this specific skill
  const skillAttempts = allAttempts.filter(attempt => {
    const question = questionMap.get(attempt.questionId);
    return question?.skill === skill;
  });

  if (skillAttempts.length === 0) {
    return {
      skill,
      isMastered: false,
      accuracy: 0,
      attemptsCount: 0,
      passagesCount: 0,
      lastAttempt: new Date(),
      trend: 'stable'
    };
  }

  // Calculate overall accuracy
  const correctCount = skillAttempts.filter(a => a.isCorrect).length;
  const accuracy = correctCount / skillAttempts.length;

  // Count unique passages
  const uniquePassages = new Set(skillAttempts.map(a => a.passageId));
  const passagesCount = uniquePassages.size;

  // Check recent performance (last 5 attempts)
  const recentAttempts = skillAttempts.slice(-5);
  const recentCorrect = recentAttempts.filter(a => a.isCorrect).length;
  const recentAccuracy = recentCorrect / recentAttempts.length;

  // Calculate trend
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (skillAttempts.length >= 10) {
    const firstHalf = skillAttempts.slice(0, Math.floor(skillAttempts.length / 2));
    const secondHalf = skillAttempts.slice(Math.floor(skillAttempts.length / 2));

    const firstAccuracy =
      firstHalf.filter(a => a.isCorrect).length / firstHalf.length;
    const secondAccuracy =
      secondHalf.filter(a => a.isCorrect).length / secondHalf.length;

    if (secondAccuracy > firstAccuracy + 0.1) {
      trend = 'improving';
    } else if (secondAccuracy < firstAccuracy - 0.1) {
      trend = 'declining';
    }
  }

  // Determine mastery
  const isMastered =
    accuracy >= 0.80 &&
    passagesCount >= 3 &&
    recentAccuracy >= 0.70 && // Don't lose mastery if one bad attempt
    skillAttempts.length >= 5;

  return {
    skill,
    isMastered,
    accuracy,
    attemptsCount: skillAttempts.length,
    passagesCount,
    lastAttempt: skillAttempts[skillAttempts.length - 1].timestamp,
    trend
  };
}

/**
 * Get mastery status for all reading comprehension skills
 */
export async function getAllSkillsMastery(
  studentId: string
): Promise<SkillMastery[]> {
  const allSkills = [
    'main-idea',
    'details',
    'sequence',
    'cause-effect',
    'compare-contrast',
    'character-analysis',
    'prediction',
    'author-purpose',
    'text-features'
  ];

  const masteryResults = await Promise.all(
    allSkills.map(skill => checkSkillMastery(studentId, skill))
  );

  // Filter out skills with no attempts
  return masteryResults.filter(m => m.attemptsCount > 0);
}

/**
 * Check if student should advance to next grade level
 */
export async function shouldAdvanceLevel(
  studentId: string,
  currentLevel: 1 | 2 | 3
): Promise<boolean> {
  const attempts = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  // Get passages for current level
  const passages = await db.comprehensionPassages
    .where('gradeLevel')
    .equals(currentLevel)
    .toArray();

  const currentLevelPassageIds = new Set(passages.map(p => p.id));

  // Filter attempts for current level
  const levelAttempts = attempts.filter(a =>
    currentLevelPassageIds.has(a.passageId)
  );

  if (levelAttempts.length < 20) {
    return false; // Need more practice at current level
  }

  // Check recent performance (last 20 attempts)
  const recentAttempts = levelAttempts.slice(-20);
  const correctCount = recentAttempts.filter(a => a.isCorrect).length;
  const accuracy = correctCount / recentAttempts.length;

  // Advance if 80%+ accuracy on recent attempts
  return accuracy >= 0.80;
}

/**
 * Check if student should move down a level (struggling)
 */
export async function shouldMoveDownLevel(
  studentId: string,
  currentLevel: 1 | 2 | 3
): Promise<boolean> {
  if (currentLevel === 1) {
    return false; // Can't go lower than level 1
  }

  const attempts = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  // Get passages for current level
  const passages = await db.comprehensionPassages
    .where('gradeLevel')
    .equals(currentLevel)
    .toArray();

  const currentLevelPassageIds = new Set(passages.map(p => p.id));

  // Filter attempts for current level
  const levelAttempts = attempts.filter(a =>
    currentLevelPassageIds.has(a.passageId)
  );

  if (levelAttempts.length < 10) {
    return false; // Give more time to adjust to level
  }

  // Check recent performance
  const recentAttempts = levelAttempts.slice(-10);
  const correctCount = recentAttempts.filter(a => a.isCorrect).length;
  const accuracy = correctCount / recentAttempts.length;

  // Move down if below 50% accuracy consistently
  return accuracy < 0.50;
}

/**
 * Get recommended focus areas for student
 */
export async function getRecommendedFocusAreas(
  studentId: string
): Promise<string[]> {
  const allMastery = await getAllSkillsMastery(studentId);

  // Sort by accuracy (lowest first)
  const sorted = allMastery.sort((a, b) => a.accuracy - b.accuracy);

  // Return top 3 skills that need work (not mastered and have been attempted)
  return sorted
    .filter(m => !m.isMastered && m.attemptsCount >= 3)
    .slice(0, 3)
    .map(m => m.skill);
}

/**
 * Calculate a comprehension readiness score (0-100)
 */
export async function getComprehensionReadinessScore(
  studentId: string,
  targetLevel: 1 | 2 | 3
): Promise<number> {
  const allMastery = await getAllSkillsMastery(studentId);

  if (allMastery.length === 0) {
    return 0;
  }

  // Weight different skills
  const skillWeights: Record<string, number> = {
    'main-idea': 2, // Most important
    details: 2,
    'cause-effect': 1.5,
    inference: 1.5,
    sequence: 1,
    'character-analysis': 1,
    prediction: 1,
    'author-purpose': 0.5,
    'text-features': 0.5
  };

  let totalWeight = 0;
  let weightedScore = 0;

  allMastery.forEach(mastery => {
    const weight = skillWeights[mastery.skill] || 1;
    totalWeight += weight;

    if (mastery.isMastered) {
      weightedScore += weight * 100;
    } else {
      weightedScore += weight * (mastery.accuracy * 80); // Max 80 points if not mastered
    }
  });

  if (totalWeight === 0) {
    return 0;
  }

  const score = Math.round(weightedScore / totalWeight);

  // Adjust based on target level
  const currentLevel = await getCurrentEstimatedLevel(studentId);

  if (currentLevel < targetLevel) {
    // Not ready yet, reduce score
    return Math.round(score * 0.7);
  } else if (currentLevel > targetLevel) {
    // Exceed requirements
    return Math.min(100, Math.round(score * 1.1));
  }

  return score;
}

/**
 * Estimate current reading level based on performance
 */
async function getCurrentEstimatedLevel(
  studentId: string
): Promise<1 | 2 | 3> {
  const attempts = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  if (attempts.length === 0) {
    return 1;
  }

  // Get passages to determine their levels
  const passageIds = [...new Set(attempts.map(a => a.passageId))];
  const passages = await db.comprehensionPassages
    .where('id')
    .anyOf(passageIds)
    .toArray();

  const passageLevelMap = new Map(passages.map(p => [p.id, p.gradeLevel]));

  // Calculate accuracy by level
  const levelStats = new Map<number, { correct: number; total: number }>();

  attempts.forEach(attempt => {
    const level = passageLevelMap.get(attempt.passageId) || 1;
    const stats = levelStats.get(level) || { correct: 0, total: 0 };
    stats.total++;
    if (attempt.isCorrect) {
      stats.correct++;
    }
    levelStats.set(level, stats);
  });

  // Find highest level with 70%+ accuracy
  for (let level = 3; level >= 1; level--) {
    const stats = levelStats.get(level);
    if (stats && stats.total >= 5) {
      const accuracy = stats.correct / stats.total;
      if (accuracy >= 0.70) {
        return level as 1 | 2 | 3;
      }
    }
  }

  return 1;
}
