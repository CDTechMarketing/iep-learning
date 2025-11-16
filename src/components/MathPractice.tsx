import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { db } from '../db';
import { MathProblem } from '../types';
import { useStore } from '../store';
import { format } from 'date-fns';
import { ErrorCorrection } from './ErrorCorrection';
import { NumberLineVisual } from './visualAids/NumberLineVisual';
import { TenFrameVisual } from './visualAids/TenFrameVisual';

export function MathPractice() {
  const { currentUnit, sessionStars, addStar, recordAttempt, settings } = useStore();
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [blockCounts, setBlockCounts] = useState<number[]>([]);
  const [showErrorCorrection, setShowErrorCorrection] = useState(false);
  const [incorrectAnswer, setIncorrectAnswer] = useState<number | null>(null);
  const [currentSessionLogId, setCurrentSessionLogId] = useState<string>(`session-${Date.now()}`);

  useEffect(() => {
    if (currentUnit) {
      loadProblems();
    }
  }, [currentUnit]);

  async function loadProblems() {
    if (!currentUnit) return;

    const problemsData = await db.mathProblems
      .where('unitId')
      .equals(currentUnit.id)
      .toArray();

    setProblems(problemsData);
  }

  const currentProblem = problems[currentProblemIndex];

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-2xl text-gray-700 mb-4">Loading math problems...</p>
        </div>
      </div>
    );
  }

  function generateAnswerOptions(correctAnswer: number, type: string): number[] {
    if (type === 'identification') {
      const options = new Set<number>([correctAnswer]);
      const range = correctAnswer > 50 ? 20 : 10;

      while (options.size < 4) {
        const offset = Math.floor(Math.random() * range) - range / 2;
        const option = Math.max(0, correctAnswer + offset);
        if (option !== correctAnswer) {
          options.add(option);
        }
      }

      return Array.from(options).sort((a, b) => a - b);
    } else {
      const options = new Set<number>([correctAnswer]);

      while (options.size < 4) {
        const offset = Math.floor(Math.random() * 5) - 2;
        const option = Math.max(0, correctAnswer + offset);
        if (option !== correctAnswer && option <= 10) {
          options.add(option);
        }
      }

      return Array.from(options).sort((a, b) => a - b);
    }
  }

  function handleAnswerSelect(answer: number) {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === currentProblem.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    recordAttempt(correct);

    if (correct) {
      addStar();
      setTimeout(() => {
        handleNextProblem();
      }, 1500);
    } else {
      // Check if error correction is enabled
      if (settings?.errorCorrection?.enabled) {
        setIncorrectAnswer(answer);
        setTimeout(() => {
          setShowFeedback(false);
          setShowErrorCorrection(true);
        }, 1500);
      } else {
        setTimeout(() => {
          handleNextProblem();
        }, 1500);
      }
    }
  }

  async function handleErrorCorrectionComplete(finallyCorrect: boolean, cyclesNeeded: number) {
    // Log the error correction
    await db.errorCorrections.add({
      id: `error-${Date.now()}`,
      sessionLogId: currentSessionLogId,
      problemId: currentProblem.id,
      problemType: 'math',
      incorrectAnswer: incorrectAnswer!,
      correctAnswer: currentProblem.answer,
      correctionCyclesNeeded: cyclesNeeded,
      finallyCorrect,
      timestamp: new Date()
    });

    // Award star if finally correct
    if (finallyCorrect && settings?.errorCorrection?.celebrateCorrection) {
      addStar();
    }

    // Reset and move to next problem
    setShowErrorCorrection(false);
    setIncorrectAnswer(null);
    setSelectedAnswer(null);
    handleNextProblem();
  }

  function handleNextProblem() {
    const newItemsCompleted = itemsCompleted + 1;
    setItemsCompleted(newItemsCompleted);

    if (
      settings?.breakPromptInterval &&
      newItemsCompleted % settings.breakPromptInterval === 0
    ) {
      setShowBreakPrompt(true);
      setShowFeedback(false);
      setSelectedAnswer(null);
      return;
    }

    moveToNextProblem();
  }

  function moveToNextProblem() {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setBlockCounts([]);
    } else {
      handleSessionComplete();
    }
  }

  function handleBreakContinue() {
    setShowBreakPrompt(false);
    moveToNextProblem();
  }

  async function handleSessionComplete() {
    if (!currentUnit) return;

    const sessionLog = {
      id: `session-${Date.now()}`,
      unitId: currentUnit.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      starsEarned: sessionStars,
      attempts: itemsCompleted,
      correct: sessionStars,
      milestonesReached: currentUnit.goalStars.filter((goal) => sessionStars >= goal),
      createdAt: new Date()
    };

    await db.sessionLogs.add(sessionLog);

    useStore.setState({ currentView: 'rewards' });
  }

  function handleBlockClick(index: number) {
    setBlockCounts((prev) => {
      const newCounts = [...prev];
      if (newCounts.includes(index)) {
        return newCounts.filter((i) => i !== index);
      } else {
        return [...newCounts, index];
      }
    });
  }

  function renderManipulatives() {
    if (!currentProblem.manipulatives || currentProblem.type !== 'addition') {
      return null;
    }

    const [left, right] = currentProblem.prompt.split('+').map((n) => parseInt(n.trim()));
    const total = left + right;

    return (
      <div className="mb-8">
        <div className="flex justify-center gap-8 mb-4">
          <div className="flex flex-wrap gap-2 max-w-xs justify-center">
            {Array.from({ length: left }).map((_, i) => (
              <button
                key={`left-${i}`}
                onClick={() => handleBlockClick(i)}
                className={`w-16 h-16 rounded-xl transition-all transform ${
                  blockCounts.includes(i)
                    ? 'bg-pink-500 scale-125 shadow-2xl ring-4 ring-pink-300'
                    : 'bg-blue-300 hover:bg-blue-400 shadow-md'
                }`}
              />
            ))}
          </div>

          <div className="text-4xl font-bold text-gray-400 flex items-center">+</div>

          <div className="flex flex-wrap gap-2 max-w-xs justify-center">
            {Array.from({ length: right }).map((_, i) => (
              <button
                key={`right-${i}`}
                onClick={() => handleBlockClick(left + i)}
                className={`w-16 h-16 rounded-xl transition-all transform ${
                  blockCounts.includes(left + i)
                    ? 'bg-pink-500 scale-125 shadow-2xl ring-4 ring-pink-300'
                    : 'bg-green-300 hover:bg-green-400 shadow-md'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-xl text-gray-600">
          Tap to count: {blockCounts.length} / {total}
        </p>
      </div>
    );
  }

  // Show Error Correction if enabled and wrong answer
  if (showErrorCorrection && incorrectAnswer !== null) {
    const visualAid = currentProblem.type === 'identification' && currentProblem.answer <= 30
      ? <NumberLineVisual range={[Math.max(0, currentProblem.answer - 5), currentProblem.answer + 5]} highlighted={currentProblem.answer} animated={true} />
      : currentProblem.type === 'addition' && currentProblem.answer <= 20
      ? <TenFrameVisual number={currentProblem.answer} animated={true} />
      : undefined;

    return (
      <ErrorCorrection
        problemType="math"
        correctAnswer={currentProblem.answer}
        incorrectAnswer={incorrectAnswer}
        question={currentProblem.prompt}
        allOptions={generateAnswerOptions(currentProblem.answer, currentProblem.type)}
        visualAid={visualAid}
        onComplete={handleErrorCorrectionComplete}
      />
    );
  }

  if (showBreakPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Great Job!</h2>
          <p className="text-2xl text-gray-600 mb-8">Time for a quick stretch break</p>
          <div className="text-6xl mb-8">🧘‍♀️</div>
          <button
            onClick={handleBreakContinue}
            className="px-12 py-6 bg-green-500 text-white text-2xl rounded-2xl hover:bg-green-600 transition-colors shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const answerOptions = generateAnswerOptions(currentProblem.answer, currentProblem.type);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col p-8 ${
        settings?.dyslexiaFont ? 'font-mono' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {Array.from({ length: sessionStars }).map((_, i) => (
            <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <div className="text-lg font-semibold text-gray-600">
          {currentProblemIndex + 1} / {problems.length}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              {currentProblem.type === 'identification'
                ? 'What number is this?'
                : 'What is the answer?'}
            </h2>
            <p className="text-8xl font-bold text-blue-900 mb-4">{currentProblem.prompt}</p>
          </div>

          {renderManipulatives()}

          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            {answerOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`p-8 text-5xl font-bold rounded-2xl transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
                  showFeedback && option === currentProblem.answer
                    ? 'bg-green-500 text-white shadow-2xl'
                    : showFeedback && option === selectedAnswer
                    ? 'bg-red-400 text-white'
                    : 'bg-white border-4 border-gray-300 text-gray-800 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="mt-8 text-center">
              <p
                className={`text-3xl font-bold ${
                  isCorrect ? 'text-green-600' : 'text-blue-600'
                }`}
              >
                {isCorrect ? '🎉 Great job!' : '👍 Keep trying!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
