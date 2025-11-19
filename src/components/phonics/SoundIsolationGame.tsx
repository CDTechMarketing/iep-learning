import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Check, X, Sparkles } from 'lucide-react';
import { PhonicsPattern, SoundPosition, PhonicsProgress } from '../../types';
import { recordAttempt, getPatternProgress } from '../../utils/phonicsEngine';

interface Props {
  pattern: PhonicsPattern;
  studentId: string;
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  word: string;
  position: SoundPosition;
  correctSound: string;
  distractors: string[];
}

export function SoundIsolationGame({ pattern, studentId, onComplete, onBack }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState<PhonicsProgress | null>(null);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    initialize();
  }, [pattern]);

  async function initialize() {
    // Load progress
    const prog = await getPatternProgress(studentId, pattern.id);
    setProgress(prog || null);

    // Generate questions based on pattern
    const newQuestions = generateQuestions(pattern);
    setQuestions(newQuestions);
    setStartTime(Date.now());
  }

  function generateQuestions(pattern: PhonicsPattern): Question[] {
    const questions: Question[] = [];
    const words = pattern.examples.slice(0, 10); // Use up to 10 examples

    words.forEach((word, index) => {
      // Vary the position: beginning, ending, then middle
      let position: SoundPosition = 'beginning';
      if (index % 3 === 1) position = 'ending';
      else if (index % 3 === 2 && word.length > 3) position = 'middle';

      const correctSound = getSound(word, position);
      const distractors = generateDistractors(correctSound, word);

      questions.push({
        word,
        position,
        correctSound,
        distractors
      });
    });

    return questions.slice(0, 5); // Limit to 5 questions per session
  }

  function getSound(word: string, position: SoundPosition): string {
    const letters = word.split('');

    if (position === 'beginning') {
      return letters[0];
    } else if (position === 'ending') {
      return letters[letters.length - 1];
    } else {
      // middle - usually the vowel in CVC words
      const middleIndex = Math.floor(letters.length / 2);
      return letters[middleIndex];
    }
  }

  function generateDistractors(correctSound: string, word: string): string[] {
    const allSounds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                       'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    const wordLetters = word.split('');
    const distractors: string[] = [];

    // Add one sound from the word (different position)
    const otherSounds = wordLetters.filter(s => s !== correctSound);
    if (otherSounds.length > 0) {
      distractors.push(otherSounds[0]);
    }

    // Add random sounds
    while (distractors.length < 3) {
      const randomSound = allSounds[Math.floor(Math.random() * allSounds.length)];
      if (randomSound !== correctSound && !distractors.includes(randomSound)) {
        distractors.push(randomSound);
      }
    }

    return distractors.slice(0, 3);
  }

  async function handleAnswer(answer: string) {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctSound;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    // Record attempt
    const timeSpent = Date.now() - startTime;
    await recordAttempt(
      studentId,
      `sound-isolation-${pattern.id}-${currentQuestionIndex}`,
      pattern.id,
      correct,
      answer,
      timeSpent,
      0, // hints used
      progress?.currentScaffoldLevel || 'medium'
    );

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setStartTime(Date.now());
      } else {
        // Activity complete
        setTimeout(onComplete, 1500);
      }
    }, 2000);
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allOptions = [currentQuestion.correctSound, ...currentQuestion.distractors]
    .sort(() => Math.random() - 0.5); // Shuffle

  const positionText = {
    beginning: 'start',
    middle: 'middle',
    ending: 'end'
  };

  return (
    <div className="max-w-4xl mx-auto">
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
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl shadow-lg">
            <span className="text-xl font-bold">Score: {score}/{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-2xl p-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🔍 Sound Detective
        </h2>

        {/* Word Display */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
            <Volume2 className="w-12 h-12 text-blue-600" />
            <div className="text-7xl font-bold text-gray-800 tracking-wider">
              {currentQuestion.word}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-12">
          <p className="text-3xl font-bold text-gray-700">
            What sound does "{currentQuestion.word}" {positionText[currentQuestion.position]} with?
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {allOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentQuestion.correctSound;

            let buttonClass = 'p-8 rounded-2xl text-5xl font-bold transition-all transform hover:scale-105 shadow-lg ';

            if (selectedAnswer === null) {
              buttonClass += 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300';
            } else if (isSelected && isCorrect) {
              buttonClass += 'bg-gradient-to-br from-green-400 to-green-500 text-white scale-110';
            } else if (isSelected && !isCorrect) {
              buttonClass += 'bg-gradient-to-br from-red-400 to-red-500 text-white';
            } else if (isCorrectAnswer) {
              buttonClass += 'bg-gradient-to-br from-green-400 to-green-500 text-white scale-110';
            } else {
              buttonClass += 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400';
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                {option}
                {isSelected && isCorrect && (
                  <Check className="w-12 h-12 mx-auto mt-2 animate-bounce" />
                )}
                {isSelected && !isCorrect && (
                  <X className="w-12 h-12 mx-auto mt-2 animate-bounce" />
                )}
              </button>
            );
          })}
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
                  Excellent! That's correct!
                </p>
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <p className="text-3xl font-bold text-red-800">
                Not quite. The {positionText[currentQuestion.position]} sound is "{currentQuestion.correctSound}".
              </p>
            )}
          </div>
        )}
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
