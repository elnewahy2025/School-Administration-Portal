# Repository Audit Report — School Administration Portal

- **Date:** 2026-11-11
- **Scope:** Full-repository audit (verification suite, security, dependencies, tests, structure, CI/CD). No existing files were modified; this report is a new file only.
- **Commit audited:** `a75d0dd` (`main`, working tree clean)
- **Overall verdict:** **HEALTHY — one high-severity dependency finding and a few medium robustness gaps; no blocking defects found.**

---

## 1. Executive Summary

The repository is a Next.js 16 (App Router, Turbopack) + Supabase multi-tenant school administration portal with Arabic/English i18n, RBAC, RLS-enforced data isolation, audit logging, backups, and a PWA. Engineering discipline is unusually high: a mandatory `AGENTS.md` rulebook (one function per file, 300-line cap, zero-hallucination policy), strict ESLint complexity/size caps, a full local `verify` pipeline mirrored in CI, and 14 prior audit documents under `docs/audits/`.

Every quality gate currently passes. The only high-severity item is the **`xlsx` dependency (0.18.5), which carries two known high-severity CVEs with no fix available in the npm-published version**, and it is used to parse user-uploaded spreadsheets in the browser.

---

## 2. Verification Results (executed during this audit)

| Check | Command | Result |
| --- | --- | --- |
| Formatting | `npm run format:check` | ✅ Pass |
| Lint | `npm run lint` (ESLint 9, incl. `max-lines: 300`, `complexity: 10`) | ✅ Pass |
| Type check | `npm run typecheck` (`tsc --noEmit`) | ✅ Pass |
| Unit/component tests | `npm run test` (Vitest) | ✅ **297 files, 966 tests, 0 failures** (~284s) |
| Secret scan | `npm run scan:secrets` | ✅ Pass |
| Production build | `npm run build` (Next 16.4.2, Turbopack) | ✅ Pass (all routes compiled) |
| Dependency audit | `npm audit --omit=dev` | ⚠️ **1 high severity** (see Finding H-1) |

Notes:
- The prior audit finding (ESLint complexity regression in `assertCanManageUser.ts`, `docs/PRODUCTION_READINESS_AUDIT.md` FINDING-001) is **no longer reproducible** — lint passes cleanly at the current commit.
- E2E (`test:e2e`) and RLS (`test:rls`) suites require a running Supabase instance and were not executed in this sandbox; both are wired into CI (`ci.yml` jobs `e2e` and `rls`).

---

## 3. Findings

### H-1 · HIGH — Vulnerable `xlsx` dependency used on user-supplied files

- **Evidence:** `npm audit --omit=dev` reports `xlsx *` with:
  - Prototype Pollution — [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6)
  - Regular Expression Denial of Service — [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9)
  - **No fix available** for the npm-registry version (`0.18.5` in `package.json`).
- **Usage:** `src/components/documents/viewer/useExcelDocumentReader.ts` (dynamic `import("xlsx")` + `XLSX.read` on a fetched buffer) and `src/components/circulars/CircularFileUpload.tsx`. Parsing happens **client-side on user-uploaded spreadsheets**, which is exactly the ReDoS/prototype-pollution surface. Prototype pollution in the browser context of an authenticated session is a real (if modest) risk; ReDoS can freeze the user's tab.
- **Recommendation:** Replace the npm `xlsx` package with the maintained SheetJS build from the vendor CDN (`https://cdn.sheetjs.com/`, ≥ 0.20.2), or migrate to `exceljs`. Alternatively, isolate parsing in a Web Worker with a hard file-size cap so a malicious file cannot freeze the main thread.

### M-1 · MEDIUM — Rate limiting is process-local and not a security control

- **Evidence:** `src/lib/rateLimit/rateLimitBuckets.ts` and `consumeRateLimitToken.ts` use an in-memory `Map` (capped at 5,000 keys). The code itself documents: *"serverless instances each keep their own window, so it cannot bound global traffic... it is a spam guard, not a security control."*
- **Impact:** `loginAction`, `requestPasswordResetAction`, and `claimPlatformOwnerAction` rely on `checkAuthRateLimit` for brute-force throttling. On Vercel serverless, per-instance windows mean an attacker's requests spread across instances largely bypass the limit.
- **Mitigating factors:** Supabase Auth applies its own server-side rate limits; error messages are generic (`"invalid"`), preventing user enumeration.
- **Recommendation:** Move auth throttling to a shared store (e.g., Upstash Redis, or a Supabase table/RPC) or document reliance on Supabase Auth's built-in limits in the threat model.

### M-2 · MEDIUM — 32 server actions lack dedicated unit tests

- **Evidence:** Actions with no co-located `*.test.ts` include:
  - RBAC: `createRoleAction`, `updateRoleAction`, `deleteRoleAction` (`src/actions/rbac/`)
  - Backup/restore (the most sensitive flows): `exportBackupAction`, `restoreBackupAction`, `previewRestoreAction` (`src/actions/backup/`)
  - Settings: `createUserAction`, `updateUserAction`, `createDepartmentAction`, `deleteDepartmentAction`, location actions, etc.
  - Circulars: `updateCircularAction`, `deleteCircularAction`, `publishCircularAction`, `deleteCircularAttachmentAction`
  - Calendar: `publishCalendarEventAction`, `cancelCalendarEventAction`, `archiveCalendarEventAction`
