# Branch Inventory: [BRANCH_NAME]

## Overview

| Field | Value |
|-------|-------|
| **Branch URL** | `origin/claude/[branch-name]` |
| **Diverged From** | [commit hash] |
| **Last Commit** | [commit hash] |
| **Last Updated** | [date] |
| **Primary Purpose** | [description] |
| **Agent/Author** | [if known] |

## Summary

[Brief description of what this branch contains and its purpose]

## Features Implemented

### Feature 1: [Name]
- **Description**: [What it does]
- **Status**: Complete / Partial / Broken
- **Files**: 
  - `src/components/[Component].tsx`
  - `src/utils/[utility].ts`
- **Dependencies**: [Other features this depends on]
- **Notes**: [Any important notes]

### Feature 2: [Name]
- **Description**: [What it does]
- **Status**: Complete / Partial / Broken
- **Files**: [list]
- **Dependencies**: [list]
- **Notes**: [notes]

## Files Modified

### New Files Added
| File | Purpose |
|------|---------|
| `src/components/[New].tsx` | [description] |
| `src/utils/[new].ts` | [description] |

### Existing Files Modified
| File | Changes |
|------|---------|
| `src/types.ts` | [what was added/changed] |
| `src/db.ts` | [what was added/changed] |
| `src/store.ts` | [what was added/changed] |
| `src/App.tsx` | [what was added/changed] |

### Files Deleted
| File | Reason |
|------|--------|
| [none or list] | [reason] |

## Database Changes

| Field | Value |
|-------|-------|
| **Schema Version** | [number] |
| **New Tables** | [list] |
| **Modified Tables** | [list] |
| **Migration Required** | Yes / No |

### Schema Details
```typescript
// New interfaces added to types.ts
interface NewType {
  // ...
}

// New tables added to db.ts
this.version(X).stores({
  newTable: 'id, field1, field2'
});
```

## State Management Changes

### New State Properties
```typescript
// Added to store.ts
newProperty: Type;
newAction: (param: Type) => void;
```

### Modified State Properties
- [list any changes to existing state]

## Route/View Changes

### New Views Added
| View Name | Route | Component |
|-----------|-------|-----------|
| [name] | `[route]` | `[Component].tsx` |

### Navigation Changes
- [list any changes to navigation]

## Conflicts Identified

### With Main Branch
| File | Conflict Type | Severity | Description |
|------|---------------|----------|-------------|
| [file] | content/schema/dependency | critical/moderate/minor | [description] |

### With Other Branches
| File | Other Branch | Conflict Type | Severity | Description |
|------|--------------|---------------|----------|-------------|
| [file] | [branch] | [type] | [severity] | [description] |

## Code Quality

### TypeScript Errors
- [ ] Compiles without errors
- Errors found: [list or "none"]

### ESLint Issues
- [ ] Passes linting
- Issues found: [list or "none"]

### Unused Code
- Unused imports: [list or "none"]
- Unused variables: [list or "none"]

## Integration Notes

| Field | Value |
|-------|-------|
| **Priority** | High / Medium / Low |
| **Estimated Effort** | [hours] |
| **Dependencies** | [branches that must be integrated first] |
| **Blocks** | [branches that depend on this] |

### Risks
1. [Risk 1]
2. [Risk 2]

### Testing Requirements
1. [Test requirement 1]
2. [Test requirement 2]

### Resolution Strategy
[How to handle conflicts and integration]

## Commit History

```
[commit hash] - [message] - [date]
[commit hash] - [message] - [date]
[commit hash] - [message] - [date]
```

## Recommendation

**Should Integrate**: Yes / No / Partial

**Rationale**: [Why this branch should or shouldn't be integrated]

**Integration Order**: [Where in the sequence this should be integrated]

---

*Inventory completed: [date]*
*Reviewed by: [name/agent]*
