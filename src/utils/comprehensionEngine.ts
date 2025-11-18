import { db } from '../db';
import {
  ReadingComprehensionPassage,
  ComprehensionAttempt,
  ComprehensionQuestion
} from '../types';

/**
 * Calculate student's current comprehension level (1-3) based on recent performance
 */
export async function calculateComprehensionLevel(
  studentId: string
): Promise<1 | 2 | 3> {
  const attempts = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .reverse()
    .limit(20)
    .toArray();

  if (attempts.length < 5) {
    return 1; // Start at level 1 if not enough data
  }

  const accuracy = attempts.filter(a => a.isCorrect).length / attempts.length;

  // Determine level based on recent performance
  if (accuracy >= 0.80) {
    return 3; // Advanced level
  } else if (accuracy >= 0.65) {
    return 2; // Intermediate level
  } else {
    return 1; // Beginning level
  }
}

/**
 * Identify skills where student accuracy is below 70%
 */
export async function identifyWeakSkills(
  studentId: string
): Promise<string[]> {
  const attempts = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  if (attempts.length === 0) {
    return [];
  }

  // Get all questions for these attempts
  const questionIds = attempts.map(a => a.questionId);
  const questions = await db.comprehensionQuestions
    .where('id')
    .anyOf(questionIds)
    .toArray();

  // Map question IDs to skills
  const questionSkillMap = new Map<string, string>();
  questions.forEach(q => {
    questionSkillMap.set(q.id, q.skill);
  });

  // Calculate accuracy by skill
  const skillStats = new Map<string, { correct: number; total: number }>();

  attempts.forEach(attempt => {
    const skill = questionSkillMap.get(attempt.questionId);
    if (skill) {
      const stats = skillStats.get(skill) || { correct: 0, total: 0 };
      stats.total++;
      if (attempt.isCorrect) {
        stats.correct++;
      }
      skillStats.set(skill, stats);
    }
  });

  // Find skills with < 70% accuracy
  const weakSkills: string[] = [];
  skillStats.forEach((stats, skill) => {
    const accuracy = stats.correct / stats.total;
    if (accuracy < 0.70 && stats.total >= 3) {
      // At least 3 attempts to be statistically meaningful
      weakSkills.push(skill);
    }
  });

  return weakSkills;
}

/**
 * Get the last genre practiced
 */
export async function getLastGenre(
  studentId: string
): Promise<'fiction' | 'nonfiction' | null> {
  const lastAttempt = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .reverse()
    .first();

  if (!lastAttempt) {
    return null;
  }

  const passage = await db.comprehensionPassages.get(lastAttempt.passageId);
  return passage?.genre === 'fiction' || passage?.genre === 'poetry'
    ? 'fiction'
    : 'nonfiction';
}

/**
 * Select the next passage for the student based on adaptive algorithm
 */
export async function selectNextPassage(
  studentId: string
): Promise<ReadingComprehensionPassage | null> {
  // 1. Calculate current comprehension level
  const currentLevel = await calculateComprehensionLevel(studentId);

  // 2. Identify weak skills
  const weakSkills = await identifyWeakSkills(studentId);

  // 3. Balance genre exposure (alternate fiction/nonfiction)
  const lastGenre = await getLastGenre(studentId);
  const preferredGenre =
    lastGenre === null
      ? 'fiction' // Start with fiction
      : lastGenre === 'fiction'
      ? 'nonfiction'
      : 'fiction';

  // 4. Get recently completed passages to avoid repetition
  const recentAttempts = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .reverse()
    .limit(10)
    .toArray();

  const recentPassageIds = new Set(recentAttempts.map(a => a.passageId));

  // 5. Find suitable passages
  let passages = await db.comprehensionPassages
    .where('gradeLevel')
    .equals(currentLevel)
    .toArray();

  // Filter by preferred genre
  passages = passages.filter(p => {
    const genre = p.genre === 'fiction' || p.genre === 'poetry' ? 'fiction' : 'nonfiction';
    return genre === preferredGenre;
  });

  // Filter out recently completed passages
  passages = passages.filter(p => !recentPassageIds.has(p.id));

  // If we have weak skills, try to find passages that target those skills
  if (weakSkills.length > 0 && passages.length > 0) {
    const passagesWithQuestions = await Promise.all(
      passages.map(async p => {
        const questions = await db.comprehensionQuestions
          .where('passageId')
          .equals(p.id)
          .toArray();
        return { passage: p, questions };
      })
    );

    // Find passages that have questions targeting weak skills
    const targetedPassages = passagesWithQuestions.filter(({ questions }) =>
      questions.some(q => weakSkills.includes(q.skill))
    );

    if (targetedPassages.length > 0) {
      // Return a random passage from those that target weak skills
      const randomIndex = Math.floor(Math.random() * targetedPassages.length);
      return targetedPassages[randomIndex].passage;
    }
  }

  // If no targeted passages or no weak skills, return a random appropriate passage
  if (passages.length > 0) {
    const randomIndex = Math.floor(Math.random() * passages.length);
    return passages[randomIndex];
  }

  // If no passages at current level with preferred genre, try any genre at current level
  passages = await db.comprehensionPassages
    .where('gradeLevel')
    .equals(currentLevel)
    .toArray();

  passages = passages.filter(p => !recentPassageIds.has(p.id));

  if (passages.length > 0) {
    const randomIndex = Math.floor(Math.random() * passages.length);
    return passages[randomIndex];
  }

  // Last resort: return any passage not recently completed
  const allPassages = await db.comprehensionPassages.toArray();
  const availablePassages = allPassages.filter(p => !recentPassageIds.has(p.id));

  if (availablePassages.length > 0) {
    const randomIndex = Math.floor(Math.random() * availablePassages.length);
    return availablePassages[randomIndex];
  }

  // If all passages have been completed, return the oldest one
  if (allPassages.length > 0) {
    return allPassages[0];
  }

  return null;
}

