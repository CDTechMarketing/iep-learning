import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { db } from '../db';
import { MathProblem } from '../types';
import { useStore } from '../store';
import { format } from 'date-fns';

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
    } else if (type === 'multiplication') {
      const options = new Set<number>([correctAnswer]);
      const range = correctAnswer > 50 ? 15 : 8;

      while (options.size < 4) {
        const offset = Math.floor(Math.random() * range) - Math.floor(range / 2);
        const option = Math.max(0, correctAnswer + offset);
        if (option !== correctAnswer) {
          options.add(option);
        }
      }

      return Array.from(options).sort((a, b) => a - b);
    } else if (type === 'division') {
      const options = new Set<number>([correctAnswer]);

      while (options.size < 4) {
        const offset = Math.floor(Math.random() * 5) - 2;
        const option = Math.max(0, correctAnswer + offset);
        if (option !== correctAnswer && option <= 12) {
          options.add(option);
        }
      }

      return Array.from(options).sort((a, b) => a - b);
    } else {
      // Addition
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
    }

    setTimeout(() => {
      handleNextProblem();
    }, 1500);
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
    if (!currentProblem.manipulatives) {
      return null;
    }

    // Addition manipulatives
    if (currentProblem.type === 'addition') {
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

    // Multiplication manipulatives (array model)
    if (currentProblem.type === 'multiplication' && currentProblem.metadata) {
      const { factor1, factor2 } = currentProblem.metadata;
      if (!factor1 || !factor2) return null;

      const rows = Math.min(factor1, factor2);
      const cols = Math.max(factor1, factor2);

      // Only show array if not too large
      if (rows * cols > 100) {
        return (
          <div className="mb-8 text-center">
            <p className="text-2xl text-gray-600">
              Think: {factor1} groups of {factor2}
            </p>
          </div>
        );
      }

      return (
        <div className="mb-8">
          <div className="flex flex-col items-center gap-1">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex gap-1">
                {Array.from({ length: cols }).map((_, colIndex) => {
                  const index = rowIndex * cols + colIndex;
                  return (
                    <button
                      key={`cell-${index}`}
                      onClick={() => handleBlockClick(index)}
                      className={`w-12 h-12 rounded-lg transition-all transform ${
                        blockCounts.includes(index)
                          ? 'bg-purple-500 scale-110 shadow-lg ring-2 ring-purple-300'
                          : 'bg-blue-300 hover:bg-blue-400 shadow-md'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-center text-xl text-gray-600 mt-4">
            Tap to count: {blockCounts.length} / {factor1 * factor2}
          </p>
          <p className="text-center text-lg text-gray-500 mt-2">
            {rows} rows × {cols} columns
          </p>
        </div>
      );
    }

    // Division manipulatives (grouping model)
    if (currentProblem.type === 'division' && currentProblem.metadata) {
      const { dividend, divisor } = currentProblem.metadata;
      if (!dividend || !divisor || dividend === 0) return null;

      const quotient = dividend / divisor;

      return (
        <div className="mb-8">
          <p className="text-center text-xl text-gray-600 mb-4">
            Share {dividend} items into {divisor} groups
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {Array.from({ length: divisor }).map((_, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className="bg-gray-100 rounded-2xl p-4 border-4 border-gray-300"
              >
                <p className="text-center text-sm font-bold text-gray-600 mb-2">
                  Group {groupIndex + 1}
                </p>
                <div className="flex flex-wrap gap-1 max-w-[120px]">
                  {Array.from({ length: quotient }).map((_, itemIndex) => {
                    const index = groupIndex * quotient + itemIndex;
                    return (
                      <button
                        key={`item-${index}`}
                        onClick={() => handleBlockClick(index)}
                        className={`w-10 h-10 rounded-lg transition-all transform ${
                          blockCounts.includes(index)
                            ? 'bg-green-500 scale-110 shadow-lg ring-2 ring-green-300'
                            : 'bg-orange-300 hover:bg-orange-400 shadow-md'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xl text-gray-600 mt-4">
            Tap to count: {blockCounts.length} / {dividend}
          </p>
        </div>
      );
    }

    return null;
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
                : currentProblem.type === 'multiplication'
                ? 'What is the product?'
                : currentProblem.type === 'division'
                ? 'What is the quotient?'
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
