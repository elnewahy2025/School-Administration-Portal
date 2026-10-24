# School Administration Portal: Roadmap & Implementation Status

> **Document Status:** Active & Maintained  
> **Last Updated:** October 2026  
> **Stack:** Next.js 16 (Turbopack, App Router), TypeScript (Strict), Supabase (PostgreSQL, Auth, Storage, RLS), Tailwind CSS, Vitest, Playwright.

---

## 1. Executive Summary

The School Administration Portal is an enterprise-grade, multi-tenant capable, Arabic-first (RTL) school operations system. The platform enforces strict separation of duties, zero-trust data access via PostgreSQL Row Level Security (RLS), architectural modularity (Rule #1: one function per file, ~300 line bound), and centralized error handling with real-time structured logging.

---

## 2. What We Did (Completed Implementations)

### A. Authentication, RBAC & Security Overhaul

1. **Platform Owner Shielding & Isolation:**
   - Platform Owner (`owner` role) accounts cannot be viewed, edited, created, or deleted by any school administrator or tenant manager.
   - Platform Owner is filtered out of tenant-level user management views (`/settings/users`) to prevent privilege escalation or accidental modification.
   - Added `assertCanManageUser.ts` server-side authorization barrier blocking modifications against platform owners.

2. **Strict Department Scoping & Role Attribution:**
   - Every Department Head and staff member is explicitly mapped to their respective department (`department_id`).
   - The user interface dynamically displays the active user's department name in header badges and user dropdowns.
   - Department Heads operate within departmental scope: they can view and submit responses only for circulars targeted to their department, role, or school-wide.

3. **Separation of Duties on Analytics & Reports:**
   - The `/reports` page and CSV export endpoints (`/api/reports/export`) are strictly restricted to the Platform Owner and School Managers (`school_admin`).
   - Revoked `reports.view` from `department_head` in both the live database and `supabase/migrations/0010_seed_rbac.sql`.
   - Updated `assertCanViewReports.ts` and `layout.tsx` navigation guards with defense-in-depth enforcement.

4. **Personalized User Home (`/dashboard`):**
   - The `/dashboard` serves as the personalized operational homepage for all authenticated roles.
   - Displays department affiliation, personalized active circulars with response status, pending maintenance tickets, school mission/vision, and role-appropriate quick actions.

5. **School Settings Persistence Fix:**
   - Resolved the RLS policy issue on the `schools` table where managers were prevented from updating school profile details.
   - Fixed multi-column payload mapping in `persistSchoolProfile.ts` and `updateSchoolAction.ts` ensuring immediate database persistence with audit logging.

---

### B. Unified Interactive Calendar & Personalized Circulars

1. **Full Visibility for All School Users:**
   - Every authenticated school user can access `/calendar` and view school-wide events, academic schedules, exams, and holidays.

2. **Seamless Merger of Events & Personalized Circulars:**
   - Created `buildUnifiedCalendarItems.ts` to merge `CalendarEventRow`s and active `CircularRow`s chronologically.
   - Governed by user-authenticated Supabase RLS (`is_circular_target(id)`): users automatically receive only circulars directed to their department, role, or whole school.
   - Circulars with submission deadlines (`due_at`), publication dates (`publish_at`), or creation timestamps render directly on the calendar alongside academic events.

3. **Full Interactive Details Dialog (`CalendarItemDetailDialog`):**
   - Clicking any event or circular in either Month Grid or List view opens an interactive detail modal:
     - **For Events:** Arabic and English titles, category badge, visibility badge (Public/Internal), status badge, exact start/end time and date, location, event creator, full description, and a direct link to the event's dedicated page.
     - **For Circulars:** Official reference number, priority badge, department target, formatted deadline countdown, required response type (acknowledgement/text), complete instructions/body excerpt, and a direct "View & Respond" link.

4. **Multi-Category & Circular Filtering:**
   - Interactive filter bar allows users to toggle between "All", specific event categories ("Academic", "Exam", "Holiday", "Meeting", "Event"), and "Circulars".
   - Supports both graphical Month Grid view and detailed List card view (`CalendarEventCard` and `CalendarCircularCard`).

---

### C. Core Operational Modules

1. **Administrative Circulars (`/circulars`):**
   - Circular creation with multiple department/role targets and file uploads (PDF, PNG, JPG).
   - Recipient tracking: School managers can view in real time who acknowledged/responded and who has not.
   - Response revision lock controls and direct print/download capabilities.

2. **Maintenance & Service Requests (`/maintenance`):**
   - State-machine workflow: `pending` -> `assigned` -> `in_progress` -> `completed` / `cancelled` / `reopened`.
   - Operator assignment, status transition reason logs, note threads, and photo upload verification.

3. **School Achievements & Milestones (`/achievements` - Owner Only):**
   - Standalone module located at `/[locale]/achievements`, completely isolated as a premium add-on feature.
   - Access is restricted exclusively to the Platform Owner (`roles.key === 'owner'`).
   - Completely hidden from the navigation sidebar, mobile drawers, dashboard quick actions, and dashboard statistics for all other roles (including School Managers/Admins).
   - Registration of academic, athletic, and cultural milestones with department attribution, date picker, photo uploads, and bilingual descriptions.
   - Real-time keyword, category, and department filtering.

4. **Executive Reports & Advanced Analytics (`/reports`):**
   - Segregated access strictly limited to Platform Owner and School Managers.
   - Multi-criteria filtering: dynamic date sorting (newest/oldest), temporal filters (all time, specific months, or custom date ranges), and department-level filtering across both Circulars Compliance and Maintenance & SLA tabs.
   - Formula-injection-safe CSV export with UTF-8 BOM encoding for Arabic spreadsheet compatibility.

5. **System Settings & Governance (`/settings`):**
   - Multi-tab management: School Profile, Locations, Departments, Users & Roles, and Immutable Audit Trail.
   - Clean, role-guarded server actions with `withActionErrorHandler` wrapper.

---

### D. Architectural Integrity & Quality Gates

- **Modularity Rule #1 Enforced:** Every single function, component, and validation schema resides in its own isolated file named after it, strictly capped at ~300 lines and max 80 lines per function.
- **Centralized Error Handling:** Typed `AppError` taxonomy with standardized error-code catalog, automatic database error mapping, and user-friendly bilingual toast feedback.
- **Zero Mock / Zero Fake Policy:** All implementations connect directly to PostgreSQL database tables, authenticated Supabase sessions, and live RLS policies.
- **Verification Suite:**
  - 39 Vitest test suites (121 unit and component tests passing).
  - ESLint with zero errors and zero warnings.
  - Prettier formatting validated.
  - Strict TypeScript compiler (`tsc --noEmit`) passing with zero type issues.
  - Next.js production build (`next build`) generating all 40 static and dynamic routes cleanly.

---

## 3. What We Will Do (Upcoming Roadmap)

### Phase 4: Authentication & Onboarding Completion

- [ ] **Invitation & Magic Link Activation:**
  - Automated transactional email dispatch when an administrator creates a new staff account.
  - Secure activation tokens with time-limited expiration and initial password configuration.
- [ ] **Self-Service Password Reset:**
  - Secure password reset flow integrating Supabase Auth recovery tokens, rate-limited and audit-logged.
- [ ] **Session & Device Auditing:**
  - Profile page showing active user sessions and sign-in history.

### Phase 5: Advanced Calendar & Circular Automation

- [ ] **Recurring Events Engine:**
  - Support recurring schedules (weekly department meetings, monthly staff assemblies) with rule-based exceptions.
- [ ] **Real-Time Push Notifications (WebSockets):**
  - Supabase Realtime integration pushing instant alerts to active users when urgent circulars or emergency maintenance tickets are dispatched.
- [ ] **Department Head Delegation & Deputy Sign-Off:**
  - Allow Department Heads to designate acting deputies during leave periods with scoped permission grants.

### Phase 6: Enterprise Reporting & Analytics Enhancements

- [ ] **Advanced Compliance Analytics:**
  - Trend charts illustrating departmental compliance over time.
  - Automated PDF report generator for official ministry submissions and school board audits.
- [ ] **Service Level Agreement (SLA) Tracking for Maintenance:**
  - Automatic escalation alerts for critical maintenance tickets exceeding resolution windows.

### Phase 7: Deployment & Hosting Checklist (Vercel Production)

- [ ] **Vercel Environment Setup & Supabase Keepalive Activation:**
  - Add production environment variables in the Vercel Project Dashboard (**Settings > Environment Variables**):
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - _(Optional)_ `CRON_SECRET`
  - Vercel automatically deploys [vercel.json](file:///c:/Users/ahmed/Desktop/School_Administration_Portal/vercel.json) crons, which will trigger `/api/keepalive` every 3 days at 06:00 UTC to prevent Supabase free tier inactivity pausing.
  - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to **GitHub Repository Secrets** if GitHub Actions scheduled workflow backup is also desired.

---

## 4. Verification & Testing Matrix

| Suite               | Target                           | Status      | Passing                     |
| ------------------- | -------------------------------- | ----------- | --------------------------- |
| Unit & Integration  | Vitest                           | **PASSING** | 125 / 125 tests (41 suites) |
| Linter & Modularity | ESLint + D11 Single-Export       | **PASSING** | 0 errors, 0 warnings        |
| Code Formatting     | Prettier                         | **PASSING** | 100% compliant              |
| Type Safety         | TypeScript (`tsc --noEmit`)      | **PASSING** | 0 errors                    |
| Production Build    | Next.js Turbopack (`next build`) | **PASSING** | 41 routes compiled          |

---

_For architectural decisions and locked defaults, refer to [docs/decisions.md](./docs/decisions.md)._
