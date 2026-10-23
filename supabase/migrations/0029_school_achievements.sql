-- 0029: School achievements register.

create table public.school_achievements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  title_ar text not null,
  title_en text,
  description text,
  category text not null default 'academic',
  date_achieved date not null default current_date,
  visibility text not null default 'internal' check (visibility in ('public', 'internal')),
  image_path text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index school_achievements_school_date_idx on public.school_achievements (school_id, date_achieved desc);
create index school_achievements_dept_idx on public.school_achievements (department_id);
create index school_achievements_visibility_idx on public.school_achievements (visibility);

alter table public.school_achievements enable row level security;

grant select, insert, update, delete on public.school_achievements to authenticated;
grant select on public.school_achievements to anon;

create policy school_achievements_select_public on public.school_achievements
  for select to anon
  using (visibility = 'public');

create policy school_achievements_select_authenticated on public.school_achievements
  for select to authenticated
  using (
    visibility = 'public'
    or public.is_school_member(school_id)
    or public.is_platform_owner()
  );

create policy school_achievements_insert on public.school_achievements
  for insert to authenticated
  with check (
    public.is_platform_owner()
    or public.has_permission('calendar.manage', school_id)
    or created_by = auth.uid()
  );

create policy school_achievements_update on public.school_achievements
  for update to authenticated
  using (
    public.is_platform_owner()
    or public.has_permission('calendar.manage', school_id)
    or created_by = auth.uid()
  )
  with check (
    public.is_platform_owner()
    or public.has_permission('calendar.manage', school_id)
    or created_by = auth.uid()
  );

create policy school_achievements_delete on public.school_achievements
  for delete to authenticated
  using (
    public.is_platform_owner()
    or public.has_permission('calendar.manage', school_id)
    or created_by = auth.uid()
  );

create trigger set_school_achievements_updated_at
  before update on public.school_achievements
  for each row execute function public.set_updated_at();
