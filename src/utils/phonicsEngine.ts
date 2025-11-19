/**
 * Phonics Engine - Adaptive Learning Logic
 * Handles progression, mastery tracking, and difficulty adjustment
 */

import { db } from '../db';
import {
  PhonicsProgress,
  PhonicsAttempt,
  PhonicsPattern,
  ScaffoldLevel,
  PhonicsProgressStatus
} from '../types';
import { PHONICS_PROGRESSION, getNextLevel, getLevelByNumber } from '../data/phonicsProgressionMap';
import { PHONICS_PATTERNS } from '../data/phonicsPatterns';

// Mastery thresholds
const MASTERY_THRESHOLD = 80; // 80% accuracy
const MINIMUM_ATTEMPTS = 10; // Minimum attempts before evaluating mastery
const STRUGGLE_THRESHOLD = 60; // Below this = needs help

/**
 * Initialize progress for a student for all patterns
 */
export async function initializePhonicsProgress(studentId: string): Promise<void> {
  const existingProgress = await db.phonicsProgress
    .where('studentId')
    .equals(studentId)
    .count();

  if (existingProgress === 0) {
    // Create progress entries for all patterns
    const progressEntries: PhonicsProgress[] = PHONICS_PATTERNS.map(pattern => ({
      id: `${studentId}-${pattern.id}`,
      studentId,
      patternId: pattern.id,
      status: 'not-introduced' as PhonicsProgressStatus,
      accuracy: 0,
      attemptsCount: 0,
      correctCount: 0,
      lastPracticed: new Date(),
      currentScaffoldLevel: 'medium' as ScaffoldLevel
    }));

    await db.phonicsProgress.bulkAdd(progressEntries);

    // Mark first pattern as "learning"
    const firstPattern = PHONICS_PATTERNS.find(p => p.level === 1);
    if (firstPattern) {
      await db.phonicsProgress.update(`${studentId}-${firstPattern.id}`, {
        status: 'learning'
      });
    }
  }
}

/**
 * Get student's progress for a specific pattern
 */
export async function getPatternProgress(
  studentId: string,
  patternId: string
): Promise<PhonicsProgress | undefined> {
  return await db.phonicsProgress.get(`${studentId}-${patternId}`);
}

/**
 * Get all progress for a student
 */
export async function getAllProgress(studentId: string): Promise<PhonicsProgress[]> {
  return await db.phonicsProgress.where('studentId').equals(studentId).toArray();
}

/**
 * Record an attempt and update progress
 */
export async function recordAttempt(
  studentId: string,
  activityId: string,
  patternId: string,
  correct: boolean,
  studentAnswer: string,
  timeSpent: number,
  hintsUsed: number,
  scaffoldLevel: ScaffoldLevel
): Promise<void> {
  // Create attempt record
  const attempt: PhonicsAttempt = {
    id: `attempt-${Date.now()}-${Math.random()}`,
    studentId,
    activityId,
    patternId,
    timestamp: new Date(),
    correct,
    studentAnswer,
    timeSpent,
    hintsUsed,
    scaffoldLevel
  };

  await db.phonicsAttempts.add(attempt);

  // Update progress
  await updateProgress(studentId, patternId);
}

/**
 * Update progress after an attempt
 */
