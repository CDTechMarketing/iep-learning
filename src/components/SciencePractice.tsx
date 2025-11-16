import { useState, useEffect } from 'react';
import { Star, Microscope } from 'lucide-react';
import { db } from '../db';
import { ScienceProblem } from '../types';
import { useStore } from '../store';
import { format } from 'date-fns';
import { ForceDemo } from './ForceDemo';
import { SimpleMachineDemo } from './SimpleMachineDemo';

export function SciencePractice() {
  const { currentUnit, sessionStars, addStar, recordAttempt, settings } = useStore();
  const [problems, setProblems] = useState<ScienceProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [itemsCompleted, setItemsCompleted] = useState(0);

  useEffect(() => {
    if (currentUnit) {
      loadProblems();
    }
  }, [currentUnit]);

  async function loadProblems() {
    if (!currentUnit) return;

    const problemsData = await db.scienceProblems
      .where('unitId')
      .equals(currentUnit.id)
      .toArray();

    setProblems(problemsData);
  }

  const currentProblem = problems[currentProblemIndex];

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center p-8">
        <div className="text-center">
          <Microscope className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <p className="text-2xl text-gray-700 mb-4">Loading science activities...</p>
        </div>
      </div>
    );
  }

  function handleProblemComplete(correct: boolean) {
    recordAttempt(correct);

    if (correct) {
      addStar();
    }

    setTimeout(() => {
      handleNextProblem();
    }, 500);
  }

  function handleNextProblem() {
    const newItemsCompleted = itemsCompleted + 1;
    setItemsCompleted(newItemsCompleted);

    if (
      settings?.breakPromptInterval &&
      newItemsCompleted % settings.breakPromptInterval === 0
    ) {
      setShowBreakPrompt(true);
      return;
    }

    moveToNextProblem();
  }

  function moveToNextProblem() {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
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

  if (showBreakPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Great Job!</h2>
          <p className="text-2xl text-gray-600 mb-8">Time for a quick stretch break</p>
          <div className="text-6xl mb-8">🧘‍♀️</div>
          <button
            onClick={handleBreakContinue}
            className="px-12 py-6 bg-purple-500 text-white text-2xl rounded-2xl hover:bg-purple-600 transition-colors shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  function renderProblem() {
    if (currentProblem.type === 'force') {
      return <ForceDemo problem={currentProblem} onComplete={handleProblemComplete} />;
    } else if (currentProblem.type === 'simple-machine') {
      return <SimpleMachineDemo problem={currentProblem} onComplete={handleProblemComplete} />;
    } else {
      // Multiple choice questions
      return <SimpleMachineDemo problem={currentProblem} onComplete={handleProblemComplete} />;
    }
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col p-8 ${
        settings?.dyslexiaFont ? 'font-mono' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Microscope className="w-8 h-8 text-purple-600" />
          <div className="flex gap-1">
            {Array.from({ length: sessionStars }).map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        <div className="text-lg font-semibold text-gray-600">
          {currentProblemIndex + 1} / {problems.length}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
          {renderProblem()}
        </div>
      </div>
    </div>
  );
}
