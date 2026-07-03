# Phase 4 — Feature Completion (5 tasks)

**Prerequisite: Phases 1/2 and 3 done.** Paste the shared preamble from
`phase-1-2-critical-fixes.md` with each task.

Ordering rationale: Task 1 (content) and Task 2 (error correction) directly serve the
learner's current level — CVC reading and early addition/counting. Task 3 (mastery/IEP)
serves the parent/teacher loop. Tasks 4–5 close accessibility promises the UI already
makes.

---

## Task 1 — Starter curriculum pack (content, low risk — do first)

**Problem:** the docs claim 9 CVC word families; the seed has 5 (-at, -an, -ig, -og,
-ug). `short-e-et.md` sits unimported at the repo root. Math seed jumps from addition-
to-9 straight to counting 20–39 — nothing covers counting 0–19 or truly easy addition,
which is where the learner is.

**Changes (all in `src/db.ts` seed + a data module):**

1. Move seed content out of `db.ts` into `src/data/seedUnits.ts` (plain typed arrays;
   `seedInitialData` iterates them). No format change to the DB.
2. Add reading units (same progressive-phrase style as existing ones):
   - Short E — -et family (transcribe from `short-e-et.md`, then delete that file)
   - Short I — -it family; Short O — -ot family; Short U — -ut family
3. Add math units:
   - "Counting 0-9" and "Counting 10-19": number-line (rangeStart/End 0-9 / 10-19),
     ten-frame (options: answer, ±1, and a place-value distractor), touch-count — 5 of
     each type per unit, mirroring the 20-29 unit's structure.
   - "Easy Addition to 5": sums ≤ 5 with `manipulatives: 'blocks'` (8 problems).
4. Fix the hardcoded 20–29 fallback in `src/components/TenFrameActivity.tsx`: when
   `problem.options` is absent, generate 4 options around the answer (answer, answer±1,
   answer−10 if ≥ 0, else answer+10) — no fixed range filter.
5. Bump seeding for EXISTING installs: seeding only runs when `units` count is 0, so
   the developer's install won't get new units. Add a lightweight
   `contentVersion` row in `settings` (or a dedicated `meta` table via a new Dexie
   version — use the next unused version number) and top-up logic: on init, insert any
   seed unit whose id doesn't exist yet. Never overwrite or duplicate existing units;
   never touch sessionLogs.
6. Tests: seed data integrity (every phrase/mathProblem `unitId` matches a seeded unit;
   ten-frame problems have 4 options including the answer; number-line answers lie
   within their range).

**Acceptance criteria:** fresh profile (ERASE path) shows ~11 units; an existing
profile (with session history) gains the new units after reload WITHOUT losing
history; every new unit is completable end-to-end; `short-e-et.md` is gone from the
repo root.

---

## Task 2 — Errorless error correction: Model → Lead → Test

**Why:** currently a wrong answer gets "Keep trying!" with no instruction. Model-Lead-
Test is the evidence-based ABA correction flow this app was always meant to have
(see `IMPLEMENTATION_ASSESSMENT.md` §2 for background — note that doc is stale on
project status but its Tier-1 feature specs are the requirements source).

**Scope:** math activities only (identification, addition, number-line, ten-frame).
Reading is already errorless. Touch-count cannot be answered wrong.

**Behavior spec (all copy child-friendly and positive):**

1. On an incorrect answer, instead of just feedback:
   - **MODEL:** overlay/inline panel "Let me show you! The answer is N" with the
     correct option visually highlighted (reuse the existing full-prompt highlight
     styling: yellow pulse + ring + bounce arrow).
   - **LEAD:** "Let's do it together — tap N!" Only the correct option is tappable
     (others disabled but visible, no red styling). Tapping it advances.
   - **TEST:** "Now you try!" — the same problem presented fresh, all options enabled.
     Correct → celebrate exactly like a normal correct answer (star, immediate reward
     if enabled). Incorrect on TEST → repeat MODEL (loop, max 2 correction cycles, then
     move on with encouragement — never punish).
