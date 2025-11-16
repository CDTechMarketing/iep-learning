import { useState, useEffect } from 'react';

interface BubblePopProps {
  onBack: () => void;
  onComplete: () => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

export function BubblePop({ onBack, onComplete }: BubblePopProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [nextBubbleId, setNextBubbleId] = useState(0);

  const colors = [
    'bg-blue-300',
    'bg-purple-300',
    'bg-pink-300',
    'bg-green-300',
    'bg-yellow-300',
    'bg-indigo-300'
  ];

  // Generate new bubbles periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (bubbles.length < 12) {
        const newBubble: Bubble = {
          id: nextBubbleId,
          x: Math.random() * 80 + 10, // 10-90% of screen width
          y: 100, // Start at bottom
          size: Math.random() * 60 + 60, // 60-120px
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 2 + 1 // 1-3 seconds to float up
        };

        setBubbles((prev) => [...prev, newBubble]);
        setNextBubbleId((prev) => prev + 1);
      }
    }, 1500); // New bubble every 1.5 seconds

    return () => clearInterval(interval);
  }, [bubbles.length, nextBubbleId]);

  // Animate bubbles floating up
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - (100 / (bubble.speed * 60)) // Move up based on speed
          }))
          .filter((bubble) => bubble.y > -20) // Remove bubbles that floated off screen
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  const handleBubblePop = (id: number) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
    setPoppedCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 overflow-hidden relative">

      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">
          🫧 Bubble Pop
        </h1>
        <p className="text-2xl text-gray-600">
          Pop {poppedCount} bubbles
        </p>
      </div>

      {/* Bubbles Container */}
      <div className="relative h-[calc(100vh-200px)] w-full">
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            onClick={() => handleBubblePop(bubble.id)}
            style={{
              left: `${bubble.x}%`,
              bottom: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              transition: 'all 0.3s ease-out'
            }}
            className={`absolute ${bubble.color} rounded-full opacity-60 hover:opacity-90 transition-all transform hover:scale-110 active:scale-0 shadow-lg border-4 border-white cursor-pointer`}
            aria-label="Pop bubble"
          >
            {/* Bubble shine effect */}
            <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full opacity-70"></div>
          </button>
        ))}

        {/* Instructions */}
        {bubbles.length === 0 && poppedCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
              <div className="text-8xl mb-6">🫧</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Touch the Bubbles
              </h2>
              <p className="text-2xl text-gray-600">
                Pop them gently at your own pace
              </p>
              <p className="text-xl text-gray-500 mt-4">
                Bubbles will appear soon...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gray-300 text-gray-800 text-2xl font-bold rounded-2xl hover:bg-gray-400 transition-colors shadow-lg"
          >
            ← Back
          </button>
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
          >
            I Feel Calm ✓
          </button>
        </div>
      </div>

      {/* Popping particles effect would go here - simplified for now */}

    </div>
  );
}
