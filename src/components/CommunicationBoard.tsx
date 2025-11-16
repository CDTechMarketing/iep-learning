import { useState } from 'react';
import { ArrowLeft, User, Heart, Utensils, Home, Book, Gamepad2, Music, Sun, Moon, Volume2, VolumeX, AlertCircle, CheckCircle, HelpCircle, ThumbsUp } from 'lucide-react';
import { PictureButton } from './PictureButton';
import { useStore } from '../store';

interface CommunicationOption {
  id: string;
  label: string;
  icon: any;
  color: string;
  category: string;
}

const communicationOptions: CommunicationOption[] = [
  // People & Greetings
  { id: 'hello', label: 'Hello', icon: User, color: 'blue', category: 'greetings' },
  { id: 'goodbye', label: 'Goodbye', icon: User, color: 'blue', category: 'greetings' },
  { id: 'please', label: 'Please', icon: Heart, color: 'pink', category: 'greetings' },
  { id: 'thankyou', label: 'Thank You', icon: Heart, color: 'pink', category: 'greetings' },
  { id: 'yes', label: 'Yes', icon: ThumbsUp, color: 'green', category: 'responses' },
  { id: 'no', label: 'No', icon: VolumeX, color: 'red', category: 'responses' },

  // Needs & Activities
  { id: 'eat', label: 'I want to eat', icon: Utensils, color: 'orange', category: 'needs' },
  { id: 'home', label: 'I want to go home', icon: Home, color: 'purple', category: 'needs' },
  { id: 'read', label: 'I want to read', icon: Book, color: 'blue', category: 'activities' },
  { id: 'play', label: 'I want to play', icon: Gamepad2, color: 'green', category: 'activities' },
  { id: 'music', label: 'I want music', icon: Music, color: 'purple', category: 'activities' },

  // States & Conditions
  { id: 'tired', label: 'I am tired', icon: Moon, color: 'purple', category: 'states' },
  { id: 'happy', label: 'I am happy', icon: Sun, color: 'yellow', category: 'states' },
  { id: 'help', label: 'I need help', icon: HelpCircle, color: 'red', category: 'needs' },
  { id: 'break', label: 'I need a break', icon: AlertCircle, color: 'orange', category: 'needs' },
  { id: 'done', label: 'I am done', icon: CheckCircle, color: 'green', category: 'states' },
];

const categories = [
  { id: 'all', label: 'All', color: 'blue' },
  { id: 'greetings', label: 'Greetings', color: 'blue' },
  { id: 'needs', label: 'Needs', color: 'red' },
  { id: 'activities', label: 'Activities', color: 'green' },
  { id: 'responses', label: 'Responses', color: 'purple' },
  { id: 'states', label: 'States', color: 'yellow' },
];

export function CommunicationBoard() {
  const { setCurrentView, settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const filteredOptions = selectedCategory === 'all'
    ? communicationOptions
    : communicationOptions.filter(opt => opt.category === selectedCategory);

  const handleOptionClick = (option: CommunicationOption) => {
    setSelectedMessages(prev => [...prev, option.label]);

    // Automatically speak the full message
    if (settings?.audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(option.label);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearMessages = () => {
    setSelectedMessages([]);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSpeakAll = () => {
    if (selectedMessages.length === 0) return;

    if (settings?.audioEnabled && 'speechSynthesis' in window) {
      const fullMessage = selectedMessages.join('. ');
      const utterance = new SpeechSynthesisUtterance(fullMessage);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col">
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
          Communication Board 🗣️
        </h1>
        <div className="w-24"></div>
      </div>

      {/* Message Display Area */}
      {selectedMessages.length > 0 && (
        <div className="bg-white shadow-lg mx-8 mt-6 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-xl font-bold text-gray-700 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
              Your Message:
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleSpeakAll}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                Speak
              </button>
              <button
                onClick={handleClearMessages}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <div className={`text-2xl text-gray-800 p-4 bg-gray-50 rounded-lg ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
            {selectedMessages.join('. ')}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="flex gap-3 px-8 mt-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all
              ${selectedCategory === category.id
                ? `bg-${category.color}-500 text-white shadow-lg scale-105`
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }
              ${settings?.dyslexiaFont ? 'font-mono' : ''}
            `}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Picture Buttons Grid */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {filteredOptions.map(option => (
            <PictureButton
              key={option.id}
              icon={option.icon}
              label={option.label}
              color={option.color}
              size="large"
              onClick={() => handleOptionClick(option)}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-100 p-4 text-center">
        <p className={`text-gray-700 ${settings?.dyslexiaFont ? 'font-mono' : ''}`}>
          💡 Tap pictures to build your message. Messages will be spoken out loud!
        </p>
      </div>
    </div>
  );
}
