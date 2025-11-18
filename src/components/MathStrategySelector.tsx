import React, { useState } from 'react';

export type MathStrategyType = 'standard-algorithm' | 'mental-math' | 'number-line' | 'base-ten-blocks';

interface MathStrategySelectorProps {
  onSelect: (strategy: MathStrategyType) => void;
  operation: 'addition' | 'subtraction';
}

interface Strategy {
  id: MathStrategyType;
  name: string;
  description: string;
  icon: string;
  example: string;
  whenToUse: string;
}

/**
 * MathStrategySelector Component
 * Allows students to choose their preferred solving method for two-digit math
 * Promotes metacognition and student agency in learning
 */
export const MathStrategySelector: React.FC<MathStrategySelectorProps> = ({
  onSelect,
  operation
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<MathStrategyType | null>(null);

  const strategies: Strategy[] = [
    {
      id: 'standard-algorithm',
      name: 'Standard Algorithm',
      description: 'Use the traditional method with carrying/borrowing',
      icon: '📝',
      example: operation === 'addition'
        ? '  48\n+ 35\n----\n  83'
        : '  52\n- 27\n----\n  25',
      whenToUse: 'Best for all problems, especially when showing your work'
    },
    {
      id: 'mental-math',
      name: 'Mental Math',
      description: 'Break apart numbers by place value and solve in your head',
      icon: '🧠',
      example: operation === 'addition'
        ? '48 + 35 = (40 + 30) + (8 + 5) = 70 + 13 = 83'
        : '52 - 27 = (50 - 20) + (2 - 7) = 30 - 5 = 25',
      whenToUse: 'Best when you can do it quickly without writing'
    },
    {
      id: 'number-line',
      name: 'Number Line',
      description: 'Jump along a number line by tens and ones',
      icon: '↔️',
      example: operation === 'addition'
        ? '48 → (+30) → 78 → (+5) → 83'
        : '52 → (-20) → 32 → (-7) → 25',
      whenToUse: 'Best for visual learners who like to see jumps'
    },
    {
      id: 'base-ten-blocks',
      name: 'Base-Ten Blocks',
      description: 'Use visual blocks to represent and combine/separate numbers',
      icon: '🟦',
      example: 'Use rods for tens and small squares for ones',
      whenToUse: 'Best when you need to see and touch the numbers'
    }
  ];

  const handleSelect = (strategyId: MathStrategyType) => {
    setSelectedStrategy(strategyId);
  };

  const handleConfirm = () => {
    if (selectedStrategy) {
      onSelect(selectedStrategy);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg max-w-6xl">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">
          Choose Your Strategy!
        </h2>
        <p className="text-lg text-gray-600">
          How do you want to solve this {operation} problem?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Pick the method that works best for you. There's no wrong choice!
        </p>
      </div>

      {/* Strategy cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            onClick={() => handleSelect(strategy.id)}
            className={`
              cursor-pointer p-6 rounded-xl border-4 transition-all duration-200
              ${
                selectedStrategy === strategy.id
                  ? 'border-indigo-600 bg-indigo-100 shadow-xl scale-105'
                  : 'border-gray-300 bg-white hover:border-indigo-400 hover:shadow-lg'
              }
            `}
          >
            {/* Strategy header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="text-5xl">{strategy.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{strategy.name}</h3>
                <p className="text-sm text-gray-600">{strategy.description}</p>
              </div>
            </div>

            {/* Example */}
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">EXAMPLE:</p>
              <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                {strategy.example}
              </pre>
            </div>

            {/* When to use */}
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs font-semibold text-yellow-800 mb-1">WHEN TO USE:</p>
              <p className="text-sm text-gray-700">{strategy.whenToUse}</p>
            </div>

            {/* Selected indicator */}
            {selectedStrategy === strategy.id && (
              <div className="mt-3 flex items-center justify-center gap-2 text-indigo-700 font-bold">
                <span className="text-2xl">✓</span>
                <span>Selected!</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={!selectedStrategy}
        className="px-12 py-4 bg-indigo-600 text-white text-xl font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg mt-4"
      >
        {selectedStrategy ? 'Start Solving!' : 'Select a Strategy First'}
      </button>

      {/* Helpful tip */}
      <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg max-w-2xl">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Tip:</strong> You can try different strategies for different problems.
          The best mathematicians know many ways to solve problems!
        </p>
      </div>
    </div>
  );
};
