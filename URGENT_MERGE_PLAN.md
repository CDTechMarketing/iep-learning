# 🚨 URGENT MERGE COORDINATION PLAN

**Created:** 2025-11-20
**Priority:** CRITICAL
**Status:** Ready to Execute

---

## 🎯 SITUATION OVERVIEW

You have **14 active feature branches** developed in parallel, totaling:
- **51+ commits** across all branches
- **150+ files** changed
- **15,000+ lines** of code added
- **12 branches** ready to merge NOW
- **1 branch** needs review/work (incomplete-task)
- **1 branch** incomplete (agent-4-multiplication)

**CRITICAL FINDING:** One massive foundation branch (`special-needs-education`) contains 86% of the codebase and is the dependency for all others. This MUST merge first.

---

## ⚠️ HIGH-RISK MERGE CONFLICTS

The following files are modified by **MULTIPLE BRANCHES**:

### **Critical Conflict Files**
1. **src/App.tsx** - 8 branches modify this
2. **src/types.ts** - 11 branches modify this
3. **src/db.ts** - 11 branches modify this
4. **src/store.ts** - 8 branches modify this
5. **src/components/Home.tsx** - 7 branches modify this

**Impact:** These conflicts MUST be resolved carefully in sequence to prevent breaking changes.

---

## 🏆 RECOMMENDED MERGE SEQUENCE

### **PHASE 1: FOUNDATION (Days 1-2)**

#### Step 1: Merge special-needs-education FIRST
```bash
# This is the BASE - all other branches assume this exists
git checkout main
git merge origin/claude/special-needs-education-01T9bKL1BjS6S3bpkcBG96Sd
# Resolve any conflicts with main (should be minimal)
git push origin main
```

**Why First:**
- 35 files, 13,175 lines added
- Establishes core architecture
- All other branches depend on components from this
- Contains: navigation, accessibility, sensory breaks, error tracking, database foundation

**Testing Required:**
- Run `npm install` (new dependencies)
- Run `npm run dev` - verify app loads
- Test accessibility features
- Test sensory break activities
- Verify database initialization

---

#### Step 2: Merge mastery-tracking-tier1
```bash
git checkout main
git pull origin main  # Get special-needs-education
git merge origin/claude/mastery-tracking-tier1-016De8Z8AuStYMHC4VgzaADX
# Resolve conflicts (will conflict with types.ts, db.ts)
git push origin main
```

**Why Second:**
- 20 files, 1,500 lines
- IEP goal tracking system
- Required by reading/math agents
- Builds on special-needs foundation

**Testing Required:**
- Test mastery tracking updates
- Verify IEP goal progress
- Test skill proficiency detection

---

### **PHASE 2: READING AGENTS (Days 3-5) - CAN RUN IN PARALLEL**

After Phase 1 completes, these can merge in any order:

#### Agent 1: sight-words-coach-agent
```bash
git merge origin/claude/sight-words-coach-agent-01EcfAbXE6vdSfJBqkfGCA4u
```
- 8 files
- Spaced repetition system
- Leitner box implementation

#### Agent 2: phonics-implementation
```bash
git merge origin/claude/phonics-implementation-01JrTd8cM2btS7nqWdSNvGy2
```
- 14 files
- 8-level phonics system
- Sound isolation, blending, segmenting

#### Agent 3: ged-reading-phonics-agent2 (AFTER Agent 2)
```bash
# Only merge AFTER phonics-implementation
git merge origin/claude/ged-reading-phonics-agent2-015eCnvhgmQUgPpAo6vUjrZb
```
- 5 files (seed data)
- 263+ activities
- Depends on phonics-implementation

#### Agent 5: review-wave-1-prompts
```bash
git merge origin/claude/review-wave-1-prompts-018EohV4e2AYTjoxrDLrfAmf
```
- 11 files
- Reading comprehension
- 3-level scaffolding

---

### **PHASE 3: MATH & SCIENCE AGENTS (Days 6-8) - CAN RUN IN PARALLEL**

#### Agent 6: review-agent-6-prompt
```bash
git merge origin/claude/review-agent-6-prompt-01GDZdME1qPduJGvYdcYiYtQ
```
- 15 files
- Two-digit operations
- Error pattern detection
- Most comprehensive math agent

#### Agent 7: document-agent-prompt
```bash
git merge origin/claude/document-agent-prompt-012bT9bNJDRHVPUR1QpkW7yn
```
- 16 files
- Science engagement
- Water cycle, animal adaptations

#### Science Module: science-module
```bash
git merge origin/claude/science-module-015uNRCvaNizjXr5yA9KsVWD
```
- 8 files
- Forces and simple machines
- Complements Agent 7

---

### **PHASE 4: OPTIONAL/FUTURE**

#### incomplete-task (REVIEW FIRST)
```bash
# DO NOT MERGE YET - Needs review
# - AAC picture communication (75% complete)
# - Model-Lead-Test error correction
# - Missing: picture library expansion, UI refinement
```

**Action Required:** Assign agent to complete this before merge

#### agent-4-multiplication-division (INCOMPLETE)
```bash
# DO NOT MERGE - Only 70% complete
# - Skeleton implementation only
# - Missing: multiplication facts, visual models, problem generator
```

**Action Required:** Assign agent to complete implementation

---

### **PHASE 5: DOCUMENTATION (Anytime)**

These are documentation-only branches, safe to merge anytime:

```bash
git merge origin/claude/create-learning-prompts-01HsWSvQVjMfM5pygwoxJyfj
git merge origin/claude/agent-6-math-operations-01Pa5Soh8gbRUNei85A2jmcf
git merge origin/claude/agent-2-prompt-01JnGHCBV8yZCnBH2qps1JFZ
```