async function updateProgress(studentId: string, patternId: string): Promise<void> {
  const progressId = `${studentId}-${patternId}`;
  const progress = await db.phonicsProgress.get(progressId);

  if (!progress) return;

  // Get last 10 attempts for this pattern
  const recentAttempts = await db.phonicsAttempts
    .where('patternId')
    .equals(patternId)
    .and(a => a.studentId === studentId)
    .reverse()
    .limit(10)
    .toArray();

  const totalAttempts = await db.phonicsAttempts
    .where('patternId')
    .equals(patternId)
    .and(a => a.studentId === studentId)
    .count();

  const totalCorrect = await db.phonicsAttempts
    .where('patternId')
    .equals(patternId)
    .and(a => a.studentId === studentId && a.correct)
    .count();

  // Calculate accuracy from last 10 attempts
  const accuracy =
    recentAttempts.length > 0
      ? (recentAttempts.filter(a => a.correct).length / recentAttempts.length) * 100
      : 0;

  // Determine if pattern should be mastered
  let status = progress.status;
  let masteredDate = progress.masteredDate;

  if (
    status === 'learning' &&
    totalAttempts >= MINIMUM_ATTEMPTS &&
    accuracy >= MASTERY_THRESHOLD
  ) {
    status = 'mastered';
    masteredDate = new Date();

    // Introduce next pattern
    await introduceNextPattern(studentId, patternId);
  }

  // Adjust scaffold level based on performance
  const newScaffoldLevel = determineScaffoldLevel(accuracy, totalAttempts);

  // Update progress
  await db.phonicsProgress.update(progressId, {
    accuracy,
    attemptsCount: totalAttempts,
    correctCount: totalCorrect,
    lastPracticed: new Date(),
    status,
    masteredDate,
    currentScaffoldLevel: newScaffoldLevel
  });
}

/**
 * Determine appropriate scaffold level based on performance
 */
function determineScaffoldLevel(accuracy: number, attemptsCount: number): ScaffoldLevel {
  if (attemptsCount < 3) {
    return 'high'; // Start with high scaffolding
  }

  if (accuracy < STRUGGLE_THRESHOLD) {
    return 'high'; // Needs more support
  } else if (accuracy >= MASTERY_THRESHOLD) {
    return 'low'; // Can reduce scaffolding
  } else {
    return 'medium'; // Standard support
  }
}

/**
 * Introduce the next pattern after mastery
 */
async function introduceNextPattern(studentId: string, currentPatternId: string): Promise<void> {
  const currentPattern = PHONICS_PATTERNS.find(p => p.id === currentPatternId);
  if (!currentPattern) return;

  // Find next pattern in the same level or next level
  const nextPattern = findNextPatternToLearn(currentPattern);

  if (nextPattern) {
    const progressId = `${studentId}-${nextPattern.id}`;
    await db.phonicsProgress.update(progressId, {
      status: 'learning'
    });
  }
}

/**
 * Find the next pattern to learn based on current progress
 */
function findNextPatternToLearn(currentPattern: PhonicsPattern): PhonicsPattern | undefined {
  // Try to find next pattern in same level
  const sameLevelPatterns = PHONICS_PATTERNS.filter(p => p.level === currentPattern.level);
  const currentIndex = sameLevelPatterns.findIndex(p => p.id === currentPattern.id);

  if (currentIndex >= 0 && currentIndex < sameLevelPatterns.length - 1) {
    return sameLevelPatterns[currentIndex + 1];
  }

  // Move to next level
  const nextLevelPatterns = PHONICS_PATTERNS.filter(p => p.level === currentPattern.level + 1);
  return nextLevelPatterns[0];
}

/**
 * Determine what pattern the student should practice next
 */
