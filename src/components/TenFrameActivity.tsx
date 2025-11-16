import { useState } from 'react';
import { MathProblem } from '../types';

interface TenFrameActivityProps {
  problem: MathProblem;
  onAnswer: (correct: boolean) => void;
  promptingLevel: 'full' | 'partial' | 'minimal' | 'independent' | 'adaptive';
  audioEnabled: boolean;
}

export function TenFrameActivity({ problem, onAnswer, promptingLevel, audioEnabled }: TenFrameActivityProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const answer = problem.answer;
  const tens = Math.floor(answer / 10);
  const ones = answer % 10;

  // Generate answer options
  const options = problem.options || [
    answer,
    answer - 1,
    answer + 1,
    answer - 10
  ].filter(n => n >= 20 && n <= 29).slice(0, 4);

  const playAudio = (number: number) => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(number.toString());
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (selectedNum: number) => {
    setSelectedAnswer(selectedNum);
    playAudio(selectedNum);

    const isCorrect = selectedNum === answer;
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(isCorrect);
      setShowFeedback(false);
      setSelectedAnswer(null);
    }, 1500);
  };

  const showFullPrompt = promptingLevel === 'full';

  return (
    <div className="space-y-8">
      {/* Instruction */}
      <div className="text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          {problem.prompt}
        </h2>
        <p className="text-3xl text-gray-600">
          Count the dots and pick the number!
        </p>
      </div>

      {/* Ten Frames */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex justify-center gap-8 mb-8">
          {/* Render ten frames */}
          {Array.from({ length: tens }).map((_, frameIndex) => (
            <div key={`frame-${frameIndex}`} className="space-y-2">
              <div className="grid grid-cols-5 gap-2 p-4 bg-blue-100 rounded-xl">
                {Array.from({ length: 10 }).map((_, dotIndex) => (
                  <div
                    key={`dot-${frameIndex}-${dotIndex}`}
                    className="w-12 h-12 bg-blue-500 rounded-full shadow-md"
                  />
                ))}
              </div>
              <div className="text-center text-2xl font-bold text-blue-800">
                10
              </div>
            </div>
          ))}

          {/* Partial frame for ones */}
          {ones > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 p-4 bg-green-100 rounded-xl">
                {Array.from({ length: 10 }).map((_, dotIndex) => (
                  <div
                    key={`ones-${dotIndex}`}
                    className={`w-12 h-12 rounded-full shadow-md ${
                      dotIndex < ones ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center text-2xl font-bold text-green-800">
                {ones}
              </div>
            </div>
          )}
        </div>

        {/* Place Value Explanation */}
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-100 rounded-2xl px-8 py-4">
            <span className="text-4xl font-bold text-blue-800">{tens} tens</span>
            <span className="text-4xl mx-4">+</span>
            <span className="text-4xl font-bold text-green-800">{ones} {ones === 1 ? 'one' : 'ones'}</span>
            <span className="text-4xl mx-4">=</span>
            <span className="text-5xl font-bold text-purple-800">?</span>
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {options.map((option) => {
            const isAnswer = option === answer;
            const isSelected = option === selectedAnswer;
            const showHint = showFullPrompt && isAnswer && !selectedAnswer;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`p-8 rounded-2xl text-5xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                  isSelected
                    ? 'bg-blue-500 text-white scale-110'
                    : showHint
                    ? 'bg-yellow-300 text-gray-800 animate-pulse ring-4 ring-yellow-500'
                    : 'bg-white text-gray-800 hover:bg-gray-100 border-4 border-gray-300'
                }`}
              >
                {option}

                {/* Hint Arrow for Full Prompting */}
                {showHint && (
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
          {selectedAnswer === answer ? (
            <div className="space-y-4">
              <div className="text-6xl font-bold text-green-600 animate-bounce">
                ✓ Perfect! {answer}!
              </div>
              <div className="text-3xl text-gray-700">
                {tens} tens + {ones} {ones === 1 ? 'one' : 'ones'} = {answer}
              </div>
            </div>
          ) : (
            <div className="text-5xl font-bold text-orange-500">
              Try counting again!
            </div>
          )}
        </div>
      )}

      {/* Prompting Hints */}
      {showFullPrompt && !selectedAnswer && (
        <div className="text-center text-3xl text-yellow-700 font-semibold animate-pulse">
          👆 The glowing number is correct!
        </div>
      )}
    </div>
  );
}
