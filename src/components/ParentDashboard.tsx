import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Sparkles, Check, Upload, X } from 'lucide-react';
import { db } from '../db';
import { SessionLog, Unit, Phrase, MathProblem } from '../types';
import { useStore } from '../store';
import { parseUnitMarkdown, validateMarkdown } from '../utils/unitImporter';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';

interface UnitPerformance {
  unitId: string;
  unitTitle: string;
  accuracy: number;
  attempts: number;
  correct: number;
}

function calculateOverallAccuracy(sessions: SessionLog[]): number {
  if (sessions.length === 0) return 0;
  const totalAttempts = sessions.reduce((sum, s) => sum + s.attempts, 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + s.correct, 0);
  return totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
}

function calculateReadingAccuracy(sessions: SessionLog[], units: Unit[]): number {
  const readingUnits = units.filter(u =>
    u.tags.some(tag => tag.includes('cvc') || tag.includes('short-') || tag.includes('reading'))
  );
  const readingUnitIds = new Set(readingUnits.map(u => u.id));
  const readingSessions = sessions.filter(s => readingUnitIds.has(s.unitId));
  return calculateOverallAccuracy(readingSessions);
}

function calculateMathAccuracy(sessions: SessionLog[], units: Unit[]): number {
  const mathUnits = units.filter(u =>
    u.tags.some(tag => tag.includes('math') || tag.includes('addition') || tag.includes('number'))
  );
  const mathUnitIds = new Set(mathUnits.map(u => u.id));
  const mathSessions = sessions.filter(s => mathUnitIds.has(s.unitId));
  return calculateOverallAccuracy(mathSessions);
}

function analyzeUnitPerformance(sessions: SessionLog[], units: Unit[]): UnitPerformance[] {
  const unitMap = new Map<string, { attempts: number; correct: number }>();

  sessions.forEach(session => {
    const existing = unitMap.get(session.unitId);
    if (existing) {
      existing.attempts += session.attempts;
      existing.correct += session.correct;
    } else {
      unitMap.set(session.unitId, {
        attempts: session.attempts,
        correct: session.correct
      });
    }
  });

  return Array.from(unitMap.entries()).map(([unitId, data]) => {
    const unit = units.find(u => u.id === unitId);
    return {
      unitId,
      unitTitle: unit?.title || 'Unknown Unit',
      accuracy: data.attempts > 0 ? (data.correct / data.attempts) * 100 : 0,
      attempts: data.attempts,
      correct: data.correct
    };
  }).sort((a, b) => b.accuracy - a.accuracy);
}

function formatAIAnalysisPrompt(
  sessions: SessionLog[],
  units: Unit[],
  childAge: number,
  dateRangeText: string
): string {
  const overallAccuracy = calculateOverallAccuracy(sessions);
  const readingAccuracy = calculateReadingAccuracy(sessions, units);
  const mathAccuracy = calculateMathAccuracy(sessions, units);
  const totalStars = sessions.reduce((sum, s) => sum + s.starsEarned, 0);
  const unitPerformance = analyzeUnitPerformance(sessions, units);

  const strengths = unitPerformance.filter(u => u.accuracy > 80);
  const challenges = unitPerformance.filter(u => u.accuracy < 70);

  const lowPerformanceAreas = challenges.map(c => c.unitTitle).join(', ') || 'none identified';

  const prompt = `# LEARNING PERFORMANCE ANALYSIS REQUEST

Child: ${childAge} years old
${dateRangeText}
Sessions Completed: ${sessions.length}

PERFORMANCE SUMMARY:
- Overall Accuracy: ${overallAccuracy.toFixed(1)}%
- Reading Accuracy: ${readingAccuracy.toFixed(1)}%
- Math Accuracy: ${mathAccuracy.toFixed(1)}%
- Total Stars Earned: ${totalStars}

STRENGTHS (>80% accuracy):
${strengths.length > 0 ? strengths.map(s => `- ${s.unitTitle} (${s.accuracy.toFixed(1)}%)`).join('\n') : '- No units above 80% yet'}

CHALLENGES (<70% accuracy):
${challenges.length > 0 ? challenges.map(c => `- ${c.unitTitle} (${c.accuracy.toFixed(1)}%)`).join('\n') : '- No units below 70%'}

QUESTIONS FOR AI ANALYSIS:
1. Based on the performance data, is the child ready to progress to more advanced concepts?
2. Why might the child be struggling with ${lowPerformanceAreas}? What strategies would help?
3. What should be the focus for the next week of learning?
4. Are there any patterns in the data that suggest specific learning needs or preferences?
5. How does the performance compare to typical expectations for a ${childAge}-year-old?

REQUEST: Please analyze these performance patterns and generate 2-3 custom learning units in markdown format optimized for the child's current level. Each unit should target identified needs while building on demonstrated strengths.

FULL DATA (JSON):
${JSON.stringify({
  exportDate: new Date().toISOString(),
  childAge,
  dateRange: dateRangeText,
  totalStars,
  sessionsCompleted: sessions.length,
  overallAccuracy: overallAccuracy.toFixed(1) + '%',
  readingAccuracy: readingAccuracy.toFixed(1) + '%',
  mathAccuracy: mathAccuracy.toFixed(1) + '%',
  unitPerformance: unitPerformance.map(u => ({
    unit: u.unitTitle,
    accuracy: u.accuracy.toFixed(1) + '%',
    attempts: u.attempts,
    correct: u.correct
  })),
  sessions: sessions.map(s => ({
    date: s.date,
    unitId: s.unitId,
    starsEarned: s.starsEarned,
    attempts: s.attempts,
    correct: s.correct,
    accuracy: ((s.correct / s.attempts) * 100).toFixed(1) + '%'
  }))
}, null, 2)}`;

  return prompt;
}

