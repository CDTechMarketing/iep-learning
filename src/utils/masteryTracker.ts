import { db } from '../db';
import { SessionLog, SkillMastery, AppSettings } from '../types';

/**
 * Analyzes skill mastery for a given unit
 */
export async function analyzeSkillMastery(unitId: string): Promise<SkillMastery | null> {
  // Get all session logs for this unit
  const sessions = await db.sessionLogs
    .where('unitId')
    .equals(unitId)
    .sortBy('createdAt');

  if (sessions.length === 0) {
    return null;
  }

  // Get settings for mastery criteria
  const settings = await db.settings.get('default');
  const criteria = settings?.masteryCriteria || {
    accuracyThreshold: 80,
    consecutiveSessionsRequired: 3,
    minSessionsBeforeMastery: 5
  };

  // Check if skill already exists
  const skillId = `skill-${unitId}`;
  let existingSkill = await db.skillMastery.get(skillId);

  // Calculate accuracy for last 10 sessions
  const recentSessions = sessions.slice(-10);
  const accuracyHistory = recentSessions.map(session =>
    session.attempts > 0 ? (session.correct / session.attempts) * 100 : 0
  );

  // Calculate current accuracy (average of last 3 sessions)
  const lastThreeSessions = accuracyHistory.slice(-3);
  const currentAccuracy = lastThreeSessions.length > 0
    ? lastThreeSessions.reduce((a, b) => a + b, 0) / lastThreeSessions.length
    : 0;

  // Count consecutive sessions above threshold
  let consecutiveSessions = 0;
  for (let i = accuracyHistory.length - 1; i >= 0; i--) {
    if (accuracyHistory[i] >= criteria.accuracyThreshold) {
      consecutiveSessions++;
    } else {
      break;
    }
  }

  // Determine mastery level
  let masteryLevel: 'emerging' | 'progressing' | 'mastered';
  let dateAchievedMastery: Date | undefined;

  if (
    sessions.length >= criteria.minSessionsBeforeMastery &&
    consecutiveSessions >= criteria.consecutiveSessionsRequired &&
    currentAccuracy >= criteria.accuracyThreshold
  ) {
    masteryLevel = 'mastered';
    // Set mastery date to the date of the session that completed the consecutive streak
    const masterySessionIndex = sessions.length - consecutiveSessions;
    dateAchievedMastery = existingSkill?.dateAchievedMastery || sessions[masterySessionIndex]?.createdAt;
  } else if (currentAccuracy >= 60) {
    masteryLevel = 'progressing';
  } else {
    masteryLevel = 'emerging';
  }

  // Get unit details for skill name
  const unit = await db.units.get(unitId);
  const skillName = unit?.title || `Unit ${unitId}`;

  // Determine category based on unit tags or content
  let category: 'reading' | 'math' | 'science' = 'reading';
  if (unit?.tags.includes('math') || unit?.tags.includes('number')) {
    category = 'math';
  } else if (unit?.tags.includes('science')) {
    category = 'science';
  }

  const skillMastery: SkillMastery = {
    id: skillId,
    skillId: unitId,
    skillName,
    category,
    masteryLevel,
    accuracyHistory,
    dateStarted: existingSkill?.dateStarted || sessions[0].createdAt,
    dateAchievedMastery,
    criteriaType: 'accuracy',
    criteriaValue: criteria.accuracyThreshold,
    consecutiveSessions
  };

  // Save or update in database
  if (existingSkill) {
    await db.skillMastery.update(skillId, skillMastery);
  } else {
    await db.skillMastery.add(skillMastery);
  }

  return skillMastery;
}

/**
 * Updates mastery data after a session completes
 */
export async function updateMasteryFromSession(sessionLog: SessionLog): Promise<SkillMastery | null> {
  return analyzeSkillMastery(sessionLog.unitId);
}

/**
 * Gets all skills by category
 */
export async function getMasteryByCategory(category: string): Promise<SkillMastery[]> {
  return db.skillMastery
    .where('category')
    .equals(category)
    .toArray();
}

/**
 * Gets all skill mastery records
 */
export async function getAllMastery(): Promise<SkillMastery[]> {
  return db.skillMastery.toArray();
}

/**
 * Gets recently mastered skills within the specified number of days
 */
export async function getRecentlyMasteredSkills(days: number = 7): Promise<SkillMastery[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const allMastered = await db.skillMastery
    .where('masteryLevel')
    .equals('mastered')
    .toArray();

  return allMastered.filter(skill =>
    skill.dateAchievedMastery && skill.dateAchievedMastery >= cutoffDate
  );
}

/**
 * Gets skills in progress (progressing level)
 */
export async function getSkillsInProgress(): Promise<SkillMastery[]> {
  return db.skillMastery
    .where('masteryLevel')
    .equals('progressing')
    .toArray();
}

/**
 * Gets emerging skills that need more practice
 */
export async function getEmergingSkills(): Promise<SkillMastery[]> {
  return db.skillMastery
    .where('masteryLevel')
    .equals('emerging')
    .toArray();
}

/**
 * Calculates overall mastery statistics
 */
export async function getMasteryStatistics() {
  const allSkills = await getAllMastery();

  const total = allSkills.length;
  const mastered = allSkills.filter(s => s.masteryLevel === 'mastered').length;
  const progressing = allSkills.filter(s => s.masteryLevel === 'progressing').length;
  const emerging = allSkills.filter(s => s.masteryLevel === 'emerging').length;

  return {
    total,
    mastered,
    progressing,
    emerging,
    masteryRate: total > 0 ? (mastered / total) * 100 : 0
  };
}

/**
 * Analyzes all existing session logs to populate mastery data
 * Useful for initial setup or data migration
 */
export async function analyzeAllSkills(): Promise<void> {
  const allUnits = await db.units.toArray();

  for (const unit of allUnits) {
    await analyzeSkillMastery(unit.id);
  }
}
