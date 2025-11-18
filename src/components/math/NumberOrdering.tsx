import { useState } from 'react';
import { MathProblem } from '../../types';

interface NumberOrderingProps {
  problem: MathProblem;
  onAnswer: (correct: boolean) => void;
}

export function NumberOrdering({ problem, onAnswer }: NumberOrderingProps) {
  const numbersToOrder = problem.numbersToOrder || [];
  const orderDirection = problem.orderDirection || 'ascending';

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>(numbersToOrder);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleNumberClick = (number: number) => {
    if (showFeedback) return;

    // Add number to selected list
    setSelectedNumbers([...selectedNumbers, number]);
    setAvailableNumbers(availableNumbers.filter(n => n !== number));
  };

  const handleRemoveNumber = (index: number) => {
    if (showFeedback) return;

    const removedNumber = selectedNumbers[index];
    setSelectedNumbers(selectedNumbers.filter((_, i) => i !== index));
    setAvailableNumbers([...availableNumbers, removedNumber]);
  };

  const handleCheckAnswer = () => {
    if (selectedNumbers.length !== numbersToOrder.length) return;

    // Check if order is correct
    const expectedOrder = [...numbersToOrder].sort((a, b) =>
      orderDirection === 'ascending' ? a - b : b - a
    );

    const correct = selectedNumbers.every((num, idx) => num === expectedOrder[idx]);
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(correct);
      setShowFeedback(false);
      setSelectedNumbers([]);
      setAvailableNumbers(numbersToOrder);
      setIsCorrect(false);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedNumbers([]);
    setAvailableNumbers(numbersToOrder);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-5xl w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        {problem.prompt}
      </h2>

      <p className="text-xl text-gray-600 mb-8 text-center">
        Put the numbers in {orderDirection === 'ascending' ? 'order from smallest to largest' : 'order from largest to smallest'}
      </p>

      {/* Selected Numbers Area */}
      <div className="mb-8">
        <p className="text-lg font-semibold text-gray-700 mb-3 text-center">
          Your Answer:
        </p>
        <div className="flex gap-4 justify-center min-h-[120px] bg-blue-50 rounded-2xl p-6 border-4 border-dashed border-blue-300">
          {selectedNumbers.length === 0 ? (
            <p className="text-gray-400 text-xl self-center">Tap numbers below to arrange them</p>
          ) : (
            selectedNumbers.map((number, index) => (
              <button
                key={`selected-${number}-${index}`}
                onClick={() => handleRemoveNumber(index)}
                disabled={showFeedback}
                className="bg-gradient-to-br from-blue-400 to-blue-500 text-white text-6xl font-bold rounded-2xl p-8 shadow-xl hover:scale-105 transition-transform disabled:cursor-not-allowed min-w-[100px]"
              >
                {number}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Available Numbers */}
      <div className="mb-8">
        <p className="text-lg font-semibold text-gray-700 mb-3 text-center">
          Numbers to arrange:
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {availableNumbers.map((number, index) => (
            <button
              key={`available-${number}-${index}`}
              onClick={() => handleNumberClick(number)}
              disabled={showFeedback}
              className="bg-gradient-to-br from-purple-400 to-purple-500 text-white text-6xl font-bold rounded-2xl p-8 shadow-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] hover:shadow-2xl"
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mb-4">
        <button
          onClick={handleReset}
          disabled={showFeedback || selectedNumbers.length === 0}
          className="px-8 py-4 bg-gray-300 text-gray-700 text-xl font-bold rounded-xl hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          onClick={handleCheckAnswer}
          disabled={showFeedback || selectedNumbers.length !== numbersToOrder.length}
          className="px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          Check Answer
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-8 text-center animate-bounce">
          <p className="text-4xl font-bold">
            {isCorrect ? (
              <span className="text-green-600">🎉 Perfect! You got them in the right order!</span>
            ) : (
              <span className="text-blue-600">👍 Good try! Let's practice again!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
