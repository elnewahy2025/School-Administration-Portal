-- 0032: Update public_school_profiles view to include all expanded school profile fields.

create or replace view public.public_school_profiles
with (security_invoker = false) as
select
  s.id,
  s.name_ar,
  s.name_en,
  s.slug,
  s.logo_path,
  s.timezone,
  s.phone,
  s.manager_name_ar,
  s.manager_name_en,
  s.assistant_manager_ar,
  s.assistant_manager_en,
  s.assistant_manager_2_ar,
  s.assistant_manager_2_en,
  s.address_ar,
  s.address_en,
  ss.academic_year,
  ss.public_description,
  ss.vision,
  ss.mission,
  ss.vision_ar,
  ss.vision_en,
  ss.mission_ar,
  ss.mission_en,
  ss.objectives
from public.schools s
left join public.school_settings ss on ss.school_id = s.id
where s.is_active;

revoke all on public.public_school_profiles from public;
grant select on public.public_school_profiles to anon, authenticated;
