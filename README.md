# School Administration Portal

Responsive web application for one school (multi-school ready): administrative
circulars and assignments, maintenance and service requests, school calendar
and public information, settings, RBAC, audit history, notifications, and
reports. Arabic-first RTL with English support.

**Status: WP1 (repository & environments) complete — see [build_plan.md](./build_plan.md)
for the roadmap and [school_administration_implementation_plan.md](./school_administration_implementation_plan.md)
for requirements.**

## Quickstart

Prerequisites: Node.js 24+, npm.

```powershell
npm ci
Copy-Item .env.example .env.local   # then fill in real values
npm run dev                         # http://localhost:3000 (Arabic default, /en for English)
```

## Scripts

| Script                            | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                     | Development server (Turbopack)                                   |
| `npm run build`                   | Production build                                                 |
| `npm run start`                   | Serve the production build                                       |
| `npm run lint`                    | ESLint incl. D11 modularity gates                                |
| `npm run typecheck`               | `tsc --noEmit` (strict)                                          |
| `npm run test`                    | Vitest unit + component tests                                    |
| `npm run test:e2e`                | Playwright (build first; `npx playwright install chromium` once) |
| `npm run test:rls`                | RLS/authorization battery against the linked Supabase project    |
| `npm run format` / `format:check` | Prettier                                                         |
| `npm run scan:secrets`            | Basic secret scan                                                |
| `npm run verify`                  | format:check + lint + typecheck + test + scan + build            |

## Architecture rules (enforced by CI)

- **D11 — one function per file, no big files.** Every function, component,
  schema, and helper lives in its own file named after it. ESLint fails the
  build on: >150 lines/file, >80 lines/function, complexity > 10, or more than
  one runtime export per file. Exemptions: barrels (`index.ts`), type files,
  tests, config files, framework route files, shadcn primitives
  (`src/components/ui`).
- **Dark mode (D10):** `next-themes`, class strategy, follows system by
  default, persisted light/dark toggle (`src/components/theme`).
- **i18n (D2):** `next-intl`, `ar` (RTL) default + `en` (`src/i18n`, `src/messages`).
- **Environments:** Zod-validated env accessed only through
  `src/lib/env` (lazy, fail-fast). The Supabase service-role key is
  server-only (`server-only` import guard in `src/lib/supabase`).
- **Supabase:** migrations in `supabase/migrations` (Git is the schema source
  of truth). The Supabase CLI is not installed yet — install it
  (`npm i -g supabase` or `scoop install supabase`) before WP2 database work.

## Troubleshooting

- `ERR_SWC_NATIVE_CACHE` on build: `@swc/core` validates its binding cache
  against directory ownership. If the shell's user differs from the profile
  owner, point it at a user-owned directory:
  `$env:SWC_NATIVE_BINDING_CACHE = 'C:\swc-cache'`.
- npm blocking install scripts (`npm warn install-scripts`): approve the native
  tooling once: `npm install-scripts approve @swc/core @parcel/watcher unrs-resolver`.

## Next steps (WP2)

1. Create dev + prod Supabase projects; fill `.env.local` from `.env.example`.
2. Implement migrations 0001+ (full schema per build_plan.md §5), RLS, RBAC.
3. Auth flows and the permission matrix from build_plan.md §6.
