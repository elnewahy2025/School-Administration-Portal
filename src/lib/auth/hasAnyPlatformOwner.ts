import { createSupabaseAdminClient } from "@/lib/supabase";

export async function hasAnyPlatformOwner(): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("user_role_assignments")
    .select("id", { count: "exact", head: true })
    .eq("roles.key", "owner")
    .is("school_id", null);
  return (count ?? 0) > 0;
}