export async function determineNextPattern(studentId: string): Promise<PhonicsPattern | null> {
  const allProgress = await getAllProgress(studentId);

  // Check for patterns currently being learned
  const learningPatterns = allProgress.filter(p => p.status === 'learning');

  // Prioritize struggling patterns (< 60% accuracy)
  const strugglingPatterns = learningPatterns
    .filter(p => p.accuracy < STRUGGLE_THRESHOLD && p.attemptsCount >= 3)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (strugglingPatterns.length > 0) {
    const pattern = PHONICS_PATTERNS.find(p => p.id === strugglingPatterns[0].patternId);
    return pattern || null;
  }

  // Practice patterns that are learning but not yet mastered
  const practicingPatterns = learningPatterns
    .filter(p => p.accuracy >= STRUGGLE_THRESHOLD && p.accuracy < MASTERY_THRESHOLD)
    .sort((a, b) => new Date(a.lastPracticed).getTime() - new Date(b.lastPracticed).getTime());

  if (practicingPatterns.length > 0) {
    const pattern = PHONICS_PATTERNS.find(p => p.id === practicingPatterns[0].patternId);
    return pattern || null;
  }

  // All current patterns are mastered, introduce next one
  const masteredPatterns = allProgress.filter(p => p.status === 'mastered');
  if (masteredPatterns.length > 0) {
    const lastMastered = masteredPatterns.sort(
      (a, b) =>
        new Date(b.masteredDate!).getTime() - new Date(a.masteredDate!).getTime()
    )[0];

    const lastPattern = PHONICS_PATTERNS.find(p => p.id === lastMastered.patternId);
    if (lastPattern) {
      const nextPattern = findNextPatternToLearn(lastPattern);
      if (nextPattern) {
        // Mark it as learning
        const progressId = `${studentId}-${nextPattern.id}`;
        await db.phonicsProgress.update(progressId, {
          status: 'learning'
        });
        return nextPattern;
      }
    }
  }

  // Default to first pattern
  return PHONICS_PATTERNS[0] || null;
}

/**
 * Get student's current level (highest level with at least one pattern mastered)
 */
export async function getCurrentLevel(studentId: string): Promise<number> {
  const allProgress = await getAllProgress(studentId);
  const masteredPatterns = allProgress.filter(p => p.status === 'mastered');

  if (masteredPatterns.length === 0) return 1;

  const levels = masteredPatterns
    .map(p => {
      const pattern = PHONICS_PATTERNS.find(pat => pat.id === p.patternId);
      return pattern?.level || 0;
    })
    .filter(level => level > 0);

  return levels.length > 0 ? Math.max(...levels) : 1;
}

/**
 * Get progress summary for a student
 */
export async function getProgressSummary(studentId: string): Promise<{
  totalPatterns: number;
  masteredPatterns: number;
  learningPatterns: number;
  currentLevel: number;
  overallAccuracy: number;
}> {
  const allProgress = await getAllProgress(studentId);

  const totalPatterns = PHONICS_PATTERNS.length;
  const masteredPatterns = allProgress.filter(p => p.status === 'mastered').length;
  const learningPatterns = allProgress.filter(p => p.status === 'learning').length;
  const currentLevel = await getCurrentLevel(studentId);

  // Calculate overall accuracy (only for patterns that have been attempted)
  const attemptedProgress = allProgress.filter(p => p.attemptsCount > 0);
  const overallAccuracy =
    attemptedProgress.length > 0
      ? attemptedProgress.reduce((sum, p) => sum + p.accuracy, 0) / attemptedProgress.length
      : 0;

  return {
    totalPatterns,
    masteredPatterns,
    learningPatterns,
    currentLevel,
    overallAccuracy: Math.round(overallAccuracy)
  };
}

/**
 * Get patterns that need review (mastered but not practiced recently)
 */
export async function getPatternsNeedingReview(
  studentId: string,
  daysSinceLastPractice: number = 7
): Promise<PhonicsPattern[]> {
  const allProgress = await getAllProgress(studentId);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastPractice);

  const needingReview = allProgress.filter(
    p =>
      p.status === 'mastered' &&
      new Date(p.lastPracticed).getTime() < cutoffDate.getTime()
  );

  return needingReview
    .map(p => PHONICS_PATTERNS.find(pat => pat.id === p.patternId))
    .filter(Boolean) as PhonicsPattern[];
}

/**
 * Reset progress for a student (for testing/demo purposes)
 */
export async function resetProgress(studentId: string): Promise<void> {
  // Delete all attempts
  const attempts = await db.phonicsAttempts.where('studentId').equals(studentId).toArray();
  await Promise.all(attempts.map(a => db.phonicsAttempts.delete(a.id)));

  // Delete all progress
  const progress = await db.phonicsProgress.where('studentId').equals(studentId).toArray();
  await Promise.all(progress.map(p => db.phonicsProgress.delete(p.id)));

  // Reinitialize
  await initializePhonicsProgress(studentId);
}
