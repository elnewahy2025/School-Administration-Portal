"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { mapDissociationError } from "@/lib/school/mapDissociationError";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { ValidationError } from "@/lib/errors/ValidationError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

/**
 * Removes a user from the caller's school.
 *
 * The write is a single transaction (`dissociate_school_user`, 0046) executed
 * with the caller's identity: it verifies `users.manage` on the user's actual
 * school, refuses to remove the last active administrator, and always
 * deactivates the account. Previously the service-role client bypassed those
 * guards and a partial failure could leave the user active without a school
 * (M-10).
 */
export async function deleteUserAction(userId: string): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      throw new AuthenticationError("No school associated with profile");
    }

    if (profile.id === userId) {
      throw new ValidationError("Cannot delete your own account");
    }

    const allowed = await hasPermission("users.manage", profile.school_id);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.rpc("dissociate_school_user", { p_user_id: userId });

    if (error) {
      throw mapDissociationError(error);
    }

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "deleteUserAction", userId });
    return formatActionErrorResult(sanitized);
  }
}
