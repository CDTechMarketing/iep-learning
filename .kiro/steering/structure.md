# Project Structure

## Directory Organization

```
src/
├── components/          # React components (one per feature/view)
├── utils/              # Utility modules
│   ├── logger.ts       # Privacy-first logging system
│   ├── markdownParser.ts
│   └── unitImporter.ts
├── App.tsx             # Main app component with view routing
├── main.tsx            # React entry point with ErrorBoundary
├── store.ts            # Zustand global state
├── types.ts            # TypeScript type definitions
├── db.ts               # Dexie database schema and initialization
└── index.css           # Tailwind imports and global styles
```

## Architecture Patterns

### State Management
- **Global State**: Zustand store (`store.ts`) for app-wide state (current view, session data, settings)
- **Local State**: React useState for component-specific UI state
- **Persistence**: Dexie/IndexedDB for all data persistence

### Component Structure
- **View Components**: Full-screen components for each app view (Home, ReadingPractice, MathPractice, etc.)
- **Feature Components**: Self-contained components with their own state and logic
- **No Shared Component Library**: Each component is standalone in `/components`

### Database Schema
- **Tables**: units, phrases, mathProblems, scienceProblems, sessionLogs, rewards, settings, logs
- **Versioning**: Dexie migrations for schema changes (currently v3)
- **Seeding**: Initial data loaded on first run

### View Routing
- Simple string-based view switching in App.tsx (no React Router)
- Views: home, reading, math, science, break, rewards, progress, dashboard, settings, units, preview, schedule, choice-boards, session-summary

### Logging System
- **Privacy-First**: All logs stored locally in IndexedDB
- **Levels**: debug, info, warn, error, critical
- **Categories**: app, user-error, performance, etc.
- **Auto-Cleanup**: Logs older than 30 days are automatically deleted

## Naming Conventions

- **Files**: PascalCase for components (`Home.tsx`), camelCase for utilities (`logger.ts`)
- **Components**: PascalCase function components
- **Types/Interfaces**: PascalCase with descriptive names
- **Database IDs**: kebab-case with prefixes (`short-a-001`, `counting-20-29-001`)

## Key Files

- `db.ts`: Database schema, initialization, and seed data
- `store.ts`: Global state management with Zustand
- `types.ts`: All TypeScript interfaces and types
- `App.tsx`: Main view router
- `utils/logger.ts`: Comprehensive logging system
