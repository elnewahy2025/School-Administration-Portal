-- 0068: Add RLS policy allowing authenticated users to delete their own notifications
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'notifications'
      and policyname = 'notifications_delete'
  ) then
    create policy notifications_delete on public.notifications
      for delete to authenticated
      using (user_id = auth.uid());
  end if;
end $$;
