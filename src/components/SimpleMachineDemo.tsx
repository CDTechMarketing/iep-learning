import { useState } from 'react';
import { ScienceProblem } from '../types';

interface SimpleMachineDemoProps {
  problem: ScienceProblem;
  onComplete: (correct: boolean) => void;
}

export function SimpleMachineDemo({ problem, onComplete }: SimpleMachineDemoProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === problem.correctAnswer;

    // Trigger animation on correct answer
    if (isCorrect) {
      setIsAnimating(true);
    }

    setTimeout(() => {
      onComplete(isCorrect);
    }, 2500);
  };

  const renderMachineDemo = () => {
    switch (problem.topic) {
      case 'lever':
        return (
          <div className="relative w-full h-48 flex items-center justify-center">
            <div className="relative">
              {/* Fulcrum */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-gray-600"></div>
              </div>
              {/* Lever bar */}
              <div
                className={`w-64 h-4 bg-amber-700 rounded-full transition-all duration-1000 ${
                  isAnimating ? 'rotate-12' : ''
                }`}
                style={{ transformOrigin: 'center' }}
              >
                {/* Objects on lever */}
                <div className="absolute -top-8 left-4 text-4xl">🎾</div>
                <div className="absolute -top-12 right-4 text-4xl">🏀</div>
              </div>
            </div>
          </div>
        );

      case 'pulley':
        return (
          <div className="relative w-full h-48 flex items-center justify-center">
            <div className="relative">
              {/* Pulley wheel */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className={`w-16 h-16 rounded-full border-8 border-gray-600 bg-gray-300 ${
                  isAnimating ? 'animate-spin' : ''
                }`}></div>
              </div>
              {/* Rope */}
              <div className="absolute top-16 left-1/2 w-1 h-24 bg-amber-600 transform -translate-x-1/2"></div>
              {/* Flag */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
                isAnimating ? 'top-20' : 'top-32'
              }`}>
                <div className="text-4xl">🚩</div>
              </div>
            </div>
          </div>
        );

      case 'wheel-axle':
        return (
          <div className="relative w-full h-48 flex items-center justify-center">
            <div className="relative">
              {/* Wheel and axle */}
              <div className={`flex items-center gap-2 transition-all duration-500 ${
                isAnimating ? 'translate-x-12' : ''
              }`}>
                {/* Front wheel */}
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full border-8 border-gray-700 bg-gray-300 ${
                    isAnimating ? 'animate-spin' : ''
                  }`}>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
                {/* Axle */}
                <div className="w-16 h-2 bg-gray-600"></div>
                {/* Back wheel */}
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full border-8 border-gray-700 bg-gray-300 ${
                    isAnimating ? 'animate-spin' : ''
                  }`}>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
              {/* Car body */}
              <div className={`absolute -top-12 left-8 text-4xl transition-all duration-500 ${
                isAnimating ? 'translate-x-12' : ''
              }`}>
                🚗
              </div>
            </div>
          </div>
        );

      case 'inclined-plane':
        return (
          <div className="relative w-full h-48 flex items-center justify-center">
            <div className="relative">
              {/* Inclined plane */}
              <div className="relative">
                <div
                  className="w-64 h-4 bg-amber-700 rounded"
                  style={{ transform: 'rotate(-20deg)', transformOrigin: 'bottom left' }}
                ></div>
                {/* Box on ramp */}
                <div
                  className={`absolute text-4xl transition-all duration-1000 ${
                    isAnimating ? 'bottom-0 left-48' : 'bottom-16 left-32'
                  }`}
                >
                  📦
                </div>
              </div>
              {/* Ground */}
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-gray-600 rounded"></div>
            </div>
          </div>
        );

      case 'wedge':
        return (
          <div className="relative w-full h-48 flex items-center justify-center">
            <div className="relative">
              {/* Wedge (axe) */}
              <div className="flex flex-col items-center">
                <div className="w-2 h-20 bg-amber-800 rounded"></div>
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-gray-400"></div>
              </div>
              {/* Log being split */}
              <div className={`absolute top-0 flex gap-0 transition-all duration-1000 ${
                isAnimating ? 'gap-8' : 'gap-0'
              }`}>
                <div className="text-4xl">🪵</div>
                <div className="text-4xl">🪵</div>
              </div>
            </div>
          </div>
        );

      case 'screw':
        return (
          <div className="relative w-full h-48 flex items-center justify-center">
            <div className="relative">
              {/* Screw */}
              <div className={`text-6xl transition-all duration-1000 ${
                isAnimating ? 'rotate-180 translate-y-8' : 'rotate-0'
              }`}>
                🔩
              </div>
              {/* Wood block */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-amber-600 rounded"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-6xl text-center">
            ⚙️
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      {/* Question */}
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {problem.question}
      </h2>

      {/* Machine Demo */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-sky-100 to-blue-50 rounded-lg border-4 border-gray-300 p-8">
        {renderMachineDemo()}
      </div>

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
