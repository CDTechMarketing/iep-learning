/**
 * Privacy-First Logger for IEP Learning App
 *
 * All logs stored locally in IndexedDB - NO external services
 * Designed for debugging and parent/teacher troubleshooting
 */

import { db } from '../db';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  id?: number;
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  context?: Record<string, any>;
  stackTrace?: string;
  userAction?: string; // What was the user doing?
  sessionInfo?: {
    currentView?: string;
    currentUnit?: string;
    sessionStars?: number;
  };
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private maxLogsInMemory = 1000; // Prevent memory bloat
  private logBuffer: LogEntry[] = [];

  /**
   * Log a debug message (only in development)
   */
  debug(category: string, message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', category, message, context);
    }
  }

  /**
   * Log informational message (user actions, successful operations)
   */
  info(category: string, message: string, context?: Record<string, any>) {
    this.log('info', category, message, context);
  }

  /**
   * Log warning (recoverable issues, deprecations)
   */
  warn(category: string, message: string, context?: Record<string, any>) {
    this.log('warn', category, message, context);
  }

  /**
   * Log error (failures that don't crash the app)
   */
  error(category: string, message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', category, message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    }, error?.stack);
  }

  /**
   * Log critical error (app crashes, data loss)
   */
  critical(category: string, message: string, error?: Error, context?: Record<string, any>) {
    this.log('critical', category, message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    }, error?.stack);
  }

  /**
   * Log user errors (incorrect answers) - for educational analytics
   */
  userError(activity: string, problemId: string, details: Record<string, any>) {
    this.log('info', 'user-error', `User error in ${activity}`, {
      problemId,
      ...details,
      isUserError: true // Flag for analytics
    });
  }

  /**
   * Track performance metrics
   */
  performance(operation: string, durationMs: number, context?: Record<string, any>) {
    this.log('info', 'performance', `${operation} took ${durationMs}ms`, {
      durationMs,
      operation,
      ...context
    });
  }

  /**
   * Core logging method
   */
  private async log(
    level: LogLevel,
    category: string,
    message: string,
    context?: Record<string, any>,
    stackTrace?: string
  ) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      context,
      stackTrace
    };

    // Console output in development
    if (this.isDevelopment) {
      const style = this.getConsoleStyle(level);
      console.log(
        `%c[${level.toUpperCase()}]%c ${category}: ${message}`,
        style,
        'color: inherit',
        context || ''
      );
      if (stackTrace) {
        console.log('Stack trace:', stackTrace);
      }
    }

    // Add to buffer
    this.logBuffer.push(entry);

    // Persist to database (async, non-blocking)
    try {
      await db.logs.add(entry);

      // Cleanup old logs (keep last 5000)
      await this.cleanupOldLogs();
    } catch (err) {
      // Can't log an error while logging, just console
      console.error('Failed to persist log:', err);
    }

    // Trim buffer if too large
    if (this.logBuffer.length > this.maxLogsInMemory) {
      this.logBuffer = this.logBuffer.slice(-this.maxLogsInMemory);
    }
  }

  /**
   * Get console styling for log level
   */
  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #888; font-weight: normal',
      info: 'color: #2196F3; font-weight: bold',
      warn: 'color: #FF9800; font-weight: bold',
      error: 'color: #F44336; font-weight: bold',
      critical: 'color: white; background-color: #D32F2F; font-weight: bold; padding: 2px 4px'
    };
    return styles[level];
  }

  /**
   * Cleanup logs older than 30 days
   */
  private async cleanupOldLogs() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const count = await db.logs
        .where('timestamp')
        .below(thirtyDaysAgo)
        .delete();

      if (count > 0) {
        this.debug('logger', `Cleaned up ${count} old log entries`);
      }
    } catch (err) {
      console.error('Failed to cleanup logs:', err);
    }
  }

  /**
   * Get recent logs from database
   */
  async getLogs(limit = 100, level?: LogLevel): Promise<LogEntry[]> {
    try {
      let collection = db.logs.orderBy('timestamp').reverse();

      if (level) {
        collection = collection.filter(log => log.level === level);
      }

      return await collection.limit(limit).toArray();
    } catch (err) {
      console.error('Failed to retrieve logs:', err);
      return [];
    }
  }

  /**
   * Get logs by category
   */
  async getLogsByCategory(category: string, limit = 100): Promise<LogEntry[]> {
    try {
      return await db.logs
        .where('category')
        .equals(category)
        .reverse()
        .limit(limit)
        .toArray();
    } catch (err) {
      console.error('Failed to retrieve logs by category:', err);
      return [];
    }
  }

  /**
   * Export logs as JSON (for debugging/support)
   */
  async exportLogs(): Promise<string> {
    try {
      const logs = await db.logs.orderBy('timestamp').reverse().limit(1000).toArray();
      return JSON.stringify(logs, null, 2);
    } catch (err) {
      console.error('Failed to export logs:', err);
      return JSON.stringify({ error: 'Failed to export logs' });
    }
  }

  /**
   * Clear all logs (for privacy/testing)
   */
  async clearLogs(): Promise<void> {
    try {
      await db.logs.clear();
      this.logBuffer = [];
      this.info('logger', 'All logs cleared');
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  }

  /**
   * Get error statistics
   */
  async getErrorStats(): Promise<{
    totalErrors: number;
    errorsByCategory: Record<string, number>;
    recentCriticalErrors: LogEntry[];
  }> {
    try {
      const errors = await db.logs
        .where('level')
        .anyOf(['error', 'critical'])
        .toArray();

      const errorsByCategory: Record<string, number> = {};
      errors.forEach(log => {
        errorsByCategory[log.category] = (errorsByCategory[log.category] || 0) + 1;
      });

      const recentCriticalErrors = await db.logs
        .where('level')
        .equals('critical')
        .reverse()
        .limit(10)
        .toArray();

      return {
        totalErrors: errors.length,
        errorsByCategory,
        recentCriticalErrors
      };
    } catch (err) {
      console.error('Failed to get error stats:', err);
      return {
        totalErrors: 0,
        errorsByCategory: {},
        recentCriticalErrors: []
      };
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Helper to wrap async functions with error logging
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  category: string,
  functionName: string
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error(
        category,
        `Error in ${functionName}`,
        error as Error,
        { args }
      );
      throw error; // Re-throw after logging
    }
  }) as T;
}

// Helper to measure and log performance
export function withPerformanceLogging<T extends (...args: any[]) => any>(
  fn: T,
  operation: string
): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);

    // Handle both sync and async functions
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        logger.performance(operation, duration);
      });
    } else {
      const duration = performance.now() - start;
      logger.performance(operation, duration);
      return result;
    }
  }) as T;
}
