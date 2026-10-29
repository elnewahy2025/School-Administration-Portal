"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { assertNotLastActiveSchoolAdmin } from "@/lib/school/assertNotLastActiveSchoolAdmin";
import {
  sanitizeError,
  formatActionErrorResult,
  AuthenticationError,
  ForbiddenError,
  ValidationError,
  NotFoundError,
  mapDatabaseError,
  type ActionResult,
} from "@/lib/errors";

export async function toggleUserActiveAction(
  targetUserId: string,
  currentStatus: boolean,
): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      throw new AuthenticationError("No school associated with profile");
    }

    if (profile.id === targetUserId) {
      throw new ValidationError("Cannot change your own active status");
    }

    if (await isPlatformOwner(targetUserId)) {
      throw new ForbiddenError("Cannot modify system-protected account");
    }

    const allowed = await hasPermission("users.manage", profile.school_id);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const admin = createSupabaseAdminClient();

    // Deactivating a school's only administrator would lock everyone else out.
    if (currentStatus) {
      await assertNotLastActiveSchoolAdmin(admin, targetUserId);
    }

    // `.select()` exposes the affected row: a 0-row update is reported as
    // "not found" instead of a silent success (M-28).
    const { data: updated, error } = await admin
      .from("profiles")
      .update({ is_active: !currentStatus })
      .eq("id", targetUserId)
      .eq("school_id", profile.school_id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw mapDatabaseError(error);
    }

    if (!updated) {
      throw new NotFoundError("User not found in this school");
    }

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "toggleUserActiveAction", targetUserId });
    return formatActionErrorResult(sanitized);
  }
}