---

## 🔧 CONFLICT RESOLUTION STRATEGY

### **For src/App.tsx**
Each agent adds new routes. Merge strategy:
1. Start with special-needs-education routes
2. Add each subsequent agent's routes in order
3. Alphabetize or group by category (Reading, Math, Science, Support)

### **For src/types.ts**
Each agent adds new interfaces. Merge strategy:
1. Group interfaces by domain:
   - Reading types
   - Math types
   - Science types
   - Tracking types
   - Support types
2. Maintain alphabetical order within groups

### **For src/db.ts**
Each agent adds new tables. Merge strategy:
1. Add table definitions in logical order
2. Update version number for each merge
3. Seed data in initialization order
4. Test database migrations after each merge

### **For src/store.ts**
Each agent adds state. Merge strategy:
1. Group by feature domain
2. Keep related state together
3. Maintain naming conventions

### **For src/components/Home.tsx**
Each agent adds navigation items. Merge strategy:
1. Group navigation by category
2. Use consistent icon and color scheme
3. Order by pedagogical sequence

---

## ✅ MERGE CHECKLIST (For Each Branch)

### Pre-Merge
- [ ] Pull latest main: `git pull origin main`
- [ ] Checkout merge branch
- [ ] Review files changed: `git diff main...branch-name`
- [ ] Identify conflict areas
- [ ] Plan conflict resolution

### Merge
- [ ] Merge branch: `git merge origin/branch-name`
- [ ] Resolve conflicts carefully
- [ ] Review all changes
- [ ] Test compilation: `npm run build`
- [ ] Test dev server: `npm run dev`

### Post-Merge
- [ ] Test new features manually
- [ ] Verify no regressions
- [ ] Update PM documents
- [ ] Push to main: `git push origin main`
- [ ] Mark branch as merged in BRANCH_TRACKING.md
- [ ] Update AGENT_ACTIVITY_LOG.md
- [ ] Celebrate! 🎉

---

## 📅 PROPOSED TIMELINE

### **Week 1**
- **Day 1-2:** Phase 1 (Foundation)
  - special-needs-education
  - mastery-tracking-tier1
  - Comprehensive testing

- **Day 3-5:** Phase 2 (Reading Agents)
  - sight-words-coach-agent
  - phonics-implementation
  - ged-reading-phonics-agent2 (after phonics)
  - review-wave-1-prompts
  - Testing after each merge

### **Week 2**
- **Day 6-8:** Phase 3 (Math & Science)
  - review-agent-6-prompt
  - document-agent-prompt
  - science-module
  - Testing after each merge

- **Day 9-10:** Integration Testing
  - Full system testing
  - Bug fixes
  - Performance optimization

### **Week 3**
- **Day 11-12:** Documentation merge
- **Day 13-14:** Final polish
- **Day 15:** Production release

---

## 🚨 CRITICAL WARNINGS

### **DO NOT:**
- ❌ Merge branches in wrong order (special-needs MUST be first)
- ❌ Skip testing between merges
- ❌ Merge incomplete-task or agent-4-multiplication without review
- ❌ Force push to main
- ❌ Merge multiple complex branches at once

### **DO:**
- ✅ Follow the sequence exactly
- ✅ Test after EVERY merge
- ✅ Resolve conflicts carefully
- ✅ Update PM documents after each merge
- ✅ Commit with clear messages
- ✅ Keep backups

---

## 💾 BACKUP STRATEGY

Before starting merges:

```bash
# Create backup branch from main
git checkout main
git checkout -b backup-main-2025-11-20
git push origin backup-main-2025-11-20

# If anything goes wrong, restore:
git checkout main
git reset --hard backup-main-2025-11-20
git push origin main --force  # USE WITH EXTREME CAUTION
```

---

## 📊 PROGRESS TRACKING

### Phase 1: Foundation
- [ ] special-needs-education merged
- [ ] mastery-tracking-tier1 merged
- [ ] Integration testing complete

### Phase 2: Reading Agents
- [ ] sight-words-coach-agent merged
- [ ] phonics-implementation merged
- [ ] ged-reading-phonics-agent2 merged
- [ ] review-wave-1-prompts merged

### Phase 3: Math & Science
- [ ] review-agent-6-prompt merged
- [ ] document-agent-prompt merged
- [ ] science-module merged

### Phase 4: Optional
- [ ] incomplete-task reviewed and completed
- [ ] incomplete-task merged
- [ ] agent-4-multiplication reviewed and completed
- [ ] agent-4-multiplication merged

### Phase 5: Documentation
- [ ] create-learning-prompts merged
- [ ] agent-6-math-operations merged
- [ ] agent-2-prompt merged

---

## 🆘 EMERGENCY CONTACTS

**If you encounter:**
- **Merge conflicts you can't resolve:** Stop, document conflict, contact PM
- **Build failures:** Revert last merge, investigate, fix, retry
- **Feature breaks:** Revert merge, test in isolation, fix, retry
- **Data loss:** Restore from backup immediately

---

## 📝 NOTES FOR PROJECT MANAGER

- This is a complex multi-branch merge operation
- High risk of conflicts in shared files
- Sequential merging is CRITICAL
- Testing between merges is MANDATORY
- Document all conflicts and resolutions
- Update BRANCH_TRACKING.md after each merge
- Estimate 2-3 weeks for complete integration

---

**Created by:** Agent #1 (Project Manager)
**Last Updated:** 2025-11-20
**Status:** Ready for Execution
**Risk Level:** HIGH (due to scale and conflicts)
