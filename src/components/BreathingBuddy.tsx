import { useState, useEffect } from 'react';

interface BreathingBuddyProps {
  onBack: () => void;
  onComplete: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export function BreathingBuddy({ onBack, onComplete }: BreathingBuddyProps) {
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const totalCycles = 3;

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Move to next phase
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 2;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 4;
          } else if (breathPhase === 'exhale') {
            setBreathPhase('rest');
            return 2;
          } else {
            // Complete a cycle
            const newCycles = cyclesCompleted + 1;
            setCyclesCompleted(newCycles);

            if (newCycles >= totalCycles) {
              setIsActive(false);
              return 0;
            } else {
              setBreathPhase('inhale');
              return 4;
            }
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, breathPhase, cyclesCompleted]);

  const getCircleSize = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'scale-150';
      case 'hold':
        return 'scale-150';
      case 'exhale':
        return 'scale-75';
      case 'rest':
        return 'scale-75';
      default:
        return 'scale-100';
    }
  };

  const getPhaseText = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
    }
  };

  const getPhaseColor = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'from-blue-400 to-blue-600';
      case 'hold':
        return 'from-purple-400 to-purple-600';
      case 'exhale':
        return 'from-green-400 to-green-600';
      case 'rest':
        return 'from-yellow-400 to-yellow-600';
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setBreathPhase('inhale');
    setCountdown(4);
    setCyclesCompleted(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            🫁 Breathing Buddy
          </h1>
          <p className="text-3xl text-gray-600">
            Follow the circle and breathe
          </p>
        </div>

        {/* Breathing Circle */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
          <div className="flex flex-col items-center justify-center min-h-[500px]">

            {!isActive && cyclesCompleted === 0 ? (
              // Start Screen
              <div className="text-center">
                <div className="text-9xl mb-8">🧘</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Ready to breathe?
                </h2>
                <p className="text-2xl text-gray-600 mb-8">
                  We'll do {totalCycles} calming breaths together
                </p>
                <button
                  onClick={handleStart}
                  className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl font-bold rounded-full shadow-2xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
                >
                  Let's Begin
                </button>
              </div>
            ) : isActive ? (
              // Active Breathing
              <div className="text-center">
                {/* Animated Circle */}
                <div className="mb-8 flex items-center justify-center">
                  <div
                    className={`w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-[2000ms] ease-in-out ${getCircleSize()} flex items-center justify-center shadow-2xl`}
                  >
                    <div className="text-white text-6xl font-bold">
                      {countdown}
                    </div>
                  </div>
                </div>

                {/* Phase Text */}
                <h2 className="text-5xl font-bold text-gray-800 mb-4">
                  {getPhaseText()}
                </h2>

                {/* Progress */}
                <p className="text-3xl text-gray-600">
                  Breath {cyclesCompleted + 1} of {totalCycles}
                </p>
              </div>
            ) : (
              // Completion Screen
              <div className="text-center">
                <div className="text-9xl mb-8 animate-bounce">✨</div>
                <h2 className="text-5xl font-bold text-green-600 mb-6">
                  Great Job!
                </h2>
                <p className="text-3xl text-gray-700 mb-8">
                  You completed {totalCycles} calming breaths!
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleStart}
                    className="px-8 py-4 bg-blue-500 text-white text-2xl font-bold rounded-2xl hover:bg-blue-600 transition-colors"
                  >
                    Practice Again
                  </button>
                  <button
                    onClick={onComplete}
                    className="px-8 py-4 bg-green-500 text-white text-2xl font-bold rounded-2xl hover:bg-green-600 transition-colors"
                  >
                    I Feel Calm ✓
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gray-300 text-gray-800 text-2xl font-bold rounded-2xl hover:bg-gray-400 transition-colors"
          >
            ← Choose Different Activity
          </button>
        </div>

      </div>
    </div>
  );
}
