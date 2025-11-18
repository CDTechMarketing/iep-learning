interface FractionRectangleVisualProps {
  totalParts: number;
  shadedParts: number;
  orientation?: 'horizontal' | 'vertical';
  width?: number;
  height?: number;
  shadedColor?: string;
  unshadedColor?: string;
  showLabels?: boolean;
}

export function FractionRectangleVisual({
  totalParts,
  shadedParts,
  orientation = 'horizontal',
  width = 400,
  height = 100,
  shadedColor = '#10b981',
  unshadedColor = '#e5e7eb',
  showLabels = false
}: FractionRectangleVisualProps) {
  // Swap dimensions if vertical
  const rectWidth = orientation === 'horizontal' ? width : height;
  const rectHeight = orientation === 'horizontal' ? height : width;

  const partWidth = orientation === 'horizontal' ? rectWidth / totalParts : rectWidth;
  const partHeight = orientation === 'horizontal' ? rectHeight : rectHeight / totalParts;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={rectWidth}
        height={rectHeight}
        viewBox={`0 0 ${rectWidth} ${rectHeight}`}
        className="drop-shadow-lg"
      >
        {/* Draw each part */}
        {Array.from({ length: totalParts }).map((_, index) => {
          const x = orientation === 'horizontal' ? index * partWidth : 0;
          const y = orientation === 'horizontal' ? 0 : index * partHeight;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={partWidth}
              height={partHeight}
              fill={index < shadedParts ? shadedColor : unshadedColor}
              stroke="#1f2937"
              strokeWidth="3"
            />
          );
        })}
      </svg>

      {showLabels && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-gray-800">
            {shadedParts}/{totalParts}
          </p>
          <p className="text-sm text-gray-600">
            {shadedParts} out of {totalParts} parts
          </p>
        </div>
      )}
    </div>
  );
}
