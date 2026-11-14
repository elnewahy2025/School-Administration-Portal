# School Administration Portal — Domain Audit Report

## Audit metadata and scope

| Field             | Details                                                                                                                                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository        | `/tmp/school-admin-audit`                                                                                                                                                                                                                                                                                             |
| Audited commit    | `a75d0dd96caaab64153863a9dab99e11cbf5a8cc` (short: `a75d0dd`)                                                                                                                                                                                                                                                         |
| Review type       | Static, read-only source and configuration review                                                                                                                                                                                                                                                                     |
| Domains           | Authentication/authorization/API routes/server actions; Supabase schema, RLS, migrations, functions and grants; uploads/storage/backup/restore/cron; business logic and concurrency; frontend/accessibility/localization; dependencies/build/configuration/deployment; tests, documentation and operational readiness |
| Workstream status | All supplied workstreams succeeded; no failed workstreams were reported.                                                                                                                                                                                                                                              |

This report synthesizes the supplied domain-audit results. Overlapping reports of the scheduled Google Drive backup defect have been merged into one finding. Finding locations and line references are those supplied by the auditors and have not been independently rechecked in this synthesis.

## Executive summary — risk-focused

The most consequential risks concern recoverability and authorization boundaries. The scheduled Google Drive backup can appear successful while omitting data: it backs up only the first school, does not paginate database or storage reads, and suppresses some query/list/download errors. A successful-looking archive therefore cannot be treated as a verified full-platform recovery copy. Separately, the bootstrap RPC has a race that can permit multiple platform owners, and a calendar update helper can fall back to a service-role write scoped only by event ID, creating a cross-school mutation path when its regular update encounters an RLS/permission error.

Other material risks include deactivated users retaining server-action authorization while their Supabase session remains valid, non-atomic maintenance and user-update workflows, report truncation at the PostgREST row ceiling, and a restore action that buffers and can overwrite school-prefixed objects without size or content validation. These are source-supported code-path risks, not claims of exploitation or production exposure. No runtime, deployment, live database, or production configuration verification was performed.

The audit identified **16 deduplicated findings**: 0 Critical, 4 High, 7 Medium, 4 Low, and 1 Info.

## Prioritized findings

### Critical

No Critical findings were reported in the supplied domain results.

### High

#### H1. Scheduled Google Drive backup can silently produce incomplete archives

**Affected file and lines:** `scripts/backupToGoogleDrive.mjs:147-180, 196-218, 232-244, 255-261`; scheduled invocation: `.github/workflows/weekly-backup.yml:26-31`.

**Evidence:** The script selects schools with `.limit(1)` and exports only the first returned school. Database exports perform a single select per table, discard query errors, and return `rows || []`; they do not paginate. Storage listing makes a single `.list(prefix)` call and does not paginate. Storage listing/download failures are suppressed or skipped, and the script can continue to upload/report success with fewer objects. Supplied domain reviews independently identified these same omissions; they are consolidated here.

**Impact:** In a multi-school project, other schools are omitted. Even for the selected school, page limits or transient errors can omit rows/files. The resulting artifact can be incomplete while appearing successful, jeopardizing recovery. The audit did not establish how many schools exist in any deployment or whether the scheduled workflow is enabled.

**Specific fix:** Enumerate every in-scope school (or explicitly document a narrower scope); paginate every table and storage listing; propagate all query/list/download errors as job failures; independently validate expected versus exported counts and include a manifest/checksums. Add script-level tests for pagination, errors, and multi-school data, plus post-upload integrity verification.

#### H2. Concurrent bootstrap calls can create multiple platform owners

**Affected file and lines:** `supabase/migrations/0010_seed_rbac.sql:66-83`; grant reference: `86-87`.

**Evidence:** `bootstrap_platform_owner` checks `has_any_owner()` at lines 73-75 and separately inserts an owner assignment for caller-supplied `p_user_id` at lines 79-82. The review found no lock, serialized/conditional claim, or singleton database invariant. The function does not bind the target ID to `auth.uid()`, while its grant is available to authenticated callers.

