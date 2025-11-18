import { useState } from 'react';
import { MathProblem } from '../../types';

interface PlaceValueBuilderProps {
  problem: MathProblem;
  onAnswer: (correct: boolean) => void;
}

export function PlaceValueBuilder({ problem, onAnswer }: PlaceValueBuilderProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    const correct = answer === problem.answer;
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(correct);
      setShowFeedback(false);
      setSelectedAnswer(null);
    }, 1500);
  };

  // Render base-10 blocks visual
  const renderTensRods = () => {
    const tens = problem.tens || Math.floor(problem.answer / 10);
    if (!tens) return null;

    return (
      <div className="flex gap-3 flex-wrap justify-center">
        {Array.from({ length: tens }).map((_, i) => (
          <div
            key={i}
            className="w-16 h-40 bg-gradient-to-b from-blue-400 to-blue-500 border-4 border-blue-700 rounded-lg shadow-lg"
          >
            {/* Ten marks inside */}
            <div className="grid grid-rows-10 h-full p-1 gap-0.5">
              {Array.from({ length: 10 }).map((_, j) => (
                <div key={j} className="bg-blue-700 rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOnesCubes = () => {
    const ones = problem.ones || (problem.answer % 10);
    if (!ones) return null;

    return (
      <div className="flex gap-3 flex-wrap justify-center">
        {Array.from({ length: ones }).map((_, i) => (
          <div
            key={i}
            className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-yellow-700 rounded-lg shadow-lg"
          />
        ))}
      </div>
    );
  };

  const options = problem.options as number[] || [];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-5xl w-full">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        {problem.prompt}
      </h2>

      {/* Visual Base-10 Blocks */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-blue-50 rounded-2xl p-6">
            <p className="text-2xl font-bold text-blue-900 mb-4 text-center">Tens</p>
            {renderTensRods()}
            <p className="text-xl text-blue-800 mt-4 text-center font-semibold">
              {problem.tens || Math.floor(problem.answer / 10)} tens
            </p>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-6">
            <p className="text-2xl font-bold text-yellow-900 mb-4 text-center">Ones</p>
            {renderOnesCubes()}
            <p className="text-xl text-yellow-800 mt-4 text-center font-semibold">
              {problem.ones || (problem.answer % 10)} ones
            </p>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={showFeedback}
            className={`p-8 text-6xl font-bold rounded-2xl transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
              showFeedback && option === problem.answer
                ? 'bg-green-500 text-white shadow-2xl scale-105'
                : showFeedback && option === selectedAnswer
                ? 'bg-red-400 text-white'
                : 'bg-white border-4 border-gray-300 text-gray-800 hover:border-blue-400 hover:shadow-lg'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-8 text-center animate-bounce">
          <p className="text-4xl font-bold">
            {selectedAnswer === problem.answer ? (
              <span className="text-green-600">🎉 Perfect! Great job!</span>
            ) : (
              <span className="text-blue-600">👍 Keep trying!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
