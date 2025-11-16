interface TenFrameVisualProps {
  number: number;
  animated?: boolean;
}

export function TenFrameVisual({ number, animated = true }: TenFrameVisualProps) {
  const frames = Math.ceil(number / 10);
  const framesArray = Array.from({ length: frames }, (_, frameIndex) => {
    const startIndex = frameIndex * 10;
    const dotsInFrame = Math.min(10, number - startIndex);
    return dotsInFrame;
  });

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
        Ten Frame {number > 10 && `(${number})`}
      </h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {framesArray.map((dotsCount, frameIndex) => (
          <div
            key={frameIndex}
            className="inline-grid grid-cols-5 grid-rows-2 gap-2 p-3 bg-gray-100 rounded-lg border-2 border-gray-300"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`
                  w-8 h-8 rounded-full border-2
                  transition-all duration-300
                  ${
                    i < dotsCount
                      ? 'bg-blue-500 border-blue-700 shadow-md'
                      : 'bg-white border-gray-400'
                  }
                  ${animated && i < dotsCount ? 'animate-bounce' : ''}
                `}
                style={{
                  animationDelay: animated ? `${i * 0.1}s` : '0s',
                  animationIterationCount: animated ? '1' : '0'
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="text-center mt-4 text-2xl font-bold text-gray-700">{number}</p>
    </div>
  );
}
