import React, { useState } from 'react';
import { TwoDigitMathProblem } from '../types';
import { BaseTenBlocks } from './BaseTenBlocks';

interface RegroupingHelperProps {
  problem: TwoDigitMathProblem;
  onComplete: () => void;
}

type Step = {
  number: number;
  instruction: string;
  question?: string;
  expectedAnswer?: string;
  hint?: string;
  showBlocks?: boolean;
};

/**
 * RegroupingHelper Component
 * Provides step-by-step guided practice for regrouping in addition and subtraction
 * Shows visual models alongside the standard algorithm
 */
export const RegroupingHelper: React.FC<RegroupingHelperProps> = ({
  problem,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Extract place values
  const op1Tens = Math.floor(problem.operand1 / 10);
  const op1Ones = problem.operand1 % 10;
  const op2Tens = Math.floor(problem.operand2 / 10);
  const op2Ones = problem.operand2 % 10;

  // Generate steps based on operation type
  const generateSteps = (): Step[] => {
    if (problem.operation === 'addition' && problem.requiresRegrouping) {
      // Addition with regrouping steps
      const onesSum = op1Ones + op2Ones;
      const onesResult = onesSum % 10;
      const carryAmount = Math.floor(onesSum / 10);
      const tensSum = op1Tens + op2Tens + carryAmount;

      return [
        {
          number: 1,
          instruction: `Add the ones: ${op1Ones} + ${op2Ones}`,
          question: `What is ${op1Ones} + ${op2Ones}?`,
          expectedAnswer: onesSum.toString(),
          hint: `Count on your fingers or use the visual blocks!`,
          showBlocks: true
        },
        {
          number: 2,
          instruction: `We got ${onesSum}. Can we keep ${onesSum} in the ones place?`,
          question: `Can we keep numbers bigger than 9 in the ones place?`,
          expectedAnswer: 'no',
          hint: `The ones place can only hold 0-9!`
        },
        {
          number: 3,
          instruction: `Regroup! ${onesSum} = ${carryAmount} ten and ${onesResult} ones`,
          question: `How many ones should we write in the ones place?`,
          expectedAnswer: onesResult.toString(),
          hint: `${onesSum} - 10 = ${onesResult}`
        },
        {
          number: 4,
          instruction: `Carry the ${carryAmount} to the tens place`,
          question: `How many tens do we carry?`,
          expectedAnswer: carryAmount.toString(),
          hint: `We made ${carryAmount} bundle of ten!`
        },
        {
          number: 5,
          instruction: `Add the tens: ${op1Tens} + ${op2Tens} + ${carryAmount} (carried)`,
          question: `What is ${op1Tens} + ${op2Tens} + ${carryAmount}?`,
          expectedAnswer: tensSum.toString(),
          hint: `Don't forget the carried ${carryAmount}!`
        },
        {
          number: 6,
          instruction: `Final answer: ${tensSum}${onesResult}`,
          question: `What is ${problem.operand1} + ${problem.operand2}?`,
          expectedAnswer: problem.answer.toString(),
          hint: `Combine the tens and ones: ${tensSum} tens and ${onesResult} ones`
        }
      ];
    } else if (problem.operation === 'subtraction' && problem.requiresRegrouping) {
      // Subtraction with borrowing steps
      const borrowedOnes = op1Ones + 10;
      const onesResult = borrowedOnes - op2Ones;
      const borrowedTens = op1Tens - 1;
      const tensResult = borrowedTens - op2Tens;

      return [
        {
          number: 1,
          instruction: `Can we subtract the ones? ${op1Ones} - ${op2Ones}?`,
          question: `Is ${op1Ones} bigger than or equal to ${op2Ones}?`,
          expectedAnswer: 'no',
          hint: `We don't have enough ones!`
        },
        {
          number: 2,
          instruction: `We need to borrow! Take 1 ten and make it 10 ones`,
          question: `How many tens will be left after borrowing?`,
          expectedAnswer: borrowedTens.toString(),
          hint: `${op1Tens} tens - 1 ten = ${borrowedTens} tens`
        },
        {
          number: 3,
          instruction: `Now we have ${borrowedTens} tens and ${borrowedOnes} ones (${op1Ones} + 10)`,
          question: `How many ones do we have now?`,
          expectedAnswer: borrowedOnes.toString(),
          hint: `${op1Ones} + 10 = ${borrowedOnes}`,
          showBlocks: true
        },
        {
          number: 4,
          instruction: `Subtract the ones: ${borrowedOnes} - ${op2Ones}`,
          question: `What is ${borrowedOnes} - ${op2Ones}?`,
          expectedAnswer: onesResult.toString(),
          hint: `Now we have enough ones to subtract!`
        },
        {
          number: 5,
          instruction: `Subtract the tens: ${borrowedTens} - ${op2Tens}`,
          question: `What is ${borrowedTens} - ${op2Tens}?`,
          expectedAnswer: tensResult.toString(),
          hint: `Remember we already borrowed 1 ten!`
        },
        {
          number: 6,
          instruction: `Final answer: ${tensResult}${onesResult}`,
          question: `What is ${problem.operand1} - ${problem.operand2}?`,
          expectedAnswer: problem.answer.toString(),
          hint: `Combine the tens and ones: ${tensResult} tens and ${onesResult} ones`
        }
      ];
    }

    return [];
  };

  const steps = generateSteps();
  const currentStepData = steps[currentStep];

  const handleAnswer = () => {
    if (!currentStepData.expectedAnswer) {
      handleNext();
      return;
    }

    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const normalizedExpected = currentStepData.expectedAnswer.toLowerCase().trim();

    if (normalizedAnswer === normalizedExpected) {
      setCompletedSteps([...completedSteps, currentStep]);
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setUserAnswer('');
          setShowHint(false);
        } else {
          onComplete();
        }
      }, 1000);
    } else {
      setShowHint(true);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserAnswer('');
      setShowHint(false);
    } else {
      onComplete();
    }
  };

  if (!currentStepData) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg max-w-4xl">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-800 mb-2">
          Step-by-Step {problem.operation === 'addition' ? 'Carrying' : 'Borrowing'} Practice
        </h2>
        <p className="text-lg text-gray-600">
          Problem: {problem.operand1} {problem.operation === 'addition' ? '+' : '−'} {problem.operand2}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current step instruction */}
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-2xl border-l-4 border-purple-500">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
            {currentStepData.number}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {currentStepData.instruction}
            </h3>
            {currentStepData.question && (
              <p className="text-lg text-gray-700 mt-2">{currentStepData.question}</p>
            )}
          </div>
        </div>
      </div>

      {/* Visual blocks (if applicable) */}
      {currentStepData.showBlocks && (
        <div className="w-full max-w-2xl">
          <BaseTenBlocks
            initialValue={problem.operand1}
            interactive={false}
            showLabels={true}
          />
        </div>
      )}

      {/* Answer input */}
      {currentStepData.question && (
        <div className="flex flex-col gap-3 w-full max-w-md">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnswer()}
            className="w-full px-6 py-4 text-2xl text-center border-4 border-purple-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
            placeholder="Type your answer..."
            autoFocus
          />

          <button
            onClick={handleAnswer}
            className="w-full px-6 py-4 bg-purple-600 text-white text-xl font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            Check Answer
          </button>

          {showHint && currentStepData.hint && (
            <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Hint:</strong> {currentStepData.hint}
              </p>
            </div>
          )}
        </div>
      )}

      {!currentStepData.question && (
        <button
          onClick={handleNext}
          className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          {currentStep < steps.length - 1 ? 'Next Step →' : 'Finish! 🎉'}
        </button>
      )}

      {/* Celebration for completed step */}
      {completedSteps.includes(currentStep) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
          ✅
        </div>
      )}
    </div>
  );
};
