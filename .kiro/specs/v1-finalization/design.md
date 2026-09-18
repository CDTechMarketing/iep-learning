# Design Document: v1.0 Finalization

## Overview

This design outlines the approach for finalizing version 1.0 of the IEP Learning application. The work involves three main categories: code removal (science features), code quality improvements (TypeScript diagnostics), and validation (user flows and production readiness).

The design follows a systematic approach:
1. Identify and remove all science-related code across the codebase
2. Resolve TypeScript errors and warnings through proper typing and cleanup
3. Validate all core user flows through manual testing and automated checks
4. Ensure production build succeeds and runtime is error-free

This is primarily a cleanup and validation effort rather than new feature development. The goal is to ship a stable, production-ready v1.0 with only complete and tested features.

## Architecture

### Affected Layers

The v1.0 finalization work touches multiple architectural layers:

**Type System Layer** (`src/types.ts`)
- Remove ScienceProblem interface and related types
- Ensure all remaining types are properly defined and used

**Data Layer** (`src/db.ts`)
- Remove scienceProblems table from Dexie schema
- Remove science-related seed data
- Ensure database version migration is handled correctly

**State Management Layer** (`src/store.ts`)
- Remove 'science' from view type unions
- Ensure state transitions only reference valid v1.0 views

**Routing Layer** (`src/App.tsx`)
- Remove science view case from routing logic
- Ensure all remaining routes are properly typed

**Component Layer**
- Remove science references from ActivityPreview component
- Remove science references from ChoiceBoards component
- Clean up unused imports across all components

### Removal Strategy

The removal of science features follows a bottom-up approach:

1. **Types First**: Remove type definitions to cause compilation errors at usage sites
2. **Database Schema**: Remove table definitions and seed data
3. **State Management**: Remove view types and state properties
4. **Components**: Remove UI elements and navigation options
5. **Routing**: Remove view routing logic

This approach ensures that the TypeScript compiler helps identify all locations that need updates.

## Components and Interfaces

### Modified Components

**types.ts**
- Remove: `ScienceProblem` interface
- Remove: Any science-related type unions or enums
- Verify: All remaining types are used and properly defined

**db.ts**
- Remove: `scienceProblems` table from schema
- Remove: Science-related seed data from initialization
- Update: Database version if schema changes require migration
- Verify: All table relationships remain valid

**store.ts**
- Remove: `'science'` from view type union
- Verify: All state properties are properly typed
- Verify: No orphaned state related to science features

**App.tsx**
- Remove: Science view case from routing switch/conditional
- Verify: All remaining view routes are handled
- Verify: Default/fallback routing works correctly

**ActivityPreview.tsx**
- Remove: Science activity type handling
- Remove: Science navigation buttons/links
- Verify: All remaining activity types render correctly

**ChoiceBoards.tsx**
- Remove: Science option from choice board grid
- Verify: Grid layout remains balanced with remaining options
- Verify: All remaining choices navigate correctly

### TypeScript Diagnostic Resolution

**Common Issues to Address:**

1. **Unused Imports**
   - Scan all files for imports that are no longer referenced
   - Remove unused imports to eliminate warnings

2. **Unused Variables**
   - Identify variables declared but never used
   - Remove or prefix with underscore if intentionally unused

3. **Missing Type Annotations**
   - Add explicit return types to functions where inferred types are unclear
   - Add type annotations to parameters where needed

4. **Type Mismatches**
   - Resolve any type incompatibilities revealed by removing science types
   - Ensure component props match their interface definitions

## Data Models

### Database Schema (v1.0)

The v1.0 database schema includes only the following tables:

```typescript
// Dexie schema definition
{
  units: '++id, type, level',
  phrases: '++id, unitId',
  mathProblems: '++id, unitId, type',
  sessionLogs: '++id, timestamp, activityType',
  rewards: '++id, timestamp',
  settings: 'key',
  logs: '++id, timestamp, level, category'
}
```

**Removed from v1.0:**
- `scienceProblems` table (deferred to v1.1)

### Type Definitions (v1.0)

**Core Activity Types:**
```typescript
type ActivityType = 'reading' | 'math';
// Note: 'science' removed from v1.0

type ViewType = 
  | 'home' 
  | 'reading' 
  | 'math' 
  | 'break' 
  | 'rewards' 
  | 'progress' 
  | 'dashboard' 
  | 'settings' 
  | 'units' 
  | 'preview' 
  | 'schedule' 
  | 'choice-boards' 
  | 'session-summary';
// Note: 'science' removed from v1.0
```

