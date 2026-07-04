import { useState, useEffect, useMemo } from 'react';
import { Star } from 'lucide-react';
import { db } from '../db';
import { MathProblem } from '../types';
import { useStore } from '../store';
import { finishSession } from '../utils/session';
import { NumberLineActivity } from './NumberLineActivity';
import { TenFrameActivity } from './TenFrameActivity';
import { TouchCountActivity } from './TouchCountActivity';
import { VisualTimer } from './VisualTimer';
import { ImmediateReward } from './ImmediateReward';
import { generateAnswerOptions } from '../utils/answerOptions';
import { useBreakFlow } from '../hooks/useBreakFlow';

export function MathPractice() {
  const { currentUnit, sessionStars, addStar, recordAttempt, settings, setCurrentView } = useStore();
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [blockCounts, setBlockCounts] = useState<number[]>([]);
  const [showImmediateReward, setShowImmediateReward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { noteItemCompleted, breakUi } = useBreakFlow({
    onContinue: moveToNextProblem
  });

  useEffect(() => {
    if (currentUnit) {
      loadProblems();
    }
  }, [currentUnit]);

  async function loadProblems() {
    if (!currentUnit) {
      return;
    }

    setIsLoading(true);

    const problemsData = await db.mathProblems
      .where('unitId')
      .equals(currentUnit.id)
      .toArray();

    setProblems(problemsData);
    setIsLoading(false);
  }

  const currentProblem = problems[currentProblemIndex];

  // Options are only used by identification/addition problems; the counting
  // activities (number-line, ten-frame, touch-count) render their own choices.
  // Memoized per problem so options stay stable across re-renders (e.g. while
  // feedback is showing).
  const answerOptions = useMemo(() => {
    if (!currentProblem) return [];
    if (currentProblem.type !== 'identification' && currentProblem.type !== 'addition') {
      return [];
    }
    return generateAnswerOptions(currentProblem.answer, currentProblem.type);
  }, [currentProblem]);

  if (!currentUnit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-2xl text-gray-700 mb-4">No unit selected</p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-8">
        <div className="text-center">
          {isLoading ? (
            <>
              <p className="text-2xl text-gray-700 mb-4">Loading math problems...</p>
              <p className="text-lg text-gray-500 mt-2">Unit: {currentUnit.title}</p>
            </>
          ) : (
            <>
              <p className="text-2xl text-gray-700 mb-4">No problems found</p>
              <p className="text-lg text-gray-500 mt-2">Unit: {currentUnit.title}</p>
              <p className="text-lg text-gray-500">Problems loaded: {problems.length}</p>
              <button
                onClick={() => setCurrentView('home')}
                className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                Go Home
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  function handleAnswerSelect(answer: number) {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === currentProblem.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    recordAttempt(correct);

    if (correct) {
      addStar();
    }

    setTimeout(() => {
      handleNextProblem();
    }, 1500);
  }

  function handleNewActivityAnswer(correct: boolean) {
    recordAttempt(correct);

    if (correct) {
      addStar();

      // Show immediate reward if enabled
      if (settings?.immediateRewards) {
        setShowImmediateReward(true);
        return; // Reward component will call handleNextProblem
      }
    }

    setTimeout(() => {
      handleNextProblem();
    }, 1500);
  }

  function handleImmediateRewardComplete() {
    setShowImmediateReward(false);
    handleNextProblem();
  }

  function handleNextProblem() {
    const status = noteItemCompleted();
    if (status === 'break-due') {
      setShowFeedback(false);
      setSelectedAnswer(null);
    } else {
      moveToNextProblem();
    }
  }

  function moveToNextProblem() {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setBlockCounts([]);
    } else {
      handleSessionComplete();
    }
  }

  async function handleSessionComplete() {
    if (!currentUnit) return;
    await finishSession(currentUnit);
  }

  function handleBlockClick(index: number) {
    setBlockCounts((prev) => {
      const newCounts = [...prev];
      if (newCounts.includes(index)) {
        return newCounts.filter((i) => i !== index);
      } else {
        return [...newCounts, index];
      }
    });
  }

  function renderManipulatives() {
    if (!currentProblem.manipulatives || currentProblem.type !== 'addition') {
      return null;
    }

    const [left, right] = currentProblem.prompt.split('+').map((n) => parseInt(n.trim()));
    const total = left + right;

    return (
      <div className="mb-8">
        <div className="flex justify-center gap-8 mb-4">
          <div className="flex flex-wrap gap-2 max-w-xs justify-center">
            {Array.from({ length: left }).map((_, i) => (
              <button
                key={`left-${i}`}
                onClick={() => handleBlockClick(i)}
                className={`w-16 h-16 rounded-xl transition-all transform ${
                  blockCounts.includes(i)
                    ? 'bg-pink-500 scale-125 shadow-2xl ring-4 ring-pink-300'
                    : 'bg-blue-300 hover:bg-blue-400 shadow-md'
                }`}
              />
            ))}
          </div>

          <div className="text-4xl font-bold text-gray-400 flex items-center">+</div>

          <div className="flex flex-wrap gap-2 max-w-xs justify-center">
            {Array.from({ length: right }).map((_, i) => (
              <button
                key={`right-${i}`}
                onClick={() => handleBlockClick(left + i)}
                className={`w-16 h-16 rounded-xl transition-all transform ${
                  blockCounts.includes(left + i)
                    ? 'bg-pink-500 scale-125 shadow-2xl ring-4 ring-pink-300'
                    : 'bg-green-300 hover:bg-green-400 shadow-md'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-xl text-gray-600">
          Tap to count: {blockCounts.length} / {total}
        </p>
      </div>
    );
  }

  // Render new activity types
  function renderActivityContent() {
    switch (currentProblem.type) {
      case 'number-line':
        return (
          <NumberLineActivity
            problem={currentProblem}
            onAnswer={handleNewActivityAnswer}
            promptingLevel={promptingLevel}
            audioEnabled={audioEnabled}
          />
        );

      case 'ten-frame':
        return (
          <TenFrameActivity
            problem={currentProblem}
            onAnswer={handleNewActivityAnswer}
            promptingLevel={promptingLevel}
            audioEnabled={audioEnabled}
          />
        );

      case 'touch-count':
        return (
          <TouchCountActivity
            problem={currentProblem}
            onAnswer={handleNewActivityAnswer}
            audioEnabled={audioEnabled}
          />
        );

      default:
        // Render original identification and addition activities
        return renderOriginalActivity();
    }
  }

  function renderOriginalActivity() {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            {currentProblem.type === 'identification'
              ? 'What number is this?'
              : 'What is the answer?'}
          </h2>
          <p className="text-8xl font-bold text-blue-900 mb-4">{currentProblem.prompt}</p>
        </div>

        {renderManipulatives()}

        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {answerOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              className={`p-8 text-5xl font-bold rounded-2xl transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
                showFeedback && option === currentProblem.answer
                  ? 'bg-green-500 text-white shadow-2xl'
                  : showFeedback && option === selectedAnswer
                  ? 'bg-red-400 text-white'
                  : 'bg-white border-4 border-gray-300 text-gray-800 hover:border-blue-400 hover:shadow-lg'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className="mt-8 text-center">
            <p
              className={`text-3xl font-bold ${
                isCorrect ? 'text-green-600' : 'text-blue-600'
              }`}
            >
              {isCorrect ? '🎉 Great job!' : '👍 Keep trying!'}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (breakUi) {
    return breakUi;
  }

  const promptingLevel = settings?.promptingLevel || 'adaptive';
  const audioEnabled = settings?.audioEnabled || false;

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col p-8 ${
        settings?.dyslexiaFont ? 'font-mono' : ''
      }`}
    >
      {/* Header with Stars and Progress */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {Array.from({ length: sessionStars }).map((_, i) => (
            <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <div className="text-lg font-semibold text-gray-600">
          {currentProblemIndex + 1} / {problems.length}
        </div>
      </div>

      {/* Visual Timer (if enabled) */}
      {settings?.visualTimerEnabled && (
        <div className="mb-6">
          <VisualTimer
            current={currentProblemIndex + 1}
            total={problems.length}
            label="Math Problems"
            showTimeEstimate={false}
          />
        </div>
      )}

      {/* Immediate Reward Overlay */}
      {showImmediateReward && (
        <ImmediateReward onComplete={handleImmediateRewardComplete} />
      )}

      <div className="flex-1 flex items-center justify-center">
        {renderActivityContent()}
      </div>
    </div>
  );
}
