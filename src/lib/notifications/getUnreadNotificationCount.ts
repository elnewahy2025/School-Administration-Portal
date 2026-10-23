import { createSupabaseServerClient } from "@/lib/supabase";

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userRes.user.id)
    .is("read_at", null);

  if (error || typeof count !== "number") return 0;
  return count;
}