**Retained Interfaces:**
- `Unit` - Learning unit definition
- `Phrase` - Reading phrase data
- `MathProblem` - Math problem data
- `SessionLog` - Activity session tracking
- `Reward` - Reward system data
- `Settings` - User preferences
- `LogEntry` - Application logging

**Removed Interfaces:**
- `ScienceProblem` - Deferred to v1.1

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Properties

Property 1: Science code absence
*For any* source file in the application, searching for science-related identifiers (ScienceProblem, scienceProblems, 'science' view type, science components) should return no matches
**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 6.2, 6.4, 7.2, 8.1, 8.2, 8.3, 8.5**

Property 2: TypeScript compilation success
*For any* TypeScript compilation run, the compiler should produce zero errors and zero warnings
**Validates: Requirements 2.1, 2.2**

Property 3: No unused imports
*For any* source file in the application, all imported modules should be referenced at least once in the file
**Validates: Requirements 2.3**

Property 4: No unused variables
*For any* source file in the application, all declared variables should be referenced at least once in the file
**Validates: Requirements 2.4**

Property 5: Component props are typed
*For any* React component in the application, the component should have an explicit TypeScript interface or type definition for its props
**Validates: Requirements 2.6**

Property 6: Settings persistence
*For any* setting modification, saving the setting should persist it to the database and applying it should reflect the change immediately in the UI
**Validates: Requirements 3.4**

Property 7: Reward system consistency
*For any* completed activity (reading or math), the application should award stars and update the reward system state correctly
**Validates: Requirements 3.7**

Property 8: Production build success
*For any* production build execution, the build command should complete with exit code 0, no errors, and no warnings
**Validates: Requirements 4.1, 4.2**

Property 9: Navigation error-free
*For any* view transition in the application, navigating from one view to another should not produce console errors
**Validates: Requirements 5.2**

Property 10: Database error handling
*For any* database operation (read, write, update, delete), errors should be caught and handled gracefully without producing console errors
**Validates: Requirements 5.4**

Property 11: View transition validity
*For any* view transition request, the application should only transition to views that are defined in the v1.0 ViewType union
**Validates: Requirements 7.4**

Property 12: State persistence
*For any* state change in core features, the state should be correctly persisted to storage and restored on application reload
**Validates: Requirements 7.5**

Property 13: Activity list filtering
*For any* component that renders activity lists, the rendered list should not include any science activity types
**Validates: Requirements 8.4**

### Example-Based Tests

The following acceptance criteria are best validated through specific example tests rather than property-based tests:

**Science Removal Validation:**
- Verify ScienceProblem interface is not in types.ts (Requirement 1.1)
- Verify scienceProblems table is not in database schema (Requirement 1.2)
- Verify 'science' is not in ViewType union (Requirement 1.3)
- Verify no science routing in App.tsx (Requirement 1.4)
- Verify no science options in ActivityPreview (Requirement 1.5)
- Verify no science options in ChoiceBoards (Requirement 1.6)
- Verify database initialization doesn't create science tables (Requirement 1.7)
- Verify no commented science code remains (Requirement 8.5)

**User Flow Validation:**
- Test Home → Reading Practice → Session Summary flow (Requirement 3.1)
- Test Home → Math Practice → Session Summary flow (Requirement 3.2)
- Test Home → Choice Boards → Activity → Summary flow (Requirement 3.3)
- Test Parent Dashboard displays data (Requirement 3.5)
- Test Unit Management create/edit operations (Requirement 3.6)
- Test sensory break flow (Requirement 3.8)

**Build Validation:**
- Verify production build includes all assets (Requirement 4.3)
- Verify production build is minified (Requirement 4.4)
- Verify production build loads without errors (Requirement 4.5)
- Verify application starts without console errors (Requirement 5.1)

**Database Schema Validation:**
- Verify only core feature tables are defined (Requirement 6.1)
- Verify database initialization creates only core tables (Requirement 6.3)

**State Management Validation:**
- Verify only core feature view types are defined (Requirement 7.1)
- Verify state initialization doesn't create science properties (Requirement 7.3)

**Error Handling Validation:**
- Verify errors are logged to local system and display user-friendly messages (Requirement 5.5)

## Error Handling

### Science Feature Removal Errors

