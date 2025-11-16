import { useStore } from '../store';
import { SessionActivity, SessionLog } from '../types';
import { db } from '../db';
import { format } from 'date-fns';

export function ActivityPreview() {
  const {
    sessionPlan,
    currentUnit,
    sessionStars,
    sessionAttempts,
    sessionCorrect,
    setCurrentView,
    updateActivityStatus,
    setCurrentSessionLog
  } = useStore();

  if (!sessionPlan) return null;

  const currentActivity = sessionPlan.activities[sessionPlan.currentActivityIndex];

  if (!currentActivity) {
    // All activities completed, create session log and show summary
    if (currentUnit) {
      const sessionLog: SessionLog = {
        id: `session-${Date.now()}`,
        unitId: currentUnit.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        starsEarned: sessionStars,
        attempts: sessionAttempts,
        correct: sessionCorrect,
        milestonesReached: currentUnit.goalStars.filter(goal => sessionStars >= goal),
        createdAt: new Date()
      };

      // Save to database and store
      db.sessionLogs.add(sessionLog).then(() => {
        setCurrentSessionLog(sessionLog);
        setCurrentView('session-summary');
      });
    } else {
      // Fallback if no unit (shouldn't happen)
      setCurrentView('rewards');
    }
    return null;
  }

  const handleStart = () => {
    updateActivityStatus(currentActivity.id, 'in-progress');

    // Navigate to the appropriate activity view
    if (currentActivity.type === 'reading') {
      setCurrentView('reading');
    } else if (currentActivity.type === 'math') {
      setCurrentView('math');
    } else if (currentActivity.type === 'science') {
      setCurrentView('science');
    } else if (currentActivity.type === 'break') {
      setCurrentView('break');
    } else if (currentActivity.type === 'rewards') {
      setCurrentView('rewards');
    }
  };

  const completedCount = sessionPlan.activities.filter(a => a.status === 'completed').length;
  const totalCount = sessionPlan.activities.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Progress Banner */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Activity {completedCount + 1} of {totalCount}
            </h2>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {sessionPlan.activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`w-4 h-4 rounded-full transition-all ${
                  activity.status === 'completed'
                    ? 'bg-green-500'
                    : activity.status === 'in-progress'
                    ? 'bg-blue-500 scale-125'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Activity Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">

          {/* Activity Icon */}
          <div className="text-9xl mb-8">
            {currentActivity.icon}
          </div>

          {/* Activity Title */}
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            {currentActivity.title}
          </h1>

          {/* Activity Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">

            <div className="bg-blue-100 rounded-2xl p-6">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-2xl font-semibold text-blue-800">
                {currentActivity.estimatedItems} {currentActivity.estimatedItems === 1 ? 'item' : 'items'}
              </div>
              <div className="text-lg text-blue-600">to practice</div>
            </div>

            <div className="bg-yellow-100 rounded-2xl p-6">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-2xl font-semibold text-yellow-800">
                Earn {currentActivity.starsToEarn} {currentActivity.starsToEarn === 1 ? 'star' : 'stars'}
              </div>
              <div className="text-lg text-yellow-600">when you finish!</div>
            </div>

          </div>

          {/* What's Coming Next */}
          {sessionPlan.currentActivityIndex < sessionPlan.activities.length - 1 && (
            <div className="bg-purple-50 rounded-2xl p-6 mb-8">
              <div className="text-xl font-semibold text-purple-800 mb-2">
                ⏭️ Coming Next:
              </div>
              <div className="text-2xl text-purple-600">
                {sessionPlan.activities[sessionPlan.currentActivityIndex + 1].icon}{' '}
                {sessionPlan.activities[sessionPlan.currentActivityIndex + 1].title}
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-4xl font-bold py-8 px-16 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            Let's Start! 🚀
          </button>

        </div>

      </div>
    </div>
  );
}
