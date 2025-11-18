import React, { useState, useEffect } from 'react';
import { TwoDigitMathProblem } from '../types';

interface VerticalMathProblemProps {
  problem: TwoDigitMathProblem;
  onAnswer: (answer: number, timeSpent: number) => void;
  showHints?: boolean;
}

/**
 * VerticalMathProblem Component
 * Displays two-digit math problems in standard vertical format
 * with interactive answer input and visual carrying/borrowing indicators
 */
export const VerticalMathProblem: React.FC<VerticalMathProblemProps> = ({
  problem,
  onAnswer,
  showHints = false
}) => {
  const [tensAnswer, setTensAnswer] = useState('');
  const [onesAnswer, setOnesAnswer] = useState('');
  const [startTime] = useState(Date.now());
  const [showCarry, setShowCarry] = useState(false);
  const [showBorrow, setShowBorrow] = useState(false);

  // Extract place values
  const op1Tens = Math.floor(problem.operand1 / 10);
  const op1Ones = problem.operand1 % 10;
  const op2Tens = Math.floor(problem.operand2 / 10);
  const op2Ones = problem.operand2 % 10;

  // Calculate if carrying/borrowing needed for hints
  const needsCarry = problem.operation === 'addition' && (op1Ones + op2Ones >= 10);
  const needsBorrow = problem.operation === 'subtraction' && (op1Ones < op2Ones);

  useEffect(() => {
    if (showHints) {
      if (needsCarry) setShowCarry(true);
      if (needsBorrow) setShowBorrow(true);
    }
  }, [showHints, needsCarry, needsBorrow]);

  const handleSubmit = () => {
    const tens = parseInt(tensAnswer) || 0;
    const ones = parseInt(onesAnswer) || 0;
    const studentAnswer = tens * 10 + ones;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    onAnswer(studentAnswer, timeSpent);
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: 'tens' | 'ones') => {
    if (e.key === 'Enter') {
      if (field === 'ones') {
        handleSubmit();
      } else {
        // Move focus to ones field
        const onesInput = document.getElementById('ones-input');
        onesInput?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
      {/* Story Problem Display (if applicable) */}
      {problem.storyProblem && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 max-w-md">
          <p className="text-lg text-gray-800 leading-relaxed">{problem.storyProblem}</p>
        </div>
      )}

      {/* Vertical Math Problem Display */}
      <div className="relative mb-6">
        {/* Carrying indicator (for addition) */}
        {showCarry && needsCarry && (
          <div className="absolute -top-8 right-12 text-sm text-red-500 font-bold animate-pulse">
            ¹
          </div>
        )}

        {/* Borrowing indicator (for subtraction) */}
        {showBorrow && needsBorrow && (
          <div className="absolute -top-8 left-8 text-sm text-red-500 font-bold">
            <span className="line-through">{op1Tens}</span>
            <span className="ml-1">{op1Tens - 1}</span>
            <span className="absolute -right-6 top-0">¹</span>
          </div>
        )}

        {/* Math Problem Grid */}
        <div className="font-mono text-4xl">
          {/* First operand */}
          <div className="flex items-center justify-end mb-2">
            <span className="text-blue-600 font-bold mr-4">{op1Tens}</span>
            <span className="text-green-600 font-bold">{op1Ones}</span>
          </div>

          {/* Operation and second operand */}
          <div className="flex items-center justify-end mb-2">
            <span className="mr-2 text-gray-700">
              {problem.operation === 'addition' ? '+' : '−'}
            </span>
            <span className="text-blue-600 font-bold mr-4">{op2Tens}</span>
            <span className="text-green-600 font-bold">{op2Ones}</span>
          </div>

          {/* Horizontal line */}
          <div className="border-t-4 border-gray-700 mb-2"></div>

          {/* Answer inputs */}
          <div className="flex items-center justify-end">
            <input
              id="tens-input"
              type="number"
              min="0"
              max="9"
              value={tensAnswer}
              onChange={(e) => setTensAnswer(e.target.value.slice(0, 1))}
              onKeyPress={(e) => handleKeyPress(e, 'tens')}
              className="w-12 h-16 text-center border-4 border-blue-400 rounded-lg mr-4 bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
              placeholder="?"
              aria-label="Tens place answer"
            />
            <input
              id="ones-input"
              type="number"
              min="0"
              max="9"
              value={onesAnswer}
              onChange={(e) => setOnesAnswer(e.target.value.slice(0, 1))}
              onKeyPress={(e) => handleKeyPress(e, 'ones')}
              className="w-12 h-16 text-center border-4 border-green-400 rounded-lg bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-300"
              placeholder="?"
              aria-label="Ones place answer"
            />
          </div>
        </div>
      </div>

      {/* Place value labels */}
      <div className="flex items-center justify-center gap-8 mb-6 text-sm font-semibold">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
          <span className="text-blue-700">Tens Place</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
          <span className="text-green-700">Ones Place</span>
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={tensAnswer === '' || onesAnswer === ''}
        className="px-8 py-3 bg-purple-600 text-white text-xl font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
      >
        Check Answer
      </button>

      {/* Hint text for regrouping */}
      {showHints && problem.requiresRegrouping && (
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg max-w-md">
          <p className="text-sm text-gray-700">
            {problem.operation === 'addition' ? (
              <span>
                <strong>Hint:</strong> When adding the ones place ({op1Ones} + {op2Ones} = {op1Ones + op2Ones}),
                you get more than 10. Remember to carry the 1 to the tens place!
              </span>
            ) : (
              <span>
                <strong>Hint:</strong> You can't subtract {op2Ones} from {op1Ones} in the ones place.
                You need to borrow 1 ten, making it {op1Ones + 10} ones.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
