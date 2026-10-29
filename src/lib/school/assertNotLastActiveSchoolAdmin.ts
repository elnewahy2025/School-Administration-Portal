import type { SupabaseClient } from "@supabase/supabase-js";
import { ConflictError } from "@/lib/errors/ConflictError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";

/**
 * Refuses to deactivate the only active school administrator (M-10).
 *
 * The database trigger `enforce_profile_self_update` enforces this for
 * end-user writes, but both the toggle and the edit form go through the
 * service-role client, which is exempt from `auth.uid()`-based guards. This
 * check closes that path; the definition of "last administrator" lives in
 * `public.is_last_active_school_admin` (0046) so the two cannot drift.
 */
export async function assertNotLastActiveSchoolAdmin(
  adminClient: SupabaseClient,
  userId: string,
): Promise<void> {
  const { data, error } = await adminClient.rpc("is_last_active_school_admin", {
    p_user_id: userId,
  });

  if (error) {
    throw mapDatabaseError(error);
  }

  if (data === true) {
    throw new ConflictError(
      "Cannot deactivate the last active school administrator. Assign another administrator first.",
    );
  }
}
