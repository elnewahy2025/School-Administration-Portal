# School Administration Portal

Responsive web application for one school (multi-school ready): administrative
circulars and assignments, maintenance and service requests, school calendar
and public information, settings, RBAC, audit history, notifications, and
reports. Arabic-first RTL with English support.

**Status: WP2 (database schema, RLS/RBAC, and auth) in progress — schema and RLS are in place
(26 migrations) and verified by an 81-check authorization battery. See
[build_plan.md](./build_plan.md) for the roadmap,
[INSPECTION_REPORT.md](./INSPECTION_REPORT.md) for the security audit, and
[`docs/decisions.md`](./docs/decisions.md) for the locked Phase-0 decisions.**

## Quickstart

Prerequisites: Node.js 24+, npm.

```powershell
npm ci
Copy-Item .env.example .env.local   # then fill in real values
npm run dev                         # http://localhost:3000 (Arabic default, /en for English)
```

## Scripts

| Script                            | Purpose                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server (Turbopack)                                                        |
| `npm run build`                   | Production build                                                                      |
| `npm run start`                   | Serve the production build                                                            |
| `npm run lint`                    | ESLint incl. D11 modularity gates                                                     |
| `npm run typecheck`               | `tsc --noEmit` (strict)                                                               |
| `npm run test`                    | Vitest unit + component tests                                                         |
| `npm run test:e2e`                | Playwright (build first; `npx playwright install chromium` once)                      |
| `npm run test:rls`                | RLS/authorization battery against a Supabase instance (local stack or linked project) |
| `npm run format` / `format:check` | Prettier                                                                              |
| `npm run scan:secrets`            | Basic secret scan                                                                     |
| `npm run verify`                  | format:check + lint + typecheck + test + scan + build                                 |

## Architecture rules (enforced by CI)

- **D11 — one function per file, no big files.** Every function, component,
  schema, and helper lives in its own file named after it. ESLint fails the
  build on: >~300 lines/file, >80 lines/function, complexity > 10, or more than
  one runtime export per file. A file may stay as one cohesive unit (e.g. a
  component with its tightly-coupled sub-parts) up to the ~300-line bound.
  Exemptions: barrels (`index.ts`), type files, tests, config files, framework
  route files, shadcn primitives (`src/components/ui`).
- **Dark mode (D10):** `next-themes`, class strategy, follows system by
  default, persisted light/dark toggle (`src/components/theme`).
- **i18n (D2):** `next-intl`, `ar` (RTL) default + `en` (`src/i18n`, `src/messages`).
- **Environments:** Zod-validated env accessed only through
  `src/lib/env` (lazy, fail-fast). The Supabase service-role key is
  server-only (`server-only` import guard in `src/lib/supabase`).
- **Supabase:** migrations in `supabase/migrations` (Git is the schema source
  of truth). The Supabase CLI is installed (2.104.0); run `supabase start` for a
  disposable local stack and `supabase db reset` after changing migrations. CI
  boots the same stack and runs the RLS battery.

## Troubleshooting

- `ERR_SWC_NATIVE_CACHE` on build: `@swc/core` validates its binding cache
  against directory ownership. If the shell's user differs from the profile
  owner, point it at a user-owned directory:
  `$env:SWC_NATIVE_BINDING_CACHE = 'C:\swc-cache'`.
- npm blocking install scripts (`npm warn install-scripts`): approve the native
  tooling once: `npm install-scripts approve @swc/core @parcel/watcher unrs-resolver`.
- `supabase db reset` returning `Error status 502 ... upstream server` while
  "Restarting containers": run `supabase stop` then `supabase start`, then retry.

## Next steps (WP3)

1. Build the users & roles UI on top of the RBAC helpers and the readable role catalog.
2. Implement circulars, maintenance, calendar, and reporting screens against the RLS surface.
3. Add the auth flows still missing from WP2 (password reset, invitation/activation).
