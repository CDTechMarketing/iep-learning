import { SightWordProgress } from '../types';

/**
 * Spaced Repetition Engine for Sight Words
 * Based on the Leitner system
 */

// Time intervals for review (in days)
const REVIEW_INTERVALS = {
  new: 0, // Practice immediately
  learning: 2, // Review every 2 days
  mastered: 7  // Review weekly
};

// Mastery thresholds
const MASTERY_THRESHOLD = 0.8; // 80% accuracy
const AUTOMATICITY_TIME_MS = 2000; // 2 seconds for instant recognition
const MIN_ATTEMPTS_FOR_MASTERY = 5; // Need at least 5 attempts before mastering

/**
 * Calculate the next review date based on current status
 */
export function calculateNextReview(status: 'new' | 'learning' | 'mastered'): Date {
  const now = new Date();
  const days = REVIEW_INTERVALS[status];
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Determine if a word should be reviewed today
 */
export function shouldReviewToday(progress: SightWordProgress): boolean {
  const now = new Date();
  return progress.nextReview <= now;
}

/**
 * Calculate if a word has been mastered based on performance
 */
export function calculateMastery(progress: SightWordProgress): {
  newStatus: 'new' | 'learning' | 'mastered';
  isMastered: boolean;
} {
  const accuracy = progress.totalAttempts > 0
    ? progress.correctAttempts / progress.totalAttempts
    : 0;

  const hasAutomaticity = progress.averageResponseTime < AUTOMATICITY_TIME_MS;
  const hasEnoughAttempts = progress.totalAttempts >= MIN_ATTEMPTS_FOR_MASTERY;

  // Must meet accuracy threshold, have automaticity, and enough attempts
  if (accuracy >= MASTERY_THRESHOLD && hasAutomaticity && hasEnoughAttempts) {
    return { newStatus: 'mastered', isMastered: true };
  }

  // If not new anymore but not mastered, it's learning
  if (progress.totalAttempts > 0 && progress.status === 'new') {
    return { newStatus: 'learning', isMastered: false };
  }

  return { newStatus: progress.status, isMastered: false };
}

/**
 * Update progress after an attempt
 */
export function updateProgressAfterAttempt(
  progress: SightWordProgress,
  correct: boolean,
  responseTime: number
): Partial<SightWordProgress> {
  const newTotalAttempts = progress.totalAttempts + 1;
  const newCorrectAttempts = progress.correctAttempts + (correct ? 1 : 0);

  // Calculate new average response time
  const totalTime = progress.averageResponseTime * progress.totalAttempts + responseTime;
  const newAverageResponseTime = totalTime / newTotalAttempts;

  // Calculate new status
  const tempProgress: SightWordProgress = {
    ...progress,
    totalAttempts: newTotalAttempts,
    correctAttempts: newCorrectAttempts,
    averageResponseTime: newAverageResponseTime
  };

  const { newStatus, isMastered } = calculateMastery(tempProgress);

  return {
    totalAttempts: newTotalAttempts,
    correctAttempts: newCorrectAttempts,
    averageResponseTime: newAverageResponseTime,
    status: newStatus,
    lastPracticed: new Date(),
    nextReview: calculateNextReview(newStatus),
    masteredDate: isMastered && !progress.masteredDate ? new Date() : progress.masteredDate
  };
}

/**
 * Get words that should be practiced today
 * Returns words in priority order: due for review > new words > review words
 */
export function getWordsToPractice(
  allProgress: SightWordProgress[],
  limit: number = 10
): SightWordProgress[] {
  const now = new Date();

  // Separate words by priority
  const dueWords = allProgress.filter(p => p.nextReview <= now && p.status !== 'mastered');
  const newWords = allProgress.filter(p => p.status === 'new' && p.totalAttempts === 0);
  const reviewWords = allProgress.filter(p => p.nextReview <= now && p.status === 'mastered');

  // Combine in priority order
  const priorityWords = [
    ...dueWords,
    ...newWords.slice(0, Math.max(3, limit - dueWords.length)), // Add at least 3 new words if space
    ...reviewWords
  ];

  return priorityWords.slice(0, limit);
}

/**
 * Initialize progress for a new word
 */
export function initializeWordProgress(
  studentId: string,
  wordId: string
): SightWordProgress {
  const now = new Date();
  return {
    id: `progress-${studentId}-${wordId}`,
    studentId,
    wordId,
    status: 'new',
    firstSeen: now,
    lastPracticed: now,
    nextReview: now, // Ready to practice immediately
    totalAttempts: 0,
    correctAttempts: 0,
    averageResponseTime: 0
  };
}

/**
 * Calculate overall statistics for a student
 */
export interface SightWordStats {
  totalWords: number;
  newWords: number;
  learningWords: number;
  masteredWords: number;
  accuracyRate: number;
  averageSpeed: number;
  wordsNeedingReview: number;
}

export function calculateStats(allProgress: SightWordProgress[]): SightWordStats {
  const now = new Date();

  const newWords = allProgress.filter(p => p.status === 'new').length;
  const learningWords = allProgress.filter(p => p.status === 'learning').length;
  const masteredWords = allProgress.filter(p => p.status === 'mastered').length;
  const wordsNeedingReview = allProgress.filter(p => p.nextReview <= now).length;

  const totalAttempts = allProgress.reduce((sum, p) => sum + p.totalAttempts, 0);
  const totalCorrect = allProgress.reduce((sum, p) => sum + p.correctAttempts, 0);
  const accuracyRate = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

  const wordsWithAttempts = allProgress.filter(p => p.totalAttempts > 0);
  const averageSpeed = wordsWithAttempts.length > 0
    ? wordsWithAttempts.reduce((sum, p) => sum + p.averageResponseTime, 0) / wordsWithAttempts.length
    : 0;

  return {
    totalWords: allProgress.length,
    newWords,
    learningWords,
    masteredWords,
    accuracyRate,
    averageSpeed,
    wordsNeedingReview
  };
}
