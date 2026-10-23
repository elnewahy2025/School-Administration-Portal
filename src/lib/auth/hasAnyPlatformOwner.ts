import { createSupabaseAdminClient } from "@/lib/supabase";

export async function hasAnyPlatformOwner(): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  // `roles.key` is a joined column: it can only be filtered when `roles` is
  // declared as an embedded resource. Without `!inner` PostgREST rejects the
  // request (PGRST108) and returns no rows; discarding `error` then made this
  // always report `false` (finding C1).
  const { count, error } = await admin
    .from("user_role_assignments")
    .select("id, roles!inner(key)", { count: "exact", head: true })
    .eq("roles.key", "owner")
    .is("school_id", null);
  if (error) throw new Error(`Platform owner check failed: ${error.message}`);
  return (count ?? 0) > 0;
}
