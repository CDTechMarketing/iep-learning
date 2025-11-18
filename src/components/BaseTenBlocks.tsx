import React, { useState } from 'react';
import { PlaceValueModel } from '../types';

interface BaseTenBlocksProps {
  initialValue: number;
  onChange?: (tens: number, ones: number) => void;
  interactive?: boolean;
  showLabels?: boolean;
}

/**
 * BaseTenBlocks Component
 * Visual representation of two-digit numbers using base-ten blocks
 * - Rods (blue rectangles) = tens
 * - Units (green squares) = ones
 * Supports interactive manipulation and automatic bundling/unbundling
 */
export const BaseTenBlocks: React.FC<BaseTenBlocksProps> = ({
  initialValue,
  onChange,
  interactive = false,
  showLabels = true
}) => {
  const [tens, setTens] = useState(Math.floor(initialValue / 10));
  const [ones, setOnes] = useState(initialValue % 10);

  // Handle bundling: 10 ones → 1 ten
  const handleBundle = () => {
    if (ones >= 10) {
      const newTens = tens + Math.floor(ones / 10);
      const newOnes = ones % 10;
      setTens(newTens);
      setOnes(newOnes);
      onChange?.(newTens, newOnes);
    }
  };

  // Handle unbundling: 1 ten → 10 ones
  const handleUnbundle = () => {
    if (tens > 0) {
      const newTens = tens - 1;
      const newOnes = ones + 10;
      setTens(newTens);
      setOnes(newOnes);
      onChange?.(newTens, newOnes);
    }
  };

  // Add a ten rod
  const addTen = () => {
    const newTens = tens + 1;
    setTens(newTens);
    onChange?.(newTens, ones);
  };

  // Remove a ten rod
  const removeTen = () => {
    if (tens > 0) {
      const newTens = tens - 1;
      setTens(newTens);
      onChange?.(newTens, ones);
    }
  };

  // Add a ones unit
  const addOne = () => {
    const newOnes = ones + 1;
    setOnes(newOnes);
    onChange?.(tens, newOnes);

    // Auto-bundle if we have 10 or more ones
    if (newOnes >= 10) {
      setTimeout(() => handleBundle(), 500);
    }
  };

  // Remove a ones unit
  const removeOne = () => {
    if (ones > 0) {
      const newOnes = ones - 1;
      setOnes(newOnes);
      onChange?.(tens, newOnes);
    }
  };

  // Render a single tens rod (blue rectangle)
  const TensRod: React.FC<{ index: number }> = ({ index }) => (
    <div
      key={`ten-${index}`}
      className={`w-6 h-24 bg-blue-500 border-2 border-blue-700 rounded-sm ${
        interactive ? 'cursor-pointer hover:bg-blue-400' : ''
      } shadow-md transition-colors flex flex-col items-center justify-around p-1`}
      onClick={interactive ? removeTen : undefined}
      title={interactive ? 'Click to remove' : undefined}
    >
      {/* Show 10 small squares inside to represent 10 ones */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-4 h-1.5 bg-blue-300 rounded-sm"></div>
      ))}
    </div>
  );

  // Render a single ones unit (green square)
  const OnesUnit: React.FC<{ index: number }> = ({ index }) => (
    <div
      key={`one-${index}`}
      className={`w-6 h-6 bg-green-500 border-2 border-green-700 rounded-sm ${
        interactive ? 'cursor-pointer hover:bg-green-400' : ''
      } shadow-md transition-colors`}
      onClick={interactive ? removeOne : undefined}
      title={interactive ? 'Click to remove' : undefined}
    ></div>
  );

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg border-2 border-gray-300">
      {/* Visual display */}
      <div className="flex gap-8 items-start min-h-[200px]">
        {/* Tens column */}
        <div className="flex flex-col items-center gap-3">
          {showLabels && (
            <div className="text-sm font-bold text-blue-700 mb-2">Tens</div>
          )}
          <div className="flex flex-wrap gap-2 max-w-[200px] justify-center">
            {Array.from({ length: tens }).map((_, i) => (
              <TensRod key={i} index={i} />
            ))}
            {tens === 0 && (
              <div className="text-gray-400 italic text-sm">No tens</div>
            )}
          </div>
        </div>

        {/* Ones column */}
        <div className="flex flex-col items-center gap-3">
          {showLabels && (
            <div className="text-sm font-bold text-green-700 mb-2">Ones</div>
          )}
          <div className="flex flex-wrap gap-2 max-w-[200px] justify-center">
            {Array.from({ length: ones }).map((_, i) => (
              <OnesUnit key={i} index={i} />
            ))}
            {ones === 0 && (
              <div className="text-gray-400 italic text-sm">No ones</div>
            )}
          </div>
        </div>
      </div>

      {/* Current value display */}
      <div className="text-2xl font-bold text-gray-800 bg-white px-6 py-2 rounded-lg border-2 border-gray-400">
        {tens} tens + {ones} ones = <span className="text-purple-600">{tens * 10 + ones}</span>
      </div>

      {/* Interactive controls */}
      {interactive && (
        <div className="flex flex-col gap-3 w-full max-w-md">
          {/* Add/Remove controls */}
          <div className="flex gap-4 justify-center">
            <div className="flex flex-col gap-2">
              <button
                onClick={addTen}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-md"
              >
                + Add Ten
              </button>
              <button
                onClick={removeTen}
                disabled={tens === 0}
                className="px-4 py-2 bg-blue-300 text-white rounded-lg hover:bg-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold shadow-md"
              >
                − Remove Ten
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={addOne}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold shadow-md"
              >
                + Add One
              </button>
              <button
                onClick={removeOne}
                disabled={ones === 0}
                className="px-4 py-2 bg-green-300 text-white rounded-lg hover:bg-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold shadow-md"
              >
                − Remove One
              </button>
            </div>
          </div>

          {/* Bundling/Unbundling controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBundle}
              disabled={ones < 10}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold shadow-md flex items-center gap-2"
            >
              <span>Bundle</span>
              {ones >= 10 && (
                <span className="text-xs bg-yellow-400 text-purple-900 px-2 py-1 rounded-full animate-pulse">
                  10 ones → 1 ten
                </span>
              )}
            </button>

            <button
              onClick={handleUnbundle}
              disabled={tens === 0}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold shadow-md"
            >
              Unbundle (1 ten → 10 ones)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
