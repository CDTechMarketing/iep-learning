interface FractionCircleVisualProps {
  totalParts: number;
  shadedParts: number;
  size?: number;
  shadedColor?: string;
  unshadedColor?: string;
  showLabels?: boolean;
}

export function FractionCircleVisual({
  totalParts,
  shadedParts,
  size = 300,
  shadedColor = '#3b82f6',
  unshadedColor = '#e5e7eb',
  showLabels = false
}: FractionCircleVisualProps) {
  const center = size / 2;
  const radius = (size / 2) - 10;

  // Calculate angles for each part
  const anglePerPart = (2 * Math.PI) / totalParts;

  // Generate SVG path for each slice
  const generateSlicePath = (index: number) => {
    const startAngle = index * anglePerPart - Math.PI / 2; // Start from top
    const endAngle = (index + 1) * anglePerPart - Math.PI / 2;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = anglePerPart > Math.PI ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
      >
        {/* Draw each slice */}
        {Array.from({ length: totalParts }).map((_, index) => (
          <g key={index}>
            <path
              d={generateSlicePath(index)}
              fill={index < shadedParts ? shadedColor : unshadedColor}
              stroke="#1f2937"
              strokeWidth="3"
            />
          </g>
        ))}

        {/* Center circle for visual appeal */}
        <circle
          cx={center}
          cy={center}
          r={8}
          fill="white"
          stroke="#1f2937"
          strokeWidth="2"
        />
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