export function ParentDashboard() {
  const { setCurrentView } = useStore();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [totalStars, setTotalStars] = useState(0);
  const [totalMilestones, setTotalMilestones] = useState(0);
  const [lastSession, setLastSession] = useState<SessionLog | null>(null);
  const [childAge, setChildAge] = useState(6);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [markdownInput, setMarkdownInput] = useState<string>('');
  const [importError, setImportError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [selectedUnit, timeRange, customStartDate, customEndDate]);

  async function loadData() {
    const unitsData = await db.units.toArray();
    setUnits(unitsData);

    const settings = await db.settings.get('default');
    if (settings) {
      setChildAge(settings.childAge);
    }

    let query = db.sessionLogs.toArray();
    let allSessions = await query;

    if (selectedUnit !== 'all') {
      allSessions = allSessions.filter((s) => s.unitId === selectedUnit);
    }

    const now = new Date();
    if (timeRange === 'week') {
      const weekStart = startOfWeek(now);
      allSessions = allSessions.filter((s) => new Date(s.date) >= weekStart);
    } else if (timeRange === 'month') {
      const monthStart = startOfMonth(now);
      allSessions = allSessions.filter((s) => new Date(s.date) >= monthStart);
    } else if (timeRange === 'custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      allSessions = allSessions.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= start && sessionDate <= end;
      });
    }

    allSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setSessions(allSessions);

    const stars = allSessions.reduce((sum, s) => sum + s.starsEarned, 0);
    setTotalStars(stars);

    const milestones = allSessions.reduce(
      (sum, s) => sum + s.milestonesReached.length,
      0
    );
    setTotalMilestones(milestones);

    setLastSession(allSessions[0] || null);
  }

  function getChartData() {
    const dateMap = new Map<string, { date: string; stars: number; attempts: number }>();

    sessions.forEach((session) => {
      const existing = dateMap.get(session.date);
      if (existing) {
        existing.stars += session.starsEarned;
        existing.attempts += session.attempts;
      } else {
        dateMap.set(session.date, {
          date: session.date,
          stars: session.starsEarned,
          attempts: session.attempts
        });
      }
    });

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  function getCumulativeData() {
    const chartData = getChartData();
    let cumulative = 0;

    return chartData.map((item) => {
      cumulative += item.stars;
      return {
        date: item.date,
        total: cumulative
      };
    });
  }

  function getDateRangeText(): string {
    if (timeRange === 'week') {
      return `Week: ${format(startOfWeek(new Date()), 'MMM d')} - ${format(new Date(), 'MMM d, yyyy')}`;
    } else if (timeRange === 'month') {
      return `Month: ${format(startOfMonth(new Date()), 'MMM d')} - ${format(new Date(), 'MMM d, yyyy')}`;
    } else if (timeRange === 'custom' && customStartDate && customEndDate) {
      return `Custom Range: ${format(new Date(customStartDate), 'MMM d')} - ${format(new Date(customEndDate), 'MMM d, yyyy')}`;
    }
    return 'All Time';
  }

  function showToastNotification(message: string) {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  }

  async function handleExport() {
    const data = {
      exportDate: new Date().toISOString(),
      totalStars,
      totalMilestones,
      sessions: sessions.map((s) => ({
        date: s.date,
        unitId: s.unitId,
        starsEarned: s.starsEarned,
        attempts: s.attempts,
        correct: s.correct,
        accuracy: ((s.correct / s.attempts) * 100).toFixed(1) + '%'
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-progress-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExportForAI() {
    const data = {
      exportDate: new Date().toISOString(),
      totalStars,
      totalMilestones,
      sessions: sessions.map((s) => ({
        date: s.date,
        unitId: s.unitId,
        starsEarned: s.starsEarned,
        attempts: s.attempts,
        correct: s.correct,
        accuracy: ((s.correct / s.attempts) * 100).toFixed(1) + '%'
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const aiPrompt = formatAIAnalysisPrompt(sessions, units, childAge, getDateRangeText());

    try {
      await navigator.clipboard.writeText(aiPrompt);
      showToastNotification('Data exported! AI prompt copied to clipboard. Paste into Claude for analysis.');
    } catch (err) {
      showToastNotification('Data exported! However, clipboard copy failed. Please try again.');
      console.error('Clipboard copy failed:', err);
    }
  }

  function handleOpenImportModal() {
    setShowImportModal(true);
    setMarkdownInput('');
    setImportError('');
  }

  function handleCloseImportModal() {
    setShowImportModal(false);
    setMarkdownInput('');
    setImportError('');
  }

  async function handleImportUnit() {
    setImportError('');

    const validation = validateMarkdown(markdownInput);
    if (!validation.valid) {
      setImportError(validation.error || 'Invalid markdown format');
      return;
    }

    try {
      const parsed = parseUnitMarkdown(markdownInput);

      const existingUnit = await db.units.get(parsed.unitId);
      if (existingUnit) {
        setImportError(`A unit with ID "${parsed.unitId}" already exists. Please use a different unit-id.`);
        return;
      }

      const unit: Unit = {
        id: parsed.unitId,
        title: parsed.title,
        tags: parsed.tags,
        goalStars: parsed.goalStars,
        createdAt: new Date()
      };

      await db.units.add(unit);

      if (parsed.cvcWords.length > 0 || parsed.phrases.length > 0) {
        const phrasesToAdd: Phrase[] = [];

        parsed.cvcWords.forEach((word, idx) => {
          phrasesToAdd.push({
            id: `${parsed.unitId}-cvc-${idx + 1}`,
            unitId: parsed.unitId,
            lines: [word]
          });
        });

        parsed.phrases.forEach((phrase, idx) => {
          phrasesToAdd.push({
            id: `${parsed.unitId}-phrase-${idx + 1}`,
            unitId: parsed.unitId,
            lines: [phrase]
          });
        });

        if (phrasesToAdd.length > 0) {
          await db.phrases.bulkAdd(phrasesToAdd);
        }
      }

      if (parsed.mathProblems.length > 0) {
        const mathToAdd: MathProblem[] = parsed.mathProblems.map((prob, idx) => ({
          id: `${parsed.unitId}-add-${idx + 1}`,
          unitId: parsed.unitId,
          type: 'addition' as const,
          prompt: prob.prompt,
          answer: prob.answer,
          manipulatives: 'blocks' as const
        }));

        await db.mathProblems.bulkAdd(mathToAdd);
      }

      showToastNotification(`Unit '${parsed.title}' imported successfully!`);
      handleCloseImportModal();
      await loadData();
    } catch (error) {
      if (error instanceof Error) {
        setImportError(error.message);
      } else {
        setImportError('Failed to import unit. Please check the markdown format.');
      }
      console.error('Import error:', error);
    }
  }

  const chartData = getChartData();
  const cumulativeData = getCumulativeData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Parent Dashboard</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleOpenImportModal}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
            >
              <Upload className="w-5 h-5" />
              Import Unit
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
            <button
              onClick={handleExportForAI}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-colors shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Export for AI Analysis
            </button>
          </div>
        </div>

        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Import Learning Unit</h2>
                <button
                  onClick={handleCloseImportModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-gray-600 mb-4">
                  Paste markdown content generated by AI. Required format:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm font-mono text-gray-700">
                  <pre>{`---
unit-id: example-unit-001
title: "Example Unit"
goal-stars: [10, 20, 30]
---

## CVC Words
- cat
- sat

## Phrases
- the cat sat

## Math Problems
### Addition
- 2+2
- 3+1`}</pre>
                </div>

                <textarea
                  value={markdownInput}
                  onChange={(e) => setMarkdownInput(e.target.value)}
                  placeholder="Paste your markdown here..."
                  className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm resize-none"
                />

                {importError && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">{importError}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={handleCloseImportModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportUnit}
                  disabled={!markdownInput.trim()}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Import Unit
                </button>
              </div>
            </div>
          </div>
        )}

        {showToast && (
          <div className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-md animate-fade-in">
            <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{toastMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Stars</h3>
            <p className="text-5xl font-bold text-yellow-500">{totalStars}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Milestones Reached</h3>
            <p className="text-5xl font-bold text-green-500">{totalMilestones}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Last Session</h3>
            {lastSession ? (
              <div>
                <p className="text-2xl font-bold text-blue-500">
                  {lastSession.starsEarned} stars
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(lastSession.date), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Accuracy: {((lastSession.correct / lastSession.attempts) * 100).toFixed(0)}%
                </p>
              </div>
            ) : (
              <p className="text-gray-400">No sessions yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Filter by Unit
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Units</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Time Range
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === 'week'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === 'month'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setTimeRange('custom')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === 'custom'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>

            {timeRange === 'custom' && (
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Stars per Session</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                />
                <Legend />
                <Bar dataKey="stars" fill="#3B82F6" name="Stars Earned" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">
              No session data available for this selection
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cumulative Progress</h2>
          {cumulativeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Total Stars"
                  dot={{ fill: '#10B981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">
              No cumulative data available for this selection
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
