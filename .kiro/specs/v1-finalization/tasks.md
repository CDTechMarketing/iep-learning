# Implementation Plan: v1.0 Finalization

## Overview

This plan outlines the tasks for finalizing version 1.0 of the IEP Learning application. The work involves removing all science-related features (deferred to v1.1), resolving TypeScript diagnostics, and validating all core user flows to ensure production readiness.

The approach follows a systematic order:
1. Remove science features from type definitions (causes compilation errors at usage sites)
2. Remove science features from database schema
3. Remove science features from state management and routing
4. Remove science features from UI components
5. Resolve all TypeScript errors and warnings
6. Validate production build and user flows

## Tasks

- [x] 1. Remove science features from type definitions
  - Open `src/types.ts` and remove the `ScienceProblem` interface
  - Remove `'science'` from any type unions that include it (e.g., activity types)
  - Save the file and note any TypeScript errors that appear in other files
  - _Requirements: 1.1, 1.3_

- [ ] 2. Remove science features from database schema
  - [x] 2.1 Update database schema in `src/db.ts`
    - Remove `scienceProblems` table from the Dexie schema definition
    - Remove any science-related seed data from initialization functions
    - Increment the database version number if schema changes require migration
    - Add migration logic to drop the `scienceProblems` table if it exists (for users upgrading from dev versions)
    - _Requirements: 1.2, 1.7, 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 2.2 Write unit test for database schema validation
    - Verify that initializing the database creates only core feature tables
    - Verify that `scienceProblems` table does not exist after initialization
    - _Requirements: 6.3_

- [x] 3. Remove science features from state management
  - Open `src/store.ts` and remove `'science'` from the `ViewType` union
  - Verify that no state properties reference science features
  - Ensure all view transition logic only handles valid v1.0 views
  - _Requirements: 1.3, 7.1, 7.2, 7.3_

- [x] 4. Remove science view routing from App component
  - Open `src/App.tsx` and remove the science view case from the routing logic
  - Ensure the default/fallback case redirects invalid views to home
  - Add defensive logic to handle any persisted state that references 'science' view
  - _Requirements: 1.4_

- [ ] 5. Remove science features from UI components
  - [x] 5.1 Update ActivityPreview component
    - Open `src/components/ActivityPreview.tsx`
    - Remove any science activity type handling
    - Remove science navigation buttons or links
    - Verify all remaining activity types render correctly
    - _Requirements: 1.5, 8.1_
  
  - [x] 5.2 Update ChoiceBoards component
    - Open `src/components/ChoiceBoards.tsx`
    - Remove the science option from the choice board grid
    - Verify the grid layout remains balanced with remaining options
    - Verify all remaining choices navigate correctly
    - _Requirements: 1.6, 8.2_
  
  - [ ] 5.3 Write property test for activity list filtering
    - **Property 13: Activity list filtering**
    - **Validates: Requirements 8.4**
    - Test that any component rendering activity lists filters out science activity types

- [x] 6. Checkpoint - Verify science removal is complete
  - Search the entire codebase for "science" (case-insensitive)
  - Verify all matches are in comments, documentation, or this spec only
  - Search for "ScienceProblem" and verify no matches in source code
  - Search for "scienceProblems" and verify no matches in source code
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 8.3, 8.5_

- [ ] 7. Resolve TypeScript diagnostics
  - [x] 7.1 Run TypeScript compiler and identify all errors
    - Run `npm run typecheck` to get a list of all TypeScript errors
    - Document each error and its location
    - _Requirements: 2.1_
  
  - [x] 7.2 Fix TypeScript errors
    - Systematically fix each TypeScript error identified
    - Focus on type mismatches caused by science feature removal
    - Add explicit type annotations where needed
    - _Requirements: 2.1, 2.5_
  
  - [x] 7.3 Remove unused imports across all files
    - Run ESLint to identify unused imports
    - Remove all unused imports from source files
    - _Requirements: 2.3_
  
  - [x] 7.4 Remove unused variables across all files
    - Run ESLint to identify unused variables
    - Remove or prefix with underscore if intentionally unused
    - _Requirements: 2.4_
  
  - [ ] 7.5 Write property test for component prop typing
    - **Property 5: Component props are typed**
    - **Validates: Requirements 2.6**
    - Verify all React components have explicit TypeScript interfaces for props
  
  - [x] 7.6 Verify zero TypeScript diagnostics
    - Run `npm run typecheck` and verify zero errors
    - Run `npm run lint` and verify zero warnings
    - _Requirements: 2.1, 2.2_

- [x] 8. Checkpoint - Verify clean compilation
  - Run `npm run typecheck` and confirm zero errors and warnings
  - Run `npm run lint` and confirm zero errors and warnings
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 2.1, 2.2_

