import { useEffect } from 'react';
import { useStore } from '../store';

interface ImmediateRewardProps {
  onComplete: () => void;
}

export function ImmediateReward({ onComplete }: ImmediateRewardProps) {
  const { settings } = useStore();

  useEffect(() => {
    // Auto-dismiss after 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getRandomCelebration = () => {
    const celebrations = [
      { emoji: '🌟', message: 'Amazing!' },
      { emoji: '⭐', message: 'Great job!' },
      { emoji: '✨', message: 'Fantastic!' },
      { emoji: '🎉', message: 'You did it!' },
      { emoji: '👏', message: 'Wonderful!' },
      { emoji: '🎊', message: 'Excellent!' },
      { emoji: '💫', message: 'Brilliant!' },
      { emoji: '🏆', message: 'Super!' }
    ];

    return celebrations[Math.floor(Math.random() * celebrations.length)];
  };

  const celebration = getRandomCelebration();
  const animationLevel = settings?.animationLevel || 'reduced';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 rounded-3xl shadow-2xl p-12 text-center ${animationLevel === 'full' ? 'animate-bounce' : animationLevel === 'reduced' ? 'animate-pulse' : ''}`}>

        {/* Star Animation */}
        <div className="text-9xl mb-6">
          {celebration.emoji}
        </div>

        {/* Success Message */}
        <div className="text-6xl font-bold text-white mb-4">
          {celebration.message}
        </div>

        {/* Star Count */}
        <div className="bg-white rounded-2xl p-6 inline-block">
          <div className="text-5xl font-bold text-yellow-600">
            +1 ⭐
          </div>
        </div>

      </div>
    </div>
  );
}
