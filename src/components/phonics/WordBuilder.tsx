import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Check, X, Sparkles } from 'lucide-react';
import { PhonicsPattern, PhonicsProgress } from '../../types';
import { recordAttempt, getPatternProgress } from '../../utils/phonicsEngine';

interface Props {
  pattern: PhonicsPattern;
  studentId: string;
  onComplete: () => void;
  onBack: () => void;
}

interface Challenge {
  targetWord: string;
  availableLetters: string[];
}

export function WordBuilder({ pattern, studentId, onComplete, onBack }: Props) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [builtWord, setBuiltWord] = useState<string[]>([]);
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

    const wordChallenges = generateChallenges(pattern);
    setChallenges(wordChallenges);
    setStartTime(Date.now());
  }

  function generateChallenges(pattern: PhonicsPattern): Challenge[] {
    return pattern.examples.slice(0, 5).map(word => {
      const letters = word.split('');

      // Add some distractor letters
      const distractors = ['a', 'e', 'i', 'o', 'u', 'b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'w']
        .filter(l => !letters.includes(l))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const availableLetters = [...letters, ...distractors].sort(() => Math.random() - 0.5);

      return {
        targetWord: word,
        availableLetters
      };
    });
  }

  function handleLetterClick(letter: string, fromBank: boolean) {
    if (isChecking) return;

    if (fromBank) {
      // Add to built word
      setBuiltWord([...builtWord, letter]);
    } else {
      // Remove from built word
      const newBuiltWord = [...builtWord];
      const index = newBuiltWord.indexOf(letter);
      if (index > -1) {
        newBuiltWord.splice(index, 1);
        setBuiltWord(newBuiltWord);
      }
    }
  }

  function handleClear() {
    setBuiltWord([]);
  }

  async function handleCheck() {
    const currentChallenge = challenges[currentChallengeIndex];
    const wordBuilt = builtWord.join('');
    const correct = wordBuilt.toLowerCase() === currentChallenge.targetWord.toLowerCase();

    setIsChecking(true);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    // Record attempt
    const timeSpent = Date.now() - startTime;
    await recordAttempt(
      studentId,
      `word-building-${pattern.id}-${currentChallengeIndex}`,
      pattern.id,
      correct,
      wordBuilt,
      timeSpent,
      0,
      progress?.currentScaffoldLevel || 'medium'
    );

    // Move to next challenge after delay
    setTimeout(() => {
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex(currentChallengeIndex + 1);
        setBuiltWord([]);
        setIsChecking(false);
        setIsCorrect(null);
        setStartTime(Date.now());
      } else {
        // Activity complete
        setTimeout(onComplete, 1500);
      }
    }, 2500);
  }

  if (challenges.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const currentChallenge = challenges[currentChallengeIndex];

  // Get available letters (those not used in built word)
  const usedLetters = [...builtWord];
  const availableInBank = currentChallenge.availableLetters.filter(letter => {
    const indexInBuilt = usedLetters.indexOf(letter);
    if (indexInBuilt > -1) {
      usedLetters.splice(indexInBuilt, 1);
      return false;
    }
    return true;
  });

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
              Word {currentChallengeIndex + 1} of {challenges.length}
            </span>
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl shadow-lg">
            <span className="text-xl font-bold">Score: {score}/{challenges.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-2xl p-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🧱 Word Builder
        </h2>

        <p className="text-2xl text-center text-gray-600 mb-12">
          Build the word: <span className="font-bold text-orange-600">{currentChallenge.targetWord}</span>
        </p>

        {/* Building Area */}
        <div className="mb-12">
          <p className="text-xl text-center text-gray-600 mb-4">Your Word:</p>
          <div className="flex justify-center items-center gap-3 min-h-32 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border-4 border-dashed border-orange-300">
            {builtWord.length === 0 ? (
              <p className="text-2xl text-gray-400">Tap letters below to build your word</p>
            ) : (
              builtWord.map((letter, index) => (
                <button
                  key={`${letter}-${index}`}
                  onClick={() => handleLetterClick(letter, false)}
                  disabled={isChecking}
                  className="px-6 py-4 bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-xl shadow-lg text-5xl font-bold hover:scale-110 transition-transform"
                >
                  {letter}
                </button>
              ))
            )}
          </div>

          {builtWord.length > 0 && !isChecking && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
                Clear
              </button>
              <button
                onClick={handleCheck}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl transition-all text-xl font-bold"
              >
                <Check className="w-6 h-6" />
                Check Answer
              </button>
            </div>
          )}
        </div>

        {/* Letter Bank */}
        <div className="mb-8">
          <p className="text-xl text-center text-gray-700 mb-4 font-bold">
            Letter Bank - Tap to add letters:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {availableInBank.map((letter, index) => (
              <button
                key={`${letter}-${index}`}
                onClick={() => handleLetterClick(letter, true)}
                disabled={isChecking}
                className="px-6 py-4 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 rounded-xl shadow-lg text-5xl font-bold hover:scale-110 hover:from-blue-200 hover:to-blue-300 transition-all"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

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
                  Excellent! You built "{currentChallenge.targetWord}" correctly!
                </p>
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <X className="w-8 h-8 text-red-600" />
                  <p className="text-3xl font-bold text-red-800">
                    Not quite. Try again next time!
                  </p>
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-2xl text-red-700">
                  The correct word is: <span className="font-bold">{currentChallenge.targetWord}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {challenges.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-12 rounded-full transition-all ${
                index < currentChallengeIndex
                  ? 'bg-green-500'
                  : index === currentChallengeIndex
                  ? 'bg-orange-500'
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
          💡 Use the letters in the bank to build words. Tap letters to add them, tap built letters to remove them!
        </p>
      </div>
    </div>
  );
}
