import { useState } from 'react';
import { useStore } from '../store';
import { BreathingBuddy } from './BreathingBuddy';
import { BubblePop } from './BubblePop';
import { ColorSwirls } from './ColorSwirls';

type BreakActivity = 'select' | 'breathing' | 'bubbles' | 'colors' | 'counting';

export function SensoryBreak() {
  const { setCurrentView } = useStore();
  const [currentActivity, setCurrentActivity] = useState<BreakActivity>('select');

  const handleActivitySelect = (activity: BreakActivity) => {
    setCurrentActivity(activity);
  };

  const handleBackToSelect = () => {
    setCurrentActivity('select');
  };

  const handleComplete = () => {
    setCurrentView('home');
  };

  if (currentActivity === 'breathing') {
    return <BreathingBuddy onBack={handleBackToSelect} onComplete={handleComplete} />;
  }

  if (currentActivity === 'bubbles') {
    return <BubblePop onBack={handleBackToSelect} onComplete={handleComplete} />;
  }

  if (currentActivity === 'colors') {
    return <ColorSwirls onBack={handleBackToSelect} onComplete={handleComplete} />;
  }

  if (currentActivity === 'counting') {
    return <CountingToCalm onBack={handleBackToSelect} onComplete={handleComplete} />;
  }

  // Activity Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            🧘 Take a Calming Break
          </h1>
          <p className="text-3xl text-gray-600">
            Choose a relaxing activity
          </p>
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Breathing Buddy */}
          <button
            onClick={() => handleActivitySelect('breathing')}
            className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-8xl mb-4">🫁</div>
            <h2 className="text-4xl font-bold text-blue-800 mb-3">
              Breathing Buddy
            </h2>
            <p className="text-xl text-gray-600">
              Breathe in and out with calming animations
            </p>
          </button>

          {/* Bubble Pop */}
          <button
            onClick={() => handleActivitySelect('bubbles')}
            className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-8xl mb-4">🫧</div>
            <h2 className="text-4xl font-bold text-purple-800 mb-3">
              Bubble Pop
            </h2>
            <p className="text-xl text-gray-600">
              Pop gentle bubbles at your own pace
            </p>
          </button>

          {/* Color Swirls */}
          <button
            onClick={() => handleActivitySelect('colors')}
            className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-8xl mb-4">🌈</div>
            <h2 className="text-4xl font-bold text-pink-800 mb-3">
              Color Swirls
            </h2>
            <p className="text-xl text-gray-600">
              Watch and touch flowing colors
            </p>
          </button>

          {/* Counting to Calm */}
          <button
            onClick={() => handleActivitySelect('counting')}
            className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-8xl mb-4">🔢</div>
            <h2 className="text-4xl font-bold text-green-800 mb-3">
              Counting to Calm
            </h2>
            <p className="text-xl text-gray-600">
              Count peaceful things together
            </p>
          </button>

        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleComplete}
            className="px-12 py-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-3xl font-bold rounded-full shadow-2xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 active:scale-95"
          >
            I'm Ready to Continue! ✨
          </button>
        </div>

      </div>
    </div>
  );
}

// Simple Counting to Calm component
function CountingToCalm({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const things = ['🌟', '🌸', '🦋', '🌈', '☁️'];
  const currentThing = things[count % things.length];

  const handleNext = () => {
    if (count < 9) {
      setCount(count + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl w-full text-center">

        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          Let's count together
        </h2>

        <div className="mb-8">
          <div className="text-9xl mb-6">{currentThing}</div>
          <div className="text-8xl font-bold text-blue-600 mb-4">
            {count + 1}
          </div>
          <p className="text-3xl text-gray-600">
            {count + 1} {count === 0 ? 'beautiful thing' : 'beautiful things'}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gray-300 text-gray-800 text-2xl font-bold rounded-2xl hover:bg-gray-400 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
          >
            {count < 9 ? 'Next' : 'All Done!'} →
          </button>
        </div>

      </div>
    </div>
  );
}
