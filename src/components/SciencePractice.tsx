import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Beaker, Award, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { db } from '../db';

interface ScienceUnit {
  id: string;
  title: string;
  topic: string;
  description: string;
  lessonsCount: number;
  completed: boolean;
}

export function SciencePractice() {
  const { setCurrentView } = useStore();
  const [units, setUnits] = useState<ScienceUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<ScienceUnit | null>(null);

  useEffect(() => {
    loadScienceUnits();
  }, []);

  async function loadScienceUnits() {
    // For now, we'll use hardcoded units until we implement the data loading
    const defaultUnits: ScienceUnit[] = [
      {
        id: 'water-cycle-unit',
        title: 'The Water Cycle',
        topic: 'water-cycle',
        description: 'Learn about evaporation, condensation, precipitation, and how water moves through our environment!',
        lessonsCount: 5,
        completed: false
      },
      {
        id: 'adaptations-unit',
        title: 'Animal Adaptations',
        topic: 'adaptations',
        description: 'Discover how animals have special features that help them survive in their habitats!',
        lessonsCount: 5,
        completed: false
      },
      {
        id: 'fossils-unit',
        title: 'Fossils',
        topic: 'fossils',
        description: 'Explore how fossils tell us about life long ago!',
        lessonsCount: 3,
        completed: false
      }
    ];

    setUnits(defaultUnits);
  }

  function handleUnitSelect(unit: ScienceUnit) {
    setSelectedUnit(unit);
  }

  function handleBackToUnits() {
    setSelectedUnit(null);
  }

  if (selectedUnit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToUnits}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 text-xl"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Units
          </button>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">{selectedUnit.title}</h1>
            <p className="text-2xl text-gray-600 mb-8">{selectedUnit.description}</p>

            <div className="space-y-4">
              {Array.from({ length: selectedUnit.lessonsCount }, (_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Lesson {i + 1}</h3>
                      <p className="text-gray-600">Click to start learning</p>
                    </div>
                  </div>
                  <ChevronRight className="w-8 h-8 text-gray-400" />
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-6 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-all transform hover:scale-105 shadow-lg">
                <BookOpen className="w-8 h-8" />
                <span className="text-xl font-bold">Vocabulary</span>
              </button>

              <button className="flex items-center justify-center gap-3 p-6 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg">
                <Beaker className="w-8 h-8" />
                <span className="text-xl font-bold">Virtual Lab</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 text-xl"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Beaker className="w-16 h-16 text-green-600" />
            <h1 className="text-6xl font-bold text-gray-800">Science Explorer</h1>
          </div>
          <p className="text-2xl text-gray-600">Choose a science unit to begin your adventure!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {units.map((unit) => (
            <div
              key={unit.id}
              onClick={() => handleUnitSelect(unit)}
              className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-4xl font-bold text-gray-800">{unit.title}</h2>
                {unit.completed && (
                  <Award className="w-12 h-12 text-yellow-500" />
                )}
              </div>

              <p className="text-xl text-gray-600 mb-6">{unit.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-500">{unit.lessonsCount} Lessons</span>
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all font-bold text-lg flex items-center gap-2">
                  Start Learning
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Science Progress</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-100 rounded-2xl">
              <div className="text-5xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-lg text-gray-600">Lessons Completed</div>
            </div>
            <div className="text-center p-6 bg-green-100 rounded-2xl">
              <div className="text-5xl font-bold text-green-600 mb-2">0</div>
              <div className="text-lg text-gray-600">Vocabulary Learned</div>
            </div>
            <div className="text-center p-6 bg-purple-100 rounded-2xl">
              <div className="text-5xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-lg text-gray-600">Badges Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
