# IEP Learning — Project Handoff Overview

**Purpose of this document:** a self-contained briefing for any new AI thread or
developer picking up this codebase — including work that diverges from the original
goals. Read this, then `docs/PROJECT_LOG.md` (canonical status), then only the files
your task touches. Do not re-derive project state from other markdown files; several
are stale (PROJECT_LOG has a doc map saying which).

**Accurate as of:** 2026-09-18, branch `claude/special-needs-education-01T9bKL1BjS6S3bpkcBG96Sd`
(open as PR #1 → `main`). All 22 tests passing; typecheck and build clean.

---

## 1. What this app is

A **local-first, single-user React SPA** originally built for one specific learner:
the developer's daughter (PDA/autism profile, learning disabilities, working at
kindergarten reading level — CVC words — and early math: counting 20–39, emerging
addition). It delivers:

- **Reading practice** — CVC word families with progressive phrase build-up
  ("the" → "the cat" → "the cat sat") and Web Speech text-to-speech, including a
  letter-by-letter "Sound Out" phoneme mode.
- **Math practice** — five problem types: number identification, addition with
  tappable manipulatives, number line, ten frame, touch counting.
- **Regulation supports** — sensory breaks (breathing, bubble pop, color swirls,
  counting) offered at configurable intervals, rendered inline so session progress
  survives; visual timers; visual schedules; errorless prompting levels.
- **Motivation** — token economy (stars → milestone sticker rewards), immediate
  reward celebrations, session summaries, child-facing progress/achievements screen.
- **Parent tooling** — dashboard with charts and filters, JSON export, an
  "Export for AI Analysis" button that copies a data-rich LLM prompt to the clipboard,
  and markdown unit import (see §5, the content pipeline — the app's most distinctive
  design).
- **Diagnostics** — privacy-first local logger (IndexedDB), debug panel, error
  boundary.

## 2. Design constraints (deliberate — not omissions)

1. **No backend, no network calls, ever.** All data in IndexedDB via Dexie. Privacy
   is a core promise.
2. **No router.** Navigation is a `currentView` string union in the Zustand store;
   `src/App.tsx` switches full-screen components on it.
3. **Positive-only child-facing feedback.** No penalties, no red error styling, no
   discouraging copy. Wrong answers get gentle retry framing.
4. **No new libraries** without explicit justification.
5. Child-facing UI: large touch targets, big text, Tailwind gradients, emoji icons.

**If your divergent work needs to break one of these** (e.g., multi-user, sync, a
backend), that is a project-level decision: record it in `docs/PROJECT_LOG.md`'s
Decisions log first, and prefer additive paths that keep the child-facing core
offline-capable.

## 3. Tech stack

React 18 · TypeScript 5.5 · Vite 5 · Tailwind 3 · Zustand 5 (single store,
`src/store.ts`) · Dexie 4 (IndexedDB) · Recharts (dashboard only) · date-fns ·
lucide-react · Web Speech API · Vitest (+ fake-indexeddb) for tests.

**Commands:** `npm run dev` (port 5173) · `npm run typecheck` · `npm run lint`
(known debt: ~15 `any` errors in logger.ts, scheduled for cleanup) · `npm test`
(22 tests) · `npm run build`. A `.claude/launch.json` exists for in-app browser
preview of the dev server.

## 4. Data model (Dexie tables, schema in `src/db.ts`, types in `src/types.ts`)

| Table | Shape (key fields) |
|---|---|
| `units` | id, title, tags[], goalStars[] (star milestones), createdAt |
| `phrases` | id, unitId, lines[] — each line is a cumulative build-up step |
| `mathProblems` | id, unitId, type ('identification'\|'addition'\|'number-line'\|'ten-frame'\|'touch-count'), prompt, answer, manipulatives?, rangeStart/End?, options[]? |
| `sessionLogs` | id, unitId, date, starsEarned, attempts, correct, milestonesReached[] |
| `rewards` | id, name, iconPath (emoji), milestone |
| `settings` | single row id='default': autoAdvance, breakPromptInterval, audioEnabled, dyslexiaFont, childAge, visualSchedule/TimerEnabled, immediateRewards, promptingLevel, colorScheme, animationLevel |
| `logs` | logger entries (timestamp, level, category, context) |

Schema changes use Dexie's versioned migrations (`this.version(n).stores(...)` in
db.ts) — always bump to the next unused version; never edit an existing one. Seed
data (6 units) lives in db.ts and only runs when `units` is empty.

## 5. The content pipeline (how new curriculum gets in)

Units are authored as markdown and imported by pasting into **Parent Dashboard →
Import Unit** (also Unit Management — both call `src/utils/importUnit.ts`). Format
(full spec: `UNIT_TEMPLATE.md`; reusable LLM generation prompt:
`LLM_LESSON_PLAN_PROMPT.md`):

