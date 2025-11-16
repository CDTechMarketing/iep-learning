import { useState, useEffect } from 'react';
import { Star, Volume2, VolumeX, X } from 'lucide-react';
import { db } from '../db';
import { Phrase } from '../types';
import { useStore } from '../store';
import { format } from 'date-fns';

export function ReadingPractice() {
  const { currentUnit, sessionStars, addStar, recordAttempt, settings, setCurrentView } = useStore();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [itemsCompleted, setItemsCompleted] = useState(0);

  useEffect(() => {
    if (currentUnit) {
      loadPhrases();
    }
  }, [currentUnit]);

  useEffect(() => {
    if (settings) {
      setAudioEnabled(settings.audioEnabled);
    }
  }, [settings]);

  useEffect(() => {
    if (settings?.autoAdvance && currentLineIndex < currentPhrase.lines.length - 1) {
      const timer = setTimeout(() => {
        handleNextLine();
      }, settings.autoAdvanceDelay * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, settings?.autoAdvance, settings?.autoAdvanceDelay]);

  async function loadPhrases() {
    if (!currentUnit) return;

    const phrasesData = await db.phrases
      .where('unitId')
      .equals(currentUnit.id)
      .toArray();

    setPhrases(phrasesData);
  }

  const currentPhrase = phrases[currentPhraseIndex];

  if (!currentPhrase) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-2xl text-gray-700 mb-4">Loading phrases...</p>
        </div>
      </div>
    );
  }

  function handleNextLine() {
    if (currentLineIndex < currentPhrase.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else {
      handlePhraseComplete();
    }
  }

  async function handlePhraseComplete() {
    addStar();
    recordAttempt(true);

    const newItemsCompleted = itemsCompleted + 1;
    setItemsCompleted(newItemsCompleted);

    if (settings?.breakPromptInterval && newItemsCompleted % settings.breakPromptInterval === 0) {
      setShowBreakPrompt(true);
      return;
    }

    moveToNextPhrase();
  }

  function moveToNextPhrase() {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
      setCurrentLineIndex(0);
    } else {
      handleSessionComplete();
    }
  }

  function handleBreakContinue() {
    setShowBreakPrompt(false);
    moveToNextPhrase();
  }

  async function handleSessionComplete() {
    if (!currentUnit) return;

    const sessionLog = {
      id: `session-${Date.now()}`,
      unitId: currentUnit.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      starsEarned: sessionStars,
      attempts: itemsCompleted,
      correct: itemsCompleted,
      milestonesReached: currentUnit.goalStars.filter(goal => sessionStars >= goal),
      createdAt: new Date()
    };

    await db.sessionLogs.add(sessionLog);

    useStore.setState({ currentView: 'rewards' });
  }

  function speakText(text: string) {
    if (!audioEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.65;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  function isConsonant(letter: string): boolean {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    return consonants.includes(letter.toLowerCase());
  }

  function getPhoneticPronunciation(letter: string, isLastLetter: boolean): string {
    if (!isLastLetter || !isConsonant(letter)) {
      return letter;
    }

    const phoneticMap: { [key: string]: string } = {
      't': 'tə',
      'd': 'də',
      'p': 'pə',
      'k': 'kə',
      'b': 'bə',
      'g': 'gə',
      'c': 'kə',
      'f': 'fə',
      'l': 'lə',
      'm': 'mə',
      'n': 'nə',
      's': 'sss',
      'z': 'zzz',
      'x': 'ksə',
      'r': 'rə',
      'v': 'və',
      'w': 'wə',
      'y': 'yə',
      'h': 'hə',
      'j': 'jə',
      'q': 'kə'
    };

    return phoneticMap[letter.toLowerCase()] || letter;
  }

  async function speakPhonemes(text: string) {
    if (!audioEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const letters = text.split('');

    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      if (letter.trim() === '') continue;

      const isLastLetter = i === letters.length - 1;
      const pronunciation = getPhoneticPronunciation(letter, isLastLetter);

      if (isLastLetter) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      const utterance = new SpeechSynthesisUtterance(pronunciation);
      utterance.rate = isLastLetter ? 0.3 : 0.5;
      utterance.pitch = isLastLetter ? 1.3 : 1.1;
      utterance.volume = isLastLetter ? 1.0 : 0.95;

      await new Promise<void>((resolve) => {
        utterance.onend = () => {
          setTimeout(resolve, isLastLetter ? 400 : 300);
        };
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    }

    await new Promise(resolve => setTimeout(resolve, 600));

    const wholeWord = new SpeechSynthesisUtterance(text);
    wholeWord.rate = 0.7;
    wholeWord.pitch = 1.0;
    window.speechSynthesis.speak(wholeWord);
  }


  function toggleAudio() {
    setAudioEnabled(!audioEnabled);
  }

  function handleQuitSession() {
    useStore.setState({ currentView: 'home' });
  }

  if (showBreakPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">🎉 Great Job! 🎉</h2>
          <p className="text-3xl text-gray-600 mb-8">You've been working hard!</p>
          <p className="text-2xl text-gray-700 mb-8">Would you like to take a calming break?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <button
              onClick={() => setCurrentView('break')}
              className="p-8 bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-xl"
            >
              <div className="text-6xl mb-3">🧘</div>
              <div className="text-2xl font-bold mb-2">Calming Activities</div>
              <div className="text-lg opacity-90">Breathing, bubbles, or colors</div>
            </button>

            <button
              onClick={handleBreakContinue}
              className="p-8 bg-gradient-to-br from-green-400 to-blue-400 text-white rounded-2xl hover:from-green-500 hover:to-blue-500 transition-all transform hover:scale-105 shadow-xl"
            >
              <div className="text-6xl mb-3">💪</div>
              <div className="text-2xl font-bold mb-2">Quick Stretch</div>
              <div className="text-lg opacity-90">Just a moment, then continue</div>
            </button>
          </div>

          <button
            onClick={handleBreakContinue}
            className="text-xl text-gray-500 hover:text-gray-700 underline"
          >
            Skip break and continue →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col p-8 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {Array.from({ length: sessionStars }).map((_, i) => (
            <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleAudio}
            className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
          >
            {audioEnabled ? (
              <Volume2 className="w-6 h-6 text-blue-600" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-400" />
            )}
          </button>

          <div className="text-lg font-semibold text-gray-600">
            {currentPhraseIndex + 1} / {phrases.length}
          </div>

          <button
            onClick={handleQuitSession}
            className="p-3 rounded-full bg-white shadow-lg hover:bg-red-50 transition-colors"
            title="Quit Session"
          >
            <X className="w-6 h-6 text-gray-600 hover:text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-4xl w-full">
          <div className="space-y-6">
            {currentPhrase.lines.slice(0, currentLineIndex + 1).map((line, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-500 ${
                  index === currentLineIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
                }`}
              >
                <div
                  className={`${
                    settings?.dyslexiaFont ? 'font-mono' : 'font-serif'
                  } font-bold leading-relaxed ${
                    index === currentLineIndex ? 'text-6xl text-blue-900' : 'text-4xl text-gray-600'
                  }`}
                >
                  {line.split(' ').map((word, wordIdx) => (
                    <span key={wordIdx} className="inline-block mx-2">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center gap-6">
            {audioEnabled && currentLineIndex < currentPhrase.lines.length && (
              <>
                <button
                  onClick={() => speakText(currentPhrase.lines[currentLineIndex])}
                  className="px-8 py-4 bg-blue-100 text-blue-700 text-xl rounded-2xl hover:bg-blue-200 transition-colors font-semibold"
                >
                  🔊 Listen
                </button>
                <button
                  onClick={() => speakPhonemes(currentPhrase.lines[currentLineIndex])}
                  className="px-8 py-4 bg-purple-100 text-purple-700 text-xl rounded-2xl hover:bg-purple-200 transition-colors font-semibold"
                >
                  🔤 Sound Out
                </button>
              </>
            )}

            {currentLineIndex < currentPhrase.lines.length - 1 ? (
              <button
                onClick={handleNextLine}
                className="px-12 py-6 bg-green-500 text-white text-2xl rounded-2xl hover:bg-green-600 transition-colors shadow-lg font-semibold"
              >
                Next Word
              </button>
            ) : (
              <button
                onClick={handlePhraseComplete}
                className="px-12 py-6 bg-blue-500 text-white text-2xl rounded-2xl hover:bg-blue-600 transition-colors shadow-lg font-semibold"
              >
                Done! ⭐
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
