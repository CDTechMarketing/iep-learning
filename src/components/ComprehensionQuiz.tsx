import React, { useState, useEffect } from 'react';
import { ComprehensionQuestion, ReadingComprehensionPassage } from '../types';
import { CheckCircle, XCircle, Lightbulb, BookOpen, ArrowLeft } from 'lucide-react';

interface ComprehensionQuizProps {
  passage: ReadingComprehensionPassage;
  questions: ComprehensionQuestion[];
  onComplete: (results: QuestionResult[]) => void;
  onBackToPassage: () => void;
  studentId: string;
}

export interface QuestionResult {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  hintsUsed: number;
  timeSpent: number;
}

export default function ComprehensionQuiz({
  passage,
  questions,
  onComplete,
  onBackToPassage,
  studentId
}: ComprehensionQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const allOptions = [
    currentQuestion.correctAnswer,
    ...currentQuestion.distractors
  ].sort(() => Math.random() - 0.5);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  function handleAnswerSelect(answer: string) {
    setSelectedAnswer(answer);
  }

  function handleSubmitAnswer() {
    if (!selectedAnswer) return;

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      hintsUsed: hintsRevealed,
      timeSpent
    };

    setResults([...results, result]);
    setShowFeedback(true);
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setHintsRevealed(0);
    } else {
      onComplete(results);
    }
  }

  function handleShowHint() {
    if (currentQuestion.hints && hintsRevealed < currentQuestion.hints.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  }

  function getSkillIcon(skill: string) {
    const icons: Record<string, string> = {
      'main-idea': '🎯',
      'details': '🔍',
      'sequence': '📝',
      'cause-effect': '⚡',
      'compare-contrast': '⚖️',
      'character-analysis': '👤',
      'prediction': '🔮',
      'author-purpose': '✍️',
      'text-features': '📊'
    };
    return icons[skill] || '❓';
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Question Header */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">{getSkillIcon(currentQuestion.skill)}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {currentQuestion.skill.replace('-', ' ').toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                {currentQuestion.questionType.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {currentQuestion.questionText}
            </h3>
          </div>
        </div>

        {/* Answer Options */}
        {!showFeedback && (
          <div className="space-y-3 mb-6">
            {allOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <span className="font-medium text-gray-800">{option}</span>
              </button>
            ))}
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`p-6 rounded-lg mb-6 ${
              isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle className="text-green-600 flex-shrink-0" size={28} />
              ) : (
                <XCircle className="text-red-600 flex-shrink-0" size={28} />
              )}
              <div>
                <h4 className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Great job! That\'s correct!' : 'Not quite. Let\'s learn from this!'}
                </h4>
                {!isCorrect && (
                  <p className="text-red-700 mb-2">
                    The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                  </p>
                )}
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </div>
            </div>

            {/* Text Evidence */}
            {currentQuestion.textEvidence && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-2">Evidence from the text:</h5>
                <p className="text-gray-700 italic">"{currentQuestion.textEvidence}"</p>
              </div>
            )}
          </div>
        )}

        {/* Hints */}
        {!showFeedback && currentQuestion.hints && currentQuestion.hints.length > 0 && (
          <div className="mb-6">
            {hintsRevealed > 0 && (
              <div className="space-y-2 mb-3">
                {currentQuestion.hints.slice(0, hintsRevealed).map((hint, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                      <p className="text-sm text-gray-700">{hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hintsRevealed < currentQuestion.hints.length && (
              <button
                onClick={handleShowHint}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
              >
                <Lightbulb size={18} />
                Need a hint? ({hintsRevealed + 1}/{currentQuestion.hints.length})
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            onClick={onBackToPassage}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back to Passage
          </button>

          {!showFeedback ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedAnswer
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results →'}
            </button>
          )}
        </div>
      </div>

      {/* Passage Reference Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={20} className="text-blue-600" />
          <span className="font-semibold text-blue-900">Remember the passage:</span>
        </div>
        <p className="text-sm text-blue-800">{passage.title}</p>
        <p className="text-xs text-blue-600 mt-1">
          Click "Go Back to Passage" above to reread the text
        </p>
      </div>
    </div>
  );
}
