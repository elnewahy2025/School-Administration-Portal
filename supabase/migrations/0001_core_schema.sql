-- Migration 0001: core schema skeleton.
-- WP2 fills this file with the full school-scoped model (build_plan.md §5):
--   schools, school_settings, profiles, departments, locations, roles,
--   permissions, role_permissions, user_role_assignments, circulars,
--   circular_targets, circular_responses, circular_attachments,
--   maintenance_requests, maintenance_assignments, maintenance_updates,
--   maintenance_attachments, calendar_events, notifications, audit_logs,
--   system_settings.
--
-- Conventions: UUID PKs, timestamptz created_at/updated_at, school_id on every
-- school-scoped table, Postgres enums for statuses, RLS enabled with policies
-- before the first feature module lands.

create extension if not exists "pgcrypto";
