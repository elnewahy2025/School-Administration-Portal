-- 0066: Allow all active public circulars to be read by anonymous visitors.
--
-- Migration 0065 permitted `status = 'published'`. However, circulars that are
-- in_progress, completed, or overdue remain valid published circulars that
-- public visitors should still be able to view and read.
--
-- 1. Anonymous visitors: all active public circulars of active schools.
drop policy if exists circulars_select_public on public.circulars;
create policy circulars_select_public on public.circulars
  for select to anon
  using (
    status in ('published', 'in_progress', 'completed', 'overdue')
    and visibility = 'public'
    and public.is_public_school_active(school_id)
  );

-- 2. Attachments of active public circulars.
drop policy if exists circular_attachments_select_public on public.circular_attachments;
create policy circular_attachments_select_public on public.circular_attachments
  for select to anon
  using (
    exists (
      select 1
      from public.circulars c
      where c.id = circular_id
        and c.status in ('published', 'in_progress', 'completed', 'overdue')
        and c.visibility = 'public'
        and public.is_public_school_active(c.school_id)
    )
  );

