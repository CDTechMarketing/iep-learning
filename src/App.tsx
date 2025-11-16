import { useEffect } from 'react';
import { useStore } from './store';
import { initializeDatabase, db } from './db';
import { Home } from './components/Home';
import { ReadingPractice } from './components/ReadingPractice';
import { MathPractice } from './components/MathPractice';
import { SciencePractice } from './components/SciencePractice';
import { Rewards } from './components/Rewards';
import { ParentDashboard } from './components/ParentDashboard';
import { Settings } from './components/Settings';
import { UnitManagement } from './components/UnitManagement';

function App() {
  const { currentView, setSettings } = useStore();

  useEffect(() => {
    async function init() {
      await initializeDatabase();

      const settings = await db.settings.get('default');
      if (settings) {
        setSettings(settings);
      }
    }

    init();
  }, []);

  return (
    <div className="min-h-screen">
      {currentView === 'home' && <Home />}
      {currentView === 'reading' && <ReadingPractice />}
      {currentView === 'math' && <MathPractice />}
      {currentView === 'science' && <SciencePractice />}
      {currentView === 'rewards' && <Rewards />}
      {currentView === 'dashboard' && <ParentDashboard />}
      {currentView === 'settings' && <Settings />}
      {currentView === 'units' && <UnitManagement />}
    </div>
  );
}

export default App;
