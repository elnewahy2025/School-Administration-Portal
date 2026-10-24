-- 0035: Fix Security Definer View and address database linter findings.
--
-- 1. Switch public.public_school_profiles view to security_invoker = true
--    and add policies allowing anon and authenticated to select active schools and settings.
alter view public.public_school_profiles set (security_invoker = true);

create policy "schools_select_active"
  on public.schools
  for select
  to anon, authenticated
  using (is_active = true);

create policy "school_settings_select_active"
  on public.school_settings
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.schools s
      where s.id = school_settings.school_id
        and s.is_active = true
    )
  );

-- 2. Fix mutable search_path on functions
alter function public.touch_updated_at() set search_path = public;
alter function public.enforce_maintenance_transition() set search_path = public;

-- 3. Revoke direct RPC execution from anon on internal security definer functions
revoke execute on function public.audit_row_change() from anon;
revoke execute on function public.can_access_department(uuid, uuid) from anon;
revoke execute on function public.effective_permission_keys() from anon;
revoke execute on function public.enforce_assignment_integrity() from anon;
revoke execute on function public.generate_school_number(uuid, text) from anon;
revoke execute on function public.has_any_owner() from anon;
revoke execute on function public.has_permission(text, uuid, uuid) from anon;
revoke execute on function public.is_active_user() from anon;
revoke execute on function public.is_circular_target(uuid) from anon;
revoke execute on function public.is_platform_owner() from anon;
revoke execute on function public.is_school_member(uuid) from anon;

-- 4. Revoke direct RPC execution from authenticated on trigger-only functions
revoke execute on function public.audit_row_change() from authenticated;
revoke execute on function public.enforce_assignment_integrity() from authenticated;
