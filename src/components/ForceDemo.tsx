import { useState } from 'react';
import { ScienceProblem } from '../types';

interface ForceDemoProps {
  problem: ScienceProblem;
  onComplete: (correct: boolean) => void;
}

export function ForceDemo({ problem, onComplete }: ForceDemoProps) {
  const [objectPosition, setObjectPosition] = useState(50); // percentage from left
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const isPush = problem.question.toLowerCase().includes('push');
  const isPull = problem.question.toLowerCase().includes('pull');

  const handleDemoAction = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (isPush) {
      // Push animation: move object to the right
      setObjectPosition(85);
      setTimeout(() => {
        setObjectPosition(50);
        setIsAnimating(false);
      }, 1500);
    } else if (isPull) {
      // Pull animation: move object to the left
      setObjectPosition(15);
      setTimeout(() => {
        setObjectPosition(50);
        setIsAnimating(false);
      }, 1500);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === problem.correctAnswer;

    setTimeout(() => {
      onComplete(isCorrect);
    }, 2000);
  };

  const getObjectIcon = () => {
    if (isPush) return '📦'; // Box for pushing
    if (isPull) return '🛒'; // Shopping cart for pulling
    return '📦';
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      {/* Question */}
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {problem.question}
      </h2>

      {/* Interactive Demo Area */}
      {problem.demoType === 'interactive' && (
        <div className="w-full max-w-2xl">
          <div className="relative h-48 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg border-4 border-gray-300 overflow-hidden">
            {/* Ground line */}
            <div className="absolute bottom-0 w-full h-2 bg-amber-900"></div>

            {/* Animated object */}
            <div
              className="absolute bottom-8 text-6xl transition-all duration-1000 ease-out"
              style={{
                left: `${objectPosition}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {getObjectIcon()}
            </div>

            {/* Person icon */}
            {isPush && (
              <div className="absolute bottom-8 left-[20%] text-6xl">
                🧑
              </div>
            )}
            {isPull && (
              <div className="absolute bottom-8 right-[20%] text-6xl">
                🧑
              </div>
            )}
          </div>

          {/* Demo Button */}
          <button
            onClick={handleDemoAction}
            disabled={isAnimating}
            className={`mt-4 w-full py-4 px-6 rounded-lg font-bold text-xl transition-all ${
              isAnimating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95 text-white shadow-lg'
            }`}
          >
            {isAnimating ? '⚡ Watch!' : `🎯 Try to ${isPush ? 'PUSH' : 'PULL'}!`}
          </button>
        </div>
      )}

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {problem.options?.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === problem.correctAnswer;
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              className={`p-6 rounded-lg border-4 font-bold text-lg transition-all ${
                showCorrect
                  ? 'bg-green-100 border-green-500 scale-105'
                  : showIncorrect
                  ? 'bg-red-100 border-red-500'
                  : isSelected
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:border-blue-400 hover:scale-105'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {showCorrect && '✅ '}
              {showIncorrect && '❌ '}
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showFeedback && problem.explanation && (
        <div className={`mt-4 p-6 rounded-lg text-center font-bold text-lg ${
          selectedAnswer === problem.correctAnswer
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {problem.explanation}
        </div>
      )}
    </div>
  );
}