**Impact:** Concurrent authenticated calls during an unclaimed bootstrap window can both observe no owner and assign global owner privileges to different accounts. This is a code-level race, not evidence that a bootstrap window is currently open or that it has been exploited.

**Specific fix:** Serialize the claim (for example, transaction-scoped advisory lock plus recheck) and enforce a singleton-owner invariant in the database where feasible. Require `p_user_id = auth.uid()` and an active profile unless a documented trusted provisioning path requires otherwise. Test concurrent claims and non-self-target attempts.

#### H3. Calendar update fallback can mutate an event outside the caller’s school

**Affected file and lines:** `src/lib/calendar/updateCalendarEventRecord.ts:38-52`; caller: `src/actions/calendar/updateCalendarEventAction.ts:42-54`.

**Evidence:** On a failed RLS update, the helper retries with a service-role client. Both update paths are scoped by event ID only. The caller does not pass the authenticated school ID into the helper, so the fallback bypasses RLS without a tenant predicate.

**Impact:** If the normal update returns an RLS/42501 error, a calendar manager may update another school’s event, including its content, date, visibility, or image path.

**Specific fix:** Remove the service-role fallback, or require and apply the authenticated `school_id` predicate in both paths. Check affected-row count and treat zero rows as not found/unauthorized. Add a cross-school regression test that exercises the fallback condition.

#### H4. Inactive users retain authorization for directly invoked server actions

**Affected file and lines:** `src/lib/auth/getCurrentProfile.ts:19-38`; examples: `src/actions/settings/deleteUserAction.ts:14-31`, `src/actions/maintenance/updateMaintenanceRequestAction.ts:31-53`; layout check: `src/app/[locale]/(app)/layout.tsx:30-33`; login check: `src/actions/auth/loginAction.ts:35-45`.

**Evidence:** `getCurrentProfile` obtains the profile including `is_active` but returns it without rejecting inactive profiles. The application layout blocks inactive profiles during page rendering, but callable server actions are not protected by that layout. Example actions check profile existence and roles/permissions before privileged writes, without a centralized active-status rejection. The login action signs out inactive users only during initial login; an existing Supabase session remains valid.

**Impact:** A deactivated account with a still-valid session may retain role-authorized access to sensitive server actions, weakening deactivation as a revocation control.

**Specific fix:** Enforce active status in a centralized server-side authorization primitive used by actions and API guards, before permission checks or privileged side effects. Test direct invocation of sensitive actions using an authenticated inactive profile.

### Medium

#### M1. Backup storage restore can overwrite school-prefixed objects without size or content validation

**Affected file and lines:** `src/actions/backup/restoreStorageFileAction.ts:11-26`.

**Evidence:** The action authenticates a backup manager and checks bucket/path constraints, then reads the submitted `File` fully into memory and uploads with `upsert: true`. Validation checks that input is a `File`; target validation checks allowed bucket, traversal-like `..`, and school prefix, but not file size, MIME, extension, or signature.

**Impact:** An authorized school-scoped operator can replace an existing object under the school prefix with arbitrary bytes or an oversized payload, causing file corruption and resource consumption. The review did not establish exposure in a deployment.

**Specific fix:** Enforce strict request and file-size ceilings before buffering; apply bucket-specific MIME/signature rules or document a deliberate unrestricted restore policy; default to non-overwrite and require an explicit replacement confirmation where replacement is necessary.

#### M2. Concurrent maintenance transitions can overwrite newer status and misstate history

**Affected file and lines:** `src/lib/maintenance/applyMaintenanceStatusChange.ts:37-65`; transition validation: `src/actions/maintenance/updateMaintenanceStatusAction.ts:31-36`.

**Evidence:** The action validates legality using a previously fetched status, but the helper updates by request ID and school without requiring the row still to have `oldStatus`. It then logs the stale old status. Concurrent requests can both validate against the same initial state and later overwrite one another.

**Impact:** A later write can regress or override a terminal transition, while the status history may describe a prior state that was no longer current.

