import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Check, X, Sparkles } from 'lucide-react';
import { PhonicsPattern, PhonicsProgress } from '../../types';
import { recordAttempt, getPatternProgress } from '../../utils/phonicsEngine';

interface Props {
  pattern: PhonicsPattern;
  studentId: string;
  onComplete: () => void;
  onBack: () => void;
}

interface SegmentWord {
  word: string;
  sounds: string[];
}

export function SegmentingActivity({ pattern, studentId, onComplete, onBack }: Props) {
  const [words, setWords] = useState<SegmentWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [placedSounds, setPlacedSounds] = useState<(string | null)[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState<PhonicsProgress | null>(null);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    initialize();
  }, [pattern]);

  async function initialize() {
    const prog = await getPatternProgress(studentId, pattern.id);
    setProgress(prog || null);

    const segmentWords = generateSegmentWords(pattern);
    setWords(segmentWords);
    setStartTime(Date.now());
  }

  function generateSegmentWords(pattern: PhonicsPattern): SegmentWord[] {
    return pattern.examples.slice(0, 5).map(word => ({
      word,
      sounds: word.split('')
    }));
  }

  function handleBoxClick(boxIndex: number) {
    if (isChecking) return;

    const newPlaced = [...placedSounds];

    if (newPlaced[boxIndex] !== null) {
      // Remove token from box
      newPlaced[boxIndex] = null;
    } else {
      // Add token to box (use simple placeholder)
      newPlaced[boxIndex] = '🪙';
    }

    setPlacedSounds(newPlaced);
  }

  async function handleCheck() {
    const currentWord = words[currentWordIndex];
    const tokensPlaced = placedSounds.filter(s => s !== null).length;
    const correct = tokensPlaced === currentWord.sounds.length;

    setIsChecking(true);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    // Record attempt
    const timeSpent = Date.now() - startTime;
    await recordAttempt(
      studentId,
      `segmenting-${pattern.id}-${currentWordIndex}`,
      pattern.id,
      correct,
      tokensPlaced.toString(),
      timeSpent,
      0,
      progress?.currentScaffoldLevel || 'medium'
    );

    // Move to next word after delay
    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setPlacedSounds([]);
        setIsChecking(false);
        setIsCorrect(null);
        setStartTime(Date.now());
      } else {
        // Activity complete
        setTimeout(onComplete, 1500);
      }
    }, 2500);
  }

  useEffect(() => {
    if (words.length > 0) {
      const currentWord = words[currentWordIndex];
      setPlacedSounds(new Array(currentWord.sounds.length).fill(null));
    }
  }, [currentWordIndex, words]);

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const tokensRemaining = currentWord.sounds.length - placedSounds.filter(s => s !== null).length;

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
          ✂️ Sound Boxes
        </h2>

        <p className="text-2xl text-center text-gray-600 mb-12">
          Break the word into sounds!
        </p>

        {/* Word Display */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
            <Volume2 className="w-12 h-12 text-purple-600" />
            <div className="text-7xl font-bold text-gray-800 tracking-wider">
              {currentWord.word}
            </div>
            <button className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all">
              <Volume2 className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Elkonin Boxes */}
        <div className="mb-12">
          <p className="text-xl text-center text-gray-600 mb-6">
            Tap a box to place or remove a token
          </p>
          <div className="flex justify-center gap-4">
            {placedSounds.map((sound, index) => (
              <button
                key={index}
                onClick={() => handleBoxClick(index)}
                disabled={isChecking}
                className={`w-32 h-32 border-4 rounded-2xl flex items-center justify-center text-6xl font-bold transition-all transform hover:scale-105 ${
                  isChecking && isCorrect !== null
                    ? isCorrect
                      ? 'border-green-500 bg-green-100'
                      : 'border-red-500 bg-red-100'
                    : 'border-purple-400 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>

        {/* Tokens Available */}
        <div className="text-center mb-8">
          <p className="text-2xl text-gray-700 mb-4">
            Tokens remaining: <span className="font-bold text-purple-600">{tokensRemaining}</span>
          </p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: tokensRemaining }).map((_, i) => (
              <div key={i} className="text-5xl">
                🪙
              </div>
            ))}
          </div>
        </div>

        {/* Check Button */}
        {!isChecking && placedSounds.filter(s => s !== null).length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={handleCheck}
              className="px-12 py-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-3xl font-bold transform hover:scale-105"
            >
              Check Answer ✓
            </button>
          </div>
        )}

        {/* Feedback */}
        {isCorrect !== null && (
          <div
            className={`text-center p-6 rounded-2xl ${
              isCorrect
                ? 'bg-green-100 border-4 border-green-400'
                : 'bg-red-100 border-4 border-red-400'
            }`}
          >
            {isCorrect ? (
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-green-600" />
                <p className="text-3xl font-bold text-green-800">
                  Perfect! "{currentWord.word}" has {currentWord.sounds.length} sounds!
                </p>
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-red-800 mb-4">
                  Not quite. Try again next time!
                </p>
                <p className="text-2xl text-red-700">
                  "{currentWord.word}" has {currentWord.sounds.length} sounds: {currentWord.sounds.join(' - ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {words.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-12 rounded-full transition-all ${
                index < currentWordIndex
                  ? 'bg-green-500'
                  : index === currentWordIndex
                  ? 'bg-purple-500'
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
        <p className="text-sm text-gray-500 mt-2">
          💡 Each sound gets one box. Listen carefully to count the sounds!
        </p>
      </div>
    </div>
  );
}
