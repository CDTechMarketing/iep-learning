# Requirements Document: Branch Consolidation & Integration

## Introduction

The IEP Learning application has been developed across multiple parallel branches by different agents, each implementing specific features. This consolidation effort will systematically review, document, and integrate all work from these branches into a unified, stable main branch while ensuring no functionality is lost and all features work together harmoniously.

## Glossary

- **Main Branch**: The primary development branch containing the current stable version of the application
- **Feature Branch**: A branch created by an agent to implement specific functionality
- **Agent**: An AI assistant that worked on a specific feature set
- **Integration**: The process of merging code from feature branches into the main branch
- **Conflict Resolution**: The process of resolving code conflicts when multiple branches modify the same files
- **Regression Testing**: Testing to ensure existing functionality still works after integration
- **Feature Parity**: Ensuring all features from branches are present in the consolidated version

## Requirements

### Requirement 1: Branch Discovery and Documentation

**User Story:** As a project maintainer, I want to understand what work exists in each branch, so that I can plan the consolidation effort effectively.

#### Acceptance Criteria

1. WHEN reviewing the project THEN the system SHALL identify all feature branches that need consolidation
2. WHEN examining each branch THEN the system SHALL document the primary features implemented in that branch
3. WHEN comparing branches THEN the system SHALL identify which files were modified in each branch
4. WHEN analyzing branch history THEN the system SHALL determine the divergence point from the main branch
5. WHEN documenting branches THEN the system SHALL create a comprehensive inventory of all branch-specific work

### Requirement 2: Feature Inventory and Gap Analysis

**User Story:** As a project maintainer, I want to know what features exist across all branches, so that I can ensure nothing is lost during consolidation.

#### Acceptance Criteria

1. WHEN inventorying features THEN the system SHALL list all implemented features from each branch
2. WHEN comparing to documentation THEN the system SHALL identify features mentioned in AGENT_PROMPTS.md that are implemented
3. WHEN analyzing the main branch THEN the system SHALL identify features already present in main
4. WHEN comparing branches THEN the system SHALL identify duplicate implementations of the same feature
5. WHEN completing inventory THEN the system SHALL produce a feature matrix showing which features exist in which branches

### Requirement 3: Conflict Identification

**User Story:** As a developer, I want to identify potential merge conflicts before integration, so that I can plan resolution strategies.

#### Acceptance Criteria

1. WHEN comparing branches THEN the system SHALL identify files modified in multiple branches
2. WHEN analyzing modifications THEN the system SHALL determine if changes are compatible or conflicting
3. WHEN finding conflicts THEN the system SHALL categorize them by severity (critical, moderate, minor)
4. WHEN documenting conflicts THEN the system SHALL provide specific line numbers and code sections involved
5. WHEN conflicts exist THEN the system SHALL recommend resolution strategies for each conflict type

### Requirement 4: Dependency Analysis

**User Story:** As a developer, I want to understand feature dependencies across branches, so that I can integrate features in the correct order.

#### Acceptance Criteria

1. WHEN analyzing features THEN the system SHALL identify dependencies between features
2. WHEN a feature depends on another THEN the system SHALL document the dependency relationship
3. WHEN planning integration THEN the system SHALL create a dependency graph showing integration order
4. WHEN dependencies exist across branches THEN the system SHALL identify which branch should be integrated first
5. WHEN circular dependencies exist THEN the system SHALL flag them for manual resolution

### Requirement 5: Integration Priority Ranking

**User Story:** As a project maintainer, I want to prioritize which branches to integrate first, so that I can maximize value while minimizing risk.

#### Acceptance Criteria

1. WHEN prioritizing branches THEN the system SHALL consider feature completeness as a factor
2. WHEN prioritizing branches THEN the system SHALL consider the number of conflicts as a factor
3. WHEN prioritizing branches THEN the system SHALL consider alignment with documented priorities (Tier 1, 2, 3)
4. WHEN prioritizing branches THEN the system SHALL consider feature dependencies as a factor
5. WHEN priorities are assigned THEN the system SHALL produce a recommended integration sequence

### Requirement 6: Code Quality Assessment

**User Story:** As a developer, I want to assess the quality of code in each branch, so that I can identify issues before integration.

#### Acceptance Criteria

1. WHEN reviewing branch code THEN the system SHALL check for TypeScript compilation errors
2. WHEN reviewing branch code THEN the system SHALL check for ESLint violations
3. WHEN reviewing branch code THEN the system SHALL identify missing type definitions
4. WHEN reviewing branch code THEN the system SHALL check for unused imports or variables
5. WHEN quality issues exist THEN the system SHALL document them with severity levels

### Requirement 7: Database Schema Compatibility

