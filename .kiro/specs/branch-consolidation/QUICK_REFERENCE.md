# Branch Consolidation Quick Reference

## Branches to Consolidate

| Branch | URL | Purpose | Priority |
|--------|-----|---------|----------|
| Project Management | `claude/setup-project-management-01BfmXzGcR298t5yCbuMVjqB` | Project structure | HIGH |
| Math Operations | `claude/agent-6-math-operations-01Pa5Soh8gbRUNei85A2jmcf` | Math features | HIGH |
| Sight Words | `claude/sight-words-coach-agent-01EcfAbXE6vdSfJBqkfGCA4u` | Sight word coaching | MEDIUM |
| Agent 2 | `claude/agent-2-prompt-01JnGHCBV8yZCnBH2qps1JFZ` | Unknown | MEDIUM |
| Phonics | `claude/phonics-implementation-01JrTd8cM2btS7nqWdSNvGy2` | Phonics instruction | HIGH |

## 5 Phases

1. **Discovery** (8-12h) - Analyze all branches
2. **Analysis** (6-10h) - Find conflicts and dependencies
3. **Planning** (4-6h) - Create integration plan
4. **Integration** (20-40h) - Merge branches
5. **Validation** (6-10h) - Test and document

**Total**: 44-78 hours

## Essential Commands

### Branch Analysis
```bash
# List remote branches
git branch -r | grep claude

# Checkout for analysis
git checkout -b analysis-[name] origin/[branch-name]

# See changes
git diff main --name-only
git diff main [file]

# See commits
git log --oneline main..HEAD
```

### Integration
```bash
# Create integration branch
git checkout main
git checkout -b consolidation/[branch-name]

# Merge
git merge [branch-name]

# Resolve conflicts
git status
# Edit files
git add [files]
git commit

# Test
npm run typecheck
npm run lint
npm run build

# Rollback if needed
git merge --abort
# or
git reset --hard HEAD~1
```

## Files to Watch

| File | Why | Common Conflicts |
|------|-----|------------------|
| `src/types.ts` | Type definitions | Multiple branches adding interfaces |
| `src/db.ts` | Database schema | Version conflicts, table additions |
| `src/store.ts` | State management | New state properties |
| `src/App.tsx` | Routes/views | New view additions |
| `package.json` | Dependencies | Version conflicts |

## Conflict Resolution Patterns

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Take Newer** | One version is clearly better | Latest implementation of a feature |
| **Merge Both** | Both add different things | Different properties to same interface |
| **Create Unified** | Both solve same problem differently | Two implementations of same feature |
| **Defer to Main** | Main is stable, branch is experimental | Incomplete feature branch changes |

## Testing Checklist

After each integration:

- [ ] `npm run typecheck` - No TypeScript errors
- [ ] `npm run lint` - No ESLint errors
- [ ] `npm run build` - Builds successfully
- [ ] Application starts without crashes
- [ ] Home screen loads
- [ ] All navigation works
- [ ] Reading practice works
- [ ] Math practice works
- [ ] Settings can be modified
- [ ] Data persists

## Key Principles

1. **Backup First** - Always create backups before integrating
2. **Test After Each** - Never integrate multiple branches without testing
3. **Document Everything** - Record all decisions
4. **Quality Over Speed** - Don't rush
5. **Preserve Core Values** - Maintain privacy-first, evidence-based approach

## Success Criteria

- ✅ All 5 branches analyzed and documented
- ✅ All features integrated and functional
- ✅ No regressions in existing functionality
- ✅ Application builds without errors
- ✅ All tests pass
- ✅ Documentation updated
- ✅ Database schema unified

## Common Issues

| Issue | Solution |
|-------|----------|
| Merge conflicts | Review both versions, choose best approach, document decision |
| Compilation errors | Fix in branch before integrating, test fixes |
| Runtime errors | Use error logging to identify cause, fix and retest |
| Schema conflicts | Create unified schema, assign proper versions |
| Missing features | Re-examine integration, cherry-pick if needed |
| Broken navigation | Check routes, imports, state management |

## Progress Tracking Template

```markdown
# Consolidation Status

**Date**: [date]
**Phase**: [1-5]
**Progress**: [X]%

## Branches
- ✅/⏳/❌ Project Management
- ✅/⏳/❌ Math Operations
- ✅/⏳/❌ Sight Words
- ✅/⏳/❌ Agent 2
- ✅/⏳/❌ Phonics

## Conflicts
- Critical: [count]
- Moderate: [count]
- Minor: [count]
- Resolved: [count]

## Next Steps
1. [action]
2. [action]
3. [action]
```

## Quick Start

```bash
# 1. Read the spec
cat .kiro/specs/branch-consolidation/README.md

# 2. Create workspace
mkdir -p consolidation-workspace
cd consolidation-workspace

# 3. Start log
echo "# Consolidation Log" > log.md
echo "Started: $(date)" >> log.md

# 4. Begin Task 1
# Follow tasks.md sequentially
```

## Resources

- **Requirements**: `.kiro/specs/branch-consolidation/requirements.md`
- **Design**: `.kiro/specs/branch-consolidation/design.md`
- **Tasks**: `.kiro/specs/branch-consolidation/tasks.md`
- **Guide**: `CONSOLIDATION_GUIDE.md`

## Emergency Rollback

If something goes wrong:

```bash
# Abort current merge
git merge --abort

# Reset to previous commit
git reset --hard HEAD~1

# Return to backup branch
git checkout backup-main-[date]

# Review what went wrong
git log
git diff

# Fix issue and retry
```

## Timeline

**Realistic** (part-time): 5-6 weeks
**Aggressive** (full-time): 2-3 weeks

## Contact

Questions? Review:
1. Requirements document (what to do)
2. Design document (how to do it)
3. Tasks document (when to do it)
4. Consolidation guide (detailed help)

---

**Remember**: Take your time, test thoroughly, document everything! 🚀
