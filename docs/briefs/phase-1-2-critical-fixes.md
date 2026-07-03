# Phase 1/2 — Critical Fixes & Stabilization (8 tasks)

Execute tasks **in order** — later tasks assume earlier ones are done. Each task below
is self-contained: paste the **shared preamble** plus **one task** into the coding model.
One task = one commit/PR.

---

## SHARED PREAMBLE (paste with every task)

> You are working on the IEP Learning app: a local-first React 18 + TypeScript + Vite
> SPA for a special-needs learner (autism, kindergarten reading level). Stack: Zustand
> store (`src/store.ts`), Dexie/IndexedDB (`src/db.ts`), Tailwind. There is NO router —
> `currentView` in the store switches full-screen components in `src/App.tsx`. There is
> NO backend and there must never be any network call.
>
> Hard rules:
> - Positive-only feedback for the child. Never add penalties, red error styling, or
>   discouraging copy to child-facing screens.
> - Do not add libraries, routers, or backend services unless the task says so.
> - Do not redesign UI; match the existing Tailwind style of surrounding code.
> - Keep changes scoped to the files the task names (plus imports).
> - Before finishing, run `npm run typecheck`, `npm run lint`, `npm run build` — all
>   must pass with no NEW errors/warnings (15 pre-existing lint errors in
>   `src/utils/logger.ts` and some hook warnings are known; don't add more).
>   If `npm test` exists (after Task 8), run it too.
> - End by listing exactly what you changed and how you verified each acceptance
>   criterion (run the app with `npm run dev` and check manually where asked).

---

## Task 1 — Fix the infinite loop that freezes math practice (CRITICAL)

**Bug:** In `src/components/MathPractice.tsx`, `generateAnswerOptions(correctAnswer, type)`
is called unconditionally for EVERY problem type (near the bottom of the component,
just before the main `return`: `const answerOptions = generateAnswerOptions(...)`).
Its non-`identification` branch only accepts candidate options that are `<= 10` and
within ±2 of the correct answer. For any answer ≥ ~13 (e.g. all `number-line`,
`ten-frame`, `touch-count` problems in the seeded "Counting 20-29" and "Counting 30-39"
units), no candidate can ever qualify, so `while (options.size < 4)` never terminates
and the browser tab freezes the moment the unit opens.

**Secondary bug (fix in the same change):** because the call sits at render scope with
`Math.random()`, the four answer options are re-generated on every re-render — when the
child taps an answer, the re-render shuffles the options during the feedback state.

**Required changes in `src/components/MathPractice.tsx`:**

1. Rewrite `generateAnswerOptions` to be deterministic-terminating: build a finite
   candidate pool instead of a rejection-sampling `while` loop.
   - For `identification`: candidates = integers in `[max(0, answer-range), answer+range]`
     excluding the answer, where `range = answer > 50 ? 10 : 5`. Shuffle, take 3,
     add the answer, sort ascending.
   - For everything else (addition): candidates = integers in
     `[max(0, answer-3), answer+3]` excluding the answer. Remove the old `option <= 10`
     cap entirely. Shuffle, take 3, add answer, sort ascending.
   - If the pool has fewer than 3 candidates (tiny answers), extend upward
     (answer+4, answer+5, …) until it has 3.
2. Only compute options for problem types that USE them (`identification`, `addition`).
   `number-line`, `ten-frame`, `touch-count` render their own components and must not
   trigger option generation.
3. Compute options ONCE per problem, not per render: use
   `useMemo(..., [currentProblem?.id])`. NOTE: hooks must be called unconditionally —
   place the `useMemo` ABOVE the early-return blocks (`if (!currentUnit)`,
   `if (isLoading || !currentProblem)`), guarding inside the memo for an undefined
   problem (return `[]`).
4. Remove the leftover debug `console.log` calls inside `renderActivityContent`.

**Acceptance criteria (verify in `npm run dev`):**
- Open the "Counting 20-29" unit → Math. The number-line activity renders (no freeze);
  you can complete several problems of all three types through to the session summary.
- Open "Short A — Cat, Sat, Mat" → Math. Identification and addition problems show 4
  distinct options including the correct answer; options DO NOT change while the
  green/feedback state is showing.
- An addition problem with a large answer (temporarily test `generateAnswerOptions(23,
  'addition')` in a scratch call or test) returns 4 distinct non-negative options
  including 23, instantly.

---

## Task 2 — Parent Dashboard import must preserve math problem types (CRITICAL)

**Bug:** `src/utils/unitImporter.ts` (`parseUnitMarkdown`) correctly parses five math
formats — `1+1`, `identify:5`, `number-line:23 (20-29)`, `ten-frame:23 [21,23,24,13]`,
`touch-count:23 (stars)` — returning `type`, `options`, `rangeStart`, `rangeEnd`,
`manipulatives`. But `handleImportUnit` in `src/components/ParentDashboard.tsx` throws
all of that away and hardcodes every problem to
`type: 'addition', manipulatives: 'blocks'`. Any imported counting unit becomes
malformed addition problems.

**Required changes in `src/components/ParentDashboard.tsx` (`handleImportUnit`):**

1. Map each parsed problem to a `MathProblem` preserving `type`, `prompt`, `answer`,
   and, when present, `manipulatives`, `rangeStart`, `rangeEnd`, `options`.
2. Cast/validate `manipulatives` against the union in `src/types.ts`
   (`'blocks' | 'icons' | 'stars' | 'animals'`); if the parsed string isn't one of
   those, omit the field.
3. Use type-aware IDs: `${unitId}-prob-${idx + 1}` is fine for all.
4. Tags: `parseUnitMarkdown` currently tags any math as `['math','addition']`. Improve
   it (in `src/utils/unitImporter.ts`) to tag from actual problem types present:
   always `'math'`, plus `'addition'`, `'number-sense'` (for identification /
   number-line / ten-frame / touch-count) as applicable. Keep `'cvc','reading'` logic
   as is. (Home.tsx and the dashboard's accuracy breakdown match on the `number`/
   `addition`/`cvc` substrings — keep those matchable.)

**Acceptance criteria:**
- Import this unit via Parent Dashboard → Import Unit, then open it from Home → Math,
  and verify a number line (40–49), a ten-frame with those 4 choices, and a touch-count
  screen all render and are completable:

```markdown
---
unit-id: test-counting-40-49
title: "Test Counting 40-49"
goal-stars: [5, 10]
---

## Math Problems
- number-line:43 (40-49)
- ten-frame:45 [44,45,46,35]
- touch-count:41 (stars)
- identify:47
- 2+3
```

- The imported unit's card on Home shows a Math button (and no Reading button).
- Re-importing the same markdown shows the friendly duplicate-ID error (existing behavior).

---

## Task 3 — One import pipeline: delete the legacy parser

**Bug:** There are two incompatible markdown import paths.
`src/utils/unitImporter.ts` handles the documented frontmatter format (see
`UNIT_TEMPLATE.md`); `src/utils/markdownParser.ts` handles an old `[cvc-words]`
bracket-section format that no documentation describes. `src/components/UnitManagement.tsx`
uses the OLD one, so pasting the documented format into Unit Management's import dialog
fails with "Unit must have id and title".

**Required changes:**

1. Create `src/utils/importUnit.ts` exporting
   `importUnitFromMarkdown(markdown: string): Promise<{ title: string }>` that does what
   `ParentDashboard.handleImportUnit` currently does inline: `validateMarkdown` →
   `parseUnitMarkdown` → duplicate-ID check (throw `Error` with the current friendly
   message) → write unit, phrases (CVC words + phrases), and math problems to Dexie.
   Preserve problem types (Task 2's mapping lives here now).
2. Refactor `ParentDashboard.tsx` to call it (keep its modal UI, error display, toast).
3. Refactor `UnitManagement.tsx` to call it too, and replace `exampleMarkdown` there
   with the frontmatter format (copy the example from ParentDashboard's modal).
4. Delete `src/utils/markdownParser.ts` entirely. Remove its import from UnitManagement.
5. Progressive phrases: the old parser split multi-word phrases into cumulative lines
   (word-by-word build-up), which matches how ReadingPractice displays `lines`.
   Add that behavior to the shared path: when a `## Phrases` entry has multiple words,
   store `lines` as the cumulative build-up (`["the", "the cat", "the cat sat"]`);
   CVC words stay single-line. This makes imported reading units behave like seeded ones.

**Acceptance criteria:**
- The same frontmatter markdown (use Task 2's sample plus a `## CVC Words` and
  `## Phrases` section) imports successfully from BOTH Unit Management and Parent
  Dashboard (in separate runs with different `unit-id`s).
- Imported phrase "the cat sat" displays in ReadingPractice as a 3-step build-up.
- `src/utils/markdownParser.ts` no longer exists; `grep -r markdownParser src/` is empty.
- Old bracket-format markdown now produces the friendly validation error, not a crash.

---

## Task 4 — Housekeeping: dead dependency, debug logs, stray content

**Changes:**

1. `npm uninstall @supabase/supabase-js` — it is imported nowhere (verify with
   `grep -r supabase src/`) and `.env` is empty.
2. Remove the debug `console.log` embedded in JSX in `src/App.tsx` (the
   `{console.log('App: Rendering MathPractice...')}` inside the `currentView === 'math'`
   block — render `<MathPractice />` directly).
3. Remove `console.log` lines from `initializeDatabase`/`seedInitialData` in `src/db.ts`
   (keep `console.error` on failure; the `logger` calls in App.tsx stay).
4. In `src/components/ReadingPractice.tsx`, replace the direct
   `useStore.setState({ currentView: 'home' })` in `handleQuitSession` with the
   `setCurrentView('home')` action already destructured in the component.

**Acceptance criteria:** typecheck/lint/build pass; `grep -rn "console.log" src/` shows
none outside `src/utils/logger.ts`; app boots and both practice modes still work.

---

## Task 5 — One source of truth for session stats (fixes wrong accuracy data)

**Bug:** Session accounting is duplicated and inconsistent. The store
(`src/store.ts`) tracks `sessionStars`, `sessionAttempts`, `sessionCorrect` via
`addStar`/`recordAttempt` — and components DO call those. But when writing the
`SessionLog`, `MathPractice.handleSessionComplete` writes `attempts: itemsCompleted`
(a local counter of problems finished, not answer attempts) and **`correct:
sessionStars`** (stars ≠ correct answers). `ReadingPractice` writes
`correct: itemsCompleted`. Result: Parent Dashboard accuracy, Student Progress accuracy,
and the AI-analysis export are all computed from wrong numbers. Also,
`store.startSession()` (which sets `sessionStartTime`) is never called anywhere, so
SessionSummary's duration always shows "< 1m".

**Required changes:**

1. Create `src/utils/session.ts` exporting
   `completeSession(): Promise<void>`-style helper — concretely:
   `buildSessionLog(unit: Unit, stats: {stars, attempts, correct}): SessionLog` and
   `finishSession(unit)` that reads `sessionStars/sessionAttempts/sessionCorrect` from
   `useStore.getState()`, builds the log (same shape as today: id, unitId, date via
   `format(new Date(),'yyyy-MM-dd')`, milestonesReached from `unit.goalStars`),
   writes it with `db.sessionLogs.add`, calls `setCurrentSessionLog`, and navigates to
   `'session-summary'`.
2. Replace `handleSessionComplete` in BOTH `MathPractice.tsx` and `ReadingPractice.tsx`
   with a call to this helper. `attempts` must come from `sessionAttempts` and `correct`
   from `sessionCorrect` (store values). Keep each component's local `itemsCompleted`
   ONLY for the break-prompt interval logic.
3. Call `startSession()` wherever a session begins: `Home.handleStartReading`,
   `Home.handleStartMath`, `Home.handleStartFull` (after `resetSession()`).
4. `SessionSummary.tsx`: move the `logger.info('session-summary', ...)` call into a
   `useEffect` with `[]` deps (it currently logs on every render).

**Acceptance criteria:**
- Complete a math session answering at least one problem wrong on the first try:
  Session Summary shows attempts > correct, accuracy < 100%, and a real duration.
- Complete a reading session: accuracy 100% (errorless by design), duration real.
- Parent Dashboard "Last Session" accuracy matches what you actually did.
- Only ONE SessionLog row is created per completed session (check via Parent Dashboard
  session count or the DebugPanel).

---

## Task 6 — Breaks must not destroy session progress

**Bug:** During math/reading practice, the break prompt's "Calming Activities" button
does `setCurrentView('break')`, which unmounts the practice component (losing
`currentProblemIndex` etc.). `SensoryBreak`'s only exit (`handleComplete`) goes to
`'home'`. So a child who takes a suggested break loses the whole session — the opposite
of what a break should do in an autism-support app.

**Required approach — render the break inline instead of navigating:**

1. `src/components/SensoryBreak.tsx`: add an optional prop
   `onComplete?: () => void`. In `handleComplete`, call it if provided; otherwise keep
   `setCurrentView('home')` (standalone use from App view routing stays valid).
2. In `MathPractice.tsx` and `ReadingPractice.tsx`: add local state
   `showBreakActivity: boolean`. The break prompt's "Calming Activities" button sets it
   true INSTEAD of navigating. When true, render `<SensoryBreak onComplete={...} />`
   (full-screen, replacing the practice UI but NOT unmounting the component's state —
   i.e., conditional render inside the component, before the main return, like the
   existing `showBreakPrompt` block). `onComplete` sets it false and calls the existing
   `moveToNextProblem()` / `moveToNextPhrase()` continuation.
3. Keep the "Quick Stretch" and "Skip break" buttons behaving as today (continue).

**Acceptance criteria:**
- In Settings set Break Prompt Interval to 3. Start "Counting 20-29" math, complete 3
  problems, choose "Calming Activities", do a breathing exercise, tap "I'm Ready to
  Continue!" → you are back in math at problem 4 with your stars intact.
- Same test in Reading.
- Navigating to a break from anywhere else (e.g., a `break` activity in a session plan)
  still exits to home as before.

---

## Task 7 — Crash guards, render side-effects, and the data-loss trap

Three small, unrelated-looking fixes that all stabilize existing behavior:

**A. Auto-advance crash (`src/components/ReadingPractice.tsx`):** the `useEffect` that
implements auto-advance reads `currentPhrase.lines` — but `currentPhrase` is
`undefined` until phrases load from Dexie (effects run even when the render bailed to
the loading branch). With the Auto-Advance setting ON, the first render throws.
Fix: guard `if (!settings?.autoAdvance || !currentPhrase) return;` inside the effect and
add `currentPhrase` to the dependency array. While there, fix the other missing-dep
warnings in this file properly (wrap `loadPhrases` in `useCallback` or move it inside
the effect) rather than suppressing them.

**B. Side effects during render:**
- `src/components/ActivityPreview.tsx`: the "all activities completed" branch calls
  `db.sessionLogs.add(...)` and `setCurrentView(...)` during render. Under React
  StrictMode (which this app uses) that can double-write logs. Move the whole
  completion block into a `useEffect` keyed on
  `[sessionPlan?.currentActivityIndex]`, with an internal guard so it writes at most
  once. Render `null` (or a brief "Wrapping up..." screen) while it runs.
- `src/components/SessionSchedule.tsx`: `if (!sessionPlan) { setCurrentView('home'); return null; }`
  sets store state during render. Move to `useEffect`.
- `src/components/Rewards.tsx`: add `currentUnit` to `loadRewards`'s effect deps
  (currently `[]`, so it computes totals with a stale/absent unit).

**C. "Reset Database" wipes the child's entire progress
(`src/components/Settings.tsx`):** `handleResetDatabase` clears `sessionLogs` (all
historical progress) while its copy says it only reloads sample data. Change it to
preserve `sessionLogs` and `logs` (clear only `units`, `phrases`, `mathProblems`,
`rewards`, then reload). Update the button copy to "Reload Sample Content" and the
description to say progress history is kept. Add a separate, clearly-labeled danger
button "Erase ALL data including progress history" that requires typing `ERASE` in a
prompt before clearing everything.

**Acceptance criteria:**
- Enable Auto-Advance in Settings, open a reading unit → no crash; lines auto-advance.
- Complete a full session; exactly one SessionLog exists for it (StrictMode on).
- "Reload Sample Content" keeps Parent Dashboard history; the ERASE path (typed
  confirmation) clears it.
- No new lint warnings; ideally the hook-deps warnings for ReadingPractice and Rewards
  are gone.

---

## Task 8 — Test harness (Vitest) + regression tests for everything above

**Goal:** the project has zero tests. Add Vitest and lock in the Phase 1/2 fixes so
future model-driven changes can't silently regress them.

**Changes:**

1. `npm i -D vitest fake-indexeddb` and add `"test": "vitest run"` to package.json
   scripts. No jsdom/component testing needed — unit-test pure logic only.
2. Extract `generateAnswerOptions` out of `MathPractice.tsx` into
   `src/utils/answerOptions.ts` (export it; MathPractice imports it).
3. Write tests:
   - `src/utils/answerOptions.test.ts`: for answers 2, 9, 23, 47 × types
     `identification`/`addition`: returns 4 distinct options, includes the answer, all
     ≥ 0, completes instantly (this is the freeze regression test).
   - `src/utils/unitImporter.test.ts`: parses all five math formats with correct
     type/fields; cumulative phrase build-up; missing `unit-id`/`title`/`goal-stars`
     throws; `validateMarkdown` rejects empty/section-less input; ten-frame options
     array parsed with 4 entries.
   - `src/utils/session.test.ts`: `buildSessionLog` computes milestonesReached
     correctly (stars ≥ goal), uses attempts/correct as given.
   - Store: `src/store.test.ts` — `recordAttempt` increments attempts always and
     correct only when true; `resetSession` clears counters;
     `updateActivityStatus`/`nextActivity` behave on a sample plan.
4. If Dexie access makes importUnit hard to test directly, split parsing (pure,
   tested) from persistence (thin, untested) — parsing is already separate; keep it so.

**Acceptance criteria:** `npm test` passes; the answerOptions test fails if someone
reintroduces the `option <= 10` cap (verify by temporarily breaking it);
typecheck/lint/build still pass.
