import { useState } from 'react';
import { useStore } from '../store';
import { logger } from '../utils/logger';

interface ChoiceBoardsProps {
  onComplete?: (choices: ActivityChoice[]) => void;
}

interface ActivityChoice {
  type: 'reading' | 'math' | 'break';
  selected: boolean;
  icon: string;
  title: string;
  description: string;
}

export function ChoiceBoards({ onComplete }: ChoiceBoardsProps) {
  const { settings, setActivityChoices, setCurrentView } = useStore();

  const [activities, setActivities] = useState<ActivityChoice[]>([
    {
      type: 'reading',
      selected: false,
      icon: '📖',
      title: 'Reading Practice',
      description: 'Learn words and sentences'
    },
    {
      type: 'math',
      selected: false,
      icon: '🔢',
      title: 'Math Practice',
      description: 'Count and add numbers'
    },
    {
      type: 'break',
      selected: false,
      icon: '🧘',
      title: 'Calming Break',
      description: 'Relax and breathe'
    }
  ]);

  const [step, setStep] = useState<'activities' | 'order'>('activities');
  const [orderedActivities, setOrderedActivities] = useState<ActivityChoice[]>([]);

  const toggleActivity = (type: ActivityChoice['type']) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.type === type
          ? { ...activity, selected: !activity.selected }
          : activity
      )
    );
  };

  const selectedActivities = activities.filter(a => a.selected);
  const canProceed = selectedActivities.length > 0;

  const handleNext = () => {
    if (step === 'activities') {
      setOrderedActivities(selectedActivities);
      if (selectedActivities.length > 1) {
        setStep('order');
      } else {
        finishSelection(selectedActivities);
      }
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...orderedActivities];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrderedActivities(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === orderedActivities.length - 1) return;
    const newOrder = [...orderedActivities];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrderedActivities(newOrder);
  };

  const handleComplete = () => {
    finishSelection(orderedActivities);
  };

  const finishSelection = (choices: ActivityChoice[]) => {
    const activityTypes = choices.map(c => c.type);

    // Save choices to store
    setActivityChoices(activityTypes, activityTypes);

    // Log the selection
    logger.info('choice-boards', 'Activities selected', {
      count: activityTypes.length,
      activities: activityTypes
    });

    // Call onComplete if provided (for legacy usage)
    if (onComplete) {
      onComplete(choices);
    } else {
      // Navigate back to home to select a unit
      setCurrentView('home');
    }
  };

  if (step === 'order') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-3xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() => setStep('activities')}
            className="mb-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition text-xl font-semibold"
          >
            ← Back
          </button>

          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              🎯 Choose Your Order
            </h1>
            <p className="text-3xl text-gray-600">
              What do you want to do first?
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {orderedActivities.map((activity, index) => (
              <div
                key={activity.type}
                className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-6"
              >
                {/* Order Number */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                  {index + 1}
                </div>

                {/* Activity Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-5xl">{activity.icon}</span>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {activity.title}
                    </h3>
                  </div>
                  <p className="text-xl text-gray-600">{activity.description}</p>
                </div>

                {/* Move Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className={`px-6 py-3 rounded-xl text-2xl font-bold transition-all ${
                      index === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === orderedActivities.length - 1}
                    className={`px-6 py-3 rounded-xl text-2xl font-bold transition-all ${
                      index === orderedActivities.length - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                    }`}
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Complete Button */}
          <div className="text-center">
            <button
              onClick={handleComplete}
              className="px-16 py-8 bg-gradient-to-r from-green-500 to-blue-500 text-white text-4xl font-bold rounded-full shadow-2xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 active:scale-95"
            >
              This is Perfect! ✓
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => setCurrentView('home')}
          className="mb-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition text-xl font-semibold"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            🎨 Choose Your Activities
          </h1>
          <p className="text-3xl text-gray-600">
            Pick what you want to practice today!
          </p>
          <p className="text-2xl text-gray-500 mt-2">
            (You can pick as many as you want)
          </p>
        </div>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {activities.map((activity) => (
            <button
              key={activity.type}
              onClick={() => toggleActivity(activity.type)}
              className={`relative p-8 rounded-3xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
                activity.selected
                  ? 'bg-gradient-to-br from-green-400 to-blue-500 text-white ring-8 ring-green-300'
                  : 'bg-white text-gray-800 hover:shadow-3xl'
              }`}
            >
              {/* Selection Checkmark */}
              {activity.selected && (
                <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">✓</span>
                </div>
              )}

              <div className="text-8xl mb-4">{activity.icon}</div>
              <h2 className="text-3xl font-bold mb-3">{activity.title}</h2>
              <p className={`text-xl ${activity.selected ? 'text-white opacity-90' : 'text-gray-600'}`}>
                {activity.description}
              </p>
            </button>
          ))}
        </div>

        {/* Selection Count */}
        <div className="text-center mb-8">
          <p className="text-3xl font-semibold text-gray-700">
            {selectedActivities.length === 0 && 'Pick at least one activity to begin'}
            {selectedActivities.length === 1 && '1 activity selected!'}
            {selectedActivities.length > 1 && `${selectedActivities.length} activities selected!`}
          </p>
        </div>

        {/* Next Button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-16 py-8 text-4xl font-bold rounded-full shadow-2xl transition-all transform ${
              canProceed
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedActivities.length > 1 ? 'Choose Order →' : 'Start Learning! →'}
          </button>
        </div>

      </div>
    </div>
  );
}
