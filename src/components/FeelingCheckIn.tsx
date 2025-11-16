import { useState, useEffect } from 'react';
import { ArrowLeft, Smile, Frown, Meh, Angry, Heart, Zap, Cloud, Sun, Moon, AlertTriangle, Sparkles } from 'lucide-react';
import { PictureButton } from './PictureButton';
import { useStore } from '../store';
import { db } from '../db';
import { format } from 'date-fns';

interface Feeling {
  id: string;
  label: string;
  icon: any;
  color: string;
  intensity: number; // 1-5 scale
}

const feelings: Feeling[] = [
  // Happy feelings
  { id: 'happy', label: 'Happy', icon: Smile, color: 'yellow', intensity: 4 },
  { id: 'excited', label: 'Excited', icon: Sparkles, color: 'orange', intensity: 5 },
  { id: 'content', label: 'Content', icon: Sun, color: 'green', intensity: 3 },
  { id: 'loved', label: 'Loved', icon: Heart, color: 'pink', intensity: 4 },

  // Neutral feelings
  { id: 'okay', label: 'Okay', icon: Meh, color: 'blue', intensity: 3 },
  { id: 'calm', label: 'Calm', icon: Cloud, color: 'blue', intensity: 3 },
  { id: 'tired', label: 'Tired', icon: Moon, color: 'purple', intensity: 2 },

  // Difficult feelings
  { id: 'sad', label: 'Sad', icon: Frown, color: 'blue', intensity: 2 },
  { id: 'angry', label: 'Angry', icon: Angry, color: 'red', intensity: 1 },
  { id: 'frustrated', label: 'Frustrated', icon: AlertTriangle, color: 'orange', intensity: 2 },
  { id: 'worried', label: 'Worried', icon: Cloud, color: 'purple', intensity: 2 },
  { id: 'energetic', label: 'Energetic', icon: Zap, color: 'yellow', intensity: 5 },
];

interface FeelingLog {
  id: string;
  feeling: string;
  intensity: number;
  timestamp: Date;
  note?: string;
}

export function FeelingCheckIn() {
  const { setCurrentView, settings } = useStore();
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [recentFeelings, setRecentFeelings] = useState<FeelingLog[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadRecentFeelings();
  }, []);

  const loadRecentFeelings = async () => {
    try {
      // For now, we'll use localStorage to store feeling logs
      // In a production app, you'd want to add a feelings table to the database
      const stored = localStorage.getItem('feelingLogs');
      if (stored) {
        const logs = JSON.parse(stored);
        setRecentFeelings(logs.slice(-5).reverse()); // Show last 5 feelings
      }
    } catch (error) {
      console.error('Error loading feelings:', error);
    }
  };

  const handleFeelingSelect = (feeling: Feeling) => {
    setSelectedFeeling(feeling);

    // Save the feeling
    const newLog: FeelingLog = {
      id: `feeling-${Date.now()}`,
      feeling: feeling.label,
      intensity: feeling.intensity,
      timestamp: new Date(),
    };

    try {
      const stored = localStorage.getItem('feelingLogs');
      const logs = stored ? JSON.parse(stored) : [];
      logs.push(newLog);
      localStorage.setItem('feelingLogs', JSON.stringify(logs));
      setRecentFeelings([newLog, ...recentFeelings].slice(0, 5));
    } catch (error) {
      console.error('Error saving feeling:', error);
    }

    // Show confirmation
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);

    // Speak confirmation
    if (settings?.audioEnabled && 'speechSynthesis' in window) {
      const message = `Thank you for sharing. You are feeling ${feeling.label}.`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getEmoji = (feelingLabel: string) => {
    const emojiMap: { [key: string]: string } = {
      'Happy': '😊',
      'Excited': '🤩',
      'Content': '😌',
      'Loved': '🥰',
      'Okay': '😐',
      'Calm': '😌',
      'Tired': '😴',
      'Sad': '😢',
      'Angry': '😠',
      'Frustrated': '😤',
      'Worried': '😟',
      'Energetic': '⚡',
    };
    return emojiMap[feelingLabel] || '🙂';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>
        <h1 className={`text-2xl font-bold text-gray-800 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
          How Are You Feeling? 💭
        </h1>
        <div className="w-24"></div>
      </div>

      {/* Confirmation Message */}
      {showConfirmation && selectedFeeling && (
        <div className="bg-green-500 text-white p-4 text-center shadow-lg">
          <p className={`text-xl font-bold ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
            ✓ Thank you for sharing! You are feeling {selectedFeeling.label} {getEmoji(selectedFeeling.label)}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className={`text-2xl font-bold text-gray-800 mb-3 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              Choose how you feel right now:
            </h2>
            <p className={`text-gray-600 text-lg ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              It's okay to have any feeling. Sharing helps us understand you better! 💙
            </p>
          </div>

          {/* Feeling Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {feelings.map(feeling => (
              <PictureButton
                key={feeling.id}
                icon={feeling.icon}
                label={feeling.label}
                color={feeling.color}
                size="large"
                selected={selectedFeeling?.id === feeling.id}
                onClick={() => handleFeelingSelect(feeling)}
              />
            ))}
          </div>

          {/* Recent Feelings History */}
          {recentFeelings.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className={`text-xl font-bold text-gray-800 mb-4 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
                Your Recent Feelings:
              </h3>
              <div className="space-y-3">
                {recentFeelings.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getEmoji(log.feeling)}</span>
                      <div>
                        <p className={`font-semibold text-gray-800 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
                          {log.feeling}
                        </p>
                        <p className={`text-sm text-gray-500 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
                          {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-8 rounded ${
                            i < log.intensity ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-purple-100 p-4 text-center">
        <p className={`text-gray-700 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
          💡 Check in with your feelings anytime. All feelings are valid and important!
        </p>
      </div>
    </div>
  );
}
