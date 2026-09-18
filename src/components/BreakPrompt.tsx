interface BreakPromptProps {
  onTakeBreak: () => void;
  onContinue: () => void;
}

export function BreakPrompt({ onTakeBreak, onContinue }: BreakPromptProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">🎉 Great Job! 🎉</h2>
        <p className="text-3xl text-gray-600 mb-8">You've been working hard!</p>
        <p className="text-2xl text-gray-700 mb-8">Would you like to take a calming break?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <button
            onClick={onTakeBreak}
            className="p-8 bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-3">🧘</div>
            <div className="text-2xl font-bold mb-2">Calming Activities</div>
            <div className="text-lg opacity-90">Breathing, bubbles, or colors</div>
          </button>

          <button
            onClick={onContinue}
            className="p-8 bg-gradient-to-br from-green-400 to-blue-400 text-white rounded-2xl hover:from-green-500 hover:to-blue-500 transition-all transform hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-3">💪</div>
            <div className="text-2xl font-bold mb-2">Quick Stretch</div>
            <div className="text-lg opacity-90">Just a moment, then continue</div>
          </button>
        </div>

        <button
          onClick={onContinue}
          className="text-xl text-gray-500 hover:text-gray-700 underline"
        >
          Skip break and continue →
        </button>
      </div>
    </div>
  );
}
