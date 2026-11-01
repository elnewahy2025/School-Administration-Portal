# Prompt: fix all issues in School Admin Portal

Copy everything below the line into your AI coding agent (for example Claude Code) at the project root.
Put `School_Admin_Portal_Inspection_Report.md` in the project root first so the agent can read it.

---

You are fixing the issues listed in `School_Admin_Portal_Inspection_Report.md` in this Next.js, Supabase, next-intl (Arabic and English, RTL) project. Read that report completely before you change anything. Finding IDs below (H1, K2, M4, and so on) refer to it.

## 0. Ground rules

1. Read `AGENTS.md` and follow it. In particular the lint rules enforce: one export per file (except framework files such as `page.tsx`, `route.ts`, `layout.tsx`, barrels and `*-styles.ts`), at most 300 lines per file, at most 80 lines per function, complexity at most 10, no hard-coded colours or fonts (use theme tokens), and identical keys in `src/messages/en.json` and `src/messages/ar.json`. Never silence a rule with an eslint-disable comment to get a change through.
2. Work in the phases below, in order. After each phase run `npm run verify` and fix everything it reports before moving on. Make one commit per phase with a clear message that names the finding IDs.
3. Do not edit existing migrations. Add new ones after the highest existing number (currently `0053`), and add or extend RLS tests for every policy or function you add or change.
4. Do not add a dependency without saying why in the commit message. Prefer what is already installed (`clsx`, `tailwind-merge`, `zod`).
5. Do not run anything destructive against a hosted database. Use the local Supabase stack for `npm run test:rls`.
6. Every behaviour change needs a test. Fix first with a failing test, then make it pass.
7. If something in the report does not match what you see in the code, or a decision is unclear, **stop and ask** instead of guessing. List the question and continue with the other items.
8. Keep user-visible text in `en.json` and `ar.json`. Write Arabic that matches the tone of the existing strings.

## 1. Decisions (edit these before running if you disagree)

- Circulars counted in compliance: `published`, `in_progress`, `completed`, `overdue`. Draft, archived and cancelled are excluded.
- A compliant response is `acknowledged`, `approved` or `completed`. `rejected` is **not** compliant. `not_applicable` is removed from the denominator.
- A target is overdue when it is not compliant and the circular's `due_at` has passed.
- When there is nothing to measure, show "no data" and never 100%.
- Compliance is calculated in one shared function used by the dashboard, the reports page and the exports.

## 2. Phases

### Phase 0: baseline
- Run `npm ci`, `npm run verify`, `npm run test:rls`, and `npm run build`. Record what fails **before** you change anything and keep that list for the final report.
- Run `node -e "console.log(require('cn'))"` and `cat node_modules/cn/package.json`. Report what the package exports. (Related: H1.)

### Phase 1: foundations (H1, M7)
- Create `src/lib/cn.ts` exporting `cn(...inputs)` built on `clsx` and `twMerge`, with a unit test that proves conflicting classes are merged (for example `cn("h-8", "h-9")` returns `"h-9"`).
- Replace every `import { cn } from "cn"` (18 files, listed in the report, H1) with the local helper. Remove the `cn` package from `package.json` and the lockfile.
- Normalise `.gitignore` to LF line endings, add a `.gitattributes` rule so it stays LF, and add `.zwork/`, `.next-e2e/`, `test-results/`, `playwright-report/` if missing. Do not delete any tracked file without asking.
- Acceptance: `npm run verify` is green and a grep for `from "cn"` finds nothing.

### Phase 2: data layer (H2, H3, M2, M4, M5)
1. **Errors (H3).** In each query listed in report appendix A.1, read `error` and throw it through `mapDatabaseError` (the pattern in `getSchoolDepartments.ts`), or return a typed failure when the caller needs to continue. `getCurrentProfile` must distinguish "no profile row" from "query failed". Add a test per helper for the error path.
2. **Pagination (H2).** For circulars, maintenance requests, calendar events, achievements, notifications and audit logs: move filtering and sorting into the query, add `.range()` pagination with a page-size constant, return a total from a count query, and update the pages to render a pager. Do not load nested targets or attachments for list rows; fetch them only for the rows on the current page.
3. **Reports.** In `getCircularsReportData.ts` and `getMaintenanceReportData.ts`, stop relying on `max_rows`. Fetch in pages or aggregate in SQL (a view or function with RLS-aware access is preferred). Split `.in("circular_id", ids)` into chunks of at most 100 ids. Surface errors; never return an empty report on failure.
4. **Indexes (M2).** Add one migration creating an index for each foreign-key column in report appendix A.4. Use `create index if not exists`, and name indexes `<table>_<column>_idx`.
5. **Signed URLs (M4).** In `getCircularAttachments.ts` (and the maintenance equivalent) create URLs with one `createSignedUrls` call and a shorter expiry (for example one hour).
6. **Exports (M5).** The audit and report CSV exports must read all pages up to a documented maximum, include a notice row or response header when the maximum is hit, and send `Cache-Control: no-store`.
- Acceptance: a test with more than 1,000 seeded circulars shows all of them reachable by paging; a forced query error shows an error state in the UI, not an empty list.

