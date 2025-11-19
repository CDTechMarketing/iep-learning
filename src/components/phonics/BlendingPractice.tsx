import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2, Check, Sparkles } from 'lucide-react';
import { PhonicsPattern, PhonicsProgress } from '../../types';
import { recordAttempt, getPatternProgress } from '../../utils/phonicsEngine';

interface Props {
  pattern: PhonicsPattern;
  studentId: string;
  onComplete: () => void;
  onBack: () => void;
}

interface BlendingWord {
  word: string;
  sounds: string[];
}

export function BlendingPractice({ pattern, studentId, onComplete, onBack }: Props) {
  const [words, setWords] = useState<BlendingWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showBlended, setShowBlended] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState<PhonicsProgress | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    initialize();
  }, [pattern]);

  async function initialize() {
    const prog = await getPatternProgress(studentId, pattern.id);
    setProgress(prog || null);

    const blendingWords = generateBlendingWords(pattern);
    setWords(blendingWords);
  }

  function generateBlendingWords(pattern: PhonicsPattern): BlendingWord[] {
    return pattern.examples.slice(0, 5).map(word => ({
      word,
      sounds: word.split('').map(letter => letter)
    }));
  }

  function handleShowBlended() {
    setShowBlended(true);
    setScore(score + 1);

    // Animate the blending
    animateBlending();
  }

  function animateBlending() {
    const currentWord = words[currentWordIndex];
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setAnimationStep(step);

      if (step >= currentWord.sounds.length) {
        clearInterval(interval);
        setTimeout(() => {
          recordAndNext();
        }, 2000);
      }
    }, 500);
  }

  async function recordAndNext() {
    const currentWord = words[currentWordIndex];

    await recordAttempt(
      studentId,
      `blending-${pattern.id}-${currentWordIndex}`,
      pattern.id,
      true,
      currentWord.word,
      3000,
      0,
      progress?.currentScaffoldLevel || 'medium'
    );

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowBlended(false);
      setAnimationStep(0);
    } else {
      setTimeout(onComplete, 1500);
    }
  }

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-xl font-bold">Back</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-white rounded-xl shadow-lg">
            <span className="text-xl font-bold text-gray-700">
              Word {currentWordIndex + 1} of {words.length}
            </span>
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl shadow-lg">
            <span className="text-xl font-bold">Score: {score}/{words.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-2xl p-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🔗 Blending Practice
        </h2>

        <p className="text-2xl text-center text-gray-600 mb-12">
          Let's blend these sounds together!
        </p>

        {/* Individual Sounds */}
        {!showBlended && (
          <div className="mb-12">
            <div className="flex items-center justify-center gap-6 mb-8">
              {currentWord.sounds.map((sound, index) => (
                <div key={index} className="flex items-center">
                  <div className="px-8 py-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg">
                    <div className="text-6xl font-bold text-blue-800">{sound}</div>
                  </div>
                  {index < currentWord.sounds.length - 1 && (
                    <ArrowRight className="w-12 h-12 text-gray-400 mx-2" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mb-8">
              <button
                className="flex items-center gap-3 px-8 py-4 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-2xl font-bold"
              >
                <Volume2 className="w-8 h-8" />
                Hear it slowly
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={handleShowBlended}
                className="px-12 py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-3xl font-bold transform hover:scale-105"
              >
                Blend it! ▶
              </button>
            </div>
          </div>
        )}

        {/* Blending Animation */}
        {showBlended && (
          <div className="mb-12">
            {/* Sounds coming together */}
            <div className="flex items-center justify-center gap-4 mb-12">
              {currentWord.sounds.map((sound, index) => (
                <div
                  key={index}
                  className={`px-8 py-6 rounded-2xl shadow-lg transition-all duration-500 ${
                    index < animationStep
                      ? 'bg-gradient-to-br from-green-400 to-green-500 text-white scale-110'
                      : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800'
                  }`}
                >
                  <div className="text-6xl font-bold">{sound}</div>
                </div>
              ))}
            </div>

            {/* Blended Word */}
            {animationStep >= currentWord.sounds.length && (
              <div className="text-center animate-bounce">
                <div className="inline-block px-16 py-12 bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-3xl shadow-2xl">
                  <div className="flex items-center gap-4">
                    <Sparkles className="w-16 h-16" />
                    <div className="text-8xl font-bold">{currentWord.word}</div>
                    <Sparkles className="w-16 h-16" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600 mt-8">
                  Perfect! You blended it! ✓
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          {words.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-12 rounded-full transition-all ${
                index < currentWordIndex
                  ? 'bg-green-500'
                  : index === currentWordIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Pattern Info */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Practicing: {pattern.name}
        </h3>
        <p className="text-gray-600">{pattern.teachingTip}</p>
      </div>
    </div>
  );
}
