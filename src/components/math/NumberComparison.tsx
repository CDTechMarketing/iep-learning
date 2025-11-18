import { useState } from 'react';
import { MathProblem } from '../../types';

interface NumberComparisonProps {
  problem: MathProblem;
  onAnswer: (correct: boolean) => void;
}

export function NumberComparison({ problem, onAnswer }: NumberComparisonProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const options = problem.options as string[];
    const selectedSymbol = options[answerIndex];
    setSelectedAnswer(selectedSymbol);
    const correct = answerIndex === problem.answer;
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(correct);
      setShowFeedback(false);
      setSelectedAnswer(null);
    }, 1500);
  };

  const options = problem.options as string[] || ['<', '>', '='];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-5xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
        Choose the correct symbol
      </h2>

      {/* Numbers and Comparison */}
      <div className="flex items-center justify-center gap-8 mb-12">
        {/* First Number */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-12 shadow-xl">
          <p className="text-8xl font-bold text-blue-900">
            {problem.number1}
          </p>
        </div>

        {/* Blank for symbol */}
        <div className="bg-yellow-100 rounded-2xl p-8 border-4 border-dashed border-yellow-400 min-w-[120px] flex items-center justify-center">
          <p className="text-7xl font-bold text-yellow-600">
            ?
          </p>
        </div>

        {/* Second Number */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-12 shadow-xl">
          <p className="text-8xl font-bold text-purple-900">
            {problem.number2}
          </p>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
        {options.map((symbol, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showFeedback}
            className={`p-10 text-7xl font-bold rounded-2xl transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
              showFeedback && index === problem.answer
                ? 'bg-green-500 text-white shadow-2xl scale-105'
                : showFeedback && symbol === selectedAnswer
                ? 'bg-red-400 text-white'
                : 'bg-white border-4 border-gray-300 text-gray-800 hover:border-blue-400 hover:shadow-lg'
            }`}
          >
            {symbol}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-8 text-center animate-bounce">
          <p className="text-4xl font-bold">
            {options[problem.answer] === selectedAnswer ? (
              <span className="text-green-600">🎉 Excellent! That's correct!</span>
            ) : (
              <span className="text-blue-600">👍 Try again!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
