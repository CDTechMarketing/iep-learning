# PROJECT LOG — IEP Learning App

**This is the canonical status document.** Any AI session (Claude, Gemini, or otherwise)
working on this project should read this file FIRST, then only the specific brief it's
assigned. Do not re-derive project state from other markdown files (see Doc Map below —
several are stale).

**Last updated:** 2026-07-03 (Phase 1/2 fully completed and verified)

---

## What this app is

Local-first React SPA for a special-needs learner (the developer's daughter: entering
4th grade, autism + learning disabilities, reading at kindergarten level — CVC words,
early addition). Reading practice (progressive CVC phrases + text-to-speech), math
practice (identification, addition with manipulatives, number line, ten frame, touch
count), sensory breaks, token-economy rewards, parent dashboard with analytics.

Content pipeline: parent exports performance data + an AI prompt → an LLM generates
lesson units in a markdown format → parent pastes them back in via the import dialog.

**Stack:** React 18, TypeScript 5.5, Vite 5, Tailwind 3, Zustand 5, Dexie (IndexedDB),
Recharts, date-fns, Web Speech API. No backend, no network calls, no router (view
switching via a `currentView` string in the Zustand store). Tests: Vitest
(`npm test`), pure-logic unit tests only.

**Design principles (never violate):** local-first / no external services; positive-only
feedback (no penalties, no red X's); large touch targets; predictable structure; no
router; no backend.

---

## Current state (as of 2026-07-03)

- `npm run typecheck` → 0 errors. `npm run build` → succeeds (755 kB single chunk).
  `npm test` → 22 tests pass (4 files). `npm run lint` → 15 errors
  (`no-explicit-any` in logger.ts) + 5 hook warnings (all pre-existing; Phase 5
  Task 4 clears them).
- All Phase 1/2 bugs are FIXED (freeze on counting units, import type conversion,
  dual import formats, break destroying progress, wrong accuracy stats, first-run
  init race, reset-wipes-history). See Decisions log.
- **Remaining known bugs:**
  1. "Full Learning Session" flow never advances past the first activity — Phase 3 Task 2.
  2. Choice Boards selections are saved but never used — Phase 3 Task 2.
- 15 unmerged remote branches exist from an earlier parallel-agent experiment.
  **Decision: do NOT merge them.** Treat as a parts bin (see Decisions log).
- Dev-server preview config exists at `.claude/launch.json` (`npm run dev`, port 5173).

## Work plan

Briefs live in `docs/briefs/`. Execute in order; each task is self-contained and
paste-able into any coding model.

| Phase | File | Status |
|---|---|---|
| 1/2 — Critical fixes & stabilization | `phase-1-2-critical-fixes.md` (8 tasks) | COMPLETED (2026-07-03, Antigravity) |
| 3 — Refactoring & session flow | `phase-3-refactoring.md` (3 tasks) | IN PROGRESS — Task 1 done (2026-07-03, Gemini, reviewed by Fable); order: Task 3 next, Task 2 last |
| 4 — Feature completion (Tier 1) | `phase-4-features.md` (5 tasks) | NOT STARTED |
| 5 — Hardening & reports | `phase-5-hardening.md` (5 tasks) | NOT STARTED |

**Update this table as tasks complete** (e.g., "Task 3 done 2026-07-05, Sonnet 5").

## Next / Now

1. Phase 3 — Refactoring & session flow (`phase-3-refactoring.md`).

## Parking lot (decided to defer, revisit later)

- **Virginia SOL alignment (4th grade):** map units/skills to Virginia Standards of
  Learning so reports can say "working toward SOL K.RF/1.NS from a 4th-grade IEP
  baseline." Current instructional level is CVC reading + early addition, so this is a
  reporting/planning layer, not a content gate. Revisit after Phase 4 mastery tracking
  exists (it provides the skill taxonomy to map onto).
- **Teacher/IEP report pack:** printable progress reports, notes/observations, lesson-plan
  suggestions to bring to teacher conversations and IEP meetings. Specced as Phase 5
  Task 1; can be pulled earlier once mastery tracking (Phase 4 Task 3) lands.
- **Productization** (sell/give to other special-needs families): multi-child profiles,
  packaging decision (PWA vs. desktop app via Tauri/Electron vs. hosted on AWS/GCP),
  privacy/compliance review (COPPA; FERPA if schools use it), content licensing.
  Discussion doc only for now — Phase 5 Task 5. No architecture changes should be made
  "for future scale" before this discussion happens.

## Undecided

- Whether break-time and reading-only sessions should produce SessionLogs (currently: no).
- Reading accuracy is 100% by definition (errorless design) — how should dashboards
  present reading progress? (Currently mixed into "accuracy," which is misleading.)
- Which dyslexia-friendly font to bundle (Lexend vs. OpenDyslexic) — Phase 4 Task 4.

## Decisions log

- **2026-07-03** — Phase 3 Task 1 implemented by Gemini, reviewed by Fable: break
  machinery deduped into `BreakPrompt.tsx` + `useBreakFlow` hook; behavior verified
  identical in-browser (prompt at interval, calming break resumes at next item with
  progress intact). All gates pass. Decided task order: Task 3 next, Task 2 last
  (Task 2 is highest-risk; it builds on Task 1's refactor).
- **2026-07-03** — Phase 1/2 Tasks 2, 3, 5, 6, 7, 8 implemented by Gemini
  (Antigravity); reviewed by Fable. Review confirmed the implementation matches the
  briefs; Fable added one missing piece (write-once guard in ActivityPreview's
  completion effect, required by Task 7B — without it StrictMode double-writes
  SessionLogs) and refreshed this log's Current state section. All gates pass:
  typecheck 0 errors, build OK, 22 tests pass, lint = 15 pre-existing logger errors
  + 5 pre-existing hook warnings (down from 9).
- **2026-07-03** — Phase 1/2 Tasks 1 & 4 implemented by Fable and verified in a live
  browser session (counting units playable end-to-end; options stable during feedback;
  no console.log outside logger; Supabase removed). Baseline WIP committed first
  (`9260e39`). New finding during verification: StrictMode double-init race on first
  run → added as Task 7D to the Phase 1/2 brief.
- **2026-07-03** — Full engineering assessment by Claude Fable 5 (see chat; key findings
  reproduced in briefs). Verdict: fix before feature work.
- **2026-07-03** — Abandon the 15-branch consolidation program (was 15% done, stalled
  Dec 2025). Branches are a parts bin: check
  `claude/mastery-tracking-tier1-016De8Z8AuStYMHC4VgzaADX` before building Phase 4
  Task 3; ignore the rest unless needed.
- **2026-07-03** — Workflow: Fable/Opus for architecture + final review; Sonnet 5 /
  Gemini for implementing briefs. Each brief PR must pass
  `npm run typecheck && npm run lint && npm run build` (+ `npm test` once it exists).
- **2026-07-03** — Keep: no router, no backend, direct Dexie access from components.
  The app is deliberately simple; do not add abstraction layers.
- **2026-01-26 (historical)** — Science module deferred to v1.1; removed from v1.0.
- **Curriculum focus** — Start where the learner is: CVC word families and early
  addition/counting. Expand content (Phase 4 Task 1) before adding new subjects.

## Doc map (what to trust)

| Doc | Status |
|---|---|
| `docs/PROJECT_LOG.md` | **Canonical — read first** |
| `docs/briefs/*` | Active work specs |
| `UNIT_TEMPLATE.md`, `LLM_LESSON_PLAN_PROMPT.md` | Accurate — the content-authoring format |
| `short-e-et.md` | Unimported lesson unit (gets seeded in Phase 4 Task 1) |
| `SPECIAL_NEEDS_RECOMMENDATIONS.md`, `DEBUGGING_AND_LOGGING.md` | Reference, still valid |
| `IMPLEMENTATION_ASSESSMENT.md`, `MISSING_FEATURES_ANALYSIS.md`, `AGENT_PROMPTS.md` | **STALE** — claim features (science, AAC) that live on unmerged branches, and call things "integrated" that aren't wired up. Historical context only. |
| `docs/archive/*` (PROJECT_STATUS, CONSOLIDATION_GUIDE, consolidation-workspace) | **STALE** — "production ready" claim was wrong; consolidation abandoned |
| `.kiro/` | Historical spec tooling; not maintained |

## Continuity protocol (how to work across chat threads cheaply)

1. Start every new implementation thread with:
   *"Read `docs/PROJECT_LOG.md`, then execute Task N in `docs/briefs/<file>`. Don't
   explore beyond the files the task names."*
2. When a task finishes: update the Work plan table + Decisions log here (1–3 lines),
   commit code + log together.
3. Never let a thread "re-assess the project" — that's what this file is for. If
   something contradicts this file, update the file, don't relitigate in chat.
4. Save review/architecture questions for a single higher-capability session (Fable/Opus)
   rather than sprinkling them across implementation threads.
