# Phase-0 decisions (WP0 exit gate)

Companion to [`build_plan.md`](../build_plan.md) §2. These are the locked defaults the build
proceeds on. They mirror the build plan unless a later decision explicitly overrides them; add a
dated entry below when that happens.

| #   | Decision                       | Locked value                                                                                                                                                                                           |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | Tenancy                        | Single school at launch; every table keeps `school_id` and RLS from day 1                                                                                                                              |
| D2  | UI language                    | Arabic-first RTL, English toggle; default locale `ar`                                                                                                                                                  |
| D3  | Auth method                    | Supabase email + password; accounts created by admin invitation only; no self sign-up                                                                                                                  |
| D4  | Notifications                  | In-app only at launch; email deferred until a provider is reviewed                                                                                                                                     |
| D5  | Respondent privacy             | Dashboards show department + job title only; identity in a restricted, audited record; honest UI copy                                                                                                  |
| D6  | Timezone                       | One configurable school timezone set at bootstrap; all timestamps `timestamptz`                                                                                                                        |
| D7  | Hosting                        | Vercel Hobby + two Supabase projects (dev, prod)                                                                                                                                                       |
| D8  | Attachment limits              | 10 MB/file; jpg, png, webp, pdf; validated server-side; adjustable in Settings                                                                                                                         |
| D9  | Deletion policy                | Soft-delete/archive for circulars, requests, calendar events; deactivate (never delete) users                                                                                                          |
| D10 | Theme                          | Dark mode follows system by default; manual light/dark/system toggle, persisted; class-based Tailwind                                                                                                  |
| D11 | Code modularity                | **Non-negotiable:** one function per file, file named after the function, size caps enforced by CI (a cohesive component + its sub-parts may share one file up to ~300 lines)                          |
| D12 | School Achievements            | Standalone `/achievements` route; strictly restricted to Platform Owner (`owner` role); hidden across all UI/navigation for non-owners                                                                 |
| D13 | Platform Owner Shielding       | Platform Owner account (`owner`) cannot be viewed, edited, created, or deleted by school administrators; filtered out of tenant user management views                                                  |
| D14 | Reports Access Restriction     | `/reports` and export endpoints are strictly restricted to Platform Owner and School Managers (`school_admin`). Revoked `reports.view` from `department_head`                                          |
| D15 | Unified Calendar & Circulars   | All users view calendar events; active circulars with deadlines render chronologically alongside events based on authenticated target RLS with full detail dialogs                                     |
| D16 | Achievements Owner-Exclusivity | School Achievements module is an add-on feature strictly restricted to Platform Owner (`owner` role). Completely hidden from sidebar, mobile navigation, dashboard, and actions for managers and staff |
| D17 | Reports Advanced Filtering     | Reports & Analytics tabs support dynamic date ordering (newest/oldest), temporal filters (all time, month picker, custom date range), and department-level filtering                                   |

## Decision log

- **D11 clarified.** "No big files" is enforced as `max-lines` ~300 (raised from 150) so a shadcn
  primitive or a component with its tightly-coupled sub-parts can stay one unit; anything past ~300
  lines, or a genuinely unrelated function bundled into an existing file, must be split. The rule
  lives at the top of [`AGENTS.md`](../AGENTS.md) and in `eslint.config.mjs`.
- **D12 updated & D16 added (School Achievements Standalone Route & Platform Owner Exclusivity).**
  Moved from `/calendar` tabs into a dedicated standalone route (`/achievements`). Access is strictly gated
  to the Platform Owner (`roles.key === 'owner'`). Completely hidden from navigation, mobile drawers,
  dashboard widgets, quick actions, and statistics grids for all non-owner roles (including school managers
  and administrators), serving as an isolated premium add-on feature.
- **D13 added (Platform Owner Account Protection).** School-level administrators must not possess the ability to alter or view global Platform Owner credentials or profiles. Server actions (`assertCanManageUser`) and user mapping queries strictly enforce tenant boundaries and hide owner records from tenant admin views.
- **D14 added (Reports Scoping).** Executive reports and compliance dashboards are segregated from departmental accounts. Department Heads view and respond only to circulars and maintenance relevant to their unit, while full-school compliance analytics remain reserved for executive leadership (`owner`, `school_admin`).
- **D15 added (Unified Calendar & Personalized Deadlines).** Rather than isolating administrative deadlines in circulars, calendar views dynamically aggregate school calendar events with target-scoped circular deadlines (`due_at`, `publish_at`). Interactive detail dialogs (`CalendarItemDetailDialog`) reveal complete event details and circular response instructions without navigation disruptions.
- **D17 added (Reports & Analytics Multi-Criteria Filtering & Sorting).** Added dynamic date sorting (newest/oldest), temporal filters (all time, monthly view, and custom date range picker), and department-based filtering across both Circulars Compliance and Maintenance & SLA tabs.
