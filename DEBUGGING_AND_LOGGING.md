# Debugging and Error Logging System

## Overview

The IEP Learning application now has comprehensive **privacy-first** error tracking and debugging capabilities. All logs are stored locally in IndexedDB - **no external services** are used to protect student privacy.

## Features

### 1. **Error Boundary** 🛡️
- Catches React component errors before they crash the app
- Shows kid-friendly error message with recovery options
- Logs all errors automatically for troubleshooting
- Provides technical details for parents/teachers

### 2. **Logger Utility** 📝
- Multiple log levels (debug, info, warn, error, critical)
- Automatic performance tracking
- User error tracking (for educational analytics)
- Context-aware logging with session info

### 3. **Debug Panel** 🔍
- View all logs with filtering (level, category, time)
- Export logs as JSON for sharing with support
- Error statistics and summaries
- Privacy-focused (local storage only)

### 4. **Database Integration** 💾
- Logs stored in IndexedDB alongside app data
- Automatic cleanup (removes logs older than 30 days)
- Indexed for fast searching
- Export/import capabilities

---

## How to Use

### For Developers: Adding Logging to Components

#### Import the Logger
```typescript
import { logger } from '../utils/logger';
```

#### Basic Logging
```typescript
// Debug (development only)
logger.debug('component-name', 'Detailed debug info', { someData: 123 });

// Info (user actions, successful operations)
logger.info('math-practice', 'User started math session', { unitId: 'counting-20-29' });

// Warning (recoverable issues)
logger.warn('database', 'Slow query detected', { duration: 2500 });

// Error (failures that don't crash app)
try {
  await someOperation();
} catch (error) {
  logger.error('operation', 'Failed to complete operation', error as Error, {
    userId: 'user-123'
  });
}

// Critical (app crashes, data loss)
logger.critical('app', 'Database connection lost', error as Error);
```

#### Track User Errors (Educational Analytics)
```typescript
// When student gets answer wrong
logger.userError('math-practice', 'problem-123', {
  problemType: 'number-line',
  correctAnswer: 23,
  userAnswer: 25,
  attemptsLeft: 2
});
```

#### Performance Tracking
```typescript
// Manual performance logging
const startTime = performance.now();
await loadData();
const duration = performance.now() - startTime;
logger.performance('load-data', duration, { rowCount: 100 });

// Or use the wrapper
import { withPerformanceLogging } from '../utils/logger';

const loadDataWithLogging = withPerformanceLogging(loadData, 'load-data');
```

#### Error Handling Wrapper
```typescript
import { withErrorLogging } from '../utils/logger';

const safeFetchData = withErrorLogging(
  async (unitId: string) => {
    // Your async function
    return await db.units.get(unitId);
  },
  'database',
  'fetchData'
);
```

---

### For Parents/Teachers: Viewing Logs

#### Accessing the Debug Panel
1. Navigate to **Parent Dashboard**
2. Scroll to the bottom
3. Find the **"Debug & Error Logs"** section

#### Understanding Log Levels

| Level | Icon | Meaning | Example |
|-------|------|---------|---------|
| 🔵 **DEBUG** | ℹ️ | Development info | Internal state changes |
| 🟢 **INFO** | ℹ️ | Normal operations | User started session, saved data |
| 🟡 **WARN** | ⚠️ | Potential issues | Slow performance, deprecated features |
| 🟠 **ERROR** | ⚠️ | Recoverable errors | Failed to load image, network timeout |
| 🔴 **CRITICAL** | ❌ | Severe errors | App crash, data corruption |

