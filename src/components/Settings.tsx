import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { db } from '../db';
import { AppSettings } from '../types';
import { useStore } from '../store';

export function Settings() {
  const { setCurrentView, setSettings } = useStore();
  const [localSettings, setLocalSettings] = useState<AppSettings>({
    id: 'default',
    autoAdvance: false,
    autoAdvanceDelay: 5,
    breakPromptInterval: 6,
    audioEnabled: false,
    dyslexiaFont: false,
    childAge: 6,
    masteryCriteria: {
      accuracyThreshold: 80,
      consecutiveSessionsRequired: 3,
      minSessionsBeforeMastery: 5
    }
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const settings = await db.settings.get('default');
    if (settings) {
      setLocalSettings(settings);
      setSettings(settings);
    }
  }

  async function handleSave() {
    setSaveStatus('saving');

    await db.settings.put(localSettings);
    setSettings(localSettings);

    setSaveStatus('saved');

    setTimeout(() => {
      setSaveStatus('idle');
    }, 2000);
  }

  function updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
          </div>

          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg disabled:bg-gray-300"
          >
            <Save className="w-5 h-5" />
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'saved'
              ? 'Saved!'
              : 'Save Settings'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Child Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Child's Age
                </label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  value={localSettings.childAge}
                  onChange={(e) =>
                    updateSetting('childAge', parseInt(e.target.value) || 6)
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Used for AI analysis and personalized recommendations
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Practice Settings</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    Auto-Advance
                  </label>
                  <p className="text-sm text-gray-500">
                    Automatically move to the next line or problem
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('autoAdvance', !localSettings.autoAdvance)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    localSettings.autoAdvance ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      localSettings.autoAdvance ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {localSettings.autoAdvance && (
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Auto-Advance Delay: {localSettings.autoAdvanceDelay}s
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    value={localSettings.autoAdvanceDelay}
                    onChange={(e) =>
                      updateSetting('autoAdvanceDelay', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2s</span>
                    <span>10s</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Break Prompt Interval: Every {localSettings.breakPromptInterval} items
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Show a stretch break reminder after this many completed items
                </p>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={localSettings.breakPromptInterval}
                  onChange={(e) =>
                    updateSetting('breakPromptInterval', parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3 items</span>
                  <span>15 items</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Accessibility</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    Audio Support
                  </label>
                  <p className="text-sm text-gray-500">
                    Enable text-to-speech for phoneme blending
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('audioEnabled', !localSettings.audioEnabled)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    localSettings.audioEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      localSettings.audioEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-1">
                    Dyslexia-Friendly Font
                  </label>
                  <p className="text-sm text-gray-500">
                    Use monospace font for easier reading
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('dyslexiaFont', !localSettings.dyslexiaFont)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    localSettings.dyslexiaFont ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      localSettings.dyslexiaFont ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mastery Tracking</h2>
            <p className="text-sm text-gray-500 mb-6">
              Configure when skills are considered "mastered" for IEP tracking
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Accuracy Threshold: {localSettings.masteryCriteria?.accuracyThreshold || 80}%
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Percentage of correct answers required for mastery
                </p>
                <input
                  type="range"
                  min="60"
                  max="100"
                  step="5"
                  value={localSettings.masteryCriteria?.accuracyThreshold || 80}
                  onChange={(e) => {
                    const newCriteria = {
                      ...(localSettings.masteryCriteria || {
                        accuracyThreshold: 80,
                        consecutiveSessionsRequired: 3,
                        minSessionsBeforeMastery: 5
                      }),
                      accuracyThreshold: parseInt(e.target.value)
                    };
                    updateSetting('masteryCriteria', newCriteria);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>60%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Consecutive Sessions Required: {localSettings.masteryCriteria?.consecutiveSessionsRequired || 3}
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Number of consecutive sessions above threshold
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={localSettings.masteryCriteria?.consecutiveSessionsRequired || 3}
                  onChange={(e) => {
                    const newCriteria = {
                      ...(localSettings.masteryCriteria || {
                        accuracyThreshold: 80,
                        consecutiveSessionsRequired: 3,
                        minSessionsBeforeMastery: 5
                      }),
                      consecutiveSessionsRequired: parseInt(e.target.value)
                    };
                    updateSetting('masteryCriteria', newCriteria);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 session</span>
                  <span>10 sessions</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Minimum Sessions Before Mastery: {localSettings.masteryCriteria?.minSessionsBeforeMastery || 5}
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Minimum total sessions required before skill can be mastered
                </p>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={localSettings.masteryCriteria?.minSessionsBeforeMastery || 5}
                  onChange={(e) => {
                    const newCriteria = {
                      ...(localSettings.masteryCriteria || {
                        accuracyThreshold: 80,
                        consecutiveSessionsRequired: 3,
                        minSessionsBeforeMastery: 5
                      }),
                      minSessionsBeforeMastery: parseInt(e.target.value)
                    };
                    updateSetting('masteryCriteria', newCriteria);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3 sessions</span>
                  <span>15 sessions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Design Principles</h2>
            <div className="space-y-2 text-gray-600">
              <p>✓ Large, high-contrast text for readability</p>
              <p>✓ Big buttons (minimum 40px touch targets)</p>
              <p>✓ Calm color palette to reduce anxiety</p>
              <p>✓ Gentle animations without flashing</p>
              <p>✓ Positive reinforcement, no penalties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
