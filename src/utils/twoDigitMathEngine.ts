import { TwoDigitMathAttempt, TwoDigitMathProblem } from '../types';
import { db } from '../db';
import { generateProblemByLevel } from './mathProblemGenerator';

/**
 * Two-Digit Math Adaptive Difficulty Engine
 * Selects appropriate problems based on student performance history
 * Adjusts difficulty dynamically to maintain optimal challenge
 */

interface LevelPerformance {
  level: number;
  attempts: number;
  correct: number;
  accuracy: number;
  recentAccuracy: number; // Last 5 attempts
}

/**
 * Calculate student's current math level (1-5)
 * based on mastery of previous levels
 */
export async function calculateMathLevel(studentId: string): Promise<1 | 2 | 3 | 4 | 5> {
  const attempts = await db.twoDigitMathAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  if (attempts.length === 0) {
    return 1; // Start at level 1
  }

  const problems = await db.twoDigitMathProblems.toArray();

  // Calculate performance for each level
  const levelPerformances: LevelPerformance[] = [];

  for (let level = 1; level <= 5; level++) {
    const levelAttempts = attempts.filter(a => {
      const problem = problems.find(p => p.id === a.problemId);
      return problem?.difficulty === level;
    });

    const correct = levelAttempts.filter(a => a.isCorrect).length;
    const accuracy = levelAttempts.length > 0 ? correct / levelAttempts.length : 0;

    // Calculate recent accuracy (last 5 attempts)
    const recentAttempts = levelAttempts.slice(-5);
    const recentCorrect = recentAttempts.filter(a => a.isCorrect).length;
    const recentAccuracy = recentAttempts.length > 0 ? recentCorrect / recentAttempts.length : 0;

    levelPerformances.push({
      level,
      attempts: levelAttempts.length,
      correct,
      accuracy,
      recentAccuracy
    });
  }

  // Determine current level based on mastery
  // Mastery = 80%+ accuracy over at least 10 attempts
  let currentLevel: 1 | 2 | 3 | 4 | 5 = 1;

  for (let level = 1; level <= 5; level++) {
    const perf = levelPerformances[level - 1];

    if (perf.attempts >= 10 && perf.accuracy >= 0.80) {
      // Mastered this level, move to next
      currentLevel = Math.min(level + 1, 5) as 1 | 2 | 3 | 4 | 5;
    } else if (perf.attempts >= 5 && perf.recentAccuracy >= 0.80) {
      // Showing mastery in recent attempts
      currentLevel = Math.min(level + 1, 5) as 1 | 2 | 3 | 4 | 5;
    } else {
      // Not yet mastered, stay at this level
      break;
    }
  }

  return currentLevel;
}

/**
 * Check if student has mastered a specific level
 */
export async function checkMastery(
  studentId: string,
  level: 1 | 2 | 3 | 4 | 5
): Promise<boolean> {
  const attempts = await db.twoDigitMathAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  const problems = await db.twoDigitMathProblems.toArray();

  const levelAttempts = attempts.filter(a => {
    const problem = problems.find(p => p.id === a.problemId);
    return problem?.difficulty === level;
  });

  if (levelAttempts.length < 10) {
    return false; // Need at least 10 attempts
  }

  const correct = levelAttempts.filter(a => a.isCorrect).length;
  const accuracy = correct / levelAttempts.length;

  // Also check recent performance
  const lastFive = levelAttempts.slice(-5);
  const lastFiveCorrect = lastFive.filter(a => a.isCorrect).length;
  const recentAccuracy = lastFive.length > 0 ? lastFiveCorrect / lastFive.length : 0;

  return accuracy >= 0.80 && recentAccuracy >= 0.80;
}

/**
 * Identify weak operation type (addition or subtraction)
 */