**Specific fix:** Make the update conditional on the fetched old status, or perform validation and mutation in a transactional database RPC. Treat no matched row as a conflict and write the audit record atomically.

#### M3. User profile changes can commit when the requested role update fails

**Affected file and lines:** `src/actions/settings/updateUserAction.ts:51-63`; rollback scope: `src/lib/school/persistUserUpdates.ts:74-90`.

**Evidence:** Profile/auth changes are persisted before `applyUserRoleUpdate`. If role resolution or assignment then fails, the catch returns an error without compensating the committed profile update. The existing rollback described in the review covers auth synchronization failure, not this later role step.

**Impact:** The UI may report failure although name/contact/active state changed and the role did not, leaving account administration in a partial state.

**Specific fix:** Make profile and role changes atomic through a database transaction/RPC, or compensate on role failure and clearly report partial-commit status if compensation itself fails.

#### M4. Report queries can omit records at the PostgREST row ceiling

**Affected file and lines:** `src/lib/reports/getMaintenanceReportData.ts:16-49`; analogous circular report: `src/lib/reports/getCircularsReportData.ts:31-45`; warning helper: `src/lib/supabase/warnOnDataTruncation.ts:1-20`.

**Evidence:** The report queries filter/order but do not paginate. The warning helper only emits a warning at the configured 1000-row ceiling; it does not fetch subsequent pages. The same pattern was identified for the circular report.

**Impact:** If the target deployment’s PostgREST ceiling applies and a school exceeds it, report totals, breakdowns, and exports may reflect only a subset and be understated. Deployment configuration was not independently verified.

**Specific fix:** Fetch all matching rows in deterministic pages or aggregate in SQL. Add tests above the configured ceiling and make completeness explicit rather than substituting a warning for pagination.

#### M5. Maintenance assignment rotation is a multi-step non-transactional write

**Affected file and lines:** `src/lib/maintenance/saveMaintenanceAssignment.ts:19-67`.

**Evidence:** The helper deactivates current assignments, inserts a replacement, updates the request, and inserts an audit record as separate operations. Later failures can occur after earlier writes commit, and concurrent rotations can interleave.

**Impact:** An error response can leave assignment, request operator/status, or audit history inconsistent; concurrent rotations can create competing active assignments where constraints do not prevent them.

**Specific fix:** Put deactivation, insertion, request update, and audit insertion in one transactional database function. Enforce at most one active assignment per request with a database constraint and handle conflicts explicitly.

#### M6. Server Actions accept request bodies up to 250 MB

**Affected file and lines:** `next.config.mjs:35-39`.

**Evidence:** The global `experimental.serverActions.bodySizeLimit` is set to `250mb`, with a comment relating the setting to large payloads/file restores. It is not scoped to a particular action in this configuration.

**Impact:** If a reachable action lacks a smaller independent limit, very large bodies can consume memory and processing resources. This is conditional; the setting alone does not prove unauthenticated access, production exposure, or that all actions accept such bodies.

**Specific fix:** Lower the global limit and enforce restore-specific limits before buffering/parsing. If large restores are required, isolate that flow and use request, authorization, rate, and resource controls suitable for the deployment.

#### M7. Restore drill directs operators to a local-only RLS test against a hosted project

**Affected file and lines:** `docs/runbooks/backup_and_restore.md:53-65`; runner references supplied as lines 45-49; CI reference: `.github/workflows/ci.yml:57-65`.

**Evidence:** The runbook directs operators to point `.env.local` at a throwaway hosted Supabase project and run `npm run test:rls`. The package command invokes a runner that obtains credentials from `supabase status` and enforces a loopback URL; it does not use `.env.local` and refuses a hosted endpoint. CI resets and uses a local stack.

**Impact:** The documented drill either fails at the local-host check or tests the local database rather than the restored hosted project, so it does not perform the stated recovery verification. Operators could mistakenly believe the restored copy passed authorization checks.

