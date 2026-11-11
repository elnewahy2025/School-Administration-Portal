-- 0071: Repair department-scoped authorization and preserve maintenance guards.
--
-- This is a follow-up migration rather than an edit to 0070 so installations
-- that have already applied 0070 receive the corrections as well.

-- Keep the school permission check from 0048, but prevent a department-scoped
-- assignment from granting school-wide permissions. Department-scoped checks
-- accept an assignment for that department or a school-wide assignment.
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

-- Remove every prior overload: default arguments on the two-argument function
-- otherwise collide with both the legacy zero-argument function and 0048's
-- one-argument function in PostgreSQL/PostgREST RPC resolution.
drop function if exists public.effective_permission_keys();
drop function if exists public.effective_permission_keys(uuid);
drop function if exists public.effective_permission_keys(uuid, uuid);

create function public.effective_permission_keys(
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

-- Require a request to begin in the safe initial state and bind the create
-- permission to the requester's actual department. The insert trigger in 0022
-- also enforces the initial status; retain the policy check as defense in depth.
drop policy if exists maintenance_requests_insert on public.maintenance_requests;
create policy maintenance_requests_insert on public.maintenance_requests
  for insert to authenticated
  with check (
    reporter_id = auth.uid()
    and status = 'submitted'
    and assigned_operator_id is null
    and public.has_permission('maintenance.create', school_id, reporter_department_id)
  );

-- Preserve ticket visibility for the assigned operator, school maintenance
-- managers, school-wide auditors, and department-scoped report viewers/heads.
-- A school-wide reports.view assignment is accepted by the department-scoped
-- call because has_permission treats department_id NULL as school-wide.
drop policy if exists maintenance_requests_select on public.maintenance_requests;
create policy maintenance_requests_select on public.maintenance_requests
  for select to authenticated
  using (
    reporter_id = auth.uid()
    or assigned_operator_id = auth.uid()
    or public.has_permission('maintenance.assign', school_id)
    or public.has_permission('maintenance.close', school_id)
    or public.has_permission('reports.view', school_id, reporter_department_id)
    or public.is_department_head(school_id, reporter_department_id)
  );
