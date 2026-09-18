import { useState } from 'react';
import { MathProblem } from '../types';

interface TouchCountActivityProps {
  problem: MathProblem;
  onAnswer: (correct: boolean) => void;
  audioEnabled: boolean;
}

export function TouchCountActivity({ problem, onAnswer, audioEnabled }: TouchCountActivityProps) {
  const [touchedItems, setTouchedItems] = useState<Set<number>>(new Set());
  const [currentCount, setCurrentCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const totalItems = problem.answer;
  const items = Array.from({ length: totalItems }, (_, i) => i);

  // Choose icon based on manipulatives type
  const getIcon = () => {
    switch (problem.manipulatives) {
      case 'stars':
        return '⭐';
      case 'animals':
        return '🐻';
      default:
        return '🟦';
    }
  };

  const icon = getIcon();

  const playAudio = (count: number) => {
    if (audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(count.toString());
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleItemClick = (index: number) => {
    if (touchedItems.has(index)) return; // Already touched

    const newTouchedItems = new Set(touchedItems);
    newTouchedItems.add(index);
    setTouchedItems(newTouchedItems);

    const newCount = newTouchedItems.size;
    setCurrentCount(newCount);
    playAudio(newCount);

    // Check if all items have been touched
    if (newCount === totalItems) {
      setShowResult(true);
      setTimeout(() => {
        onAnswer(true); // Always correct when they count all items
      }, 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Instruction */}
      <div className="text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          {problem.prompt}
        </h2>
        <p className="text-3xl text-gray-600">
          Touch each one to count!
        </p>
      </div>

      {/* Count Display */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl px-12 py-6 shadow-2xl">
          <div className="text-7xl font-bold">
            {currentCount}
          </div>
          {currentCount > 0 && (
            <div className="text-3xl mt-2">
              {currentCount === 1 ? '1 item' : `${currentCount} items`}
            </div>
          )}
        </div>
      </div>

      {/* Items to Touch */}
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
          {items.map((index) => {
            const isTouched = touchedItems.has(index);

            return (
              <button
                key={index}
                onClick={() => handleItemClick(index)}
                disabled={isTouched || showResult}
                className={`relative p-4 text-6xl transition-all transform ${
                  isTouched
                    ? 'scale-75 opacity-40 cursor-not-allowed'
                    : 'hover:scale-110 active:scale-95 animate-pulse'
                }`}
              >
                {icon}

                {/* Checkmark when touched */}
                {isTouched && (
                  <div className="absolute top-0 right-0 text-4xl">
                    ✓
                  </div>
                )}

                {/* Number overlay when touched */}
                {isTouched && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
                      {Array.from(touchedItems).indexOf(index) + 1}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300 flex items-center justify-end pr-3"
            style={{ width: `${(currentCount / totalItems) * 100}%` }}
          >
            {currentCount > 0 && (
              <span className="text-white font-bold text-sm">
                {currentCount}/{totalItems}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      {showResult && (
        <div className="text-center space-y-4">
          <div className="text-7xl font-bold text-green-600 animate-bounce">
            🎉 Perfect! 🎉
          </div>
          <div className="text-5xl font-bold text-gray-800">
            You counted {totalItems} {totalItems === 1 ? 'item' : 'items'}!
          </div>
        </div>
      )}

      {/* Encouragement */}
      {currentCount > 0 && !showResult && (
        <div className="text-center text-3xl text-blue-600 font-semibold">
          Great counting! Keep going! 👏
        </div>
      )}
    </div>
  );
}
