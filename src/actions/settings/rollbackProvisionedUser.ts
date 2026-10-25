import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Rolls back newly created profile and authentication records
 * when user provisioning encounters downstream failures.
 */
export async function rollbackProvisionedUser(
  admin: SupabaseClient,
  userId: string,
): Promise<void> {
  await admin.from("profiles").delete().eq("id", userId);
  await admin.auth.admin.deleteUser(userId);
}
