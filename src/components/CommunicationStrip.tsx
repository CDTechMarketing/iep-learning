import { useState } from 'react';
import { Droplet, Utensils, Heart, HelpCircle, AlertCircle, Music, Volume2, X } from 'lucide-react';
import { PictureButton } from './PictureButton';
import { useStore } from '../store';

interface Need {
  id: string;
  label: string;
  shortLabel: string;
  icon: any;
  color: string;
  priority: 'low' | 'medium' | 'high';
}

const needs: Need[] = [
  { id: 'water', label: 'I need water', shortLabel: 'Water', icon: Droplet, color: 'blue', priority: 'high' },
  { id: 'food', label: 'I need food', shortLabel: 'Food', icon: Utensils, color: 'orange', priority: 'high' },
  { id: 'bathroom', label: 'I need the bathroom', shortLabel: 'Bathroom', icon: AlertCircle, color: 'red', priority: 'high' },
  { id: 'break', label: 'I need a break', shortLabel: 'Break', icon: Heart, color: 'purple', priority: 'medium' },
  { id: 'help', label: 'I need help', shortLabel: 'Help', icon: HelpCircle, color: 'yellow', priority: 'high' },
  { id: 'quiet', label: 'I need quiet', shortLabel: 'Quiet', icon: Volume2, color: 'green', priority: 'medium' },
  { id: 'music', label: 'I want music', shortLabel: 'Music', icon: Music, color: 'pink', priority: 'low' },
];

interface CommunicationStripProps {
  onClose?: () => void;
  compact?: boolean;
}

export function CommunicationStrip({ onClose, compact = false }: CommunicationStripProps) {
  const { settings } = useStore();
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleNeedSelect = (need: Need) => {
    setSelectedNeed(need);

    // Speak the need
    if (settings?.audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(need.label);
      utterance.rate = 0.9;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    // Show notification
    setShowNotification(true);

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
      setSelectedNeed(null);
    }, 3000);

    // Log the need (in a real app, this could notify a teacher/parent)
    console.log(`Need communicated: ${need.label} at ${new Date().toLocaleTimeString()}`);

    // Store in localStorage for tracking
    try {
      const stored = localStorage.getItem('needsLog');
      const logs = stored ? JSON.parse(stored) : [];
      logs.push({
        id: `need-${Date.now()}`,
        need: need.label,
        priority: need.priority,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('needsLog', JSON.stringify(logs));
    } catch (error) {
      console.error('Error logging need:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-300';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300';
      case 'low':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (compact) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-4 border-blue-500 z-50">
        {/* Notification Banner */}
        {showNotification && selectedNeed && (
          <div className={`p-4 text-center font-bold text-lg ${getPriorityColor(selectedNeed.priority)}`}>
            <div className={settings?.dyslexiaFont ? 'font-mono' : ''}>
              ✓ Communicating: {selectedNeed.label}
            </div>
          </div>
        )}

        {/* Compact Strip */}
        <div className="flex items-center justify-between p-3 overflow-x-auto gap-2">
          <div className="flex gap-2 flex-1 justify-center">
            {needs.map(need => (
              <button
                key={need.id}
                onClick={() => handleNeedSelect(need)}
                className={`
                  flex flex-col items-center justify-center
                  w-20 h-20 p-2
                  rounded-xl
                  ${need.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  ${need.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  ${need.color === 'red' ? 'bg-red-500 hover:bg-red-600' : ''}
                  ${need.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                  ${need.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                  ${need.color === 'green' ? 'bg-green-500 hover:bg-green-600' : ''}
                  ${need.color === 'pink' ? 'bg-pink-500 hover:bg-pink-600' : ''}
                  text-white
                  shadow-lg
                  hover:scale-105
                  transition-all
                  border-2 border-white
                  ${selectedNeed?.id === need.id ? 'ring-4 ring-yellow-400 scale-105' : ''}
                `}
              >
                <need.icon size={28} strokeWidth={2.5} />
                <span className={`text-xs font-bold mt-1 text-center leading-tight ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
                  {need.shortLabel}
                </span>
              </button>
            ))}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close needs bar"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Full page version
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col">
      {/* Notification Banner */}
      {showNotification && selectedNeed && (
        <div className={`p-6 text-center font-bold text-2xl ${getPriorityColor(selectedNeed.priority)} border-b-4`}>
          <div className={settings?.dyslexiaFont ? 'font-mono' : ''}>
            ✓ Your need has been communicated: {selectedNeed.label}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md p-6 text-center">
        <h1 className={`text-3xl font-bold text-gray-800 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
          What Do You Need? 🙋
        </h1>
        <p className={`text-gray-600 mt-2 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
          Tap a button to let us know what you need right now
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-5xl w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {needs.map(need => (
              <div key={need.id} className="relative">
                {need.priority === 'high' && (
                  <div className="absolute -top-2 -right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    ⚠️ Priority
                  </div>
                )}
                <PictureButton
                  icon={need.icon}
                  label={need.shortLabel}
                  color={need.color}
                  size="large"
                  selected={selectedNeed?.id === need.id}
                  onClick={() => handleNeedSelect(need)}
                />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className={`text-lg font-bold text-gray-800 mb-3 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              Priority Levels:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg border-2 border-red-300">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className={`font-semibold ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>High Priority - Immediate attention needed</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-100 rounded-lg border-2 border-yellow-300">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className={`font-semibold ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>Medium Priority - Soon as possible</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg border-2 border-green-300">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className={`font-semibold ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>Low Priority - When convenient</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-100 p-4 text-center">
        <p className={`text-gray-700 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
          💡 Your needs are important. Don't hesitate to communicate them!
        </p>
      </div>
    </div>
  );
}
