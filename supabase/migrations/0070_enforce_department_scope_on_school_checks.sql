-- 0070: Enforce department scope on school-scoped permission checks.
--
-- Finding:
-- In 0026 / 0048, `has_permission` evaluated `p_department is null` as true
-- regardless of `ura.department_id`:
--
--   and (p_department is null or ura.department_id is null or ura.department_id = p_department)
--
-- When callers checked school-scoped permissions (such as `users.manage`,
-- `roles.manage`, `maintenance.assign`, or `circular.create`) by omitting
-- `p_department`, any user holding a department-scoped custom role assignment
-- with that permission was granted school-wide authority.
--
-- Fix:
-- 1. In `has_permission`: when `p_department` is null (school-scoped check),
--    require `ura.department_id is null`, with an explicit allowance for
--    `maintenance.create` so that school staff can file maintenance requests.
--    When `p_department` is provided, require either `ura.department_id is null`
--    or `ura.department_id = p_department`.
-- 2. In `effective_permission_keys`: apply the same department scoping filter
--    so that school-scoped queries do not leak department-scoped administrative
--    permissions.
-- 3. In `maintenance_requests_insert`: verify `maintenance.create` against
--    `reporter_department_id` in row-level security.

-- 1. Update has_permission
create or replace function public.has_permission(
  p_permission text,
  p_school uuid default null,
  p_department uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_user() and exists (
    select 1
    from public.user_role_assignments ura
    join public.role_permissions rp on rp.role_id = ura.role_id
    where ura.user_id = auth.uid()
      and rp.permission_key = p_permission
      and (
        ura.school_id is null
        or (p_school is not null and ura.school_id = p_school)
      )
      and (
        (p_department is not null and (ura.department_id is null or ura.department_id = p_department))
        or (p_department is null and (ura.department_id is null or p_permission = 'maintenance.create'))
      )
  );
$$;

-- 2. Update effective_permission_keys
create or replace function public.effective_permission_keys(
  p_school uuid default null,
  p_department uuid default null
)
returns setof text
language sql
stable
security definer
set search_path = public
as $$
  select distinct rp.permission_key
  from public.user_role_assignments ura
  join public.role_permissions rp on rp.role_id = ura.role_id
  join public.profiles p on p.id = ura.user_id
  where ura.user_id = auth.uid()
    and p.is_active
    and (
      ura.school_id is null
      or p_school is null
      or ura.school_id = p_school
    )
    and (
      (p_department is not null and (ura.department_id is null or ura.department_id = p_department))
      or (p_department is null and (ura.department_id is null or rp.permission_key = 'maintenance.create'))
    );
$$;

revoke all on function public.effective_permission_keys(uuid, uuid) from public, anon;
grant execute on function public.effective_permission_keys(uuid, uuid) to authenticated, service_role;

-- 3. Harden maintenance_requests_insert RLS check with reporter_department_id
drop policy if exists maintenance_requests_insert on public.maintenance_requests;
create policy maintenance_requests_insert on public.maintenance_requests
  for insert to authenticated
  with check (
    reporter_id = auth.uid()
    and (
      public.has_permission('maintenance.create', school_id, reporter_department_id)
      or public.has_permission('maintenance.create', school_id)
    )
  );
