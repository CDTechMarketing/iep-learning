/**
 * Session Summary Component
 *
 * Shows motivating stats and encouragement at the end of each session
 */

import { useStore } from '../store';
import { logger } from '../utils/logger';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color: 'yellow' | 'green' | 'blue' | 'purple';
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  const colors = {
    yellow: 'from-yellow-400 to-yellow-500',
    green: 'from-green-400 to-green-500',
    blue: 'from-blue-400 to-blue-500',
    purple: 'from-purple-400 to-purple-500'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white text-center shadow-lg transform hover:scale-105 transition-transform`}>
      <div className="text-5xl mb-2">{icon}</div>
      <div className="text-4xl font-bold mb-1">{value}</div>
      <div className="text-lg opacity-90">{label}</div>
    </div>
  );
}

function getEncouragingMessage(accuracy: number): string {
  if (accuracy >= 90) return "You're a superstar! Outstanding work! 🌟";
  if (accuracy >= 80) return "Excellent job! You're doing great! 🎯";
  if (accuracy >= 70) return "Nice work! Keep it up! 💪";
  if (accuracy >= 60) return "Good effort! You're learning! 📈";
  return "Great job trying! Every practice makes you better! 🌱";
}

export function SessionSummary() {
  const {
    sessionStars,
    sessionAttempts,
    sessionCorrect,
    sessionStartTime,
    currentSessionLog,
    setCurrentView
  } = useStore();

  // Calculate stats
  const accuracy = sessionAttempts > 0 ? (sessionCorrect / sessionAttempts) * 100 : 0;
  const duration = sessionStartTime ? Math.round((Date.now() - sessionStartTime) / 60000) : 0;

  // Log summary viewed
  logger.info('session-summary', 'Session summary displayed', {
    stars: sessionStars,
    accuracy: Math.round(accuracy),
    attempts: sessionAttempts,
    duration
  });

  // Use current session log if available, otherwise use current stats
  const displayStars = currentSessionLog?.starsEarned ?? sessionStars;
  const displayCorrect = currentSessionLog?.correct ?? sessionCorrect;
  const displayAttempts = currentSessionLog?.attempts ?? sessionAttempts;
  const displayAccuracy = displayAttempts > 0 ? (displayCorrect / displayAttempts) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="text-8xl md:text-9xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Amazing Work!
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            icon="⭐"
            value={displayStars}
            label="Stars Earned"
            color="yellow"
          />
          <StatCard
            icon="✅"
            value={displayCorrect}
            label="Correct"
            color="green"
          />
          <StatCard
            icon="📊"
            value={`${Math.round(displayAccuracy)}%`}
            label="Accuracy"
            color="blue"
          />
          <StatCard
            icon="⏱️"
            value={duration > 0 ? `${duration}m` : '< 1m'}
            label="Time"
            color="purple"
          />
        </div>

        {/* Encouraging Message */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-2xl md:text-3xl text-center text-gray-800 font-semibold">
            {getEncouragingMessage(displayAccuracy)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">Your Accuracy</h3>
          <div className="h-10 md:h-12 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-out flex items-center justify-end pr-4"
              style={{ width: `${Math.min(displayAccuracy, 100)}%` }}
            >
              {displayAccuracy > 10 && (
                <span className="text-white font-bold text-lg md:text-xl">
                  {Math.round(displayAccuracy)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              logger.info('session-summary', 'User returned to home');
              setCurrentView('home');
            }}
            className="p-4 md:p-6 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition text-xl md:text-2xl font-bold flex items-center justify-center gap-2"
          >
            <span className="text-3xl">🏠</span>
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => {
              logger.info('session-summary', 'User navigated to rewards');
              setCurrentView('rewards');
            }}
            className="p-4 md:p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition text-xl md:text-2xl font-bold flex items-center justify-center gap-2"
          >
            <span className="text-3xl">🎁</span>
            <span>See Rewards</span>
          </button>
        </div>

        {/* Optional: Show Progress Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              logger.info('session-summary', 'User viewed progress');
              setCurrentView('progress');
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg underline"
          >
            View My Progress →
          </button>
        </div>
      </div>
    </div>
  );
}
