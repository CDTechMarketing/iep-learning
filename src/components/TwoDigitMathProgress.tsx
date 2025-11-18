import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { TwoDigitMathAttempt } from '../types';

interface ProgressMetrics {
  totalAttempts: number;
  correctCount: number;
  accuracy: number;
  additionAccuracy: number;
  subtractionAccuracy: number;
  regroupingAccuracy: number;
  currentLevel: number;
  levelAccuracies: { [key: number]: number };
  badges: string[];
}

/**
 * TwoDigitMathProgress Component
 * Displays comprehensive progress metrics for two-digit math practice
 * Shows badges, level progress, and skill-specific performance
 */
export const TwoDigitMathProgress: React.FC = () => {
  const [metrics, setMetrics] = useState<ProgressMetrics>({
    totalAttempts: 0,
    correctCount: 0,
    accuracy: 0,
    additionAccuracy: 0,
    subtractionAccuracy: 0,
    regroupingAccuracy: 0,
    currentLevel: 1,
    levelAccuracies: {},
    badges: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const attempts = await db.twoDigitMathAttempts.toArray();
      const problems = await db.twoDigitMathProblems.toArray();

      if (attempts.length === 0) {
        setLoading(false);
        return;
      }

      // Calculate overall metrics
      const correctCount = attempts.filter(a => a.isCorrect).length;
      const accuracy = (correctCount / attempts.length) * 100;

      // Calculate operation-specific accuracy
      const additionAttempts = attempts.filter(a => {
        const problem = problems.find(p => p.id === a.problemId);
        return problem?.operation === 'addition';
      });
      const additionCorrect = additionAttempts.filter(a => a.isCorrect).length;
      const additionAccuracy = additionAttempts.length > 0
        ? (additionCorrect / additionAttempts.length) * 100
        : 0;

      const subtractionAttempts = attempts.filter(a => {
        const problem = problems.find(p => p.id === a.problemId);
        return problem?.operation === 'subtraction';
      });
      const subtractionCorrect = subtractionAttempts.filter(a => a.isCorrect).length;
      const subtractionAccuracy = subtractionAttempts.length > 0
        ? (subtractionCorrect / subtractionAttempts.length) * 100
        : 0;

      // Calculate regrouping accuracy
      const regroupingAttempts = attempts.filter(a => {
        const problem = problems.find(p => p.id === a.problemId);
        return problem?.requiresRegrouping;
      });
      const regroupingCorrect = regroupingAttempts.filter(a => a.isCorrect).length;
      const regroupingAccuracy = regroupingAttempts.length > 0
        ? (regroupingCorrect / regroupingAttempts.length) * 100
        : 0;

      // Calculate level accuracies
      const levelAccuracies: { [key: number]: number } = {};
      for (let level = 1; level <= 5; level++) {
        const levelAttempts = attempts.filter(a => {
          const problem = problems.find(p => p.id === a.problemId);
          return problem?.difficulty === level;
        });
        const levelCorrect = levelAttempts.filter(a => a.isCorrect).length;
        levelAccuracies[level] = levelAttempts.length > 0
          ? (levelCorrect / levelAttempts.length) * 100
          : 0;
      }

      // Determine current level (highest level with 80%+ accuracy)
      let currentLevel = 1;
      for (let level = 5; level >= 1; level--) {
        if (levelAccuracies[level] >= 80) {
          currentLevel = Math.min(level + 1, 5);
          break;
        }
      }

      // Calculate badges earned
      const badges: string[] = [];
      if (additionAccuracy >= 90) badges.push('Addition Ace');
      if (subtractionAccuracy >= 90) badges.push('Subtraction Star');
      if (regroupingAccuracy >= 90) badges.push('Regrouping Rockstar');
      if (attempts.filter(a => {
        const problem = problems.find(p => p.id === a.problemId);
        return problem?.contextType === 'story-problem' && a.isCorrect;
      }).length >= 10) badges.push('Story Problem Solver');
      if (accuracy === 100 && attempts.length >= 10) badges.push('Perfect Session');

      setMetrics({
        totalAttempts: attempts.length,
        correctCount,
        accuracy,
        additionAccuracy,
        subtractionAccuracy,
        regroupingAccuracy,
        currentLevel,
        levelAccuracies,
        badges
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading progress:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-xl text-gray-600">Loading progress...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 rounded-xl max-w-6xl">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-800 mb-2">Your Two-Digit Math Progress</h2>
        <p className="text-lg text-gray-600">See how far you've come!</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="text-4xl font-bold text-blue-600">{metrics.totalAttempts}</div>
          <div className="text-sm text-gray-600 mt-1">Problems Attempted</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="text-4xl font-bold text-green-600">{metrics.correctCount}</div>
          <div className="text-sm text-gray-600 mt-1">Problems Solved Correctly</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="text-4xl font-bold text-purple-600">{metrics.accuracy.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 mt-1">Overall Accuracy</div>
        </div>
      </div>

      {/* Current level */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-purple-800 mb-3">Current Level</h3>
        <div className="flex items-center gap-4">
          <div className="text-6xl font-bold text-purple-600">Level {metrics.currentLevel}</div>
          <div className="flex-1">
            <div className="mb-2 text-sm font-semibold text-gray-700">
              {metrics.currentLevel === 1 && 'Addition without regrouping'}
              {metrics.currentLevel === 2 && 'Addition with regrouping'}
              {metrics.currentLevel === 3 && 'Subtraction without regrouping'}
              {metrics.currentLevel === 4 && 'Subtraction with regrouping'}
              {metrics.currentLevel === 5 && 'Story problems & mixed operations'}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all"
                style={{ width: `${(metrics.currentLevel / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Operation-specific accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-3">Addition Accuracy</h4>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-2xl font-semibold text-green-600">
                {metrics.additionAccuracy.toFixed(1)}%
              </span>
            </div>
            <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${metrics.additionAccuracy}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all"
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-3">Subtraction Accuracy</h4>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-2xl font-semibold text-orange-600">
                {metrics.subtractionAccuracy.toFixed(1)}%
              </span>
            </div>
            <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${metrics.subtractionAccuracy}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500 transition-all"
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-3">Regrouping Accuracy</h4>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-2xl font-semibold text-purple-600">
                {metrics.regroupingAccuracy.toFixed(1)}%
              </span>
            </div>
            <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${metrics.regroupingAccuracy}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Level progress bars */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Progress by Level</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className="flex items-center gap-4">
              <div className="w-24 text-sm font-semibold text-gray-700">Level {level}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className={`h-6 rounded-full transition-all flex items-center justify-end pr-2 text-white text-xs font-bold ${
                      (metrics.levelAccuracies[level] || 0) >= 80
                        ? 'bg-green-500'
                        : (metrics.levelAccuracies[level] || 0) >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${metrics.levelAccuracies[level] || 0}%` }}
                  >
                    {(metrics.levelAccuracies[level] || 0).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      {metrics.badges.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-orange-800 mb-4">Badges Earned</h3>
          <div className="flex flex-wrap gap-3">
            {metrics.badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border-2 border-orange-400"
              >
                <span className="text-2xl">🏆</span>
                <span className="font-semibold text-gray-800">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement message */}
      <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg text-center">
        <p className="text-gray-700">
          {metrics.accuracy >= 90 && '🌟 Outstanding work! You're a math superstar!'}
          {metrics.accuracy >= 70 && metrics.accuracy < 90 && '👍 Great job! Keep practicing to reach mastery!'}
          {metrics.accuracy < 70 && '💪 Keep going! Every problem makes you stronger at math!'}
        </p>
      </div>
    </div>
  );
};
