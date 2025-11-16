import { useEffect } from 'react';
import { useStore } from './store';
import { initializeDatabase, db } from './db';
import { Home } from './components/Home';
import { ReadingPractice } from './components/ReadingPractice';
import { MathPractice } from './components/MathPractice';
import { Rewards } from './components/Rewards';
import { ParentDashboard } from './components/ParentDashboard';
import { Settings } from './components/Settings';
import { UnitManagement } from './components/UnitManagement';
import { SessionSchedule } from './components/SessionSchedule';
import { ActivityPreview } from './components/ActivityPreview';
import { SensoryBreak } from './components/SensoryBreak';
import { StudentProgress } from './components/StudentProgress';
import { logger } from './utils/logger';

function App() {
  const { currentView, setSettings } = useStore();

  useEffect(() => {
    async function init() {
      const startTime = performance.now();

      try {
        logger.info('app', 'Application initializing...');

        await initializeDatabase();
        logger.info('app', 'Database initialized successfully');

        const settings = await db.settings.get('default');
        if (settings) {
          setSettings(settings);
          logger.info('app', 'Settings loaded', { settingsId: settings.id });
        } else {
          logger.warn('app', 'No settings found in database');
        }

        const initTime = performance.now() - startTime;
        logger.performance('app-initialization', initTime);
        logger.info('app', `Application ready (${Math.round(initTime)}ms)`);
      } catch (error) {
        logger.critical('app', 'Failed to initialize application', error as Error);
        // Still throw to trigger Error Boundary
        throw error;
      }
    }

    init();
  }, []);

  return (
    <div className="min-h-screen">
      {currentView === 'home' && <Home />}
      {currentView === 'schedule' && <SessionSchedule />}
      {currentView === 'preview' && <ActivityPreview />}
      {currentView === 'reading' && <ReadingPractice />}
      {currentView === 'math' && <MathPractice />}
      {currentView === 'break' && <SensoryBreak />}
      {currentView === 'rewards' && <Rewards />}
      {currentView === 'progress' && <StudentProgress />}
      {currentView === 'dashboard' && <ParentDashboard />}
      {currentView === 'settings' && <Settings />}
      {currentView === 'units' && <UnitManagement />}
    </div>
  );
}

export default App;
