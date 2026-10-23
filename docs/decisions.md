# Phase-0 decisions (WP0 exit gate)

Companion to [`build_plan.md`](../build_plan.md) §2. These are the locked defaults the build
proceeds on. They mirror the build plan unless a later decision explicitly overrides them; add a
dated entry below when that happens.

| #   | Decision            | Locked value                                                                                                                                                                  |
| --- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Tenancy             | Single school at launch; every table keeps `school_id` and RLS from day 1                                                                                                     |
| D2  | UI language         | Arabic-first RTL, English toggle; default locale `ar`                                                                                                                         |
| D3  | Auth method         | Supabase email + password; accounts created by admin invitation only; no self sign-up                                                                                         |
| D4  | Notifications       | In-app only at launch; email deferred until a provider is reviewed                                                                                                            |
| D5  | Respondent privacy  | Dashboards show department + job title only; identity in a restricted, audited record; honest UI copy                                                                         |
| D6  | Timezone            | One configurable school timezone set at bootstrap; all timestamps `timestamptz`                                                                                               |
| D7  | Hosting             | Vercel Hobby + two Supabase projects (dev, prod)                                                                                                                              |
| D8  | Attachment limits   | 10 MB/file; jpg, png, webp, pdf; validated server-side; adjustable in Settings                                                                                                |
| D9  | Deletion policy     | Soft-delete/archive for circulars, requests, calendar events; deactivate (never delete) users                                                                                 |
| D10 | Theme               | Dark mode follows system by default; manual light/dark/system toggle, persisted; class-based Tailwind                                                                         |
| D11 | Code modularity     | **Non-negotiable:** one function per file, file named after the function, size caps enforced by CI (a cohesive component + its sub-parts may share one file up to ~300 lines) |
| D12 | School Achievements | Tabbed under `/calendar`; records departmental awards & milestones with public/internal visibility, department attribution, and interactive detail modal                      |

## Decision log

- **D11 clarified.** "No big files" is enforced as `max-lines` ~300 (raised from 150) so a shadcn
  primitive or a component with its tightly-coupled sub-parts can stay one unit; anything past ~300
  lines, or a genuinely unrelated function bundled into an existing file, must be split. The rule
  lives at the top of [`AGENTS.md`](../AGENTS.md) and in `eslint.config.mjs`.
- **D12 added (School Achievements Registration).** Placed under `/calendar` with two distinct tabs ("Events" & "School Achievements"). Department heads and calendar managers can register milestones attributed to specific departments with optional certification photos, bilingual titles, and rich descriptions. Interactive click-to-view detail dialogs and real-time category/department/keyword filters ensure seamless navigation.