- [ ] 9. Validate production build
  - [x] 9.1 Test production build process
    - Run `npm run build` and verify it completes successfully
    - Verify exit code is 0 with no errors or warnings
    - Check that the `dist` directory contains all expected assets
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 9.2 Verify build optimization
    - Inspect output files in `dist` directory
    - Verify JavaScript files are minified (no unnecessary whitespace)
    - Verify bundle sizes are reasonable
    - _Requirements: 4.4_
  
  - [ ] 9.3 Test production build runtime
    - Run `npm run preview` to serve the production build
    - Open the application in a browser
    - Verify it loads without console errors
    - _Requirements: 4.5, 5.1_
  
  - [ ] 9.4 Write property test for build success
    - **Property 8: Production build success**
    - **Validates: Requirements 4.1, 4.2**
    - Test that running the build command completes with exit code 0

- [ ] 10. Validate core user flows
  - [ ] 10.1 Test reading practice flow
    - Navigate from Home to Reading Practice
    - Complete a reading activity
    - Verify session is recorded in database
    - Verify Session Summary displays correctly
    - Verify stars are awarded
    - _Requirements: 3.1, 3.7_
  
  - [ ] 10.2 Test math practice flow
    - Navigate from Home to Math Practice
    - Complete a math activity
    - Verify session is recorded in database
    - Verify Session Summary displays correctly
    - Verify stars are awarded
    - _Requirements: 3.2, 3.7_
  
  - [ ] 10.3 Test choice boards flow
    - Navigate from Home to Choice Boards
    - Select an activity (reading or math)
    - Complete the activity
    - Verify flow completes to Session Summary
    - _Requirements: 3.3_
  
  - [ ] 10.4 Test settings persistence
    - Navigate to Settings
    - Modify a setting (e.g., toggle high contrast mode)
    - Verify setting is saved to database
    - Verify setting is applied immediately in UI
    - Reload the application and verify setting persists
    - _Requirements: 3.4_
  
  - [ ] 10.5 Test parent dashboard
    - Navigate to Parent Dashboard
    - Verify session data displays without errors
    - Verify progress analytics render correctly
    - _Requirements: 3.5_
  
  - [ ] 10.6 Test unit management
    - Navigate to Unit Management
    - Create a new unit and verify it saves
    - Edit an existing unit and verify changes save
    - Verify no errors occur during operations
    - _Requirements: 3.6_
  
  - [ ] 10.7 Test sensory break flow
    - Start an activity session
    - Trigger a sensory break
    - Verify break activity displays correctly
    - Return to the session and verify it continues
    - _Requirements: 3.8_
  
  - [ ] 10.8 Write property test for reward system consistency
    - **Property 7: Reward system consistency**
    - **Validates: Requirements 3.7**
    - Test that completing any activity (reading or math) awards stars correctly
  
  - [ ] 10.9 Write property test for settings persistence
    - **Property 6: Settings persistence**
    - **Validates: Requirements 3.4**
    - Test that any setting modification persists and applies correctly
  
  - [ ] 10.10 Write property test for navigation error-free
    - **Property 9: Navigation error-free**
    - **Validates: Requirements 5.2**
    - Test that any view transition does not produce console errors
  
  - [ ] 10.11 Write property test for database error handling
    - **Property 10: Database error handling**
    - **Validates: Requirements 5.4**
    - Test that any database operation handles errors gracefully
  
  - [ ] 10.12 Write property test for state persistence
    - **Property 12: State persistence**
    - **Validates: Requirements 7.5**
    - Test that any state change persists correctly and restores on reload

- [ ] 11. Final validation and cleanup
  - [ ] 11.1 Monitor console during all user flows
    - Open browser developer console
    - Perform all user flows from task 10
    - Verify no errors or warnings appear in console
    - Verify only expected info/debug logs appear
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 11.2 Verify error handling
    - Trigger an error condition (e.g., database access failure)
    - Verify error is logged to local logging system
    - Verify user-friendly message is displayed
    - _Requirements: 5.5_
  
  - [ ] 11.3 Final code search for science references
    - Search codebase for "science" and verify no code references
    - Search for "ScienceProblem" and verify no matches
    - Search for "scienceProblems" and verify no matches
    - Search for commented-out science code and remove any found
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 8.5_
  
  - [ ] 11.4 Run full test suite
    - Run all unit tests and verify they pass
    - Run all property tests and verify they pass
    - Run TypeScript compiler and verify zero errors
    - Run ESLint and verify zero warnings
    - Run production build and verify success
    - _Requirements: 2.1, 2.2, 4.1, 4.2_

- [ ] 12. Final checkpoint - Production readiness verification
  - Verify all previous tasks are complete
  - Verify production build succeeds with no errors or warnings
  - Verify all user flows work end-to-end without errors
  - Verify no console errors during normal usage
  - Verify no science references remain in codebase
  - Document any known issues or limitations for v1.0
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Manual testing is required for user flows to ensure end-to-end functionality
- The systematic removal order (types → database → state → routing → components) ensures TypeScript helps identify all locations needing updates
