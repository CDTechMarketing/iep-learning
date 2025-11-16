import { useState, useEffect } from 'react';
import { TrendingUp, Award, Sparkles, BarChart3 } from 'lucide-react';
import { SkillMastery } from '../types';
import {
  getAllMastery,
  getMasteryByCategory,
  getRecentlyMasteredSkills,
  getMasteryStatistics,
  analyzeAllSkills
} from '../utils/masteryTracker';
import { useStore } from '../store';

export function SkillMasteryView() {
  const { setCurrentView } = useStore();
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [recentlyMastered, setRecentlyMastered] = useState<SkillMastery[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    mastered: 0,
    progressing: 0,
    emerging: 0,
    masteryRate: 0
  });
  const [selectedSkill, setSelectedSkill] = useState<SkillMastery | null>(null);

  useEffect(() => {
    loadSkills();
    loadRecentlyMastered();
    loadStats();
  }, []);

  const loadSkills = async () => {
    // Analyze all skills first to ensure data is up to date
    await analyzeAllSkills();
    const allSkills = await getAllMastery();
    setSkills(allSkills);
  };

  const loadRecentlyMastered = async () => {
    const recent = await getRecentlyMasteredSkills(7);
    setRecentlyMastered(recent);
  };

  const loadStats = async () => {
    const statistics = await getMasteryStatistics();
    setStats(statistics);
  };

  const getMasteryIcon = (level: string) => {
    switch (level) {
      case 'mastered':
        return '✅';
      case 'progressing':
        return '📈';
      case 'emerging':
        return '🌱';
      default:
        return '❓';
    }
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'mastered':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'progressing':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'emerging':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const filteredSkills = skills.filter(skill => {
    if (filterCategory !== 'all' && skill.category !== filterCategory) return false;
    if (filterLevel !== 'all' && skill.masteryLevel !== filterLevel) return false;
    return true;
  });

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillMastery[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-3 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              ←
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Award className="w-10 h-10 text-green-600" />
                Skill Mastery
              </h1>
              <p className="text-gray-600 mt-1">Track skill progression and mastery achievements</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Total Skills</h3>
              <BarChart3 className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-green-800">Mastered</h3>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-4xl font-bold text-green-900">{stats.mastered}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-yellow-800">Progressing</h3>
              <span className="text-3xl">📈</span>
            </div>
            <p className="text-4xl font-bold text-yellow-900">{stats.progressing}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-800">Emerging</h3>
              <span className="text-3xl">🌱</span>
            </div>
            <p className="text-4xl font-bold text-blue-900">{stats.emerging}</p>
          </div>
        </div>

        {/* Recently Mastered Celebration */}
        {recentlyMastered.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 rounded-2xl shadow-lg p-8 mb-8 border-4 border-yellow-300">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-600" />
              <h2 className="text-3xl font-bold text-gray-800">
                Recently Mastered! 🎉
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {recentlyMastered.map(skill => (
                <div
                  key={skill.id}
                  className="bg-white rounded-xl shadow-md p-4 border-2 border-yellow-400"
                >
                  <div className="text-4xl mb-2">⭐</div>
                  <h3 className="font-bold text-gray-800">{skill.skillName}</h3>
                  <p className="text-sm text-gray-600">
                    {skill.dateAchievedMastery && new Date(skill.dateAchievedMastery).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="reading">Reading</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mastery Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="mastered">✅ Mastered</option>
                <option value="progressing">📈 Progressing</option>
                <option value="emerging">🌱 Emerging</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        {Object.keys(groupedSkills).length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              No skills found. Complete some practice sessions to see skill mastery data!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize flex items-center gap-3">
                  {category === 'reading' && '📚'}
                  {category === 'math' && '🔢'}
                  {category === 'science' && '🔬'}
                  {category} Skills ({categorySkills.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map(skill => (
                    <div
                      key={skill.id}
                      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 cursor-pointer hover:shadow-xl transition ${
                        getMasteryColor(skill.masteryLevel).split(' ')[1]
                      }`}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-3xl">{getMasteryIcon(skill.masteryLevel)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getMasteryColor(skill.masteryLevel)}`}>
                              {skill.masteryLevel.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {skill.skillName}
                          </h3>
                        </div>
                      </div>

                      {/* Mini Accuracy Chart */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-600">
                            Accuracy Trend
                          </span>
                          <span className="text-xs font-bold text-gray-800">
                            {skill.accuracyHistory.length > 0
                              ? `${Math.round(skill.accuracyHistory[skill.accuracyHistory.length - 1])}%`
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-end gap-1 h-12">
                          {skill.accuracyHistory.slice(-10).map((acc, idx) => (
                            <div
                              key={idx}
                              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                              style={{ height: `${acc}%` }}
                              title={`${Math.round(acc)}%`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Sessions:</strong> {skill.accuracyHistory.length}
                        </p>
                        <p>
                          <strong>Consecutive:</strong> {skill.consecutiveSessions} at {skill.criteriaValue}%+
                        </p>
                        {skill.dateAchievedMastery && (
                          <p>
                            <strong>Mastered:</strong>{' '}
                            {new Date(skill.dateAchievedMastery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skill Detail Modal */}
        {selectedSkill && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSkill(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-4xl">{getMasteryIcon(selectedSkill.masteryLevel)}</span>
                  {selectedSkill.skillName}
                </h2>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${getMasteryColor(selectedSkill.masteryLevel)}`}>
                  <p className="text-xl font-bold">
                    {selectedSkill.masteryLevel.toUpperCase()}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Accuracy History</h3>
                  <div className="flex items-end gap-2 h-32 bg-gray-50 rounded-lg p-4">
                    {selectedSkill.accuracyHistory.map((acc, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                          style={{ height: `${acc}%` }}
                        />
                        <span className="text-xs text-gray-600 mt-1">{Math.round(acc)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Started</p>
                    <p className="font-bold text-gray-800">
                      {new Date(selectedSkill.dateStarted).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-bold text-gray-800 capitalize">{selectedSkill.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Criteria</p>
                    <p className="font-bold text-gray-800">
                      {selectedSkill.criteriaValue}% accuracy
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Consecutive Sessions</p>
                    <p className="font-bold text-gray-800">
                      {selectedSkill.consecutiveSessions}
                    </p>
                  </div>
                </div>

                {selectedSkill.dateAchievedMastery && (
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <p className="text-sm text-green-700">Achieved Mastery</p>
                    <p className="font-bold text-green-900 text-xl">
                      {new Date(selectedSkill.dateAchievedMastery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