- **Impact:** These are exactly the authorization-sensitive mutations; regressions in permission checks would not be caught by unit tests. Partially offset by 3 Playwright e2e suites (`smoke`, `workflows`, `backup`) and RLS tests in CI.
- **Recommendation:** Prioritize unit tests for `src/actions/rbac/*` and `src/actions/backup/*`, following the existing pattern (e.g., `createCalendarEventAction.test.ts`).

### L-1 · LOW — Report/audit CSV exports load all rows into memory

- **Evidence:** `src/app/api/audit/export/route.ts` calls `fetchAllSchoolAuditLogs` with no row cap; `src/app/api/reports/export/route.ts` similarly materializes full datasets before building CSV strings.
- **Impact:** For a school with a large audit history this can create large memory/CPU spikes on a serverless function (self-inflicted DoS, cost). No pagination or streaming.
- **Recommendation:** Stream the CSV (`ReadableStream`) or enforce a maximum export window/row count.

### L-2 · LOW — `serverActions.bodySizeLimit: "250mb"` is a very large upload surface

- **Evidence:** `next.config.mjs`. Auth-gated, and validated downstream by `assertValidCircularDocuments` / MIME hardening migrations (`0044_storage_mime_hardening.sql`), but 250 MB per action body invites abuse and memory pressure.
- **Recommendation:** Lower to the largest legitimate document size (e.g., 25–50 MB) unless the backup-restore flow genuinely requires more.

### L-3 · LOW — CSP `connect-src`/`img-src` include a redundant `https://*.supabase.co` wildcard

- **Evidence:** `src/lib/security/buildContentSecurityPolicy.ts` adds both the resolved project origin and the `*.supabase.co` wildcard. The wildcard broadens the allowlist to any Supabase project; the explicit origin alone would suffice in production.
- **Recommendation:** Drop the wildcard when `NEXT_PUBLIC_SUPABASE_URL` is resolvable.

### I-1 · INFO — Vitest creates a fresh jsdom per test file (297 environments, ~75% of suite time)

- **Evidence:** Vitest's own post-run hint. `pool: 'vmThreads'` or `isolate: false` could cut the ~284s unit suite significantly, speeding up CI.
- **Trade-off:** Reduced isolation; verify flake-free before adopting.

### I-2 · INFO — Documentation and audit dates are in the future (2026)

- **Evidence:** Commit timestamps and filenames such as `audit-report-2026-10-30.md`. Internally consistent with the repository clock, but worth confirming the machine/CI clock is correct, as it affects audit-trail credibility.

---

## 4. Strengths (verified, not assumed)

- **Security posture is well above average for this stack:**
  - Strict CSP with per-request nonce + `'strict-dynamic'` (`src/proxy.ts`, `buildContentSecurityPolicy.ts`); no `dangerouslySetInnerHTML` anywhere in `src/`.
  - Full security-header set in `next.config.mjs` (HSTS preload, `X-Frame-Options: DENY`, `nosniff`, Permissions-Policy), with carefully scoped `frame-ancestors 'self'` exceptions only for the two document-preview endpoints.
  - Service-role key confined to `createSupabaseAdminClient.ts` behind `import "server-only"`; actor headers propagated for audit attribution.
  - All API routes checked during this audit enforce authorization before data access (`assertCanViewReports`, `assertCanViewAudit`, `assertCronAuthorized`); `/api/client-errors` is rate-limited, size-capped, zod-validated, and returns a non-echoing 204.
  - Secrets compared with `constantTimeCompare`; cron/health/bypass endpoints fail closed when secrets are unset.
  - CSV formula injection (Excel formula injection) is neutralized in `src/lib/reports/escapeCsvCell.ts`.
  - Only `.env.example` is tracked; `.env*` is gitignored; repo secret scan passes.
- **Database layer:** 72 sequential migrations with 158 RLS policies, dedicated migrations for `search_path` hardening, storage MIME/RLS scoping, and CI job that rebuilds the database from migration 0001 to prove clean-apply.
- **Test culture:** 297 test files / 966 tests, all green; e2e and RLS suites in CI; tests co-located following the one-function-per-file convention.
- **Architecture:** 974 non-test TS/TSX files, ~61k LOC, largest file 259 lines — the 300-line cap is genuinely respected. Clear layering (`src/actions` → `src/lib` → `src/app`), zod validation schemas, sanitized errors with correlation IDs.
- **CI/CD:** `ci.yml` runs the full `verify` pipeline plus e2e (with real Supabase) and RLS migration rebuild; `weekly-backup.yml` and a Vercel cron keepalive with `CRON_SECRET`.

---

## 5. Recommended Action Plan (priority order)

1. **Replace or upgrade `xlsx`** (H-1) — vendor-CDN SheetJS build or `exceljs`; add a regression test parsing a crafted malicious workbook.
2. **Add unit tests for RBAC and backup/restore actions** (M-2), starting with `createRoleAction`, `deleteRoleAction`, `restoreBackupAction`.
3. **Move auth rate limiting to a shared store** or explicitly document reliance on Supabase Auth limits (M-1).
4. **Stream or cap CSV exports** (L-1) and **reduce `bodySizeLimit`** (L-2).
5. **Tighten CSP supabase wildcard** (L-3) and **speed up Vitest** (I-1) as low-effort follow-ups.

---

*Audit performed by Vibe Code. All claims above were verified against the working tree at commit `a75d0dd`; commands and results are listed in §2. No repository files were modified or reverted; this report was added as a new file.*
