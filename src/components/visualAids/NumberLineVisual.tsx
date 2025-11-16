interface NumberLineVisualProps {
  range: [number, number];
  highlighted: number;
  animated?: boolean;
}

export function NumberLineVisual({ range, highlighted, animated = true }: NumberLineVisualProps) {
  const [start, end] = range;
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Number Line</h3>
      <div className="flex items-center justify-center gap-1 overflow-x-auto">
        {numbers.map((num) => (
          <div key={num} className="flex flex-col items-center">
            <div
              className={`
                w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-2xl
                transition-all duration-300
                ${
                  num === highlighted
                    ? 'bg-green-400 border-green-600 text-white scale-125 shadow-lg'
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }
                ${animated && num === highlighted ? 'animate-pulse' : ''}
              `}
            >
              {num}
            </div>
            <div className="h-2 w-px bg-gray-400 mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
