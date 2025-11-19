import React, { useState, useEffect } from 'react';
import { SightWord } from '../types';

interface SightWordFlashcardProps {
  word: SightWord;
  onResponse: (correct: boolean, responseTime: number) => void;
  showContext?: boolean;
  autoSpeak?: boolean;
}

export default function SightWordFlashcard({
  word,
  onResponse,
  showContext = false,
  autoSpeak = false
}: SightWordFlashcardProps) {
  const [startTime] = useState(Date.now());
  const [showSentence, setShowSentence] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (autoSpeak) {
      speakWord();
    }
  }, [word.word, autoSpeak]);

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.rate = 0.8; // Slightly slower for clarity
      speechSynthesis.speak(utterance);
    }
  };

  const speakSentence = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.exampleSentence);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleResponse = (correct: boolean) => {
    if (answered) return;

    const responseTime = Date.now() - startTime;
    setAnswered(true);

    // Brief delay before calling onResponse to show feedback
    setTimeout(() => {
      onResponse(correct, responseTime);
      setAnswered(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Word Display */}
      <div className="bg-white rounded-lg shadow-lg p-12 min-w-[300px] text-center">
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {word.word}
        </div>

        {/* Audio Button */}
        <button
          onClick={speakWord}
          className="text-2xl hover:scale-110 transition-transform"
          aria-label="Hear word"
        >
          🔊
        </button>
      </div>

      {/* Context Section */}
      {showContext && (
        <div className="bg-blue-50 rounded-lg p-4 max-w-md text-center">
          <button
            onClick={() => setShowSentence(!showSentence)}
            className="text-blue-600 font-semibold mb-2 hover:text-blue-800"
          >
            {showSentence ? 'Hide' : 'Show'} Example Sentence
          </button>

          {showSentence && (
            <div className="mt-2">
              <p className="text-lg text-gray-700 italic">
                "{word.exampleSentence}"
              </p>
              <button
                onClick={speakSentence}
                className="mt-2 text-xl hover:scale-110 transition-transform"
                aria-label="Hear sentence"
              >
                🔊
              </button>
            </div>
          )}
        </div>
      )}

      {/* Response Buttons */}
      {!answered ? (
        <div className="flex gap-4">
          <button
            onClick={() => handleResponse(false)}
            className="px-8 py-4 bg-red-500 text-white rounded-lg text-xl font-semibold hover:bg-red-600 transition-colors shadow-lg"
          >
            ❌ Still Learning
          </button>
          <button
            onClick={() => handleResponse(true)}
            className="px-8 py-4 bg-green-500 text-white rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
          >
            ✓ I Know It!
          </button>
        </div>
      ) : (
        <div className="text-2xl animate-bounce">
          ⭐ Great job! ⭐
        </div>
      )}

      {/* Word Info */}
      <div className="text-sm text-gray-500">
        {word.list.replace('-', ' ').toUpperCase()} · Word #{word.frequency}
      </div>
    </div>
  );
}