**Specific fix:** Provide a staging-compatible, explicitly safe test harness with deliberate credentials and destructive-test safeguards, or remove the `test:rls` step from the hosted-project drill and document a supported local-clone procedure. Require operators to verify and record the actual target.

### Low

#### L1. Maintenance attachment link has no accessible name

**Affected file and lines:** `src/components/maintenance/MaintenanceAttachmentsList.tsx:56-64`.

**Evidence:** The external-link anchor renders only an `ExternalLinkIcon` and has no accessible label, title, or visually hidden text.

**Impact:** Assistive-technology users encounter an unnamed link and cannot readily determine the attachment action or purpose.

**Specific fix:** Add localized accessible text (for example, an attachment-kind and “open” label), or visible link text; mark the decorative icon `aria-hidden`.

#### L2. Calendar image preview alt text is hard-coded in English

**Affected file and lines:** `src/components/calendar/CalendarImageField.tsx:36-43`.

**Evidence:** The component uses localization, but the preview image’s alt text is the literal “Banner preview.”

**Impact:** Arabic-language users receive an English accessible description in the localized interface.

**Specific fix:** Add a localized preview-description key to both dictionaries and use it, or use empty alt text if the image adds no information beyond adjacent form text.

#### L3. Backup script imports undeclared direct dependency

**Affected file and lines:** `scripts/backupToGoogleDrive.mjs:3-4`; manifest: `package.json:26-65`.

**Evidence:** The script imports `jszip`, which is not declared directly. The lockfile contains it transitively via `docx-preview`, making resolution dependent on the present dependency graph/hoisting.

**Impact:** A dependency-graph change can cause the scheduled backup to fail at module load despite a successful clean install.

**Specific fix:** Declare `jszip` as a direct dependency and update the lockfile, or remove the import in favor of a declared, supported package.

#### L4. Supabase CLI version floats in CI

**Affected file and lines:** `.github/workflows/ci.yml:38-41,54-57`.

**Evidence:** E2E and RLS jobs configure `supabase/setup-cli@v1` with `version: latest` before starting/resetting a local database.

**Impact:** A future CLI release may change startup, migration, or local-stack behavior without a repository change, making CI results less reproducible. This is not evidence that the current workflow is failing.

**Specific fix:** Pin a tested Supabase CLI version and update it deliberately with CI validation.

### Info

#### I1. Scheduled backup script lacks regression tests for completeness and failure handling

**Affected file and lines:** `scripts/backupToGoogleDrive.mjs:147-179, 207-219, 223-290`; test configuration: `vitest.config.mts:10-14`; workflow: `.github/workflows/weekly-backup.yml:26-31`.

**Evidence:** The inventory found nine backup-library tests and a Playwright restore test, but none target this scheduled backup script. Vitest is limited to `src/**/*.test.{ts,tsx}`. The weekly workflow runs the script without an independent completeness verification beyond its success output.

**Impact:** The backup omission paths lack a regression guard, and a successful workflow does not demonstrate archive completeness.

**Specific fix:** Extract discovery/export/upload into testable functions. Add mocked tests asserting failures abort, all pages and schools are covered, and counts match source data; add post-upload integrity/manifest verification.

## Strengths

