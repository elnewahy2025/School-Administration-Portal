"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";
import {
  sanitizeError,
  formatActionErrorResult,
  AuthenticationError,
  ForbiddenError,
  ValidationError,
  mapDatabaseError,
  type ActionResult,
} from "@/lib/errors";

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      throw new AuthenticationError("No school associated with profile");
    }

    if (profile.id === userId) {
      throw new ValidationError("Cannot delete your own account");
    }

    if (await isPlatformOwner(userId)) {
      throw new ForbiddenError("Cannot modify system-protected account");
    }

    const allowed = await hasPermission("users.manage", profile.school_id);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const admin = createSupabaseAdminClient();

    // Delete role assignments for this user within this school
    await admin
      .from("user_role_assignments")
      .delete()
      .eq("user_id", userId)
      .eq("school_id", profile.school_id);

    // Disassociate the user from the school and deactivate
    const { error } = await admin
      .from("profiles")
      .update({
        school_id: null,
        department_id: null,
        is_active: false,
      })
      .eq("id", userId)
      .eq("school_id", profile.school_id);

    if (error) {
      throw mapDatabaseError(error);
    }

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "deleteUserAction", userId });
    return formatActionErrorResult(sanitized);
  }
}
