import { db } from '../db';
import { IEPGoal, SkillMastery } from '../types';

/**
 * Creates a new IEP goal
 */
export async function createIEPGoal(
  goal: Omit<IEPGoal, 'id' | 'createdAt'>
): Promise<IEPGoal> {
  const newGoal: IEPGoal = {
    ...goal,
    id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };

  await db.iepGoals.add(newGoal);
  return newGoal;
}

/**
 * Updates an existing IEP goal
 */
export async function updateIEPGoal(
  goalId: string,
  updates: Partial<IEPGoal>
): Promise<void> {
  await db.iepGoals.update(goalId, updates);
}

/**
 * Deletes an IEP goal
 */
export async function deleteIEPGoal(goalId: string): Promise<void> {
  await db.iepGoals.delete(goalId);
}

/**
 * Gets a specific IEP goal by ID
 */
export async function getIEPGoal(goalId: string): Promise<IEPGoal | undefined> {
  return db.iepGoals.get(goalId);
}

/**
 * Gets all IEP goals
 */
export async function getAllIEPGoals(): Promise<IEPGoal[]> {
  return db.iepGoals.toArray();
}

/**
 * Gets IEP goals by category
 */
export async function getGoalsByCategory(category: string): Promise<IEPGoal[]> {
  return db.iepGoals
    .where('category')
    .equals(category)
    .toArray();
}

/**
 * Updates goal progress based on related skills' mastery
 */
export async function updateGoalProgress(goalId: string): Promise<void> {
  const goal = await db.iepGoals.get(goalId);
  if (!goal) return;

  // Get mastery data for all related skills
  const relatedSkills = await Promise.all(
    goal.relatedSkills.map(skillId => db.skillMastery.get(skillId))
  );

  const validSkills = relatedSkills.filter((s): s is SkillMastery => s !== undefined);

  if (validSkills.length === 0) {
    return;
  }

  let progress = 0;

  switch (goal.measurementType) {
    case 'accuracy': {
      // Calculate average accuracy from skill accuracy histories
      const allAccuracies = validSkills.flatMap(skill => skill.accuracyHistory);
      const avgAccuracy = allAccuracies.length > 0
        ? allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length
        : 0;

      // Progress = (current - baseline) / (target - baseline) * 100
      progress = ((avgAccuracy - goal.baselineData) / (goal.targetValue - goal.baselineData)) * 100;
      break;
    }

    case 'frequency': {
      // Count mastered skills
      const masteredCount = validSkills.filter(s => s.masteryLevel === 'mastered').length;
      progress = ((masteredCount - goal.baselineData) / (goal.targetValue - goal.baselineData)) * 100;
      break;
    }

    case 'duration': {
      // This would need session duration data - simplified for now
      progress = goal.currentProgress; // Keep existing if we can't calculate
      break;
    }
  }

  // Clamp progress between 0 and 100
  progress = Math.max(0, Math.min(100, progress));

  await db.iepGoals.update(goalId, { currentProgress: progress });
}

/**
 * Updates all goals' progress
 */
export async function updateAllGoalsProgress(): Promise<void> {
  const allGoals = await getAllIEPGoals();

  for (const goal of allGoals) {
    await updateGoalProgress(goal.id);
  }
}

/**
 * Gets goals that are at risk (behind schedule)
 */
export async function getGoalsAtRisk(): Promise<IEPGoal[]> {
  const allGoals = await getAllIEPGoals();
  const now = new Date();

  return allGoals.filter(goal => {
    // Calculate expected progress based on time elapsed
    const timeElapsed = now.getTime() - goal.createdAt.getTime();
    const totalTime = goal.targetDate.getTime() - goal.createdAt.getTime();
    const expectedProgress = (timeElapsed / totalTime) * 100;

    // Goal is at risk if current progress is more than 20% behind expected progress
    return goal.currentProgress < expectedProgress - 20 && now < goal.targetDate;
  });
}

/**
 * Gets achieved goals (100% progress)
 */
