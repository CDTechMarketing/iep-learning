import { useState } from 'react';
import { FractionProblem } from '../../types';
import { FractionCircleVisual } from './FractionCircleVisual';
import { FractionRectangleVisual } from './FractionRectangleVisual';

interface FractionIdentificationProps {
  problem: FractionProblem;
  onAnswer: (correct: boolean) => void;
}

export function FractionIdentification({ problem, onAnswer }: FractionIdentificationProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const options = problem.options || [];
    const selectedFraction = options[answerIndex];
    setSelectedAnswer(selectedFraction);

    // Check if the selected fraction matches the correct answer
    const correctFraction = `${problem.numerator}/${problem.denominator}`;
    const correct = selectedFraction === correctFraction;
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(correct);
      setShowFeedback(false);
      setSelectedAnswer(null);
    }, 1500);
  };

  const options = problem.options || [
    `${problem.numerator}/${problem.denominator}`,
    `${problem.denominator}/${problem.numerator}`,
    `${problem.numerator + 1}/${problem.denominator}`,
    `${problem.numerator}/${problem.denominator + 1}`
  ];

  const correctFraction = `${problem.numerator}/${problem.denominator}`;

  // Render the appropriate visual based on type
  function renderVisual() {
    if (problem.visualType === 'circle') {
      return (
        <FractionCircleVisual
          totalParts={problem.totalParts}
          shadedParts={problem.shadedParts}
          size={320}
          shadedColor="#3b82f6"
          unshadedColor="#e5e7eb"
        />
      );
    } else if (problem.visualType === 'rectangle' || problem.visualType === 'bar') {
      return (
        <FractionRectangleVisual
          totalParts={problem.totalParts}
          shadedParts={problem.shadedParts}
          orientation="horizontal"
          width={400}
          height={100}
          shadedColor="#10b981"
          unshadedColor="#e5e7eb"
        />
      );
    }
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-5xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {problem.prompt}
      </h2>

      {/* Visual Representation */}
      <div className="mb-12 flex justify-center bg-gray-50 rounded-2xl p-8">
        {renderVisual()}
      </div>

      {/* Helpful Text */}
      <p className="text-xl text-gray-600 mb-8 text-center">
        How much is shaded?
      </p>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showFeedback}
            className={`p-8 text-6xl font-bold rounded-2xl transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
              showFeedback && option === correctFraction
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
            {selectedAnswer === correctFraction ? (
              <span className="text-green-600">🎉 Excellent! That's the right fraction!</span>
            ) : (
              <span className="text-blue-600">👍 Good try! Let's practice more!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
