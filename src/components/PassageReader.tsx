import React, { useState, useEffect } from 'react';
import { ReadingComprehensionPassage, VocabularyTerm } from '../types';
import { db } from '../db';
import { BookOpen, Volume2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PassageReaderProps {
  passage: ReadingComprehensionPassage;
  onComplete: () => void;
}

export default function PassageReader({ passage, onComplete }: PassageReaderProps) {
  const [fontSize, setFontSize] = useState(16);
  const [vocabularyTerms, setVocabularyTerms] = useState<VocabularyTerm[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    loadVocabularyTerms();
  }, [passage.id]);

  async function loadVocabularyTerms() {
    const terms = await db.vocabularyTerms
      .where('passageId')
      .equals(passage.id)
      .toArray();
    setVocabularyTerms(terms);
  }

  function increaseFontSize() {
    setFontSize(prev => Math.min(prev + 2, 24));
  }

  function decreaseFontSize() {
    setFontSize(prev => Math.max(prev - 2, 12));
  }

  function handleReadAloud() {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(passage.text);
        utterance.rate = 0.9; // Slightly slower for comprehension
        utterance.pitch = 1;
        utterance.onend = () => setIsReading(false);

        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  }

  function getVocabularyDefinition(word: string): string | undefined {
    const term = vocabularyTerms.find(
      t => t.term.toLowerCase() === word.toLowerCase()
    );
    return term?.definition;
  }

  function handleWordClick(word: string) {
    const definition = getVocabularyDefinition(word);
    if (definition) {
      setSelectedWord(word);
    }
  }

  function renderTextWithVocabulary() {
    const words = passage.text.split(/(\s+)/);

    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      const definition = getVocabularyDefinition(cleanWord);

      if (definition) {
        return (
          <span
            key={index}
            className="vocab-word cursor-pointer border-b-2 border-blue-400 border-dotted text-blue-600 font-medium hover:bg-blue-50 transition-colors"
            onClick={() => handleWordClick(cleanWord)}
            title="Click for definition"
          >
            {word}
          </span>
        );
      }

      return <span key={index}>{word}</span>;
    });
  }

  const selectedTerm = vocabularyTerms.find(
    t => t.term.toLowerCase() === selectedWord?.toLowerCase()
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <BookOpen className="text-blue-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{passage.title}</h2>
            <p className="text-sm text-gray-600">
              {passage.genre.charAt(0).toUpperCase() + passage.genre.slice(1)} • Grade {passage.gradeLevel} • {passage.lexileRange}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={decreaseFontSize}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Decrease font size"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={increaseFontSize}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Increase font size"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleReadAloud}
            className={`p-2 rounded-lg transition-colors ${
              isReading
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={isReading ? 'Stop reading' : 'Read aloud'}
          >
            <Volume2 size={20} />
          </button>
        </div>
      </div>

      {/* Passage Image */}
      {passage.imageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img
            src={passage.imageUrl}
            alt={passage.title}
            className="w-full max-h-64 object-cover"
          />
        </div>
      )}

      {/* Passage Text */}
      <div
        className="passage-text leading-relaxed text-gray-800 mb-6 whitespace-pre-wrap"
        style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
      >
        {renderTextWithVocabulary()}
      </div>

      {/* Text Features (for nonfiction) */}
      {passage.textFeatures && passage.textFeatures.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Text Features:</h3>
          <ul className="space-y-1">
            {passage.textFeatures.map((feature, index) => (
              <li key={index} className="text-sm text-blue-800">
                <span className="font-medium">{feature.type}:</span> {feature.purpose}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vocabulary Popup */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-blue-600 mb-3">
              {selectedTerm.term}
            </h3>
            <p className="text-lg text-gray-800 mb-4">{selectedTerm.definition}</p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-700 italic">
                "{selectedTerm.exampleSentence}"
              </p>
            </div>
            <button
              onClick={() => setSelectedWord(null)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          onClick={handleReadAloud}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <RotateCcw size={18} />
          Reread Passage
        </button>

        <button
          onClick={onComplete}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Ready for Questions →
        </button>
      </div>
    </div>
  );
}
