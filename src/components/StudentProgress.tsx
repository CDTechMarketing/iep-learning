import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { db } from '../db';
import { SessionLog } from '../types';
import { Star, TrendingUp, Award, ArrowLeft } from 'lucide-react';

export function StudentProgress() {
  const { setCurrentView, settings } = useStore();
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [recentImprovement, setRecentImprovement] = useState(0);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    const logs = await db.sessionLogs.orderBy('createdAt').reverse().toArray();
    setSessionLogs(logs);

    const stars = logs.reduce((sum, log) => sum + log.starsEarned, 0);
    setTotalStars(stars);
    setTotalSessions(logs.length);

    if (logs.length > 0) {
      const totalAttempts = logs.reduce((sum, log) => sum + log.attempts, 0);
      const totalCorrect = logs.reduce((sum, log) => sum + log.correct, 0);
      const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
      setAverageAccuracy(accuracy);

      // Calculate improvement (compare first 5 sessions vs last 5 sessions)
      if (logs.length >= 10) {
        const firstFive = logs.slice(-5);
        const lastFive = logs.slice(0, 5);

        const firstAccuracy = firstFive.reduce((sum, log) =>
          sum + (log.attempts > 0 ? (log.correct / log.attempts) * 100 : 0), 0) / 5;
        const lastAccuracy = lastFive.reduce((sum, log) =>
          sum + (log.attempts > 0 ? (log.correct / log.attempts) * 100 : 0), 0) / 5;

        setRecentImprovement(lastAccuracy - firstAccuracy);
      }
    }
  }

  const getStarLevel = (stars: number) => {
    if (stars >= 100) return { level: 'Super Star', icon: '🌟', color: 'from-yellow-400 to-orange-500' };
    if (stars >= 50) return { level: 'Rising Star', icon: '⭐', color: 'from-blue-400 to-purple-500' };
    if (stars >= 25) return { level: 'Bright Star', icon: '✨', color: 'from-green-400 to-blue-500' };
    if (stars >= 10) return { level: 'Shining Star', icon: '💫', color: 'from-purple-400 to-pink-500' };
    return { level: 'New Star', icon: '🌠', color: 'from-pink-400 to-red-500' };
  };

  const starLevel = getStarLevel(totalStars);

  const recentSessions = sessionLogs.slice(0, 10);
  const starsPerSession = recentSessions.map(log => log.starsEarned);
  const maxStars = Math.max(...starsPerSession, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentView('home')}
            className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-8 h-8 text-gray-700" />
          </button>
          <h1 className="text-6xl font-bold text-gray-800">My Progress</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Star Level Card */}
        <div className={`bg-gradient-to-br ${starLevel.color} rounded-3xl shadow-2xl p-12 mb-8 text-center text-white`}>
          <div className="text-9xl mb-4">{starLevel.icon}</div>
          <h2 className="text-5xl font-bold mb-2">{starLevel.level}!</h2>
          <p className="text-3xl opacity-90">{totalStars} Total Stars Earned</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Total Sessions */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-5xl font-bold text-gray-800 mb-2">{totalSessions}</div>
            <div className="text-2xl text-gray-600">Practice Sessions</div>
          </div>

          {/* Average Accuracy */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <div className="text-5xl font-bold text-gray-800 mb-2">{Math.round(averageAccuracy)}%</div>
            <div className="text-2xl text-gray-600">Accuracy</div>
          </div>

          {/* Recent Improvement */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">
              {recentImprovement > 0 ? '📈' : recentImprovement < 0 ? '📊' : '➡️'}
            </div>
            <div className={`text-5xl font-bold mb-2 ${
              recentImprovement > 0 ? 'text-green-600' : recentImprovement < 0 ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {recentImprovement > 0 && '+'}
              {Math.round(recentImprovement)}%
            </div>
            <div className="text-2xl text-gray-600">Recent Progress</div>
          </div>

        </div>

        {/* Progress Chart */}
        {recentSessions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              ⭐ Stars Earned (Last {recentSessions.length} Sessions)
            </h3>

            <div className="flex items-end justify-center gap-4 h-64">
              {recentSessions.reverse().map((session, index) => {
                const heightPercent = (session.starsEarned / maxStars) * 100;

                return (
                  <div key={session.id} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
                    {/* Bar */}
                    <div className="w-full flex flex-col justify-end items-center" style={{ height: '200px' }}>
                      <div
                        className="w-full bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-xl transition-all hover:from-yellow-500 hover:to-yellow-600 flex items-start justify-center pt-2"
                        style={{ height: `${heightPercent}%`, minHeight: session.starsEarned > 0 ? '30px' : '0' }}
                      >
                        {session.starsEarned > 0 && (
                          <span className="text-white font-bold text-sm">{session.starsEarned}</span>
                        )}
                      </div>
                    </div>

                    {/* Label */}
                    <div className="text-sm font-semibold text-gray-600">
                      #{recentSessions.length - index}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🏆 My Achievements
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {/* First Session */}
            <div className={`p-6 rounded-2xl text-center ${totalSessions >= 1 ? 'bg-green-100' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-5xl mb-2">🎯</div>
              <div className="text-lg font-bold text-gray-800">First Try</div>
              <div className="text-sm text-gray-600">Complete 1 session</div>
            </div>

            {/* 10 Stars */}
            <div className={`p-6 rounded-2xl text-center ${totalStars >= 10 ? 'bg-yellow-100' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-5xl mb-2">⭐</div>
              <div className="text-lg font-bold text-gray-800">Star Collector</div>
              <div className="text-sm text-gray-600">Earn 10 stars</div>
            </div>

            {/* 25 Stars */}
            <div className={`p-6 rounded-2xl text-center ${totalStars >= 25 ? 'bg-blue-100' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-5xl mb-2">✨</div>
              <div className="text-lg font-bold text-gray-800">Bright Star</div>
              <div className="text-sm text-gray-600">Earn 25 stars</div>
            </div>

            {/* 50 Stars */}
            <div className={`p-6 rounded-2xl text-center ${totalStars >= 50 ? 'bg-purple-100' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-5xl mb-2">🌟</div>
              <div className="text-lg font-bold text-gray-800">Super Star</div>
              <div className="text-sm text-gray-600">Earn 50 stars</div>
            </div>

            {/* 10 Sessions */}
            <div className={`p-6 rounded-2xl text-center ${totalSessions >= 10 ? 'bg-green-100' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-5xl mb-2">📚</div>
              <div className="text-lg font-bold text-gray-800">Dedicated</div>
              <div className="text-sm text-gray-600">10 practice sessions</div>
            </div>

            {/* 80% Accuracy */}
            <div className={`p-6 rounded-2xl text-center ${averageAccuracy >= 80 ? 'bg-pink-100' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-5xl mb-2">🎯</div>
              <div className="text-lg font-bold text-gray-800">Accurate</div>
              <div className="text-sm text-gray-600">80% accuracy</div>
            </div>

            {/* Improvement */}
            <div className={`p-6 rounded-2xl text-center ${recentImprovement > 10 ? 'bg-orange-100' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-5xl mb-2">📈</div>
              <div className="text-lg font-bold text-gray-800">Growing</div>
              <div className="text-sm text-gray-600">10% improvement</div>
            </div>

            {/* 100 Stars */}
            <div className={`p-6 rounded-2xl text-center ${totalStars >= 100 ? 'bg-yellow-100' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-5xl mb-2">👑</div>
              <div className="text-lg font-bold text-gray-800">Star Champion</div>
              <div className="text-sm text-gray-600">Earn 100 stars</div>
            </div>

          </div>
        </div>

        {/* Encouragement Message */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white">
            <p className="text-4xl font-bold mb-3">
              {totalStars === 0 && "You're just getting started! Let's earn some stars! 🌟"}
              {totalStars > 0 && totalStars < 10 && "Great start! Keep practicing to earn more stars! ⭐"}
              {totalStars >= 10 && totalStars < 25 && "You're doing amazing! Look how many stars you have! ✨"}
              {totalStars >= 25 && totalStars < 50 && "Wow! You're becoming a reading and math expert! 🎉"}
              {totalStars >= 50 && "You're incredible! Look at all your progress! 🌟"}
            </p>
            <p className="text-2xl opacity-90">
              Keep up the great work!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