```markdown
---
unit-id: unique-kebab-id
title: "Display Title"
difficulty: 2          # optional
goal-stars: [5, 10, 15]
---

## CVC Words
- cat

## Phrases
- the cat sat          # becomes progressive build-up automatically

## Math Problems
- 2+3                  # addition
- identify:23          # identification
- number-line:23 (20-29)
- ten-frame:23 [21,23,24,13]   # exactly 4 options
- touch-count:23 (stars)       # stars | animals
```

The intended loop: **Export for AI Analysis** (dashboard) → paste into an LLM with
the format spec → get tailored units back → import. Parsing is in
`src/utils/unitImporter.ts` (pure, tested); persistence in `importUnit.ts`.

## 6. Source map

```
src/
├── App.tsx                 view switch + app init (single-flight DB init + ready gate)
├── store.ts                Zustand: currentView, session counters, sessionPlan, settings
├── db.ts                   Dexie schema (versioned), seed data
├── types.ts                all shared interfaces
├── components/
│   ├── Home.tsx            unit cards, entry points
│   ├── ReadingPractice.tsx / MathPractice.tsx    practice hosts
│   ├── NumberLineActivity / TenFrameActivity / TouchCountActivity
│   ├── BreakPrompt.tsx     shared break-offer screen (+ hooks/useBreakFlow.tsx)
│   ├── SensoryBreak.tsx (+ BreathingBuddy, BubblePop, ColorSwirls)
│   ├── SessionSchedule / ActivityPreview / SessionSummary / VisualTimer / ImmediateReward
│   ├── ChoiceBoards.tsx / Rewards.tsx / StudentProgress.tsx
│   ├── ParentDashboard.tsx (charts, exports, import modal, DebugPanel)
│   ├── Settings.tsx / UnitManagement.tsx / ErrorBoundary.tsx
├── utils/
│   ├── unitImporter.ts     markdown → parsed unit (tested)
│   ├── importUnit.ts       parsed unit → Dexie (shared by both import dialogs)
│   ├── session.ts          session-log building/finishing (tested)
│   ├── answerOptions.ts    bounded answer-choice generation (tested)
│   └── logger.ts           local logging singleton
```

Docs: `docs/PROJECT_LOG.md` (canonical), `docs/briefs/` (phased task specs),
`SPECIAL_NEEDS_RECOMMENDATIONS.md` (evidence-base reference),
`VIRGINIA_SOL_GAP_ANALYSIS.md` + `GED_TRACK_ROADMAP.md` + `GED_AGENT_PROMPTS.md`
(standards-alignment planning, added Sept 2026), `docs/archive/` (stale — ignore).

## 7. What works vs. known gaps (honest state)

**Working and verified:** both practice modes end-to-end including all counting
activity types; imports of all unit types with progressive phrases; session stats
(attempts/correct/stars distinct, real duration); inline breaks that preserve
progress; rewards/milestones; dashboard analytics and exports; seeding; logging.

**Known gaps (specced in `docs/briefs/`, not yet built):**
- "Full Learning Session" plan flow stops after the first activity; Choice Boards
  selections are stored but unused (Phase 3 Task 2 wires both).
- Import UX polish: a paste missing its opening `---` gives a misleading error;
  `goal-stars` is required but should default (Phase 1/2 Task 3 items 6–7).
- `colorScheme` setting is a no-op; "dyslexia font" is just monospace (Phase 4 Task 4).
- No mastery tracking / IEP goals, no error-correction (Model-Lead-Test) flow, no
  social stories, no motor breaks, no teacher report pack yet (Phase 4–5 briefs).
- Bundle is one ~755 kB chunk (Phase 3 Task 3 splits it).
- Parent areas aren't passcode-gated (Phase 5 Task 2).

## 8. Working agreements for any new thread

1. `docs/PROJECT_LOG.md` is the single source of truth for status and decisions.
   Update its work-plan table + decisions log (1–3 lines) with every completed task,
   committed together with the code.
2. One task = one commit/PR-able unit. Before finishing:
   `npm run typecheck && npm run lint && npm test && npm run build` — no new failures.
3. Divergent initiatives: add a new brief file `docs/briefs/<initiative>.md` in the
   same style (self-contained tasks, acceptance criteria, guardrails) rather than
   editing the existing phase briefs, and register the initiative in PROJECT_LOG
   (work-plan table + a parking-lot or decisions entry). Existing briefs assume the
   original single-learner scope; do not silently repurpose them.
4. Respect §2 constraints unless a PROJECT_LOG decision says otherwise.
5. Git: work happens on the long-running branch above (PR #1 → main is open);
   15 old `claude/*` remote branches are an abandoned parallel-agent experiment —
   parts bin only, do not merge.
