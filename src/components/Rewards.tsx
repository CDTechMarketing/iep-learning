import { useState, useEffect } from 'react';
import { Star, Home } from 'lucide-react';
import { db } from '../db';
import { Reward, SessionLog } from '../types';
import { useStore } from '../store';

export function Rewards() {
  const { currentUnit, sessionStars, resetSession, setCurrentView } = useStore();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [unlockedRewards, setUnlockedRewards] = useState<Set<string>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState<Reward[]>([]);

  useEffect(() => {
    loadRewards();
  }, []);

  async function loadRewards() {
    const rewardsData = await db.rewards.toArray();
    setRewards(rewardsData.sort((a, b) => a.milestone - b.milestone));

    if (currentUnit) {
      const logs = await db.sessionLogs
        .where('unitId')
        .equals(currentUnit.id)
        .toArray();

      const total = logs.reduce((sum, log) => sum + log.starsEarned, 0);
      setTotalStars(total);

      const unlocked = rewardsData.filter((r) => total >= r.milestone);
      setUnlockedRewards(new Set(unlocked.map((r) => r.id)));

      const prevTotal = total - sessionStars;
      const newUnlocked = rewardsData.filter(
        (r) => r.milestone > prevTotal && r.milestone <= total
      );
      setNewlyUnlocked(newUnlocked);
    }
  }

  function handleContinue() {
    resetSession();
    setCurrentView('home');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Amazing Work!</h1>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
            <p className="text-4xl font-bold text-yellow-600">+{sessionStars}</p>
            <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
          </div>

          <p className="text-2xl text-gray-600">
            Total Stars: <span className="font-bold text-blue-600">{totalStars}</span>
          </p>
        </div>

        {newlyUnlocked.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
              New Stickers Unlocked!
            </h2>
            <div className="flex justify-center gap-6 flex-wrap">
              {newlyUnlocked.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 animate-bounce"
                >
                  <div className="text-7xl mb-2">{reward.iconPath}</div>
                  <p className="text-lg font-semibold text-gray-700 text-center">
                    {reward.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Sticker Collection
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {rewards.map((reward) => {
              const isUnlocked = unlockedRewards.has(reward.id);
              return (
                <div
                  key={reward.id}
                  className={`rounded-2xl p-4 text-center transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg'
                      : 'bg-gray-100 opacity-50'
                  }`}
                >
                  <div className={`text-5xl mb-2 ${isUnlocked ? '' : 'grayscale blur-sm'}`}>
                    {reward.iconPath}
                  </div>
                  <p className="text-xs font-medium text-gray-600">{reward.name}</p>
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500 mt-1">{reward.milestone} ⭐</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleContinue}
            className="flex items-center gap-3 px-8 py-4 bg-blue-500 text-white text-xl rounded-2xl hover:bg-blue-600 transition-colors shadow-lg font-semibold"
          >
            <Home className="w-6 h-6" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