/**
 * Record a comprehension attempt
 */
export async function recordComprehensionAttempt(
  studentId: string,
  passageId: string,
  questionId: string,
  selectedAnswer: string,
  correctAnswer: string,
  timeSpentSeconds: number,
  hintsUsed: number
): Promise<void> {
  const attempt: Omit<ComprehensionAttempt, 'id'> = {
    studentId,
    passageId,
    questionId,
    selectedAnswer,
    isCorrect: selectedAnswer === correctAnswer,
    timeSpentSeconds,
    scaffoldUsed: hintsUsed > 0,
    hintsUsed,
    timestamp: new Date()
  };

  await db.comprehensionAttempts.add(attempt as ComprehensionAttempt);

  // Update last practiced date on passage
  await db.comprehensionPassages.update(passageId, {
    lastPracticed: new Date()
  });
}

/**
 * Get questions for a passage in optimal sequence
 */
export async function getQuestionsForPassage(
  passageId: string
): Promise<ComprehensionQuestion[]> {
  const questions = await db.comprehensionQuestions
    .where('passageId')
    .equals(passageId)
    .toArray();

  // Sort questions by type: literal first, then inferential, then evaluative
  const typeOrder = { literal: 1, inferential: 2, vocabulary: 2, evaluative: 3 };

  questions.sort((a, b) => {
    const orderA = typeOrder[a.questionType] || 3;
    const orderB = typeOrder[b.questionType] || 3;
    return orderA - orderB;
  });

  return questions;
}

/**
 * Calculate overall comprehension statistics for a student
 */
export async function getComprehensionStats(studentId: string) {
  const attempts = await db.comprehensionAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      accuracy: 0,
      passagesCompleted: 0,
      averageTimePerQuestion: 0,
      skillBreakdown: {}
    };
  }

  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const accuracy = correctAttempts / attempts.length;

  // Count unique passages
  const uniquePassages = new Set(attempts.map(a => a.passageId));
  const passagesCompleted = uniquePassages.size;

  // Calculate average time
  const totalTime = attempts.reduce((sum, a) => sum + a.timeSpentSeconds, 0);
  const averageTimePerQuestion = totalTime / attempts.length;

  // Get skill breakdown
  const questionIds = attempts.map(a => a.questionId);
  const questions = await db.comprehensionQuestions
    .where('id')
    .anyOf(questionIds)
    .toArray();

  const questionSkillMap = new Map<string, string>();
  questions.forEach(q => {
    questionSkillMap.set(q.id, q.skill);
  });

  const skillBreakdown: Record<string, { correct: number; total: number; accuracy: number }> = {};

  attempts.forEach(attempt => {
    const skill = questionSkillMap.get(attempt.questionId);
    if (skill) {
      if (!skillBreakdown[skill]) {
        skillBreakdown[skill] = { correct: 0, total: 0, accuracy: 0 };
      }
      skillBreakdown[skill].total++;
      if (attempt.isCorrect) {
        skillBreakdown[skill].correct++;
      }
    }
  });

  // Calculate accuracy for each skill
  Object.keys(skillBreakdown).forEach(skill => {
    const stats = skillBreakdown[skill];
    stats.accuracy = stats.correct / stats.total;
  });

  return {
    totalAttempts: attempts.length,
    accuracy,
    passagesCompleted,
    averageTimePerQuestion,
    skillBreakdown
  };
}
