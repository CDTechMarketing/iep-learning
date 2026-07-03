import { format } from 'date-fns';
import { db } from '../db';
import { Unit, SessionLog } from '../types';
import { useStore } from '../store';

export function buildSessionLog(
  unit: Unit,
  stats: { stars: number; attempts: number; correct: number }
): SessionLog {
  return {
    id: `session-${Date.now()}`,
    unitId: unit.id,
    date: format(new Date(), 'yyyy-MM-dd'),
    starsEarned: stats.stars,
    attempts: stats.attempts,
    correct: stats.correct,
    milestonesReached: unit.goalStars.filter((goal) => stats.stars >= goal),
    createdAt: new Date()
  };
}

export async function finishSession(unit: Unit): Promise<void> {
  const { sessionStars, sessionAttempts, sessionCorrect, setCurrentSessionLog, setCurrentView } = useStore.getState();

  const sessionLog = buildSessionLog(unit, {
    stars: sessionStars,
    attempts: sessionAttempts,
    correct: sessionCorrect
  });

  await db.sessionLogs.add(sessionLog);
  setCurrentSessionLog(sessionLog);
  setCurrentView('session-summary');
}
