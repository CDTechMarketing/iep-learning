import { useEffect, useState } from 'react';

interface VisualTimerProps {
  current: number;
  total: number;
  label?: string;
  showTimeEstimate?: boolean;
}

export function VisualTimer({ current, total, label = 'Progress', showTimeEstimate = false }: VisualTimerProps) {
  const percentage = Math.min((current / total) * 100, 100);
  const remaining = total - current;

  // Estimate time remaining (assuming 30 seconds per item on average)
  const estimatedMinutes = Math.ceil((remaining * 30) / 60);

  // Color based on progress
  const getColor = () => {
    if (percentage >= 80) return 'from-green-400 to-green-500';
    if (percentage >= 50) return 'from-yellow-400 to-yellow-500';
    if (percentage >= 25) return 'from-blue-400 to-blue-500';
    return 'from-purple-400 to-purple-500';
  };

  const getBackgroundColor = () => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 50) return 'bg-yellow-100';
    if (percentage >= 25) return 'bg-blue-100';
    return 'bg-purple-100';
  };

  return (
    <div className={`${getBackgroundColor()} rounded-2xl p-4 shadow-md`}>

      {/* Label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xl font-semibold text-gray-700">
          {label}
        </span>
        <span className="text-2xl font-bold text-gray-800">
          {current} / {total}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-full h-8 overflow-hidden shadow-inner mb-2">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500 ease-out flex items-center justify-end pr-3`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && (
            <span className="text-white font-bold text-lg">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-1 justify-center mb-2">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`h-3 flex-1 max-w-[40px] rounded-full transition-all ${
              index < current
                ? 'bg-gradient-to-r ' + getColor()
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Time Estimate */}
      {showTimeEstimate && remaining > 0 && (
        <div className="text-center text-lg text-gray-600">
          ⏱️ About {estimatedMinutes} {estimatedMinutes === 1 ? 'minute' : 'minutes'} left
        </div>
      )}

      {/* Completion Message */}
      {current === total && (
        <div className="text-center text-2xl font-bold text-green-600 animate-bounce">
          🎉 All Done! 🎉
        </div>
      )}

      {/* Almost Done Message */}
      {remaining > 0 && remaining <= 2 && (
        <div className="text-center text-xl font-semibold text-orange-600">
          🔔 Almost done! Just {remaining} more!
        </div>
      )}

    </div>
  );
}
