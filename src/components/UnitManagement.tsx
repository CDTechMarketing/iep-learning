import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, BookOpen, Calculator } from 'lucide-react';
import { db } from '../db';
import { Unit } from '../types';
import { useStore } from '../store';
import { importMarkdownUnit } from '../utils/markdownParser';

export function UnitManagement() {
  const { setCurrentView } = useStore();
  const [units, setUnits] = useState<Unit[]>([]);
  const [markdownInput, setMarkdownInput] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    loadUnits();
  }, []);

  async function loadUnits() {
    const unitsData = await db.units.toArray();
    setUnits(unitsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }

  async function handleImport() {
    try {
      setImportStatus('idle');
      setImportMessage('');

      await importMarkdownUnit(markdownInput);

      setImportStatus('success');
      setImportMessage('Unit imported successfully!');
      setMarkdownInput('');

      await loadUnits();

      setTimeout(() => {
        setShowImportDialog(false);
        setImportStatus('idle');
        setImportMessage('');
      }, 2000);
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Import failed');
    }
  }

  async function getUnitStats(unitId: string) {
    const phrasesCount = await db.phrases.where('unitId').equals(unitId).count();
    const mathCount = await db.mathProblems.where('unitId').equals(unitId).count();
    const sessions = await db.sessionLogs.where('unitId').equals(unitId).toArray();
    const totalStars = sessions.reduce((sum, s) => sum + s.starsEarned, 0);

    return { phrasesCount, mathCount, totalStars, sessionCount: sessions.length };
  }

  const [unitStats, setUnitStats] = useState<
    Map<string, { phrasesCount: number; mathCount: number; totalStars: number; sessionCount: number }>
  >(new Map());

  useEffect(() => {
    async function loadStats() {
      const stats = new Map();
      for (const unit of units) {
        const unitStat = await getUnitStats(unit.id);
        stats.set(unit.id, unitStat);
      }
      setUnitStats(stats);
    }
    if (units.length > 0) {
      loadStats();
    }
  }, [units]);

  const exampleMarkdown = `# Unit: Short A — Cat, Sat, Mat
unit-id: short-a-001
goal-stars: [5, 10]

[cvc-words]
- cat
- sat
- mat

[phrases]
- cat sat on the mat
- the cat is fat

[math-identification]
range: 0-20
count: 5

[math-addition]
problems:
- 1+1
- 2+3
- 5+4
manipulatives: blocks`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Unit Management</h1>
          </div>

          <button
            onClick={() => setShowImportDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Import Unit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit) => {
            const stats = unitStats.get(unit.id);
            return (
              <div key={unit.id} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{unit.title}</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {unit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {stats && (
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <span>{stats.phrasesCount} reading exercises</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-purple-600" />
                      <span>{stats.mathCount} math problems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      <span>
                        {stats.totalStars} stars earned ({stats.sessionCount} sessions)
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Goal: {unit.goalStars.join(', ')} stars
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {units.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No units yet. Import a unit to get started!</p>
          </div>
        )}
      </div>

      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Import Unit from Markdown</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Markdown Content
              </label>
              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                placeholder={exampleMarkdown}
                className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
              />
            </div>

            {importStatus !== 'idle' && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  importStatus === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {importMessage}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Example Format:</h3>
              <pre className="text-xs text-gray-600 overflow-x-auto">{exampleMarkdown}</pre>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setMarkdownInput('');
                  setImportStatus('idle');
                  setImportMessage('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!markdownInput.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Import Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
