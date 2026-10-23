# Administrator Runbook & Operations Guide

## 1. Initial System Bootstrap & Account Provisioning

1. **Initial Platform Owner Bootstrap**:
   - The first user who signs up or is created in Supabase claims the `platform_owner` role from the Dashboard `/dashboard`.
   - The platform owner creates the School record and designates the primary **School Administrator**.
2. **Staff Invitation & User Management** (`/settings/users`):
   - School Administrators create staff accounts directly in the portal.
   - Staff cannot self-register; credentials or invitations are issued securely by administration.
   - Roles are assigned per user: `school_admin`, `dept_head`, `staff`, `maintenance_operator`, or `auditor`.
   - To revoke access, toggle the user to **Deactivated** (`is_active = false`). Active sessions are blocked immediately by the session refresh middleware.

## 2. Departmental Structure & Facilities Setup

1. **Departments** (`/settings/departments`):
   - Create academic and administrative departments (e.g. Science, Mathematics, English, Administration, Maintenance).
   - Assign a designated **Department Head** (`head_profile_id`). Department Heads receive circular tasks and departmental reports.
2. **Locations & Facilities** (`/settings/locations`):
   - Set up buildings, floors, and rooms (classrooms, labs, auditoriums, outdoor facilities).
   - These locations populate the location picker for maintenance tickets and campus events.

## 3. Circulars & Compliance Monitoring

1. **Issuing Circulars** (`/circulars/new`):
   - Provide reference number (or auto-sequence `CIR-YYYY-NNNN`), title, description, priority, category, and due date.
   - Select required response type:
     - `acknowledgement`: confirms receipt by the department head.
     - `approval`: requires formal approval or rejection with mandatory rationale.
     - `task`: departmental task completion.
   - Target specific departments or broadcast school-wide.
2. **Tracking Department Compliance** (`/circulars/[id]` & `/reports`):
   - Grouped compliance dashboard displays which departments have responded and which are pending.
   - Overdue circulars are flagged automatically for administrative follow-up.
   - Anonymized responses preserve staff privacy while providing department-level compliance metrics.

## 4. Maintenance & Facilities Operations

1. **Ticket Triage & Operator Assignment** (`/maintenance`):
   - Routine tickets (`submitted`) are triaged by the dispatcher or school administrator.
   - Administrators assign tickets to operators (`assigned`) with priority levels (`emergency`, `urgent`, `medium`, `deferrable`).
2. **Operator Work & Status Transitions**:
   - Operators transition assigned tickets through legal states: `in_progress`, `waiting_for_parts`, `resolved`.
   - Resolution photo evidence can be attached upon ticket completion.
3. **Closing & Reopening Tickets**:
   - Resolved tickets are reviewed by administration and marked `closed`.
   - If an issue recurs, administration can reopen the ticket (`reopened`) with a mandatory explanation.

## 5. School Calendar & Public Showcase

1. **Internal vs. Public Events** (`/calendar/new`):
   - **Internal**: Visible only to authenticated school staff (faculty meetings, internal exam schedules).
   - **Public**: Automatically showcased on the public landing page `/` for parents, students, and community visitors.
2. **Event Management**:
   - Manage events across Month Grid and accessible List View.
   - Support for all-day events, specific timeframes, venues, and banner images.

## 6. Reports & Data Exports

1. **Operational Analytics** (`/reports`):
   - **Circulars & Compliance**: Monitor total circulars, response rates, overdue items, and per-department breakdown.
   - **Maintenance SLA**: Inspect ticket volumes, status breakdowns, priority distributions, and average resolution times.
2. **Server-Authorized CSV Export**:
   - Click "Export CSV" to download verified datasets.
   - Files include formula injection protection (`'`, `=`, `+`, `-`, `@`) and UTF-8 BOM (`\uFEFF`) for Arabic spreadsheet fidelity.
