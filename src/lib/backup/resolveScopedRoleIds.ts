import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Ids of the roles owned by a school, used to scope `role_permissions`.
 *
 * A missing school (platform scope) returns `null`; a school with no custom
 * roles returns `[]`, which callers treat as "nothing to read".
 */
export async function resolveScopedRoleIds(
  admin: SupabaseClient,
  schoolId: string | null,
): Promise<string[] | null> {
  if (!schoolId) return null;

  const { data, error } = await admin.from("roles").select("id").eq("school_id", schoolId);
  if (error) {
    throw new Error(`Could not list the school's roles: ${error.message}`);
  }

  return ((data ?? []) as { id: string }[]).map((role) => role.id);
}
