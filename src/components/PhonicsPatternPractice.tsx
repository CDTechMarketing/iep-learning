import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Volume2, Award } from 'lucide-react';
import { useStore } from '../store';
import { db } from '../db';
import { PhonicsPattern, PhonicsProgress } from '../types';
import {
  initializePhonicsProgress,
  determineNextPattern,
  getProgressSummary
} from '../utils/phonicsEngine';
import { SoundIsolationGame } from './phonics/SoundIsolationGame';
import { BlendingPractice } from './phonics/BlendingPractice';
import { SegmentingActivity } from './phonics/SegmentingActivity';
import { WordBuilder } from './phonics/WordBuilder';
import { PhonicsProgress as PhonicsProgressView } from './phonics/PhonicsProgress';
import { PHONICS_PATTERNS } from '../data/phonicsPatterns';
import { getLevelColor } from '../data/phonicsProgressionMap';

type ActivityType = 'sound-isolation' | 'blending' | 'segmenting' | 'word-building' | 'progress' | null;

export function PhonicsPatternPractice() {
  const { setCurrentView } = useStore();
  const [currentPattern, setCurrentPattern] = useState<PhonicsPattern | null>(null);
  const [currentActivity, setCurrentActivity] = useState<ActivityType>(null);
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const studentId = 'default-student'; // In a real app, this would come from auth

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    setLoading(true);
    try {
      // Initialize progress if needed
      await initializePhonicsProgress(studentId);

      // Seed patterns if needed
      const existingPatterns = await db.phonicsPatterns.count();
      if (existingPatterns === 0) {
        await db.phonicsPatterns.bulkAdd(PHONICS_PATTERNS);
      }

      // Get next pattern to practice
      const nextPattern = await determineNextPattern(studentId);
      setCurrentPattern(nextPattern);

      // Get progress summary
      const summary = await getProgressSummary(studentId);
      setProgressSummary(summary);
    } catch (error) {
      console.error('Error initializing phonics:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleActivitySelect(activity: ActivityType) {
    setCurrentActivity(activity);
  }

  function handleActivityComplete() {
    setCurrentActivity(null);
    // Refresh data
    initialize();
  }

  function handleBackToHome() {
    setCurrentView('home');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-2xl text-gray-700">Loading Phonics Detective...</p>
        </div>
      </div>
    );
  }

  // Activity view
  if (currentActivity && currentPattern) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-indigo-50 to-blue-50">
        <div className="p-8">
          {currentActivity === 'sound-isolation' && (
            <SoundIsolationGame
              pattern={currentPattern}
              studentId={studentId}
              onComplete={handleActivityComplete}
              onBack={() => setCurrentActivity(null)}
            />
          )}
          {currentActivity === 'blending' && (
            <BlendingPractice
              pattern={currentPattern}
              studentId={studentId}
              onComplete={handleActivityComplete}
              onBack={() => setCurrentActivity(null)}
            />
          )}
          {currentActivity === 'segmenting' && (
            <SegmentingActivity
              pattern={currentPattern}
              studentId={studentId}
              onComplete={handleActivityComplete}
              onBack={() => setCurrentActivity(null)}
            />
          )}
          {currentActivity === 'word-building' && (
            <WordBuilder
              pattern={currentPattern}
              studentId={studentId}
              onComplete={handleActivityComplete}
              onBack={() => setCurrentActivity(null)}
            />
          )}
        </div>
      </div>
    );
  }

  // Progress view
  if (currentActivity === 'progress') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-indigo-50 to-blue-50">
        <PhonicsProgressView
          studentId={studentId}
          onBack={() => setCurrentActivity(null)}
        />
      </div>
    );
  }

  // Main menu
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-indigo-50 to-blue-50">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-xl font-bold">Home</span>
            </button>

            <button
              onClick={() => handleActivitySelect('progress')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Award className="w-6 h-6" />
              <span className="text-xl font-bold">Progress</span>
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              🔍 Phonics Detective
            </h1>
            <p className="text-2xl text-gray-600">
              Crack the reading code! Practice letter sounds and phonics patterns.
            </p>
          </div>

          {/* Progress Summary */}
          {progressSummary && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Progress</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600">
                    {progressSummary.masteredPatterns}
                  </div>
                  <div className="text-gray-600 mt-2">Patterns Mastered</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">
                    {progressSummary.learningPatterns}
                  </div>
                  <div className="text-gray-600 mt-2">Currently Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600">
                    {progressSummary.currentLevel}
                  </div>
                  <div className="text-gray-600 mt-2">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-600">
                    {progressSummary.overallAccuracy}%
                  </div>
                  <div className="text-gray-600 mt-2">Accuracy</div>
                </div>
              </div>
            </div>
          )}

          {/* Current Pattern */}
          {currentPattern && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    {currentPattern.name}
                  </h2>
                  <p className="text-xl text-gray-600">{currentPattern.description}</p>
                </div>
                <div
                  className="px-6 py-3 rounded-xl text-white font-bold text-xl"
                  style={{ backgroundColor: getLevelColor(currentPattern.level) }}
                >
                  Level {currentPattern.level}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-700 mb-3">Examples:</h3>
                <div className="flex flex-wrap gap-3">
                  {currentPattern.examples.slice(0, 6).map((example, index) => (
                    <div
                      key={index}
                      className="px-6 py-3 bg-gray-100 rounded-xl text-2xl font-bold text-gray-800"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-2">💡 Teaching Tip:</h3>
                <p className="text-lg text-blue-700">{currentPattern.teachingTip}</p>
              </div>
            </div>
          )}

          {/* Activity Selection */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Choose an Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleActivitySelect('sound-isolation')}
                className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Volume2 className="w-16 h-16" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Sound Detective</h3>
                  <p className="text-blue-100">Identify sounds in words</p>
                </div>
              </button>

              <button
                onClick={() => handleActivitySelect('blending')}
                className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-2xl hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl">🔗</div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Blending Practice</h3>
                  <p className="text-green-100">Put sounds together</p>
                </div>
              </button>

              <button
                onClick={() => handleActivitySelect('segmenting')}
                className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-2xl hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl">✂️</div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Sound Boxes</h3>
                  <p className="text-purple-100">Break words into sounds</p>
                </div>
              </button>

              <button
                onClick={() => handleActivitySelect('word-building')}
                className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-2xl hover:from-orange-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl">🧱</div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Word Builder</h3>
                  <p className="text-orange-100">Build words with letter tiles</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