- Supabase user identity is validated with `auth.getUser()` rather than trusting client-supplied identity claims. The authenticated app layout checks profile existence and active status; this UI gate is appropriately not treated as a substitute for server-action authorization.
- API routes inspected generally use explicit authorization helpers. Several inspected privileged user-update paths perform tenant/target checks, and exports set no-store cache headers.
- Core tables have RLS enabled with tenant/department predicates; later migrations address earlier scope regressions. Security-definer helpers and most exposed RPCs use explicit `search_path`, with grants explicitly managed in dedicated migrations.
- Storage write policies scope paths and validate parent records. Common upload flows use server-side MIME allowlists, size limits, and signature checks. The orphan sweep defaults to dry-run and refuses non-local Supabase URLs.
- Restore JSON validation checks schema envelope, checksum, and tenant scope; restore is owner-gated, creates a pre-restore snapshot, and delegates database writes to a transactional RPC.
- Cron authorization fails closed in production when `CRON_SECRET` is absent. Circular response submission has a transactional RPC path. Notification dispatch filters recipient IDs against active profiles in the supplied school.
- The service worker avoids caching HTML navigations, API/Supabase/storage requests, and non-GET requests; logout purges client caches. Locale metadata includes language/direction, and the app shell has a skip-to-main link and focusable main landmark.
- CI separates formatting, lint, typecheck, unit tests, secret scanning, and production build, and includes local Supabase E2E/RLS workflows. The RLS runner refuses non-loopback endpoints. The restore E2E exercises a UI restore over 5 MB and checks row counts, pre-restore snapshot, and audit events.
- A committed lockfile is used with `npm ci`; environment configuration separates client/server Zod schemas and keeps the service-role key server-only by naming convention. Security headers include HSTS, anti-framing, nosniff, referrer and permissions policies.

## Verification executed after the static review

The parent installed locked dependencies with lifecycle scripts disabled (`npm ci --ignore-scripts --no-audit --no-fund`) and ran the repository verification sequence. Formatting check, ESLint, TypeScript typecheck, unit tests, secret scan, and production build all passed. Vitest reported **297 test files and 966 tests passing**. The Next.js production build compiled, completed TypeScript validation, generated 56 static pages, and finalized route optimization. The secret scan reported “Secret scan passed.” The audited worktree remained clean at commit `a75d0dd96caaab64153863a9dab99e11cbf5a8cc`.

The dependency install deliberately used `--ignore-scripts`; successful build/test outcomes confirm the required packages were usable without package lifecycle scripts. The E2E Playwright suite, local Supabase RLS suite, SQL migration replay, database concurrency scenarios, hosted backup, and restore drill were not run. No live registry vulnerability scan was performed.

## Follow-up verification and remediation

1. Add and run focused regression tests for inactive-profile direct server-action calls; cross-school calendar fallback; atomic bootstrap concurrency/self-target enforcement; maintenance transition concurrency; assignment write atomicity; profile/role partial failure; report pagination beyond the configured cap; and restore size/content/overwrite rules.
2. Extract and test the scheduled backup script with mocked Supabase/Drive APIs, including multi-school data, paginated tables/storage, query/list/download failures, and count/manifest verification. Do not test against production or a hosted endpoint with destructive fixtures.
3. Reconcile the restore runbook with the RLS test runner: the runbook describes a throwaway hosted Supabase project, whereas the runner obtains credentials from local `supabase status` and enforces a loopback URL (`docs/runbooks/backup_and_restore.md:53-65`; runner references supplied as lines 45-49). Validate a supported safe procedure and check the actual target explicitly.
4. Run the E2E and RLS suites only against their intended isolated local Supabase setup, and replay migrations in that environment.
5. Pin a tested Supabase CLI version rather than `latest` in `.github/workflows/ci.yml:38-41,54-57` for reproducible CI.

## Limitations and non-claims

This is a synthesis of static, read-only reviews at the specified commit, supplemented by local formatting, lint, typecheck, unit-test, secret-scan, and production-build checks. No live HTTP requests, database execution, migration replay, concurrency test, browser/assistive-technology session, hosted backup, restore drill, or production configuration review was performed. Findings describe source-supported behavior or conditional code paths; they do **not** establish exploitation, production exposure, an open bootstrap window, an enabled scheduled workflow, actual multi-school deployment data, or loss of production data.

The reviews were scoped by domain and were not exhaustive reviews of every business-logic module, caller, database policy, external integration, or deployment. The report-truncation concern depends on the relevant PostgREST row ceiling applying in the target deployment. Backup behavior also depends on external Supabase/Drive configuration, secrets, and API limits that were not examined. The offline dependency audit result is not evidence of current absence of vulnerabilities.

No failed workstreams were reported in the supplied results.

---

**Finding count: 16 deduplicated findings — 0 Critical, 4 High, 7 Medium, 4 Low, 1 Info.**
