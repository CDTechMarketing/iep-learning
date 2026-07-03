# Phase 3 — Refactoring & Session Flow Completion (3 tasks)

**Prerequisite: all of Phase 1/2 is done** (especially Tasks 5–8 — these tasks build on
the shared session helper, the inline-break pattern, and the test harness).

Paste the shared preamble from `phase-1-2-critical-fixes.md` with each task.

---

## Task 1 — Extract the duplicated break-prompt / completion machinery

**Problem:** `MathPractice.tsx` and `ReadingPractice.tsx` each contain a nearly
identical ~60-line break-prompt screen, identical `itemsCompleted`/interval logic,
identical inline-break rendering (added in Phase 1/2 Task 6), and identical
session-completion calls. Any behavior change must be made twice, and Phase 4's error
correction will touch these files heavily — dedupe first.

**Changes:**

1. Create `src/components/BreakPrompt.tsx`: presentational component with props
   `{ onTakeBreak, onContinue }`, containing the existing "Great Job! / Calming
   Activities / Quick Stretch / Skip break" screen (copy the current markup once).
2. Create `src/hooks/useBreakFlow.ts`: hook owning `itemsCompleted`, `showBreakPrompt`,
   `showBreakActivity`, exposing
   `{ noteItemCompleted(): 'break-due' | 'continue', breakUi, ... }` or a similar
   minimal API — design it so each practice component ends up with: one hook call, one
   `if (breakState) return <...>` block, and its own `moveToNext*` continuation passed in.
   The break interval comes from `settings?.breakPromptInterval` inside the hook.
3. Refactor both practice components to use them. Net line count of the two components
   should drop meaningfully; behavior identical.
4. No behavior changes in this task. Add/adjust tests only if the hook contains
   extractable pure logic (e.g., the interval arithmetic).

**Acceptance criteria:** the Task-6 (Phase 1/2) break acceptance tests still pass
verbatim in both math and reading; `grep -c "Calming Activities" src/components/*.tsx`
returns 1 (only BreakPrompt).

---

## Task 2 — Make the session plan actually work (Full Session + Choice Boards)

**Problem (two halves, one root cause):** the `SessionPlan` machinery exists but nothing
drives it, so two advertised features are decorative:

- *Full Learning Session:* Home builds a plan (reading → math → rewards) and shows
  Schedule → Preview, but when the first activity finishes, the practice component
  routes straight to `session-summary`. `updateActivityStatus('completed')` and
  `nextActivity()` are never called by anyone (verify: grep). The plan dies after one
  activity.
- *Choice Boards:* the child picks and orders activities; `setActivityChoices` stores
  them; **no component ever reads `selectedActivities`/`activityOrder`** — the board
  then just navigates home.

**Design decisions (already made — implement as stated):**

1. Move `createSessionPlan` out of `Home.tsx` into `src/utils/sessionPlan.ts` with
   signature `createSessionPlan(unit: Unit, activityTypes: Array<'reading'|'math'|'break'>): Promise<SessionPlan>`.
   It appends the `rewards` activity at the end (as today). A `break` activity gets
   `estimatedItems: 1, starsToEarn: 0`, icon 🧘.
2. **Plan-aware completion:** in the shared session helper (Phase 1/2 Task 5), add
   `completeActivity(type)` logic: if `store.sessionPlan` exists and its current
   activity matches the finishing view, then `updateActivityStatus(id,'completed')` →
   `nextActivity()` → `setCurrentView('preview')` and DO NOT write a SessionLog.
   If there is no plan (child launched Reading/Math directly from Home), keep the
   current behavior: write the log, go to `session-summary`.
   The single end-of-plan SessionLog is written by ActivityPreview's completion effect
   (Phase 1/2 Task 7B) using store totals — that path already exists; verify it.
3. **Break inside a plan:** ActivityPreview already routes `break` → `'break'` view.
   Give `SensoryBreak` plan-awareness via the same helper: when a plan is active and
   current activity is `break`, its completion marks the activity completed and returns
   to `'preview'` (it takes the `onComplete` prop path added in Phase 1/2 Task 6).
4. **Choice Boards flow:** after the child confirms selection/order:
   - If the selection includes reading and/or math → show a **unit picker step** inside
     ChoiceBoards (cards listing units from Dexie that have the required content —
     reuse the phrase/math count queries from Home). Picking a unit: `setCurrentUnit`,
     `resetSession()`, `startSession()`, build plan from the ORDERED chosen types,
     `setSessionPlan`, `setCurrentView('schedule')`.
   - If ONLY `break` was chosen → `setCurrentView('break')` directly (no plan, no unit).
   - Delete the now-unused `selectedActivities`/`activityOrder` state + `setActivityChoices`
     from `src/store.ts` (the plan is the single representation of choices).
5. Home's "Full Learning Session" button now calls the same util with
   `['reading','math']`.
6. Add tests (`src/utils/sessionPlan.test.ts` + store tests): plan built in chosen
   order with rewards appended; `nextActivity` + status updates walk the plan;
   plan-aware completion decision logic (extract it pure so it's testable).

**Acceptance criteria (manual, `npm run dev`):**
- Home → Full Learning Session on "Short A — Cat, Sat, Mat": Schedule shows 3 items →
  Preview reading → complete reading → **returns to Preview showing math as current,
  reading checked off** → complete math → rewards activity → Session Summary appears
  once, with combined stars/attempts from both activities; exactly ONE SessionLog row.
- Choice Boards: pick Math + Break, order Break first → unit picker → pick "Counting
  20-29" → Schedule shows Break, Math, Rewards → break runs first, returns to preview,
  then math, then summary.
- Choice Boards with only Break → goes straight to the break screen; exiting returns home.
- Direct "Reading" / "Math" buttons on Home still work exactly as before (log +
  summary per session).

---

## Task 3 — Code-split the parent-side bundle

**Problem:** single 755 kB JS chunk (220 kB gzip); Recharts (used only by
ParentDashboard) loads before a child can start reading.

**Changes:**

1. Lazy-load the parent-facing views in `src/App.tsx`:
   `const ParentDashboard = lazy(() => import('./components/ParentDashboard'))` — note
   the components use named exports; re-export default or map
   `.then(m => ({ default: m.ParentDashboard }))`. Same for `Settings`,
   `UnitManagement`, `StudentProgress`. Wrap the view switch in `<Suspense>` with a
   simple friendly fallback (large text "Loading…", no spinner libraries).
2. Child-facing practice components stay eagerly loaded (no perceptible delay for the
   child mid-flow).
3. Run `npm run build` and record chunk sizes in the task summary.

**Acceptance criteria:** build output shows Recharts/dashboard code in a separate
chunk; main chunk gzip size drops substantially (expect roughly ≤ 120 kB gzip);
navigating to Parent Dashboard still renders charts; no Suspense flash when moving
between child-facing views.
