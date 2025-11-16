import { useState, useEffect } from 'react';
import { FileText, Printer, Calendar, TrendingUp } from 'lucide-react';
import { SkillMastery, IEPGoal, SessionLog } from '../types';
import { getAllMastery, getMasteryStatistics } from '../utils/masteryTracker';
import { getAllIEPGoals, getGoalStatistics } from '../utils/iepGoalTracker';
import { db } from '../db';
import { useStore } from '../store';

export function ProgressReport() {
  const { setCurrentView } = useStore();
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [goals, setGoals] = useState<IEPGoal[]>([]);
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [skillStats, setSkillStats] = useState({
    total: 0,
    mastered: 0,
    progressing: 0,
    emerging: 0,
    masteryRate: 0
  });

  const [goalStats, setGoalStats] = useState({
    total: 0,
    achieved: 0,
    onTrack: 0,
    atRisk: 0,
    avgProgress: 0
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    const allSkills = await getAllMastery();
    const allGoals = await getAllIEPGoals();
    const allSessions = await db.sessionLogs
      .where('createdAt')
      .between(new Date(dateRange.start), new Date(dateRange.end))
      .toArray();

    setSkills(allSkills);
    setGoals(allGoals);
    setSessions(allSessions);

    const skillStatistics = await getMasteryStatistics();
    const goalStatistics = await getGoalStatistics();

    setSkillStats(skillStatistics);
    setGoalStats(goalStatistics);
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotalStars = () => {
    return sessions.reduce((total, session) => total + session.starsEarned, 0);
  };

  const calculateTotalAccuracy = () => {
    const totalAttempts = sessions.reduce((total, session) => total + session.attempts, 0);
    const totalCorrect = sessions.reduce((total, session) => total + session.correct, 0);
    return totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];

    // Based on skill mastery
    if (skillStats.emerging > skillStats.progressing + skillStats.mastered) {
      recommendations.push(
        'Focus on emerging skills with additional practice and support. Consider breaking down tasks into smaller steps.'
      );
    }

    if (skillStats.progressing > 0) {
      recommendations.push(
        `Great progress on ${skillStats.progressing} skill${skillStats.progressing > 1 ? 's' : ''}! Continue current practice routine to achieve mastery.`
      );
    }

    // Based on IEP goals
    if (goalStats.atRisk > 0) {
      recommendations.push(
        `${goalStats.atRisk} IEP goal${goalStats.atRisk > 1 ? 's are' : ' is'} at risk. Consider increasing practice frequency or adjusting strategies.`
      );
    }

    if (goalStats.achieved > 0) {
      recommendations.push(
        `Celebrate! ${goalStats.achieved} IEP goal${goalStats.achieved > 1 ? 's have' : ' has'} been achieved. Consider setting new challenging goals.`
      );
    }

    // Based on session data
    const accuracy = calculateTotalAccuracy();
    if (accuracy < 60) {
      recommendations.push(
        'Overall accuracy is below 60%. Consider reviewing material difficulty and providing additional support or accommodations.'
      );
    } else if (accuracy >= 80) {
      recommendations.push(
        'Excellent accuracy! Student is ready for more challenging material and new skills.'
      );
    }

    if (sessions.length < 10) {
      recommendations.push(
        'Increase practice frequency for better skill retention and progress tracking.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Keep up the good work! Continue current practice routine and monitor progress regularly.'
      );
    }

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Print/Screen Version */}
        <div className="flex items-center justify-between mb-8 print:mb-4">
          <div className="flex items-center gap-4 print:gap-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-3 bg-white rounded-xl shadow hover:shadow-lg transition print:hidden"
            >
              ←
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 print:text-3xl">
                <FileText className="w-10 h-10 text-blue-600 print:w-8 print:h-8" />
                Progress Report
              </h1>
              <p className="text-gray-600 mt-1 print:text-sm">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg print:hidden"
          >
            <Printer className="w-5 h-5" />
            Print Report
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 print:shadow-none print:border print:border-gray-300">
          <div className="flex items-center gap-4 print:gap-2">
            <Calendar className="w-6 h-6 text-gray-600 print:hidden" />
            <div className="flex gap-4 items-center flex-wrap">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none print:border print:p-1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none print:border print:p-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 print:shadow-none print:border print:border-gray-300 print:p-4 print:mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 print:text-xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Executive Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2">
            <div className="bg-blue-50 rounded-lg p-4 print:p-2">
              <p className="text-sm text-blue-700 font-semibold">Total Sessions</p>
              <p className="text-3xl font-bold text-blue-900 print:text-2xl">{sessions.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 print:p-2">
              <p className="text-sm text-yellow-700 font-semibold">Stars Earned</p>
              <p className="text-3xl font-bold text-yellow-900 print:text-2xl">{calculateTotalStars()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 print:p-2">
              <p className="text-sm text-green-700 font-semibold">Overall Accuracy</p>
              <p className="text-3xl font-bold text-green-900 print:text-2xl">
                {Math.round(calculateTotalAccuracy())}%
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 print:p-2">
              <p className="text-sm text-purple-700 font-semibold">Mastery Rate</p>
              <p className="text-3xl font-bold text-purple-900 print:text-2xl">
                {Math.round(skillStats.masteryRate)}%
              </p>
            </div>
          </div>
        </div>

        {/* Skill Mastery Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 print:shadow-none print:border print:border-gray-300 print:p-4 print:mb-4 print:page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 print:text-xl">
            Skill Mastery Summary
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6 print:gap-2 print:mb-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 print:p-2">
              <p className="text-sm text-green-700 font-semibold">✅ Mastered</p>
              <p className="text-3xl font-bold text-green-900 print:text-2xl">{skillStats.mastered}</p>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 print:p-2">
              <p className="text-sm text-yellow-700 font-semibold">📈 Progressing</p>
              <p className="text-3xl font-bold text-yellow-900 print:text-2xl">{skillStats.progressing}</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 print:p-2">
              <p className="text-sm text-blue-700 font-semibold">🌱 Emerging</p>
              <p className="text-3xl font-bold text-blue-900 print:text-2xl">{skillStats.emerging}</p>
            </div>
          </div>

          {/* Skills by Category */}
          <div className="space-y-3 print:space-y-2">
            <h3 className="font-bold text-gray-700">Skills by Category</h3>
            {['reading', 'math', 'science'].map(category => {
              const categorySkills = skills.filter(s => s.category === category);
              if (categorySkills.length === 0) return null;

              return (
                <div key={category} className="border-l-4 border-blue-300 pl-4 print:pl-2">
                  <h4 className="font-semibold text-gray-800 capitalize mb-2">
                    {category} ({categorySkills.length} skills)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 print:gap-1">
                    {categorySkills.map(skill => (
                      <div key={skill.id} className="flex items-center justify-between bg-gray-50 rounded p-2 print:p-1">
                        <span className="text-sm font-medium text-gray-700">{skill.skillName}</span>
                        <span className="text-lg">
                          {skill.masteryLevel === 'mastered' && '✅'}
                          {skill.masteryLevel === 'progressing' && '📈'}
                          {skill.masteryLevel === 'emerging' && '🌱'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* IEP Goals Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 print:shadow-none print:border print:border-gray-300 print:p-4 print:mb-4 print:page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 print:text-xl">
            IEP Goals Summary
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6 print:gap-2 print:mb-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 print:p-2">
              <p className="text-sm text-green-700 font-semibold">Achieved</p>
              <p className="text-3xl font-bold text-green-900 print:text-2xl">{goalStats.achieved}</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 print:p-2">
              <p className="text-sm text-blue-700 font-semibold">On Track</p>
              <p className="text-3xl font-bold text-blue-900 print:text-2xl">{goalStats.onTrack}</p>
            </div>
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 print:p-2">
              <p className="text-sm text-red-700 font-semibold">At Risk</p>
              <p className="text-3xl font-bold text-red-900 print:text-2xl">{goalStats.atRisk}</p>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-3 print:space-y-2">
            {goals.map(goal => {
              const status =
                goal.currentProgress >= 100
                  ? 'achieved'
                  : goal.currentProgress >= 70
                  ? 'on-track'
                  : 'at-risk';
              const statusColor =
                status === 'achieved'
                  ? 'bg-green-50 border-green-300'
                  : status === 'on-track'
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-red-50 border-red-300';

              return (
                <div key={goal.id} className={`border-2 rounded-lg p-4 print:p-2 ${statusColor}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{goal.description}</h4>
                      <p className="text-sm text-gray-600">
                        {goal.category} • Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800 print:text-xl">
                        {Math.round(goal.currentProgress)}%
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        status === 'achieved'
                          ? 'bg-green-500'
                          : status === 'on-track'
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, goal.currentProgress)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && (
              <p className="text-gray-500 text-center py-4">No IEP goals set yet.</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 print:shadow-none print:border print:border-gray-300 print:p-4 print:page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 print:text-xl">
            Recommendations
          </h2>
          <ul className="space-y-3 print:space-y-2">
            {getRecommendations().map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 print:gap-2">
                <span className="text-blue-600 text-xl print:text-lg">•</span>
                <p className="text-gray-700 flex-1">{rec}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer - Print Only */}
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600 text-center">
          <p>IEP Learning App Progress Report • {new Date().toLocaleDateString()}</p>
          <p>Report Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
