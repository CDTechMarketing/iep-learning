import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { SightWord, SightWordProgress, SightWordAttempt } from '../types';
import {
  getWordsToPractice,
  updateProgressAfterAttempt,
  initializeWordProgress,
  calculateStats,
  type SightWordStats
} from '../utils/spacedRepetition';
import SightWordFlashcard from './SightWordFlashcard';

type PracticeMode = 'flashcard' | 'word-hunt' | 'speed-challenge';

export default function SightWordsPractice() {
  const [words, setWords] = useState<SightWord[]>([]);
  const [allProgress, setAllProgress] = useState<SightWordProgress[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [practiceWords, setPracticeWords] = useState<SightWord[]>([]);
  const [stats, setStats] = useState<SightWordStats | null>(null);
  const [mode, setMode] = useState<PracticeMode>('flashcard');
  const [loading, setLoading] = useState(true);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  const studentId = 'default-student'; // In a real app, this would come from auth

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load all sight words
      const allWords = await db.sightWords.toArray();
      setWords(allWords);

      // Load or initialize progress for all words
      const existingProgress = await db.sightWordProgress
        .where('studentId')
        .equals(studentId)
        .toArray();

      const progressMap = new Map(existingProgress.map(p => [p.wordId, p]));

      // Create progress entries for words that don't have them
      const newProgressEntries: SightWordProgress[] = [];
      for (const word of allWords) {
        if (!progressMap.has(word.id)) {
          const newProgress = initializeWordProgress(studentId, word.id);
          newProgressEntries.push(newProgress);
          progressMap.set(word.id, newProgress);
        }
      }

      if (newProgressEntries.length > 0) {
        await db.sightWordProgress.bulkAdd(newProgressEntries);
      }

      const allProgressData = Array.from(progressMap.values());
      setAllProgress(allProgressData);

      // Calculate stats
      const currentStats = calculateStats(allProgressData);
      setStats(currentStats);

      // Get words to practice
      const wordsToReview = getWordsToPractice(allProgressData, 10);
      const reviewWordObjects = wordsToReview
        .map(p => allWords.find(w => w.id === p.wordId))
        .filter((w): w is SightWord => w !== undefined);

      setPracticeWords(reviewWordObjects);
      setLoading(false);
    } catch (error) {
      console.error('Error loading sight words data:', error);
      setLoading(false);
    }
  };

  const handleResponse = async (correct: boolean, responseTime: number) => {
    const currentWord = practiceWords[currentWordIndex];
    if (!currentWord) return;

    // Record the attempt
    const attempt: SightWordAttempt = {
      id: `attempt-${Date.now()}-${Math.random()}`,
      studentId,
      wordId: currentWord.id,
      timestamp: new Date(),
      correct,
      responseTime,
      mode
    };

    await db.sightWordAttempts.add(attempt);

    // Update progress
    const progress = allProgress.find(p => p.wordId === currentWord.id);
    if (progress) {
      const updates = updateProgressAfterAttempt(progress, correct, responseTime);
      await db.sightWordProgress.update(progress.id, updates);

      // Update local state
      const updatedProgress = allProgress.map(p =>
        p.id === progress.id ? { ...p, ...updates } : p
      );
      setAllProgress(updatedProgress);
      setStats(calculateStats(updatedProgress));
    }

    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    // Move to next word or complete
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setPracticeComplete(true);
    }
  };

  const startNewSession = () => {
    setPracticeComplete(false);
    setCurrentWordIndex(0);
    setSessionStats({ correct: 0, total: 0 });
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading sight words...</div>
      </div>
    );
  }

  if (practiceComplete) {
    const accuracy = sessionStats.total > 0
      ? Math.round((sessionStats.correct / sessionStats.total) * 100)
      : 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Great Job!
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            You practiced {sessionStats.total} words
          </p>
          <div className="bg-green-100 rounded-lg p-4 mb-6">
            <div className="text-4xl font-bold text-green-600">
              {accuracy}%
            </div>
            <div className="text-gray-600">Accuracy</div>
          </div>

          {stats && (
            <div className="space-y-2 mb-6 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Words:</span>
                <span className="font-semibold">{stats.totalWords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mastered:</span>
                <span className="font-semibold text-green-600">{stats.masteredWords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Learning:</span>
                <span className="font-semibold text-yellow-600">{stats.learningWords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New:</span>
                <span className="font-semibold text-blue-600">{stats.newWords}</span>
              </div>
            </div>
          )}

          <button
            onClick={startNewSession}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Practice More Words
          </button>
        </div>
      </div>
    );
  }

  if (practiceWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            All Caught Up!
          </h2>
          <p className="text-gray-600 mb-6">
            You've reviewed all your sight words for today. Great job!
          </p>
          {stats && (
            <div className="bg-green-100 rounded-lg p-4 mb-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.masteredWords} / {stats.totalWords}
              </div>
              <div className="text-gray-600">Words Mastered</div>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentWord = practiceWords[currentWordIndex];
  const progress = (currentWordIndex / practiceWords.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Sight Words Practice
        </h1>

        {/* Progress Bar */}
        <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-green-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-2 text-gray-600">
          Word {currentWordIndex + 1} of {practiceWords.length}
        </div>
      </div>

      {/* Flashcard */}
      <div className="max-w-2xl mx-auto">
        <SightWordFlashcard
          word={currentWord}
          onResponse={handleResponse}
          showContext={true}
          autoSpeak={false}
        />
      </div>

      {/* Stats Display */}
      {stats && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.masteredWords}
                </div>
                <div className="text-sm text-gray-600">Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {stats.learningWords}
                </div>
                <div className="text-sm text-gray-600">Learning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.newWords}
                </div>
                <div className="text-sm text-gray-600">New</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(stats.accuracyRate * 100)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
