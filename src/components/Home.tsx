import { useState, useEffect } from 'react';
import { BookOpen, Calculator, BarChart3, Settings as SettingsIcon, FolderOpen, Eye } from 'lucide-react';
import { db } from '../db';
import { Unit } from '../types';
import { useStore } from '../store';

export function Home() {
  const { setCurrentUnit, setCurrentView } = useStore();
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    loadUnits();
  }, []);

  async function loadUnits() {
    const unitsData = await db.units.toArray();
    setUnits(unitsData);
  }

  function handleStartReading(unit: Unit) {
    setCurrentUnit(unit);
    setCurrentView('reading');
  }

  function handleStartMath(unit: Unit) {
    setCurrentUnit(unit);
    setCurrentView('math');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-green-50 to-yellow-50">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">Learning Time!</h1>
            <p className="text-2xl text-gray-600">Choose an activity to get started</p>
          </div>

          {/* Sight Words Feature Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-4xl font-bold mb-2">Sight Words Mastery</h2>
                  <p className="text-xl opacity-90">
                    Master high-frequency words with flashcards and fun activities!
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('sightwords')}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg text-xl font-bold"
                >
                  <Eye className="w-8 h-8" />
                  Practice Sight Words
                </button>
              </div>
            </div>
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