**User Story:** As a developer, I want to ensure database schema changes across branches are compatible, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN branches modify database schema THEN the system SHALL identify all schema changes
2. WHEN multiple branches modify schema THEN the system SHALL check for version conflicts
3. WHEN schema changes exist THEN the system SHALL verify migration compatibility
4. WHEN incompatible changes exist THEN the system SHALL recommend a unified schema approach
5. WHEN consolidating schemas THEN the system SHALL ensure backward compatibility with existing data

### Requirement 8: Component Integration Testing

**User Story:** As a developer, I want to test that integrated components work together, so that I can catch integration issues early.

#### Acceptance Criteria

1. WHEN integrating a branch THEN the system SHALL verify all imports resolve correctly
2. WHEN integrating a branch THEN the system SHALL verify all TypeScript types are compatible
3. WHEN integrating a branch THEN the system SHALL verify the application builds successfully
4. WHEN integrating a branch THEN the system SHALL verify no runtime errors occur during initialization
5. WHEN integration is complete THEN the system SHALL verify all routes and navigation work correctly

### Requirement 9: Feature Documentation Consolidation

**User Story:** As a project maintainer, I want consolidated documentation for all features, so that future developers understand the complete system.

#### Acceptance Criteria

1. WHEN consolidating branches THEN the system SHALL merge all feature documentation
2. WHEN documentation conflicts exist THEN the system SHALL preserve the most complete version
3. WHEN features are integrated THEN the system SHALL update the main README with new features
4. WHEN consolidation is complete THEN the system SHALL create a CHANGELOG documenting all integrated features
5. WHEN documentation is updated THEN the system SHALL ensure all code examples are accurate

### Requirement 10: Rollback Strategy

**User Story:** As a project maintainer, I want a rollback strategy for each integration, so that I can recover if issues arise.

#### Acceptance Criteria

1. WHEN planning integration THEN the system SHALL create a backup of the current main branch
2. WHEN integrating a branch THEN the system SHALL document the exact commit hash before integration
3. WHEN integration fails THEN the system SHALL provide clear rollback instructions
4. WHEN rolling back THEN the system SHALL restore the previous working state completely
5. WHEN rollback is complete THEN the system SHALL verify the application functions as before

### Requirement 11: Stakeholder Communication

**User Story:** As a project maintainer, I want to communicate consolidation progress, so that stakeholders understand the status.

#### Acceptance Criteria

1. WHEN consolidation begins THEN the system SHALL create a status document tracking progress
2. WHEN each branch is reviewed THEN the system SHALL update the status document
3. WHEN conflicts are found THEN the system SHALL document them for stakeholder review
4. WHEN integration is complete THEN the system SHALL provide a summary of changes
5. WHEN consolidation is finished THEN the system SHALL create a final report of all integrated features

### Requirement 12: Post-Integration Validation

**User Story:** As a developer, I want to validate the consolidated application, so that I can ensure all features work correctly together.

#### Acceptance Criteria

1. WHEN consolidation is complete THEN the system SHALL run all existing tests
2. WHEN consolidation is complete THEN the system SHALL verify all database operations work
3. WHEN consolidation is complete THEN the system SHALL verify all UI components render correctly
4. WHEN consolidation is complete THEN the system SHALL verify all navigation paths work
5. WHEN validation passes THEN the system SHALL mark the consolidation as successful

## Branch Inventory

Based on discovery (December 7, 2025), we found **15 branches** - 10 more than originally mentioned!

### Originally Mentioned Branches (Priority)

### 1. Project Management Branch
- **URL**: `origin/claude/setup-project-management-01BfmXzGcR298t5yCbuMVjqB`
- **Purpose**: Project management and coordination
- **Expected Content**: Project structure, documentation, coordination files
- **Priority**: HIGH (should have latest standing)

### 2. Math Operations Branch (Agent 6)
- **URL**: `origin/claude/agent-6-math-operations-01Pa5Soh8gbRUNei85A2jmcf`
- **Purpose**: Math operations implementation
- **Expected Content**: Math problem types, operations, practice components
- **Priority**: HIGH (core functionality)

### 3. Sight Words Branch
- **URL**: `origin/claude/sight-words-coach-agent-01EcfAbXE6vdSfJBqkfGCA4u`
- **Purpose**: Sight words coaching functionality
- **Expected Content**: Sight word lists, practice activities, coaching logic
- **Priority**: MEDIUM (important for reading)

### 4. Agent 2 Branch
- **URL**: `origin/claude/agent-2-prompt-01JnGHCBV8yZCnBH2qps1JFZ`
- **Purpose**: Unknown (needs investigation)
- **Expected Content**: To be determined
- **Priority**: MEDIUM (pending discovery)

### 5. Phonics Branch
- **URL**: `origin/claude/phonics-implementation-01JrTd8cM2btS7nqWdSNvGy2`
- **Purpose**: Phonics instruction implementation
- **Expected Content**: Phonics activities, sound-letter correspondence, blending exercises
- **Priority**: HIGH (critical for reading foundation)

### Additional Discovered Branches

