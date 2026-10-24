"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
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
      throw new ForbiddenError("Cannot modify platform owner");
    }

    const allowed = await hasPermission("users.manage", profile.school_id);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !currentStatus })
      .eq("id", targetUserId)
      .eq("school_id", profile.school_id);

    if (error) {
      throw mapDatabaseError(error);
    }

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "toggleUserActiveAction", targetUserId });
    return formatActionErrorResult(sanitized);
  }
}