**Potential Issue**: Removing science types may cause compilation errors at usage sites

**Handling Strategy**:
1. Remove type definitions first to surface all usage locations
2. Use TypeScript compiler errors as a checklist
3. Systematically remove each usage
4. Verify compilation succeeds after each major removal

### Database Migration Errors

**Potential Issue**: Removing a table from the schema may cause issues for existing users with science data

**Handling Strategy**:
1. Increment database version number
2. Add migration logic to drop scienceProblems table if it exists
3. Ensure migration is idempotent (safe to run multiple times)
4. Test migration with a database that has science data

### Runtime Navigation Errors

**Potential Issue**: Existing state or URLs may reference 'science' view

**Handling Strategy**:
1. Add fallback logic in view routing to redirect invalid views to home
2. Clear any persisted state that references 'science' view
3. Add defensive checks before view transitions

### Build Errors

**Potential Issue**: Unused imports or type errors may cause build failures

**Handling Strategy**:
1. Run TypeScript compiler in strict mode
2. Use ESLint to identify unused imports and variables
3. Fix all diagnostics before attempting production build
4. Test production build locally before deployment

## Testing Strategy

### Dual Testing Approach

This v1.0 finalization work requires both **unit tests** and **property-based tests** to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of science code removal (checking specific files)
- Specific user flows (Home → Reading → Summary)
- Specific build validation checks (production build succeeds)
- Edge cases and error conditions

**Property-Based Tests** focus on:
- Universal properties across all files (no unused imports in ANY file)
- Universal properties across all activities (rewards work for ANY activity)
- Universal properties across all views (navigation works for ANY view transition)
- Universal properties across all database operations (errors handled for ANY operation)

### Property-Based Testing Configuration

**Library Selection**: For TypeScript/JavaScript, we will use **fast-check** as the property-based testing library.

**Test Configuration**:
- Each property test must run a minimum of 100 iterations
- Each test must be tagged with a comment referencing the design property
- Tag format: `// Feature: v1-finalization, Property N: [property text]`

**Example Property Test Structure**:
```typescript
// Feature: v1-finalization, Property 7: Reward system consistency
test('rewards are awarded for any completed activity', () => {
  fc.assert(
    fc.property(
      fc.oneof(fc.constant('reading'), fc.constant('math')),
      fc.record({ /* activity data */ }),
      (activityType, activityData) => {
        // Complete activity
        // Verify stars awarded
        // Verify reward system updated
      }
    ),
    { numRuns: 100 }
  );
});
```

### Manual Testing Checklist

In addition to automated tests, the following manual testing is required:

**User Flow Testing**:
1. Complete a reading practice session from start to finish
2. Complete a math practice session from start to finish
3. Use choice boards to select and complete an activity
4. Modify settings and verify they persist
5. View parent dashboard and verify data displays
6. Create and edit units in unit management
7. Take a sensory break and return to session
8. Earn rewards and view reward milestones

**Visual Inspection**:
1. Verify no science options appear in any UI
2. Verify choice boards layout is balanced without science
3. Verify activity preview doesn't show science navigation
4. Verify all views load without visual errors

**Console Monitoring**:
1. Monitor browser console during all user flows
2. Verify no errors or warnings appear
3. Verify only expected info/debug logs appear

### Automated Testing Requirements

**Static Analysis**:
- Run TypeScript compiler with `--noEmit` flag
- Run ESLint with all rules enabled
- Verify zero errors and zero warnings

**Build Testing**:
- Run `npm run build` and verify success
- Serve production build and verify it loads
- Check bundle size is reasonable

**Code Search Testing**:
- Search codebase for "science" (case-insensitive)
- Verify all matches are in comments or documentation only
- Search for "ScienceProblem" and verify no matches
- Search for "scienceProblems" and verify no matches

### Test Execution Order

1. **Static Analysis First**: Run TypeScript and ESLint to catch obvious issues
2. **Unit Tests**: Run specific example tests for science removal
3. **Property Tests**: Run property-based tests for universal properties
4. **Build Test**: Verify production build succeeds
5. **Manual Testing**: Perform user flow testing
6. **Final Validation**: Run all tests together and verify all pass

### Success Criteria

All tests must pass with:
- Zero TypeScript errors
- Zero TypeScript warnings
- Zero ESLint errors
- Zero ESLint warnings
- Zero console errors during manual testing
- Production build completes successfully
- All user flows complete without errors
