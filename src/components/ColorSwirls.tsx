import { useState } from 'react';

interface ColorSwirlsProps {
  onBack: () => void;
  onComplete: () => void;
}

type ColorTheme = {
  name: string;
  gradient: string;
  emoji: string;
};

const colorThemes: ColorTheme[] = [
  {
    name: 'Ocean Waves',
    gradient: 'from-blue-400 via-cyan-300 to-teal-400',
    emoji: '🌊'
  },
  {
    name: 'Sunset Sky',
    gradient: 'from-orange-400 via-pink-400 to-purple-500',
    emoji: '🌅'
  },
  {
    name: 'Forest Green',
    gradient: 'from-green-500 via-emerald-400 to-lime-400',
    emoji: '🌲'
  },
  {
    name: 'Rainbow',
    gradient: 'from-red-400 via-yellow-300 to-blue-400',
    emoji: '🌈'
  },
  {
    name: 'Lavender Dreams',
    gradient: 'from-purple-400 via-pink-300 to-indigo-400',
    emoji: '💜'
  },
  {
    name: 'Golden Hour',
    gradient: 'from-yellow-400 via-amber-300 to-orange-400',
    emoji: '✨'
  }
];

export function ColorSwirls({ onBack, onComplete }: ColorSwirlsProps) {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [touchPoints, setTouchPoints] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [nextId, setNextId] = useState(0);

  const currentTheme = colorThemes[currentThemeIndex];

  const handleNextTheme = () => {
    setCurrentThemeIndex((prev) => (prev + 1) % colorThemes.length);
  };

  const handlePreviousTheme = () => {
    setCurrentThemeIndex((prev) => (prev - 1 + colorThemes.length) % colorThemes.length);
  };

  const handleTouch = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPoint = { x, y, id: nextId };
    setTouchPoints((prev) => [...prev, newPoint]);
    setNextId((prev) => prev + 1);

    // Remove the point after animation
    setTimeout(() => {
      setTouchPoints((prev) => prev.filter((p) => p.id !== newPoint.id));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden relative">

      {/* Main Color Canvas */}
      <div
        onClick={handleTouch}
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} animate-gradient-shift cursor-pointer transition-all duration-1000`}
      >
        {/* Touch ripples */}
        {touchPoints.map((point) => (
          <div
            key={point.id}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`
            }}
            className="absolute w-32 h-32 -ml-16 -mt-16 rounded-full bg-white opacity-30 animate-ping pointer-events-none"
          />
        ))}

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-float-slower"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-8">
        <h1 className="text-6xl font-bold text-white drop-shadow-2xl mb-2">
          {currentTheme.emoji} {currentTheme.name}
        </h1>
        <p className="text-3xl text-white drop-shadow-lg opacity-90">
          Touch the screen to create ripples
        </p>
      </div>

      {/* Theme Selector */}
      <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-10">
        <button
          onClick={handlePreviousTheme}
          className="p-4 bg-white bg-opacity-30 backdrop-blur-md rounded-full text-white text-4xl hover:bg-opacity-50 transition-all shadow-2xl"
          aria-label="Previous theme"
        >
          ←
        </button>
      </div>

      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-10">
        <button
          onClick={handleNextTheme}
          className="p-4 bg-white bg-opacity-30 backdrop-blur-md rounded-full text-white text-4xl hover:bg-opacity-50 transition-all shadow-2xl"
          aria-label="Next theme"
        >
          →
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-white bg-opacity-90 text-gray-800 text-2xl font-bold rounded-2xl hover:bg-opacity-100 transition-all shadow-2xl backdrop-blur-sm"
          >
            ← Back
          </button>
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-90 text-white text-2xl font-bold rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all shadow-2xl backdrop-blur-sm"
          >
            I Feel Calm ✓
          </button>
        </div>
      </div>

      {/* Instructions hint */}
      {touchPoints.length === 0 && (
        <div className="absolute bottom-32 left-0 right-0 z-10 text-center animate-pulse">
          <p className="text-2xl text-white drop-shadow-lg opacity-75">
            👆 Tap anywhere to create ripples
          </p>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, 50px) scale(1.1);
          }
        }

        @keyframes float-slower {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-30px, -40px) scale(0.95);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 8s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}