### 6. Mastery Tracking Branch (Tier 1)
- **URL**: `origin/claude/mastery-tracking-tier1-016De8Z8AuStYMHC4VgzaADX`
- **Purpose**: IEP goal tracking and skill mastery
- **Expected Content**: Mastery tracking, IEP goals, progress reports
- **Priority**: HIGH (Tier 1 feature from AGENT_PROMPTS.md)

### 7. Science Module Branch
- **URL**: `origin/claude/science-module-015uNRCvaNizjXr5yA9KsVWD`
- **Purpose**: Science content (simple machines, forces)
- **Expected Content**: Science activities, demonstrations
- **Priority**: MEDIUM (curriculum content)

### 8. Multiplication/Division Branch (Agent 4)
- **URL**: `origin/claude/agent-4-multiplication-division-01VK5J1EatRKTHvubtzZkcZ9`
- **Purpose**: Multiplication and division operations
- **Expected Content**: Math operations, practice activities
- **Priority**: MEDIUM (extends math capabilities)

### 9. GED Reading/Phonics Branch (Agent 2)
- **URL**: `origin/claude/ged-reading-phonics-agent2-015eCnvhgmQUgPpAo6vUjrZb`
- **Purpose**: GED-level reading and phonics
- **Expected Content**: Advanced reading content
- **Priority**: LOW (may be out of scope for current user)

### 10. Create Learning Prompts Branch
- **URL**: `origin/claude/create-learning-prompts-01HsWSvQVjMfM5pygwoxJyfj`
- **Purpose**: Learning prompt creation
- **Expected Content**: Prompt templates, content creation
- **Priority**: TBD (needs investigation)

### 11. Document Agent Prompt Branch
- **URL**: `origin/claude/document-agent-prompt-012bT9bNJDRHVPUR1QpkW7yn`
- **Purpose**: Documentation
- **Expected Content**: Documentation files
- **Priority**: LOW (documentation only)

### 12. Review Agent 6 Prompt Branch
- **URL**: `origin/claude/review-agent-6-prompt-01GDZdME1qPduJGvYdcYiYtQ`
- **Purpose**: Review of Agent 6 work
- **Expected Content**: Review notes, possibly fixes
- **Priority**: TBD (needs investigation)

### 13. Review Wave 1 Prompts Branch
- **URL**: `origin/claude/review-wave-1-prompts-018EohV4e2AYTjoxrDLrfAmf`
- **Purpose**: Review of Wave 1 prompts
- **Expected Content**: Review notes
- **Priority**: LOW (review only)

### 14. Incomplete Task Branch
- **URL**: `origin/claude/incomplete-task-01EWNqovG9q4ovrncGkr1nAn`
- **Purpose**: Incomplete work
- **Expected Content**: Partial implementation
- **Priority**: LOW (incomplete)

### 15. Special Needs Education Branch (Current)
- **URL**: `origin/claude/special-needs-education-01T9bKL1BjS6S3bpkcBG96Sd`
- **Purpose**: Current working branch
- **Expected Content**: Current application state
- **Priority**: N/A (this is the current branch)

## Success Criteria

The branch consolidation will be considered successful when:

1. ✅ All five branches have been reviewed and documented
2. ✅ A complete feature inventory exists showing what's in each branch
3. ✅ All conflicts have been identified and resolved
4. ✅ Features have been integrated in dependency order
5. ✅ The consolidated application builds without errors
6. ✅ All existing functionality continues to work (no regressions)
7. ✅ New features from branches are accessible and functional
8. ✅ Database schema is unified and compatible
9. ✅ Documentation is updated to reflect all integrated features
10. ✅ A comprehensive CHANGELOG documents all changes

## Out of Scope

The following are explicitly out of scope for this consolidation effort:

- ❌ Implementing new features not present in any branch
- ❌ Refactoring code for optimization (unless required for integration)
- ❌ Updating dependencies or libraries (unless required for compatibility)
- ❌ Redesigning UI/UX (preserve existing designs)
- ❌ Performance optimization (unless integration causes performance issues)
- ❌ Adding new tests (preserve existing tests, ensure they pass)

## Risks and Mitigation

### Risk 1: Conflicting Implementations
**Mitigation**: Document all conflicts, choose best implementation, preserve alternative in documentation

### Risk 2: Breaking Changes
**Mitigation**: Maintain rollback capability, test thoroughly before finalizing

### Risk 3: Lost Functionality
**Mitigation**: Comprehensive feature inventory before starting, validation after completion

### Risk 4: Database Incompatibility
**Mitigation**: Schema analysis before integration, migration scripts if needed

### Risk 5: Time Overrun
**Mitigation**: Prioritize branches, integrate incrementally, validate frequently

## Notes

- This consolidation should preserve the privacy-first, offline-first architecture
- All evidence-based practices for autism and learning disabilities must be maintained
- The positive-only feedback approach must be preserved across all integrated features
- Integration should not disrupt the existing user experience for current features
