# Backup & Disaster Recovery Runbook

## 1. Backup Strategy Overview

The School Administration Portal relies on two stateful layers:

1. **PostgreSQL Database (Supabase)**: schema, user accounts, RLS policies, circulars, maintenance tickets, calendar events, notifications, audit logs.
2. **Supabase Storage Buckets**:
   - `circular-attachments` (private)
   - `maintenance-photos` (private)
   - `public-assets` (public)

## 2. Automated & Scheduled Backups

1. **Daily Automated Database Backups**:
   - Managed automatically by the Supabase platform on standard backup tiers.
   - Point-in-time recovery (PITR) is enabled on production projects.
2. **Pre-Migration Manual Export**:
   - Before executing any additive or non-trivial database migration in production, generate a full logical dump:
     ```bash
     supabase db dump --db-url "$DATABASE_URL" -f "backups/pre-migration-$(date +%Y%m%d%H%M%S).sql"
     ```
   - Store backup dumps in an encrypted, off-site location with restricted access.

## 3. Storage Bucket Backups

1. **Bucket Synchronization**:
   - Object metadata is tracked in `public.file_metadata` and table attachments.
   - To archive storage objects locally or to secondary cloud storage:
     ```bash
     # Example using AWS S3 CLI or Supabase CLI S3-compatible API
     aws s3 sync s3://supabase-project-id/maintenance-photos ./backups/storage/maintenance-photos --endpoint-url "$STORAGE_S3_ENDPOINT"
     ```

## 4. Disaster Recovery & Restoration Drill

To verify backup validity or restore following an incident, execute the restore procedure into a disposable/staging database:

1. **Provision Target Environment**:
   - Create a clean test project or database instance.
2. **Restore Database Schema & Data**:
   ```bash
   psql "$STAGING_DATABASE_URL" -f "backups/target_backup.sql"
   ```
3. **Run RLS Battery Verification**:
   - Verify that all security policies and constraints are fully intact:
     ```bash
     npm test
     node supabase/tests/rls.battery.test.mjs
     ```
4. **Audit Key Invariants**:
   - Ensure `is_platform_owner()` works.
   - Verify sequence numbering functions: `public.generate_school_number`.
   - Verify triggers: `enforce_maintenance_transition`, audit triggers.
   - Check that deactivated users cannot access records.
5. **Switch Traffic**:
   - Once the restored database is validated, update environment variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel to point to the restored instance.
   - Trigger production redeployment.
