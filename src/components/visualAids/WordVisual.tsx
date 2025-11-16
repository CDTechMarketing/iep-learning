interface WordVisualProps {
  word: string;
  showImage?: boolean;
  showPhonics?: boolean;
}

export function WordVisual({ word, showImage = true, showPhonics = true }: WordVisualProps) {
  // Simple image mapping for common CVC words
  const wordImages: { [key: string]: string } = {
    'cat': '🐱',
    'sat': '🪑',
    'mat': '🧘',
    'bat': '🦇',
    'rat': '🐀',
    'hat': '🎩',
    'dog': '🐶',
    'log': '🪵',
    'frog': '🐸',
    'run': '🏃',
    'sun': '☀️',
    'fun': '🎉',
    'pig': '🐷',
    'big': '📏',
    'dig': '⛏️',
    'hen': '🐔',
    'pen': '🖊️',
    'ten': '🔟',
    'bed': '🛏️',
    'red': '🔴',
    'web': '🕸️'
  };

  const letters = word.split('');
  const emoji = wordImages[word.toLowerCase()];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-md">
      {showImage && emoji && (
        <div className="text-center mb-4">
          <div className="text-8xl mb-2">{emoji}</div>
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-5xl font-bold text-gray-800">{word}</p>
      </div>

      {showPhonics && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 text-center mb-2">Sound it out:</p>
          <div className="flex justify-center gap-2">
            {letters.map((letter, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 border-2 border-blue-300 rounded-lg">
                  <span className="text-2xl font-bold text-blue-900">{letter}</span>
                </div>
                {index < letters.length - 1 && (
                  <span className="text-gray-400 mx-1">-</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