export async function identifyWeakOperation(
  studentId: string
): Promise<'addition' | 'subtraction' | null> {
  const attempts = await db.twoDigitMathAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  if (attempts.length < 10) {
    return null; // Not enough data
  }

  const problems = await db.twoDigitMathProblems.toArray();

  const additionAttempts = attempts.filter(a => {
    const problem = problems.find(p => p.id === a.problemId);
    return problem?.operation === 'addition';
  });

  const subtractionAttempts = attempts.filter(a => {
    const problem = problems.find(p => p.id === a.problemId);
    return problem?.operation === 'subtraction';
  });

  const additionAccuracy = additionAttempts.length > 0
    ? additionAttempts.filter(a => a.isCorrect).length / additionAttempts.length
    : 0;

  const subtractionAccuracy = subtractionAttempts.length > 0
    ? subtractionAttempts.filter(a => a.isCorrect).length / subtractionAttempts.length
    : 0;

  // If one operation is significantly weaker (< 70% and at least 15% worse)
  if (additionAccuracy < 0.70 && additionAccuracy < subtractionAccuracy - 0.15) {
    return 'addition';
  }
  if (subtractionAccuracy < 0.70 && subtractionAccuracy < additionAccuracy - 0.15) {
    return 'subtraction';
  }

  return null;
}

/**
 * Select the next problem for the student
 * Uses adaptive algorithm to maintain optimal challenge
 */
export async function selectNextProblem(studentId: string): Promise<TwoDigitMathProblem> {
  // 1. Determine current level
  const currentLevel = await calculateMathLevel(studentId);

  // 2. Check for mastery at current level
  const hasMastery = await checkMastery(studentId, currentLevel);

  // 3. Identify weak operation
  const weakOperation = await identifyWeakOperation(studentId);

  // 4. Generate problem based on analysis
  let targetLevel = currentLevel;

  // If student has mastered current level and not at max, move up
  if (hasMastery && currentLevel < 5) {
    targetLevel = (currentLevel + 1) as 1 | 2 | 3 | 4 | 5;
  }

  // Generate problem at target level
  let problem = generateProblemByLevel(targetLevel);

  // If there's a weak operation, prioritize it (70% of the time)
  if (weakOperation && Math.random() < 0.7) {
    // Regenerate until we get the target operation
    let attempts = 0;
    while (problem.operation !== weakOperation && attempts < 10) {
      problem = generateProblemByLevel(targetLevel);
      attempts++;
    }
  }

  // Save problem to database
  await db.twoDigitMathProblems.add(problem);

  return problem;
}

/**
 * Get recommended practice plan for student
 */
export async function getRecommendedPractice(
  studentId: string
): Promise<{
  currentLevel: number;
  nextLevel: number;
  strengths: string[];
  areasForGrowth: string[];
  recommendedProblemsCount: number;
}> {
  const currentLevel = await calculateMathLevel(studentId);
  const weakOperation = await identifyWeakOperation(studentId);
  const attempts = await db.twoDigitMathAttempts
    .where('studentId')
    .equals(studentId)
    .toArray();

  const problems = await db.twoDigitMathProblems.toArray();

  // Identify strengths
  const strengths: string[] = [];
  const areasForGrowth: string[] = [];

  // Check regrouping performance
  const regroupingAttempts = attempts.filter(a => {
    const problem = problems.find(p => p.id === a.problemId);
    return problem?.requiresRegrouping;
  });
  const regroupingAccuracy = regroupingAttempts.length > 0
    ? regroupingAttempts.filter(a => a.isCorrect).length / regroupingAttempts.length
    : 0;

  if (regroupingAccuracy >= 0.80) {
    strengths.push('Regrouping/Borrowing');
  } else if (regroupingAccuracy < 0.70 && regroupingAttempts.length >= 5) {
    areasForGrowth.push('Regrouping/Borrowing needs more practice');
  }

  // Check operations
  if (!weakOperation) {
    strengths.push('Both addition and subtraction');
  } else {
    areasForGrowth.push(`${weakOperation} accuracy could improve`);
  }

  // Recommend number of problems
  let recommendedProblemsCount = 10; // Default

  if (attempts.length < 20) {
    recommendedProblemsCount = 15; // More practice for beginners
  } else if (regroupingAccuracy < 0.60) {
    recommendedProblemsCount = 20; // Extra practice for struggling areas
  }

  return {
    currentLevel,
    nextLevel: Math.min(currentLevel + 1, 5),
    strengths,
    areasForGrowth,
    recommendedProblemsCount
  };
}
