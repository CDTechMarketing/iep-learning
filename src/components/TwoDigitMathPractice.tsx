import React, { useState, useEffect } from 'react';
import { TwoDigitMathProblem, TwoDigitMathAttempt } from '../types';
import { selectNextProblem } from '../utils/twoDigitMathEngine';
import { analyzeRegroupingErrors, getErrorExplanation, getErrorHint } from '../utils/errorPatternAnalyzer';
import { getEncouragementMessage } from '../utils/mathIntervention';
import { db } from '../db';
import { VerticalMathProblem } from './VerticalMathProblem';
import { MathStrategySelector, MathStrategyType } from './MathStrategySelector';
import { BaseTenBlocks } from './BaseTenBlocks';
import { RegroupingHelper } from './RegroupingHelper';

type ViewState = 'strategy' | 'problem' | 'feedback' | 'regrouping-helper' | 'complete';

/**
 * TwoDigitMathPractice Component
 * Main practice interface for two-digit addition and subtraction
 * Integrates all components and adaptive learning features
 */
export const TwoDigitMathPractice: React.FC = () => {
  const [view, setView] = useState<ViewState>('strategy');
  const [currentProblem, setCurrentProblem] = useState<TwoDigitMathProblem | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<MathStrategyType | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionStart] = useState(Date.now());

  const studentId = 'default-student'; // In real app, get from auth context
  const problemsPerSession = 10;

  useEffect(() => {
    loadNextProblem();
  }, []);

  const loadNextProblem = async () => {
    try {
      const problem = await selectNextProblem(studentId);
      setCurrentProblem(problem);
      setView('strategy');
      setShowHints(false);
      setSelectedStrategy(null);
    } catch (error) {
      console.error('Error loading problem:', error);
    }
  };

  const handleStrategySelect = (strategy: MathStrategyType) => {
    setSelectedStrategy(strategy);

    // If regrouping helper selected and problem requires regrouping, show it
    if (currentProblem?.requiresRegrouping && (strategy === 'standard-algorithm' || strategy === 'base-ten-blocks')) {
      // Offer regrouping helper
      setView('problem');
    } else {
      setView('problem');
    }
  };

  const handleAnswer = async (answer: number, timeSpent: number) => {
    if (!currentProblem) return;

    const correct = answer === currentProblem.answer;
    setIsCorrect(correct);

    // Create attempt record
    const attempt: TwoDigitMathAttempt = {
      id: `attempt-${Date.now()}`,
      studentId,
      problemId: currentProblem.id,
      studentAnswer: answer,
      isCorrect: correct,
      timeSpentSeconds: timeSpent,
      method: selectedStrategy || 'standard-algorithm',
      hintsUsed: showHints ? 1 : 0,
      timestamp: new Date()
    };

    // Analyze errors if incorrect
    if (!correct) {
      const errors = analyzeRegroupingErrors(currentProblem, answer);
      attempt.regroupingErrors = errors;

      // Generate feedback
      if (errors.length > 0) {
        const errorExplanation = getErrorExplanation(errors[0]);
        const errorHint = getErrorHint(errors[0], currentProblem);
        setFeedbackMessage(`${errorExplanation}\n\n${errorHint}`);
      } else {
        setFeedbackMessage('Not quite right. Let\'s try again! Double-check your work step by step.');
      }

      setConsecutiveCorrect(0);
    } else {
      const newCorrectCount = correctCount + 1;
      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setCorrectCount(newCorrectCount);
      setConsecutiveCorrect(newConsecutiveCorrect);

      const encouragement = getEncouragementMessage(
        newConsecutiveCorrect,
        problemsCompleted + 1,
        (newCorrectCount / (problemsCompleted + 1)) * 100
      );
      setFeedbackMessage(encouragement);
    }

    // Save attempt to database
    await db.twoDigitMathAttempts.add(attempt);

    setView('feedback');
  };

  const handleNext = () => {
    const newProblemsCompleted = problemsCompleted + 1;
    setProblemsCompleted(newProblemsCompleted);

    if (newProblemsCompleted >= problemsPerSession) {
      setView('complete');
    } else {
      loadNextProblem();
    }
  };

  const handleUseRegroupingHelper = () => {
    setView('regrouping-helper');
  };

  const handleRegroupingComplete = () => {
    setView('problem');
  };

  const handleToggleHints = () => {
    setShowHints(!showHints);
  };

  const handleRestart = () => {
    setProblemsCompleted(0);
    setCorrectCount(0);
    setConsecutiveCorrect(0);
    loadNextProblem();
  };

  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-xl text-gray-600">Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-800">Two-Digit Math Practice</h1>
              <p className="text-gray-600">
                Problem {problemsCompleted + 1} of {problemsPerSession}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(problemsCompleted / problemsPerSession) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {view === 'strategy' && (
            <MathStrategySelector
              operation={currentProblem.operation}
              onSelect={handleStrategySelect}
            />
          )}

          {view === 'problem' && (
            <div className="space-y-6">
              {/* Visual support based on strategy */}
              {selectedStrategy === 'base-ten-blocks' && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Visual Model:</h3>
                  <BaseTenBlocks
                    initialValue={currentProblem.operand1}
                    interactive={false}
                    showLabels={true}
                  />
                </div>
              )}

              {/* Main problem */}
              <VerticalMathProblem
                problem={currentProblem}
                onAnswer={handleAnswer}
                showHints={showHints}
              />

              {/* Help buttons */}
              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={handleToggleHints}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold shadow-md"
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>

                {currentProblem.requiresRegrouping && (
                  <button
                    onClick={handleUseRegroupingHelper}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold shadow-md"
                  >
                    Use Regrouping Helper
                  </button>
                )}
              </div>
            </div>
          )}

          {view === 'regrouping-helper' && (
            <RegroupingHelper
              problem={currentProblem}
              onComplete={handleRegroupingComplete}
            />
          )}

          {view === 'feedback' && (
            <div className="text-center space-y-6">
              {/* Feedback icon */}
              <div className="text-8xl">
                {isCorrect ? '✅' : '❌'}
              </div>

              {/* Feedback message */}
              <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </div>

              {/* Detailed feedback */}
              <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                <p className="text-lg text-gray-700 whitespace-pre-line">{feedbackMessage}</p>
              </div>

              {/* Show correct answer if wrong */}
              {!isCorrect && (
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 max-w-md mx-auto">
                  <p className="text-gray-700">
                    <strong>The correct answer is:</strong> {currentProblem.answer}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {currentProblem.operand1} {currentProblem.operation === 'addition' ? '+' : '−'} {currentProblem.operand2} = {currentProblem.answer}
                  </p>
                </div>
              )}

              {/* Next button */}
              <button
                onClick={handleNext}
                className="px-12 py-4 bg-purple-600 text-white text-xl font-bold rounded-lg hover:bg-purple-700 shadow-lg transition-colors"
              >
                {problemsCompleted + 1 >= problemsPerSession ? 'See Results' : 'Next Problem →'}
              </button>
            </div>
          )}

          {view === 'complete' && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-purple-800">Session Complete!</h2>

              <div className="max-w-2xl mx-auto grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-8 rounded-xl shadow-lg">
                  <div className="text-5xl font-bold text-green-700">{correctCount}</div>
                  <div className="text-lg text-gray-700 mt-2">Problems Correct</div>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-xl shadow-lg">
                  <div className="text-5xl font-bold text-blue-700">
                    {Math.round((correctCount / problemsPerSession) * 100)}%
                  </div>
                  <div className="text-lg text-gray-700 mt-2">Accuracy</div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={handleRestart}
                  className="px-12 py-4 bg-purple-600 text-white text-xl font-bold rounded-lg hover:bg-purple-700 shadow-lg transition-colors"
                >
                  Practice More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
