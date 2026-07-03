# Technology Stack

## Core Technologies

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **State Management**: Zustand
- **Database**: Dexie (IndexedDB wrapper)
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Utilities**: date-fns

## Development Tools

- **Linting**: ESLint 9 with TypeScript ESLint
- **Type Checking**: TypeScript 5.5
- **Package Manager**: npm

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Build Configuration

- **Vite Config**: Standard React plugin setup with lucide-react excluded from optimization
- **TypeScript**: Project references pattern (app + node configs)
- **PostCSS**: Tailwind CSS processing with autoprefixer
- **ESLint**: Flat config format with React hooks and refresh plugins

## Browser Support

Modern browsers with IndexedDB support (Chrome, Firefox, Safari, Edge)