2. Stars: award the star when the child succeeds on TEST (a corrected response still
   earns the star — positive-only economy). Track it distinctly (below).
3. Data: `recordAttempt(false)` fires only for the ORIGINAL error (not lead/test taps).
   Log corrections via `logger.userError(activity, problemId, { corrected: true, cycles })`.
   Optionally add `correctedResponses: number` to the store session counters and
   SessionLog (add Dexie version bump ONLY if you persist it — next unused version).
4. Settings (`AppSettings` + Settings UI + DB default in the next unused Dexie
   version's upgrade — follow the existing pattern in `src/db.ts`):
   `errorCorrection: { enabled: boolean (default true) }`. Keep it to a single toggle —
   do NOT build the six-flag structure from the old doc; start simple.
5. Implementation shape: a `useErrorCorrection` hook + a `CorrectionOverlay` component;
   the three counting activities receive an optional `correctionState` prop or, better,
   keep correction orchestration in MathPractice and pass down
   `forcedHighlight`/`onlyCorrectEnabled` props. Choose the least invasive wiring but
   keep per-activity changes small.

**Acceptance criteria:** with the toggle on, answering a number-line problem wrong
walks through Model → Lead → Test and a correct TEST answer earns a star and continues;
with the toggle off, old behavior; wrong answers still never show red/negative UI;
SessionLog accuracy counts the original attempt as incorrect; tests cover the
correction state machine (extract it as a pure reducer/function).

---

## Task 3 — Mastery tracking & IEP goals

**Why:** the #1 Tier-1 item — turns session logs into "which skills are mastered /
progressing / emerging," the data a parent brings to IEP meetings.

**BEFORE WRITING CODE:** check the unmerged remote branch
`claude/mastery-tracking-tier1-016De8Z8AuStYMHC4VgzaADX`
(`git fetch && git diff main...origin/claude/mastery-tracking-tier1-016De8Z8AuStYMHC4VgzaADX --stat`).
If it contains a working schema/UI, port the good parts onto current code (do NOT
merge the branch — the codebase has diverged). Summarize in your PR what was reused.

**Spec:**

1. **Skill taxonomy (keep derivable, not hand-entered):** a skill =
   `unit tag group × activity type`, e.g. `cvc/short-e × reading`,
   `counting-20-29 × number-line`, `addition × addition`. Implement
   `skillKeyForProblem(unit, problem)` / `skillKeyForPhrase(unit)` in
   `src/utils/skills.ts`.
2. **Per-skill attempt records:** new Dexie table `skillAttempts`
   (`++id, skillKey, date, correct`) written alongside `recordAttempt` during practice
   (next unused Dexie version; follow existing version-bump pattern). This gives
   per-skill accuracy that SessionLogs (per-unit) cannot.
3. **Mastery computation (pure function, tested):** for a skill, look at the last N=3
   distinct practice DAYS: `mastered` if accuracy ≥ 80% on each of the last 3 days
   (≥ 5 attempts each), `progressing` if trend positive or accuracy ≥ 60%, else
   `emerging`. Compute on demand — no stored denormalized state to drift.
4. **IEP goals:** new table `iepGoals` (`id, description, targetDate, baseline,
   targetValue (accuracy %), skillKeys: string[], createdAt`). Parent Dashboard gets a
   "Goals & Mastery" section: create/edit/delete goals (form modal, parent-styled like
   the import modal); per-goal progress bar = current combined accuracy of its skills
   vs. baseline→target; per-skill mastery chips (🌱 emerging / 📈 progressing /
   ✅ mastered + date-ish info).
5. **Include mastery + goal status in the AI-analysis export prompt**
   (`formatAIAnalysisPrompt`) so generated lesson plans target weak skills.
6. Tests: mastery thresholds/edge cases, goal progress math, skillKey derivation.

**Acceptance criteria:** after several sessions (seed manually or via a dev helper),
dashboard shows per-skill mastery states; a goal "Count 20-29 at 80%" tracks and
updates from real practice; existing installs upgrade without data loss; export prompt
contains the new sections.

---

## Task 4 — Make the accessibility settings real (color scheme, animation, dyslexia font)

**Problem:** Settings offers `colorScheme` (high-contrast / pastel / grayscale) and it
is applied NOWHERE (grep confirms). `animationLevel` is honored only by
ImmediateReward. "Dyslexia-Friendly Font" just switches to `font-mono`, which is not a
dyslexia-friendly typeface.

**Changes:**

1. **Mechanism:** in `App.tsx`, set classes on the root wrapper from settings:
   `scheme-default | scheme-high-contrast | scheme-pastel | scheme-grayscale` and
   `anim-full | anim-reduced | anim-none`. Implement schemes with CSS in
   `src/index.css` using targeted overrides — pragmatic approach for this codebase's
   inline-Tailwind style:
   - `grayscale`: `filter: grayscale(0.9)` on the wrapper + slightly boosted contrast.
   - `high-contrast`: black text / white surfaces / 2px+ borders via a small set of
     CSS-variable-driven overrides on background gradients (`.scheme-high-contrast
     [class*='bg-gradient'] { background-image: none; ... }`) — keep it coarse but
     effective; do not attempt to restyle every component.
   - `pastel`: reduce saturation (`filter: saturate(0.6)`).
   - `anim-none`: `*, *::before, *::after { animation: none !important; transition:
     none !important; }` under `.anim-none`; `anim-reduced`: disable only
     `animate-bounce`/`animate-pulse` (keep transitions).
2. **Font:** bundle a dyslexia-friendly font LOCALLY (no CDN — offline-first). Use
   **Lexend** (SIL Open Font License): add woff2 to `src/assets/fonts/`, `@font-face`
   in index.css, and a `.font-dyslexic` class applied to the root when the setting is
   on; replace the scattered `font-mono` conditionals in ReadingPractice/MathPractice
   with inheritance from the root class. Verify the license file is included.
3. Also honor `animationLevel` in the obvious hot spots: SessionSummary bounce,
   NumberLine/TenFrame pulse hints (the CSS-class approach above should cover them —
   verify visually).

**Acceptance criteria:** flipping each Settings value visibly changes the app
everywhere (Home, practice, summary); `animationLevel: none` shows zero motion;
dyslexia font renders Lexend in reading practice; no network request for fonts
(check devtools Network tab); settings persist across reload.

---

## Task 5 — Social stories

**Why:** Tier-1 autism support — short first-person picture stories that prepare the
child for transitions ("My Learning Time", "When I Need a Break", "Making Mistakes is
Okay"). Requirements background in `IMPLEMENTATION_ASSESSMENT.md` §3.

**Spec:**

1. Types + Dexie table `socialStories` (next unused version):
   `{ id, title, icon, pages: Array<{ text: string; emoji: string }>, builtIn: boolean }`.
   Seed the three stories above using the page scripts from the assessment doc
   (emoji as the visual; no image assets).
2. `SocialStoryViewer` component: one page at a time, huge emoji + large text,
   Next/Back, optional read-aloud button reusing the Web Speech pattern from
   ReadingPractice (`speechSynthesis`, rate ~0.75), honoring `settings.audioEnabled`.
   Child-friendly, full-screen, exits via `onClose`.
3. Entry points:
   - Home: a small "📖 My Stories" button → story picker → viewer.
   - Break prompt (BreakPrompt component): third option "Read a story" → shows
     "When I Need a Break", then returns to the break prompt choice.
   - First launch: if no sessions exist in `sessionLogs`, offer (don't force) "My
     Learning Time" before the first activity starts.
4. Parent Dashboard: "Manage Stories" — create/edit/delete custom stories (title,
   pages of text + emoji picker can be a plain text input for the emoji). Built-in
   stories are editable but restorable (a "restore built-in stories" button re-seeds
   any missing built-ins).
5. Tests: story seeding/top-up logic (same pattern as content pack), pure page-nav
   state if extracted.

**Acceptance criteria:** all three stories readable from Home; break prompt offers the
break story mid-practice and returns correctly (session progress intact — reuse the
inline pattern, do NOT navigate views); parent can create a custom story and the child
sees it; fresh install offers "My Learning Time" once.
