/**
 * Debug Panel Component
 *
 * Privacy-first debugging interface for parents/teachers
 * View logs, export for troubleshooting, clear old data
 */

import { useState, useEffect } from 'react';
import { logger, LogEntry, LogLevel } from '../utils/logger';
import { Download, Trash2, RefreshCw, AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export function DebugPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStats, setErrorStats] = useState<{
    totalErrors: number;
    errorsByCategory: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    loadLogs();
    loadErrorStats();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, selectedLevel, selectedCategory]);

  async function loadLogs() {
    setIsLoading(true);
    try {
      const allLogs = await logger.getLogs(500);
      setLogs(allLogs);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(allLogs.map(log => log.category))
      ).sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadErrorStats() {
    try {
      const stats = await logger.getErrorStats();
      setErrorStats(stats);
    } catch (error) {
      console.error('Failed to load error stats:', error);
    }
  }

  function filterLogs() {
    let filtered = logs;

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    setFilteredLogs(filtered);
  }

  async function handleExportLogs() {
    try {
      const logsJson = await logger.exportLogs();
      const blob = new Blob([logsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iep-learning-logs-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
      a.click();
      URL.revokeObjectURL(url);

      logger.info('debug-panel', 'Logs exported successfully');
    } catch (error) {
      console.error('Failed to export logs:', error);
      logger.error('debug-panel', 'Failed to export logs', error as Error);
    }
  }

  async function handleClearLogs() {
    if (confirm('Are you sure you want to clear all logs? This cannot be undone.')) {
      try {
        await logger.clearLogs();
        await loadLogs();
        await loadErrorStats();
        logger.info('debug-panel', 'Logs cleared by user');
      } catch (error) {
        console.error('Failed to clear logs:', error);
      }
    }
  }

  function getLevelIcon(level: LogLevel) {
    switch (level) {
      case 'debug':
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'critical':
        return <XCircle className="w-5 h-5" />;
    }
  }

  function getLevelColor(level: LogLevel) {
    switch (level) {
      case 'debug':
        return 'text-gray-500 bg-gray-100';
      case 'info':
        return 'text-blue-700 bg-blue-100';
      case 'warn':
        return 'text-yellow-700 bg-yellow-100';
      case 'error':
        return 'text-orange-700 bg-orange-100';
      case 'critical':
        return 'text-red-700 bg-red-100';
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Debug & Error Logs</h2>
        <p className="text-gray-600">
          View application logs for troubleshooting. All data stored locally for privacy.
        </p>
      </div>

      {/* Error Statistics */}
      {errorStats && errorStats.totalErrors > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Error Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Errors</p>
              <p className="text-2xl font-bold text-red-600">{errorStats.totalErrors}</p>
            </div>
            {Object.entries(errorStats.errorsByCategory).slice(0, 3).map(([category, count]) => (
              <div key={category} className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-600 truncate">{category}</p>
                <p className="text-2xl font-bold text-orange-600">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Level Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'all')}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex-1 flex items-end justify-end gap-2">
          <button
            onClick={loadLogs}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExportLogs}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Log Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredLogs.length} of {logs.length} logs
      </div>

      {/* Logs List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No logs found</p>
            <p className="text-gray-400 text-sm mt-2">
              {selectedLevel !== 'all' || selectedCategory !== 'all'
                ? 'Try changing the filters'
                : 'Logs will appear here as you use the app'}
            </p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <details
              key={log.id || index}
              className={`p-4 rounded-lg border-2 ${getLevelColor(log.level)}`}
            >
              <summary className="cursor-pointer font-semibold flex items-center gap-3">
                {getLevelIcon(log.level)}
                <span className="uppercase text-xs">{log.level}</span>
                <span className="text-gray-600 text-sm">
                  [{format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}]
                </span>
                <span className="text-xs bg-white px-2 py-1 rounded">{log.category}</span>
                <span className="flex-1">{log.message}</span>
              </summary>

              <div className="mt-4 space-y-2 pl-8">
                {log.context && (
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Context:</p>
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  </div>
                )}

                {log.stackTrace && (
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Stack Trace:</p>
                    <pre className="text-xs text-gray-600 overflow-auto font-mono">
                      {log.stackTrace}
                    </pre>
                  </div>
                )}

                {log.userAction && (
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">User Action:</p>
                    <p className="text-sm text-gray-600">{log.userAction}</p>
                  </div>
                )}

                {log.sessionInfo && (
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Session Info:</p>
                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                      {log.sessionInfo.currentView && (
                        <div><strong>View:</strong> {log.sessionInfo.currentView}</div>
                      )}
                      {log.sessionInfo.currentUnit && (
                        <div><strong>Unit:</strong> {log.sessionInfo.currentUnit}</div>
                      )}
                      {log.sessionInfo.sessionStars !== undefined && (
                        <div><strong>Stars:</strong> {log.sessionInfo.sessionStars}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </details>
          ))
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-2">💡 How to Use Debug Logs:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li><strong>Export:</strong> Download logs as JSON file to share with support</li>
          <li><strong>Filter:</strong> Use filters to find specific errors or categories</li>
          <li><strong>Clear:</strong> Remove old logs to free up space (clears logs older than 30 days automatically)</li>
          <li><strong>Privacy:</strong> All logs stored locally on your device - never sent to external servers</li>
        </ul>
      </div>
    </div>
  );
}
