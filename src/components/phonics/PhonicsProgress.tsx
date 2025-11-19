import { useState, useEffect } from 'react';
import { ArrowLeft, Award, TrendingUp, Target, Star, CheckCircle2 } from 'lucide-react';
import { PhonicsProgress as PhonicsProgressType } from '../../types';
import { getAllProgress, getProgressSummary } from '../../utils/phonicsEngine';
import { PHONICS_PATTERNS } from '../../data/phonicsPatterns';
import { PHONICS_PROGRESSION, getLevelColor } from '../../data/phonicsProgressionMap';

interface Props {
  studentId: string;
  onBack: () => void;
}

export function PhonicsProgress({ studentId, onBack }: Props) {
  const [allProgress, setAllProgress] = useState<PhonicsProgressType[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    setLoading(true);
    try {
      const progress = await getAllProgress(studentId);
      const progressSummary = await getProgressSummary(studentId);

      setAllProgress(progress);
      setSummary(progressSummary);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-2xl text-gray-700">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const masteredProgress = allProgress.filter(p => p.status === 'mastered');
  const learningProgress = allProgress.filter(p => p.status === 'learning');
  const notStartedProgress = allProgress.filter(p => p.status === 'not-introduced');

  // Get patterns by level
  const levelProgress = PHONICS_PROGRESSION.map(level => {
    const levelPatterns = PHONICS_PATTERNS.filter(p => p.level === level.level);
    const masteredInLevel = levelPatterns.filter(p =>
      masteredProgress.some(mp => mp.patternId === p.id)
    ).length;

    return {
      level: level.level,
      name: level.name,
      total: levelPatterns.length,
      mastered: masteredInLevel,
      percentage: levelPatterns.length > 0 ? (masteredInLevel / levelPatterns.length) * 100 : 0
    };
  });

  // Filter patterns for selected level
  const displayPatterns = selectedLevel
    ? PHONICS_PATTERNS.filter(p => p.level === selectedLevel)
    : PHONICS_PATTERNS;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-xl font-bold">Back</span>
          </button>

          <h1 className="text-5xl font-bold text-gray-800">
            📊 Your Phonics Progress
          </h1>

          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl p-8">
              <Award className="w-12 h-12 mb-4" />
              <div className="text-5xl font-bold mb-2">{summary.masteredPatterns}</div>
              <div className="text-xl opacity-90">Patterns Mastered</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-8">
              <TrendingUp className="w-12 h-12 mb-4" />
              <div className="text-5xl font-bold mb-2">{summary.learningPatterns}</div>
              <div className="text-xl opacity-90">Currently Learning</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-8">
              <Target className="w-12 h-12 mb-4" />
              <div className="text-5xl font-bold mb-2">{summary.currentLevel}</div>
              <div className="text-xl opacity-90">Current Level</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl p-8">
              <Star className="w-12 h-12 mb-4" />
              <div className="text-5xl font-bold mb-2">{summary.overallAccuracy}%</div>
              <div className="text-xl opacity-90">Overall Accuracy</div>
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Progress by Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levelProgress.map(lp => (
              <button
                key={lp.level}
                onClick={() => setSelectedLevel(selectedLevel === lp.level ? null : lp.level)}
                className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${
                  selectedLevel === lp.level
                    ? 'ring-4 ring-offset-2 scale-105'
                    : ''
                }`}
                style={{
                  backgroundColor: getLevelColor(lp.level),
                  opacity: lp.mastered === 0 && lp.level > (summary?.currentLevel || 1) ? 0.5 : 1
                }}
              >
                <div className="text-white">
                  <div className="text-4xl font-bold mb-2">Level {lp.level}</div>
                  <div className="text-xl mb-4">{lp.name}</div>
                  <div className="bg-white bg-opacity-30 rounded-full h-3 mb-2">
                    <div
                      className="bg-white h-3 rounded-full transition-all"
                      style={{ width: `${lp.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-lg font-bold">
                    {lp.mastered} / {lp.total} patterns
                  </div>
                </div>
              </button>
            ))}
          </div>
          {selectedLevel && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedLevel(null)}
                className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all text-gray-800 font-bold"
              >
                Show All Levels
              </button>
            </div>
          )}
        </div>

        {/* Pattern Details */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {selectedLevel ? `Level ${selectedLevel} Patterns` : 'All Patterns'}
          </h2>

          {/* Mastered Patterns */}
          {masteredProgress.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-8 h-8" />
                Mastered Patterns ({masteredProgress.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {masteredProgress
                  .filter(p => !selectedLevel || PHONICS_PATTERNS.find(pat => pat.id === p.patternId)?.level === selectedLevel)
                  .map(progress => {
                    const pattern = PHONICS_PATTERNS.find(p => p.id === progress.patternId);
                    if (!pattern) return null;

                    return (
                      <div
                        key={progress.id}
                        className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{pattern.name}</h4>
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700 font-semibold">
                            Accuracy: {Math.round(progress.accuracy)}%
                          </span>
                          <span className="text-gray-600">
                            {progress.attemptsCount} attempts
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Mastered: {new Date(progress.masteredDate!).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Learning Patterns */}
          {learningProgress.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                <TrendingUp className="w-8 h-8" />
                Currently Learning ({learningProgress.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningProgress
                  .filter(p => !selectedLevel || PHONICS_PATTERNS.find(pat => pat.id === p.patternId)?.level === selectedLevel)
                  .map(progress => {
                    const pattern = PHONICS_PATTERNS.find(p => p.id === progress.patternId);
                    if (!pattern) return null;

                    return (
                      <div
                        key={progress.id}
                        className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{pattern.name}</h4>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: getLevelColor(pattern.level) }}
                          >
                            {pattern.level}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full transition-all"
                              style={{ width: `${progress.accuracy}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700 font-semibold">
                            Accuracy: {Math.round(progress.accuracy)}%
                          </span>
                          <span className="text-gray-600">
                            {progress.attemptsCount} attempts
                          </span>
                        </div>

                        {progress.accuracy >= 80 && progress.attemptsCount >= 10 && (
                          <div className="mt-3 text-sm font-bold text-green-600">
                            🎉 Ready to master soon!
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Not Started */}
          {selectedLevel && notStartedProgress.filter(p =>
            PHONICS_PATTERNS.find(pat => pat.id === p.patternId)?.level === selectedLevel
          ).length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                Not Yet Started
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notStartedProgress
                  .filter(p => PHONICS_PATTERNS.find(pat => pat.id === p.patternId)?.level === selectedLevel)
                  .slice(0, 6)
                  .map(progress => {
                    const pattern = PHONICS_PATTERNS.find(p => p.id === progress.patternId);
                    if (!pattern) return null;

                    return (
                      <div
                        key={progress.id}
                        className="p-6 bg-gray-100 rounded-2xl border-2 border-gray-300 opacity-75"
                      >
                        <h4 className="text-xl font-bold text-gray-600 mb-2">{pattern.name}</h4>
                        <p className="text-sm text-gray-500">{pattern.description}</p>
                        <p className="text-sm text-gray-400 mt-2">Coming soon!</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