### Phase 3: security (H4, H5, H6, M3, M6)
1. **CSP (H4).** In `src/proxy.ts` generate a per-request nonce and set `Content-Security-Policy-Report-Only` first, allowing only: own origin, the Supabase project URL (REST, auth, storage, realtime over `wss`), and the fonts already in use. Use the nonce for inline scripts that Next.js emits. Add a test for the header. Document how to switch from report-only to enforcing. Do not enable enforcing mode in this change.
2. **Bypass route (H5).** Rework `src/app/api/bypass/route.ts`: accept the secret by POST (not the query string), compare with `crypto.timingSafeEqual`, issue a random token stored as a signed, `httpOnly`, `secure`, `sameSite=strict` cookie with a short expiry (not the secret), add `UNDER_CONSTRUCTION_BYPASS_SECRET` to `serverEnvSchema.ts` and `.env.example`, and rate-limit it. Update whatever reads the cookie.
3. **Throttling (H6).** Add a database-backed rate limiter (new migration plus helper, RLS-protected, server-only access) and use it in `loginAction`, `requestPasswordResetAction` and `claimPlatformOwnerAction`, keyed by IP and by email where available. Return the same generic message whether or not an account exists. Compare bootstrap and cron secrets with `timingSafeEqual`.
4. **Documents (M3).** Do not change the `school_documents` policy yet. Add a clearly worded comment and a question in your final report asking whether every document should be world-readable.
5. **Health (M6).** `?deep=1` must require the cron secret.
- Acceptance: RLS and unit tests cover each new function and policy; a request without the secret to `?deep=1` is rejected.

### Phase 4: compliance calculation and chart (K1 to K10, G1)
1. **Calculation.** Create one shared module (one export per file) that takes circulars, targets, responses and departments, builds lookup maps once (no filtering inside nested loops), and returns for each circular and for each department: `targeted`, `compliant`, `overdue`, `notYetDue`, `notApplicable`, and a `percent` that is `null` when `targeted` is 0. Apply the decisions in section 1.
2. Make `computeDepartmentCompliance`, `mapCircularReportRows`, `getCircularsReportData`, `getDashboardComplianceData`, the reports page and both CSV exports use it. Pass the user's department scope into the dashboard the same way the reports page does. Remove the `circResponses.length` fallback.
3. **Dashboard list.** Show the 10 circulars that matter most (overdue first, then most recently published). Default the selector to the most important one. Do not show the Remind button for circulars that are not published.
4. **Lists.** Define "responded" and "pending" department lists so that a partly compliant department appears under pending with its count, never only under responded.
5. **Tests.** Add tests that reproduce the report's scenario (section 4.2 of the report) and assert the correct values: overall 60%, circular C3 50%, draft and cancelled circulars excluded, a response from a department that was not targeted is ignored, `not_applicable` removed from the denominator, `null` percent for no data.
6. **Chart.** Replace the donut with: a headline overall percentage with counts, then departments as horizontal bars sorted from lowest compliance to highest, each split into responded, overdue and not yet due, with a direct label like `7/10 · 70%`. Show the lowest 5 with a control to show all. Use theme tokens (`success`, `destructive`, `muted`), no hex values, no dependency on hover (everything readable by keyboard, touch and screen reader, with a text alternative), RTL-safe layout, and all text from `en.json` and `ar.json`. Keep the circular selector and the Remind button. Delete `DashboardComplianceDonut`, `DashboardComplianceLegend`, `computeDonutSegments` and `donutPalette` once nothing uses them.
- Acceptance: the dashboard, the reports page and the CSV give identical numbers for the same data; all new tests pass.

### Phase 5: translations and accessibility (M1, L1 to L6)
- Move every string in report appendix A.3 into `en.json` and `ar.json` and use `useTranslations`/`getTranslations`. Keep both files in parity.
- Add `type="button"` to the three buttons in L2. For each dialog in appendix A.6 confirm Esc closes it, it has `role="dialog"` and `aria-modal="true"`, focus moves in on open and returns on close; fix what is missing.
- Replace raw `<img>` with `next/image` where the source is static; where the source is a signed or blob URL keep `<img>` with a short comment explaining why.
- Route the `console.*` calls in appendix A.7 (outside the logger itself) through the logger. Type the `any` in `applyAuditQueryFilters.ts`. Read environment variables through `lib/env` where that is possible (server code), and leave `NEXT_PUBLIC_*` reads that client components need.

### Phase 6: chatbot (only if the chatbot package is installed) (M8)
- If `supabase/migrations/0049_circular_visibility_and_attachment_text.sql` from the chatbot package exists next to an existing `0049_*`, rename the chatbot one to the next free number and check it against `0051_add_category_and_visibility_check_constraints.sql` for duplicate constraints before applying. If the chatbot package is not installed, skip this phase.

## 3. Final report (required)

When finished, reply with:
1. A table: finding ID, status (fixed, partly fixed, not fixed, needs decision), and the commit hash or file.
2. The Phase 0 baseline failures and whether each is now fixed.
3. The list of questions you stopped to ask.
4. The output of `npm run verify`, `npm run test:rls` and `npm run build` after the last phase.
5. Anything you noticed that is not in the report.
