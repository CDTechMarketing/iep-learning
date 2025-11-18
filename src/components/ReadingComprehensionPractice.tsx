import React, { useState, useEffect } from 'react';
import { ReadingComprehensionPassage, ComprehensionQuestion, ReadingStrategy } from '../types';
import { db } from '../db';
import {
  selectNextPassage,
  getQuestionsForPassage,
  recordComprehensionAttempt,
  getComprehensionStats
} from '../utils/comprehensionEngine';
import { getAllSkillsMastery } from '../utils/masteryTracker';
import PassageReader from './PassageReader';
import ComprehensionQuiz, { QuestionResult } from './ComprehensionQuiz';
import { BookOpen, Award, TrendingUp, Home, Star } from 'lucide-react';

interface ReadingComprehensionPracticeProps {
  onExit: () => void;
  studentId: string;
}

type ViewState = 'start' | 'strategy' | 'passage' | 'quiz' | 'results';

export default function ReadingComprehensionPractice({
  onExit,
  studentId
}: ReadingComprehensionPracticeProps) {
  const [viewState, setViewState] = useState<ViewState>('start');
  const [currentPassage, setCurrentPassage] = useState<ReadingComprehensionPassage | null>(null);
  const [questions, setQuestions] = useState<ComprehensionQuestion[]>([]);
  const [strategies, setStrategies] = useState<ReadingStrategy[]>([]);
  const [sessionResults, setSessionResults] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStrategies();
  }, []);

  async function loadStrategies() {
    const allStrategies = await db.readingStrategies.toArray();
    setStrategies(allStrategies);
  }

  async function startSession() {
    setLoading(true);
    try {
      const passage = await selectNextPassage(studentId);
      if (passage) {
        setCurrentPassage(passage);
        const passageQuestions = await getQuestionsForPassage(passage.id);
        setQuestions(passageQuestions);
        setViewState('strategy');
      } else {
        alert('No passages available. Please add some content first.');
      }
    } catch (error) {
      console.error('Error loading passage:', error);
      alert('Error loading passage. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleStrategyComplete() {
    setViewState('passage');
  }

  function handlePassageComplete() {
    setViewState('quiz');
  }

  function handleBackToPassage() {
    setViewState('passage');
  }

  async function handleQuizComplete(results: QuestionResult[]) {
    setSessionResults(results);

    // Record all attempts in database
    for (const result of results) {
      await recordComprehensionAttempt(
        studentId,
        currentPassage!.id,
        result.questionId,
        result.selectedAnswer,
        result.correctAnswer,
        result.timeSpent,
        result.hintsUsed
      );
    }

    setViewState('results');
  }

  async function handleStartNewSession() {
    setSessionResults([]);
    setCurrentPassage(null);
    setQuestions([]);
    await startSession();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reading passage...</p>
        </div>
      </div>
    );
  }

  // Start Screen
  if (viewState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onExit}
            className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Home size={20} />
            Back to Home
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <BookOpen size={48} className="text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Reading Comprehension
              </h1>
              <p className="text-lg text-gray-600">
                Build your understanding and reading skills
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                icon={<BookOpen className="text-blue-600" size={24} />}
                title="Passages Read"
                value="Track your progress"
                color="blue"
              />
              <StatsCard
                icon={<TrendingUp className="text-green-600" size={24} />}
                title="Skills Growing"
                value="Master comprehension"
                color="green"
              />
              <StatsCard
                icon={<Award className="text-purple-600" size={24} />}
                title="Earn Rewards"
                value="Points & badges"
                color="purple"
              />
            </div>

            <button
              onClick={startSession}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Reading Practice →
            </button>
          </div>

          <ReadingStrategiesGuide strategies={strategies} />
        </div>
      </div>
    );
  }

  // Strategy Reminder Screen
  if (viewState === 'strategy' && currentPassage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Reading Strategies Reminder
            </h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              Use these strategies as you read "{currentPassage.title}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {strategies.slice(0, 4).map(strategy => (
                <div
                  key={strategy.id}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{strategy.iconUrl}</span>
                    <h3 className="font-bold text-gray-800">{strategy.strategyName}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{strategy.description}</p>
                  <p className="text-xs text-blue-600 italic">{strategy.whenToUse}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleStrategyComplete}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              I'm Ready to Read →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Passage Reading Screen
  if (viewState === 'passage' && currentPassage) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <PassageReader passage={currentPassage} onComplete={handlePassageComplete} />
      </div>
    );
  }

  // Quiz Screen
  if (viewState === 'quiz' && currentPassage) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <ComprehensionQuiz
          passage={currentPassage}
          questions={questions}
          onComplete={handleQuizComplete}
          onBackToPassage={handleBackToPassage}
          studentId={studentId}
        />
      </div>
    );
  }

  // Results Screen
  if (viewState === 'results' && currentPassage) {
    const correctCount = sessionResults.filter(r => r.isCorrect).length;
    const accuracy = (correctCount / sessionResults.length) * 100;
    const totalTime = sessionResults.reduce((sum, r) => sum + r.timeSpent, 0);
    const pointsEarned = calculatePoints(correctCount, sessionResults);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <Award size={48} className="text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Great Work!
              </h2>
              <p className="text-lg text-gray-600">
                You completed "{currentPassage.title}"
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <ResultCard label="Correct" value={`${correctCount}/${sessionResults.length}`} />
              <ResultCard label="Accuracy" value={`${Math.round(accuracy)}%`} />
              <ResultCard label="Time" value={`${Math.round(totalTime / 60)} min`} />
              <ResultCard label="Points" value={`+${pointsEarned}`} />
            </div>

            {accuracy >= 80 && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-1">
                  Excellent Comprehension!
                </h3>
                <p className="text-green-700">
                  You really understood this passage well!
                </p>
              </div>
            )}

            {/* Question-by-Question Review */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Question Review</h3>
              <div className="space-y-3">
                {sessionResults.map((result, index) => {
                  const question = questions.find(q => q.id === result.questionId);
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        result.isCorrect
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {result.isCorrect ? '✅' : '❌'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-1">
                            Q{index + 1}: {question?.questionText}
                          </p>
                          {!result.isCorrect && (
                            <p className="text-sm text-gray-600">
                              Your answer: <span className="font-medium">{result.selectedAnswer}</span>
                              <br />
                              Correct answer: <span className="font-medium text-green-700">{result.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleStartNewSession}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Read Another Passage
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function StatsCard({
  icon,
  title,
  value,
  color
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function ReadingStrategiesGuide({ strategies }: { strategies: ReadingStrategy[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Reading Strategies</h3>
      <p className="text-gray-600 mb-6">
        Use these strategies to help you understand what you read:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map(strategy => (
          <div
            key={strategy.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{strategy.iconUrl}</span>
              <h4 className="font-bold text-gray-800">{strategy.strategyName}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">{strategy.description}</p>
            <p className="text-xs text-blue-600 italic">{strategy.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function calculatePoints(correctCount: number, results: QuestionResult[]): number {
  let points = 0;

  // Base points: 50 per passage
  points += 50;

  // Correct answer points: 10 per correct
  points += correctCount * 10;

  // Bonus for high accuracy
  const accuracy = correctCount / results.length;
  if (accuracy >= 0.80) {
    points += 25;
  }

  // Bonus for not using hints
  const totalHints = results.reduce((sum, r) => sum + r.hintsUsed, 0);
  if (totalHints === 0) {
    points += 15;
  }

  return points;
}
