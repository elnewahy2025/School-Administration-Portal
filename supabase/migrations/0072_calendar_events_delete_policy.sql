-- 0072: Add RLS policy allowing calendar managers to delete calendar events and their public assets
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'calendar_events'
      and policyname = 'calendar_events_delete'
  ) then
    create policy calendar_events_delete on public.calendar_events
      for delete to authenticated
      using (public.has_permission('calendar.manage', school_id));
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'public assets deleted by calendar managers'
  ) then
    create policy "public assets deleted by calendar managers"
      on storage.objects for delete to authenticated
      using (
        bucket_id = 'public-assets'
        and public.is_active_user()
        and (storage.foldername(name))[1] ~ '^[0-9a-fA-F-]{36}$'
        and (storage.foldername(name))[2] = 'calendar'
        and public.has_permission('calendar.manage', ((storage.foldername(name))[1])::uuid)
      );
  end if;
end $$;
