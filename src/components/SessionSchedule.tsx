import { useStore } from '../store';

export function SessionSchedule() {
  const { sessionPlan, setCurrentView } = useStore();

  if (!sessionPlan) {
    // If no session plan, go back to home
    setCurrentView('home');
    return null;
  }

  const handleBegin = () => {
    // Navigate to the first activity preview
    setCurrentView('preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            📅 Today's Learning Plan
          </h1>
          <p className="text-3xl text-gray-600">
            Let's see what we'll do today!
          </p>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="space-y-4">
            {sessionPlan.activities.map((activity, index) => {
              const isCompleted = activity.status === 'completed';
              const isInProgress = activity.status === 'in-progress';
              const isPending = activity.status === 'pending';

              return (
                <div
                  key={activity.id}
                  className={`rounded-2xl p-6 transition-all ${
                    isCompleted
                      ? 'bg-green-100 border-4 border-green-400'
                      : isInProgress
                      ? 'bg-blue-100 border-4 border-blue-400 scale-105'
                      : 'bg-gray-50 border-4 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-6">

                    {/* Number Badge */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isInProgress
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>

                    {/* Activity Icon */}
                    <div className="text-6xl">
                      {activity.icon}
                    </div>

                    {/* Activity Info */}
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-800 mb-1">
                        {activity.title}
                      </h3>
                      <div className="text-xl text-gray-600">
                        {activity.estimatedItems} items • {activity.starsToEarn} ⭐
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {isCompleted && (
                      <div className="text-2xl font-bold text-green-600">
                        DONE! ✓
                      </div>
                    )}
                    {isInProgress && (
                      <div className="text-2xl font-bold text-blue-600">
                        → NOW
                      </div>
                    )}
                    {isPending && index === sessionPlan.currentActivityIndex && (
                      <div className="text-2xl font-bold text-purple-600">
                        ⏳ NEXT
                      </div>
                    )}
                    {isPending && index > sessionPlan.currentActivityIndex && (
                      <div className="text-2xl font-bold text-gray-400">
                        ⏳ LATER
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

            <div>
              <div className="text-6xl mb-2">📝</div>
              <div className="text-4xl font-bold">
                {sessionPlan.activities.reduce((sum, a) => sum + a.estimatedItems, 0)}
              </div>
              <div className="text-2xl">Total Items</div>
            </div>

            <div>
              <div className="text-6xl mb-2">⭐</div>
              <div className="text-4xl font-bold">
                {sessionPlan.activities.reduce((sum, a) => sum + a.starsToEarn, 0)}
              </div>
              <div className="text-2xl">Stars to Earn</div>
            </div>

            <div>
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-4xl font-bold">
                {sessionPlan.activities.length}
              </div>
              <div className="text-2xl">Activities</div>
            </div>

          </div>
        </div>

        {/* Begin Button */}
        <div className="text-center">
          <button
            onClick={handleBegin}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-4xl font-bold py-8 px-16 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            Let's Begin! 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
