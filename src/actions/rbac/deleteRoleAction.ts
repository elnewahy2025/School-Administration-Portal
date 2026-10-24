"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import {
  sanitizeError,
  formatActionErrorResult,
  AuthenticationError,
  ForbiddenError,
  AppError,
  mapDatabaseError,
  type ActionResult,
} from "@/lib/errors";
import { assertCanDeleteRoleRecord } from "./assertCanDeleteRoleRecord";

export async function deleteRoleAction(roleId: string): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      throw new AuthenticationError("No school associated with profile");
    }

    const allowed = await hasPermission("roles.manage", profile.school_id);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const supabase = await createSupabaseServerClient();
    const canDelete = await assertCanDeleteRoleRecord(supabase, roleId, profile.school_id);
    if (!canDelete.allowed) {
      throw new AppError(canDelete.error || "Cannot delete role");
    }

    const { error } = await supabase.from("roles").delete().eq("id", roleId);
    if (error) {
      throw mapDatabaseError(error);
    }

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "deleteRoleAction", roleId });
    return formatActionErrorResult(sanitized);
  }
}
