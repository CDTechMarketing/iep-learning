# Phase 5 — Hardening, Reports & Future Prep (5 tasks)

**Prerequisite: Phase 4 done** (Task 1 here depends on mastery/goals data from Phase 4
Task 3). Paste the shared preamble from `phase-1-2-critical-fixes.md` with each task.

Task 1 is the highest-value item for the project's stated goal (teacher/IEP
collaboration) and can be pulled forward to right after Phase 4 Task 3 if desired.

---

## Task 1 — Teacher & IEP report pack

**Why:** the parent needs artifacts to bring to teacher conversations and IEP meetings:
progress reports, observations, and "here's what we're working on" summaries that
augment classroom instruction.

**Spec:**

1. **Printable progress report** (new dashboard section "Reports"):
   - A report view for a selected date range (reuse dashboard's existing range filters):
     summary stats, per-skill mastery table (from Phase 4 Task 3), IEP goal progress
     bars, stars/session chart, break usage if available, and a "Suggested focus"
     section (top 3 lowest-accuracy skills with ≥ N attempts).
   - Print styling: a dedicated print stylesheet (`@media print`) that hides nav/
     buttons and formats for Letter paper. "Print / Save as PDF" button calls
     `window.print()` — no PDF library; the browser's print-to-PDF is sufficient and
     keeps the app offline-first.
2. **Notes & observations:** new Dexie table `observations`
   (`++id, date, text, tags`) with a simple add/list/delete UI in the dashboard
   ("Very focused after breakfast", "Frustrated during math"). Included in the printed
   report (last 10 in range) and in the CSV export.
3. **CSV export:** alongside the existing JSON export, add "Export CSV" producing
   session-level rows (date, unit, attempts, correct, accuracy, stars, milestones) —
   teachers live in Excel. Plain string building, no library.
4. **Teacher-conversation prompt:** extend the existing "Export for AI Analysis"
   feature with a second button "Copy Teacher Summary Prompt" that generates an LLM
   prompt asking for: a plain-language progress narrative, suggested IEP goal language
   aligned to current data, and 3 classroom accommodation suggestions — using the same
   data payload. (The LLM stays outside the app, same as the lesson-plan pipeline.)
5. Tests: CSV escaping/format, suggested-focus selection logic.

**Acceptance criteria:** print preview of a report is clean and complete on one to two
pages; CSV opens correctly in a spreadsheet; observations persist and appear in the
report; teacher-summary prompt lands on the clipboard with real data embedded.

---

## Task 2 — Parent gate (passcode)

**Why:** `AppSettings.parentPasscode` exists in types but nothing uses it. The child
can open Settings/Dashboard and (worst case) reach the data-erase button. This is
child-proofing, not security.

**Spec:**

1. Settings: "Parent Gate" section — enable/disable + set a 4-digit PIN (stored
   plaintext in settings; explicitly comment that this is a child-proofing gate, not
   security).
2. When enabled, navigating to `dashboard`, `settings`, or `units` shows a
   `ParentGate` overlay first: large keypad, "Ask a grown-up for help!" copy, gentle
   dismiss back to home. Correct PIN unlocks for the session (store a
   `parentUnlocked` flag in the Zustand store; cleared on reload — do not persist).
3. Fallback: a "forgot PIN" path — hold-press (3s) reveals instructions to reset via
   a browser-console command, or simply disable after 5 wrong attempts + a 60s
   cooldown with friendly copy. Keep it simple; the parent owns the device.
4. Tests: gate state logic (attempts, cooldown) as a pure reducer.

**Acceptance criteria:** with the gate on, child-facing flows never require the PIN;
the three parent views do; PIN persists across reloads; disabling removes the gate.

---

## Task 3 — Installable offline app (PWA)

**Why:** the child uses this on a tablet; it should launch from a home-screen icon and
work fully offline (it's already offline-by-design except for asset loading).

**Spec:**

1. Add `vite-plugin-pwa` (this is the one allowed new dependency): manifest (name
   "IEP Learning", standalone display, portrait, theme color matching the app's
   gradient palette), generated icons from a simple source image (create a basic
   512×512 star/book icon as an SVG-derived PNG placed in `public/`).
2. Service worker: precache the built assets (`generateSW` mode, default Workbox
   config). No runtime caching rules needed — there are no network calls.
3. Update-safe: use `registerType: 'autoUpdate'`; verify a rebuilt version replaces
   the old one after reload (document the behavior in the PR).
4. Verify IndexedDB survives installed-app restarts (it does; just test it).

**Acceptance criteria:** Lighthouse (or devtools Application tab) shows a valid
manifest + registered SW; with devtools "Offline" checked, a hard reload still loads
the full app and a practice session works end-to-end; "Install app" works in Chrome
and the installed window opens standalone.

---

## Task 4 — Logging & lint hygiene

**Spec:**

1. `src/utils/logger.ts`: `cleanupOldLogs()` currently runs a delete query on EVERY
   log write. Throttle it: run at most once per app boot (flag on the Logger instance)
   plus once per 24h (`lastLogCleanup` timestamp in `localStorage`).
2. Replace the 15 `any` types in logger.ts with `unknown` / a
   `LogContext = Record<string, unknown>` alias; fix knock-on type errors at call
   sites. Target: `npm run lint` → **0 errors**.
3. Fix remaining hook-dependency warnings project-wide (there should be few left after
   earlier phases). Target: 0 warnings, no `eslint-disable` except where a comment
   justifies it.
4. Add `npm run lint` + `npm test` guidance to the shared preamble expectation: from
   this task on, briefs require a fully clean lint.

**Acceptance criteria:** `npm run lint` exits 0 with 0 problems; logging still works
(DebugPanel shows entries); a long practice session doesn't fire cleanup queries per
answer (add a temporary counter/log to verify, then remove it).

---

## Task 5 — Productization discussion doc (NO CODE)

**Why:** long-term goal is offering the app to other special-needs families (free or
paid). That decision shapes deployment, data, and compliance — decide before building.

**Deliverable:** `docs/PRODUCTIZATION.md` analyzing options with a recommendation:

1. **Packaging paths:** (a) stay a PWA — zero-install, offline, no server, data stays
   on-device (strongest privacy story, weakest discoverability/billing);
   (b) desktop app (Tauri preferred over Electron for size) for Mac/Windows;
   (c) hosted multi-tenant SaaS on AWS/GCP (requires accounts, sync, backend — the
   largest departure from the current architecture).
2. **What productization forces regardless of path:** multi-child profiles; onboarding
   (today's seed assumes one specific learner); content management for non-technical
   parents; the LLM pipeline UX (paste-based today — fine for the developer, rough for
   customers); backup/restore of IndexedDB data (export/import full DB as JSON).
3. **Compliance:** COPPA (child data), FERPA (if schools adopt it), accessibility
   (WCAG 2.1 AA) — what each implies per packaging path. Local-only storage keeps the
   compliance surface dramatically smaller; state that tradeoff clearly.
4. **Recommendation + phasing:** cheapest credible path first (likely: polish the PWA
   + full-DB backup/restore + multi-profile, defer any backend), with rough effort
   ranges.

This document is an input to a future architecture conversation — it must NOT change
any code, and no code should pre-build for hypothetical scale before that conversation.

**Acceptance criteria:** the doc exists, is under ~200 lines, ends with a concrete
recommendation and an explicit list of "decisions needed from the owner."
