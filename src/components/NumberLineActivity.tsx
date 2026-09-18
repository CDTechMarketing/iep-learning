import { useState } from 'react';
import { MathProblem } from '../types';

interface NumberLineActivityProps {
  problem: MathProblem;
  onAnswer: (correct: boolean) => void;
  promptingLevel: 'full' | 'partial' | 'minimal' | 'independent' | 'adaptive';
  audioEnabled: boolean;
}

export function NumberLineActivity({ problem, onAnswer, promptingLevel, audioEnabled }: NumberLineActivityProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const rangeStart = problem.rangeStart || 20;
  const rangeEnd = problem.rangeEnd || 29;
  const numbers = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);

  const playAudio = (number: number) => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(number.toString());
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
    playAudio(number);

    const isCorrect = number === problem.answer;
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(isCorrect);
      setShowFeedback(false);
      setSelectedNumber(null);
    }, 1500);
  };

  const showFullPrompt = promptingLevel === 'full';
  const showPartialPrompt = promptingLevel === 'partial' || promptingLevel === 'adaptive';

  return (
    <div className="space-y-8">
      {/* Instruction */}
      <div className="text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          {problem.prompt}
        </h2>
        <p className="text-3xl text-gray-600">
          Touch the number on the number line!
        </p>
      </div>

      {/* Number Line */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        {/* Visual Line */}
        <div className="relative mb-8">
          <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-5 gap-4">
          {numbers.map((number) => {
            const isAnswer = number === problem.answer;
            const isSelected = number === selectedNumber;
            const showHint = showFullPrompt && isAnswer;
            const showPartialHint = showPartialPrompt && isAnswer && !selectedNumber;

            return (
              <button
                key={number}
                onClick={() => handleNumberClick(number)}
                disabled={showFeedback}
                className={`relative p-6 rounded-2xl text-4xl font-bold transition-all transform hover:scale-110 active:scale-95 shadow-lg ${
                  isSelected
                    ? 'bg-blue-500 text-white scale-110'
                    : showHint
                    ? 'bg-yellow-300 text-gray-800 animate-pulse ring-4 ring-yellow-500'
                    : showPartialHint
                    ? 'bg-yellow-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {number}

                {/* Hint Arrow for Full Prompting */}
                {showHint && !selectedNumber && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-5xl animate-bounce">
                      ⬇️
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="text-center">
          {selectedNumber === problem.answer ? (
            <div className="text-6xl font-bold text-green-600 animate-bounce">
              ✓ Yes! {selectedNumber}!
            </div>
          ) : (
            <div className="text-5xl font-bold text-orange-500">
              Let's try again!
            </div>
          )}
        </div>
      )}

      {/* Prompting Hints */}
      {showFullPrompt && !selectedNumber && (
        <div className="text-center text-3xl text-yellow-700 font-semibold animate-pulse">
          👆 Look for the number that's glowing!
        </div>
      )}
    </div>
  );
}