#### Filtering Logs
- **Filter by Level**: Show only errors, warnings, etc.
- **Filter by Category**: Show logs from specific features (math-practice, reading, database, etc.)
- **Refresh**: Reload logs from database
- **Export**: Download logs as JSON file
- **Clear**: Remove all logs (can't be undone!)

#### Exporting Logs for Support
1. Click **"Export"** button
2. Save the JSON file
3. Share with support team or developer
4. File contains last 1000 log entries

---

## Log Categories

Common categories you'll see:

- `app` - Application initialization and lifecycle
- `database` - Database operations
- `math-practice` - Math activity logs
- `reading-practice` - Reading activity logs
- `science-practice` - Science activity logs
- `user-error` - Student incorrect answers (for analytics)
- `react-error-boundary` - React component errors
- `debug-panel` - Debug panel operations
- `logger` - Logging system itself
- `performance` - Performance measurements

---

## Privacy & Data Protection

### ✅ What We Store (Locally)
- Error messages and stack traces
- User actions (started session, earned star, etc.)
- Performance metrics
- Application state at time of error

### ❌ What We DON'T Store
- Student personal information (names, ages)
- Passwords or credentials
- External tracking IDs
- Location data

### 🔒 Privacy Guarantees
- **All logs stored locally** in your browser's IndexedDB
- **No external servers** - logs never leave your device
- **No third-party services** (no Sentry, LogRocket, etc.)
- **You control the data** - export or delete anytime
- **FERPA/COPPA compliant** - student data stays on device

---

## Troubleshooting Common Issues

### Error: "Application won't load"
1. Open Parent Dashboard → Debug Panel
2. Filter by level: "Critical" or "Error"
3. Look for errors during app initialization
4. Export logs and share with support

### Error: "White screen after clicking something"
1. The Error Boundary should catch this automatically
2. Click "Try Again" to recover
3. If it persists, click "Go to Home Screen"
4. Export logs from Debug Panel

### Error: "Slow performance"
1. Open Debug Panel
2. Filter by category: "performance"
3. Look for operations taking >2000ms
4. Common culprits: large database queries, image loading

### Error: "Data not saving"
1. Filter by category: "database"
2. Look for errors with "save", "add", or "update"
3. Check browser storage settings
4. Export logs for detailed diagnosis

---

## Best Practices for Developers

### 1. **Log at appropriate levels**
```typescript
// ❌ BAD - Everything as error
logger.error('app', 'User clicked button'); // This is not an error!

// ✅ GOOD - Appropriate levels
logger.info('app', 'User clicked button');
logger.debug('app', 'Button state changed', { newState: 'active' });
logger.error('app', 'Failed to save data', error);
```

### 2. **Provide context**
```typescript
// ❌ BAD - No context
logger.error('math', 'Error occurred');

// ✅ GOOD - Rich context
logger.error('math-practice', 'Failed to load problems', error, {
  unitId: 'counting-20-29',
  problemType: 'number-line',
  attemptNumber: 3
});
```

### 3. **Use consistent categories**
```typescript
// ❌ BAD - Inconsistent naming
logger.info('Math', 'Started');
logger.info('math-practice', 'Problem loaded');
logger.info('mathPractice', 'Session ended');

// ✅ GOOD - Consistent naming
logger.info('math-practice', 'Session started');
logger.info('math-practice', 'Problem loaded');
logger.info('math-practice', 'Session ended');
```

### 4. **Log user errors separately**
```typescript
// For educational analytics - track what students struggle with
logger.userError('reading-practice', 'phrase-cat-sat-mat', {
  phraseText: 'the cat sat',
  errorType: 'incorrect-word',
  incorrectWord: 'cat',
  attemptNumber: 2
});
```

### 5. **Track performance of slow operations**
```typescript
async function loadAllUnits() {
  const start = performance.now();

  const units = await db.units.toArray();

  const duration = performance.now() - start;
  if (duration > 1000) {
    logger.warn('database', 'Slow query: loadAllUnits', {
      duration,
      rowCount: units.length
    });
  }

  return units;
}
```

---

## Error Boundary Usage

### Wrapping Components
The entire app is wrapped in an Error Boundary in `main.tsx`. Individual components can have their own boundaries:

```typescript
import { ErrorBoundary } from './components/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary
      fallback={<div>Custom error message</div>}
      onError={(error, errorInfo) => {
        // Custom error handling
        logger.error('my-component', 'Component error', error);
      }}
    >
      <SomeComplexComponent />
    </ErrorBoundary>
  );
}
```

### Using the HOC Wrapper
```typescript
import { withErrorBoundary } from './components/ErrorBoundary';

function RiskyComponent() {
  // Component that might throw errors
  return <div>...</div>;
}

export default withErrorBoundary(RiskyComponent, {
  onError: (error) => logger.error('risky-component', 'Error caught', error)
});
```

---

## Advanced: Querying Logs Programmatically

```typescript
import { logger } from '../utils/logger';

// Get last 100 error logs
const errors = await logger.getLogs(100, 'error');

// Get logs from specific category
const mathLogs = await logger.getLogsByCategory('math-practice', 50);

// Get error statistics
const stats = await logger.getErrorStats();
console.log(`Total errors: ${stats.totalErrors}`);
console.log('Errors by category:', stats.errorsByCategory);

// Export all logs
const logsJson = await logger.exportLogs();

// Clear all logs
await logger.clearLogs();
```

---

## Database Schema

### Logs Table
```typescript
interface LogEntry {
  id?: number;                     // Auto-increment
  timestamp: Date;                 // When logged
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  category: string;                // Feature category
  message: string;                 // Log message
  context?: Record<string, any>;   // Additional data
  stackTrace?: string;             // Error stack trace
  userAction?: string;             // What user was doing
  sessionInfo?: {                  // App state at time of log
    currentView?: string;
    currentUnit?: string;
    sessionStars?: number;
  };
}
```

### Indexes
- `id` - Primary key (auto-increment)
- `timestamp` - For time-based queries
- `level` - For filtering by severity
- `category` - For filtering by feature

---

## Example Scenarios

### Scenario 1: Student Gets Stuck on Math Problem
```typescript
// In MathPractice.tsx
function handleIncorrectAnswer(problemId: string, userAnswer: number, correctAnswer: number) {
  logger.userError('math-practice', problemId, {
    userAnswer,
    correctAnswer,
    difference: Math.abs(userAnswer - correctAnswer),
    problemType: currentProblem.type,
    attempts: attemptCount
  });

  // Continue with normal error handling...
}
```

### Scenario 2: Database Operation Fails
```typescript
async function saveSessionLog(sessionLog: SessionLog) {
  try {
    await db.sessionLogs.add(sessionLog);
    logger.info('database', 'Session log saved', {
      sessionId: sessionLog.id,
      starsEarned: sessionLog.starsEarned
    });
  } catch (error) {
    logger.error('database', 'Failed to save session log', error as Error, {
      sessionId: sessionLog.id
    });
    throw error; // Re-throw for calling code to handle
  }
}
```

### Scenario 3: Performance Issue Detected
```typescript
useEffect(() => {
  async function loadData() {
    const start = performance.now();

    const units = await db.units.toArray();
    const phrases = await db.phrases.toArray();
    const problems = await db.mathProblems.toArray();

    const duration = performance.now() - start;

    logger.performance('load-all-data', duration, {
      unitCount: units.length,
      phraseCount: phrases.length,
      problemCount: problems.length
    });

    if (duration > 2000) {
      logger.warn('performance', 'Slow data load detected', { duration });
    }
  }

  loadData();
}, []);
```

---

## Future Enhancements

Potential additions to the logging system:

1. **Log Visualization**
   - Charts showing errors over time
   - Performance trends
   - Most common error categories

2. **Automated Error Reporting**
   - Daily digest of errors (local email)
   - Critical error notifications
   - Threshold alerts (>10 errors in hour)

3. **Log Compression**
   - Compress old logs to save space
   - Archive to IndexedDB blob storage

4. **Session Replay** (Privacy-Conscious)
   - Record user interactions (locally)
   - Replay session leading to error
   - Never store sensitive data

5. **Educational Analytics**
   - Heatmaps of common user errors
   - Skill mastery predictions
   - Personalized recommendations

---

## Support & Questions

**For Developers:**
- See code examples in `src/utils/logger.ts`
- Check existing usage in `src/App.tsx`
- Review Error Boundary in `src/components/ErrorBoundary.tsx`

**For Parents/Teachers:**
- Use the Debug Panel in Parent Dashboard
- Export logs when requesting support
- Contact support with exported log file

**Privacy Concerns:**
- All data stored locally
- Logs can be cleared anytime
- Export and review before sharing

---

## Quick Reference

```typescript
// Import
import { logger } from '../utils/logger';

// Basic logging
logger.debug('category', 'message', { data });
logger.info('category', 'message', { data });
logger.warn('category', 'message', { data });
logger.error('category', 'message', error, { data });
logger.critical('category', 'message', error, { data });

// Special cases
logger.userError('activity', 'problemId', { details });
logger.performance('operation', durationMs, { context });

// Query logs
await logger.getLogs(100, 'error');
await logger.getLogsByCategory('math-practice');
await logger.getErrorStats();
await logger.exportLogs();
await logger.clearLogs();
```

---

**Built with privacy and educational excellence in mind.** 🎓🔒
