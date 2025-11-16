import { useState, useEffect } from 'react';
import { BookOpen, Calculator, BarChart3, Settings as SettingsIcon, FolderOpen } from 'lucide-react';
import { db } from '../db';
import { Unit } from '../types';
import { useStore } from '../store';

export function Home() {
  const { setCurrentUnit, setCurrentView, setSessionPlan, settings, resetSession } = useStore();
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    loadUnits();
  }, []);

  async function loadUnits() {
    const unitsData = await db.units.toArray();
    setUnits(unitsData);
  }

  async function createSessionPlan(unit: Unit, startWith: 'reading' | 'math' | 'full') {
    const phrases = await db.phrases.where('unitId').equals(unit.id).toArray();
    const mathProblems = await db.mathProblems.where('unitId').equals(unit.id).toArray();

    const activities = [];

    if (startWith === 'reading' || startWith === 'full') {
      activities.push({
        id: `${unit.id}-reading`,
        type: 'reading' as const,
        title: 'Reading Practice',
        icon: '📖',
        estimatedItems: phrases.length,
        starsToEarn: Math.ceil(phrases.length / 2),
        status: 'pending' as const
      });
    }

    if (startWith === 'math' || startWith === 'full') {
      activities.push({
        id: `${unit.id}-math`,
        type: 'math' as const,
        title: 'Math Practice',
        icon: '🔢',
        estimatedItems: mathProblems.length,
        starsToEarn: Math.ceil(mathProblems.length / 2),
        status: 'pending' as const
      });
    }

    // Always add rewards at the end
    activities.push({
      id: `${unit.id}-rewards`,
      type: 'rewards' as const,
      title: 'Get Your Rewards!',
      icon: '🎁',
      estimatedItems: 1,
      starsToEarn: 0,
      status: 'pending' as const
    });

    return {
      id: `session-${Date.now()}`,
      unitId: unit.id,
      activities,
      currentActivityIndex: 0,
      createdAt: new Date()
    };
  }

  async function handleStartReading(unit: Unit) {
    setCurrentUnit(unit);
    resetSession();

    if (settings?.visualScheduleEnabled) {
      const plan = await createSessionPlan(unit, 'reading');
      setSessionPlan(plan);
      setCurrentView('schedule');
    } else {
      setCurrentView('reading');
    }
  }

  async function handleStartMath(unit: Unit) {
    setCurrentUnit(unit);
    resetSession();

    if (settings?.visualScheduleEnabled) {
      const plan = await createSessionPlan(unit, 'math');
      setSessionPlan(plan);
      setCurrentView('schedule');
    } else {
      setCurrentView('math');
    }
  }

  async function handleStartFull(unit: Unit) {
    setCurrentUnit(unit);
    resetSession();

    const plan = await createSessionPlan(unit, 'full');
    setSessionPlan(plan);
    setCurrentView('schedule');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-green-50 to-yellow-50">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">Learning Time!</h1>
            <p className="text-2xl text-gray-600">Choose an activity to get started</p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Practice Units</h2>

            {units.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow"
                  >
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{unit.title}</h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {unit.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {/* Full Session Button (if visual schedule is enabled) */}
                      {settings?.visualScheduleEnabled && (
                        <button
                          onClick={() => handleStartFull(unit)}
                          className="w-full flex items-center justify-center gap-3 p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                          <span className="text-4xl">🎯</span>
                          <span className="text-xl font-bold">Full Learning Session</span>
                        </button>
                      )}

                      {/* Individual Activity Buttons */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleStartReading(unit)}
                          className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-2xl hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                          <BookOpen className="w-12 h-12" />
                          <span className="text-xl font-bold">Reading</span>
                        </button>

                        <button
                          onClick={() => handleStartMath(unit)}
                          className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-2xl hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                          <Calculator className="w-12 h-12" />
                          <span className="text-xl font-bold">Math</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 text-center text-gray-600">
                      <p className="text-sm">Goal: {unit.goalStars.join(' & ')} stars</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
                <p className="text-xl text-gray-500 mb-4">No units available yet</p>
                <button
                  onClick={() => setCurrentView('settings')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Set up units
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center justify-center gap-4 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <BarChart3 className="w-10 h-10 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">Parent Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className="flex items-center justify-center gap-4 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <SettingsIcon className="w-10 h-10 text-gray-600" />
              <span className="text-2xl font-bold text-gray-800">Settings</span>
            </button>

            <button
              onClick={() => setCurrentView('units')}
              className="flex items-center justify-center gap-4 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <FolderOpen className="w-10 h-10 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">Manage Units</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