export async function getAchievedGoals(): Promise<IEPGoal[]> {
  const allGoals = await getAllIEPGoals();
  return allGoals.filter(goal => goal.currentProgress >= 100);
}

/**
 * Gets goals on track
 */
export async function getGoalsOnTrack(): Promise<IEPGoal[]> {
  const allGoals = await getAllIEPGoals();
  const atRiskIds = new Set((await getGoalsAtRisk()).map(g => g.id));
  const achievedIds = new Set((await getAchievedGoals()).map(g => g.id));

  return allGoals.filter(goal =>
    !atRiskIds.has(goal.id) && !achievedIds.has(goal.id)
  );
}

/**
 * Projects when a skill will be mastered based on current trend
 */
export async function projectMasteryDate(skillId: string): Promise<Date | null> {
  const skill = await db.skillMastery.get(skillId);
  if (!skill || skill.masteryLevel === 'mastered') {
    return skill?.dateAchievedMastery || null;
  }

  // Get session logs for this skill
  const sessions = await db.sessionLogs
    .where('unitId')
    .equals(skill.skillId)
    .sortBy('createdAt');

  if (sessions.length < 2) {
    return null; // Not enough data to project
  }

  // Calculate trend (improvement per session)
  const recentSessions = sessions.slice(-5); // Last 5 sessions
  const accuracies = recentSessions.map(s =>
    s.attempts > 0 ? (s.correct / s.attempts) * 100 : 0
  );

  if (accuracies.length < 2) {
    return null;
  }

  // Simple linear regression to find trend
  const avgImprovement = (accuracies[accuracies.length - 1] - accuracies[0]) / (accuracies.length - 1);

  if (avgImprovement <= 0) {
    return null; // No improvement trend
  }

  const currentAccuracy = accuracies[accuracies.length - 1];
  const targetAccuracy = skill.criteriaValue;
  const sessionsNeeded = Math.ceil((targetAccuracy - currentAccuracy) / avgImprovement);

  if (sessionsNeeded <= 0) {
    return new Date(); // Already at or above target
  }

  // Estimate based on average time between sessions
  const sessionIntervals = [];
  for (let i = 1; i < recentSessions.length; i++) {
    const interval = recentSessions[i].createdAt.getTime() - recentSessions[i - 1].createdAt.getTime();
    sessionIntervals.push(interval);
  }

  const avgInterval = sessionIntervals.reduce((a, b) => a + b, 0) / sessionIntervals.length;
  const projectedDate = new Date(Date.now() + (sessionsNeeded * avgInterval));

  return projectedDate;
}

/**
 * Links a skill to a goal
 */
export async function linkSkillToGoal(goalId: string, skillId: string): Promise<void> {
  const goal = await db.iepGoals.get(goalId);
  if (!goal) return;

  if (!goal.relatedSkills.includes(skillId)) {
    const updatedSkills = [...goal.relatedSkills, skillId];
    await db.iepGoals.update(goalId, { relatedSkills: updatedSkills });
    await updateGoalProgress(goalId);
  }
}

/**
 * Unlinks a skill from a goal
 */
export async function unlinkSkillFromGoal(goalId: string, skillId: string): Promise<void> {
  const goal = await db.iepGoals.get(goalId);
  if (!goal) return;

  const updatedSkills = goal.relatedSkills.filter(id => id !== skillId);
  await db.iepGoals.update(goalId, { relatedSkills: updatedSkills });
  await updateGoalProgress(goalId);
}

/**
 * Gets statistics for all IEP goals
 */
export async function getGoalStatistics() {
  const allGoals = await getAllIEPGoals();
  const atRisk = await getGoalsAtRisk();
  const achieved = await getAchievedGoals();
  const onTrack = await getGoalsOnTrack();

  return {
    total: allGoals.length,
    achieved: achieved.length,
    onTrack: onTrack.length,
    atRisk: atRisk.length,
    avgProgress: allGoals.length > 0
      ? allGoals.reduce((sum, g) => sum + g.currentProgress, 0) / allGoals.length
      : 0
  };
}
