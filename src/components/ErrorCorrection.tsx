import { useState, useEffect } from 'react';
import { ArrowDown, CheckCircle } from 'lucide-react';
import { useStore } from '../store';

type ErrorCorrectionStep = 'model' | 'lead' | 'test';

interface ErrorCorrectionProps {
  problemType: 'reading' | 'math' | 'science';
  correctAnswer: string | number;
  incorrectAnswer: string | number;
  question: string;
  allOptions?: (string | number)[];
  visualAid?: React.ReactNode;
  onComplete: (finallyCorrect: boolean, cyclesNeeded: number) => void;
}

export function ErrorCorrection({
  problemType,
  correctAnswer,
  incorrectAnswer,
  question,
  allOptions,
  visualAid,
  onComplete,
}: ErrorCorrectionProps) {
  const { settings } = useStore();
  const [step, setStep] = useState<ErrorCorrectionStep>('model');
  const [cycleCount, setCycleCount] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const maxCycles = settings?.errorCorrection?.maxCycles ?? 2;
  const modelDuration = (settings?.errorCorrection?.modelDuration ?? 3) * 1000;
  const leadDuration = (settings?.errorCorrection?.leadDuration ?? 3) * 1000;

  // Auto-advance from Model to Lead
  useEffect(() => {
    if (step === 'model') {
      const timer = setTimeout(() => {
        setStep('lead');
      }, modelDuration);
      return () => clearTimeout(timer);
    }
  }, [step, modelDuration]);

  // Auto-advance from Lead to Test
  useEffect(() => {
    if (step === 'lead') {
      const timer = setTimeout(() => {
        setStep('test');
      }, leadDuration);
      return () => clearTimeout(timer);
    }
  }, [step, leadDuration]);

  const handleTestAnswer = (selectedAnswer: string | number) => {
    if (selectedAnswer === correctAnswer) {
      // Correct! Show celebration and complete
      setShowCelebration(true);

      // Speak encouragement
      if (settings?.audioEnabled && 'speechSynthesis' in window) {
        const message = cycleCount === 1
          ? "You found it! Great job!"
          : "You got it! I knew you could do it!";
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }

      setTimeout(() => {
        onComplete(true, cycleCount);
      }, 2000);
    } else {
      // Still wrong - check if we should repeat cycle
      if (cycleCount < maxCycles) {
        setCycleCount(prev => prev + 1);
        setStep('model');
      } else {
        // Max cycles reached, move on
        onComplete(false, cycleCount);
      }
    }
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-9xl mb-6 animate-bounce">🎉</div>
          <h1 className={`text-6xl font-bold text-green-900 mb-4 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
            You Did It!
          </h1>
          <p className={`text-3xl text-gray-700 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
            Great job learning! ⭐
          </p>
        </div>
      </div>
    );
  }

  // STEP 1: MODEL - Show the correct answer
  if (step === 'model') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-blue-300">
            <h2 className={`text-5xl font-bold text-blue-900 mb-6 text-center ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              Let me show you! 👀
            </h2>

            <p className={`text-3xl text-gray-700 mb-8 text-center ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              {question}
            </p>

            {/* Visual Aid */}
            {visualAid && (
              <div className="mb-8 flex justify-center">
                {visualAid}
              </div>
            )}

            {/* Highlight correct answer */}
            <div className="text-center">
              <div className="inline-block p-12 bg-green-300 rounded-2xl border-4 border-green-500 animate-pulse">
                <p className={`text-8xl font-bold text-green-900 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
                  {correctAnswer}
                </p>
              </div>
            </div>

            <p className={`text-2xl text-gray-600 mt-8 text-center ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              The answer is <strong className="text-green-700">{correctAnswer}</strong>
            </p>

            {/* Progress indicator */}
            <div className="mt-8 text-center">
              <div className="inline-flex gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: LEAD - Guide to the answer
  if (step === 'lead') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-purple-300">
            <h2 className={`text-5xl font-bold text-purple-900 mb-6 text-center ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              Let's do it together! 🤝
            </h2>

            <p className={`text-3xl text-gray-700 mb-8 text-center ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              {question}
            </p>

            {/* Animated pointer to correct answer */}
            <div className="relative flex justify-center">
              <div className="absolute -top-20 animate-bounce">
                <ArrowDown className="w-24 h-24 text-purple-600" strokeWidth={3} />
              </div>

              <div className="mt-8 p-12 bg-purple-300 rounded-2xl border-4 border-purple-500">
                <p className={`text-8xl font-bold text-purple-900 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
                  {correctAnswer}
                </p>
              </div>
            </div>

            <p className={`text-2xl text-purple-600 mt-8 text-center font-bold ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              This is the answer! ⬆️
            </p>

            {/* Progress indicator */}
            <div className="mt-8 text-center">
              <div className="inline-flex gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: TEST - Independent retry
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-yellow-300">
          <h2 className={`text-5xl font-bold text-yellow-900 mb-6 text-center ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
            Now you try! 💪
          </h2>

          <p className={`text-3xl text-gray-700 mb-8 text-center ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
            {question}
          </p>

          {/* Visual Aid */}
          {visualAid && (
            <div className="mb-8 flex justify-center">
              {visualAid}
            </div>
          )}

          {/* Show all options */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {allOptions ? (
              allOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleTestAnswer(option)}
                  className={`
                    p-8 rounded-2xl border-4 text-4xl font-bold
                    transition-all transform hover:scale-105
                    bg-white border-yellow-400 text-gray-800
                    hover:bg-yellow-100 hover:border-yellow-500
                    shadow-lg hover:shadow-xl
                    ${settings?.dyslexiaFont ? 'font-mono' : ''}
                  `}
                >
                  {option}
                </button>
              ))
            ) : (
              // If no options provided, just show correct answer as button
              <button
                onClick={() => handleTestAnswer(correctAnswer)}
                className={`
                  p-8 rounded-2xl border-4 text-4xl font-bold
                  transition-all transform hover:scale-105
                  bg-white border-yellow-400 text-gray-800
                  hover:bg-yellow-100 hover:border-yellow-500
                  shadow-lg hover:shadow-xl
                  ${settings?.dyslexiaFont ? 'font-mono' : ''}
                `}
              >
                {correctAnswer}
              </button>
            )}
          </div>

          <p className={`text-xl text-gray-600 mt-8 text-center ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
            {cycleCount > 1 ? 'You can do it! Try again!' : 'Choose the correct answer!'}
          </p>

          {/* Progress indicator */}
          <div className="mt-8 text-center">
            <div className="inline-flex gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>

          {/* Cycle indicator */}
          {cycleCount > 1 && (
            <div className="mt-4 text-center">
              <span className={`text-sm text-gray-500 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
                Attempt {cycleCount} of {maxCycles}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
