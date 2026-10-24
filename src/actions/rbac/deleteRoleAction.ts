"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { sanitizeError, formatActionErrorResult } from "@/lib/errors";
import { assertCanDeleteRoleRecord } from "./assertCanDeleteRoleRecord";

export async function deleteRoleAction(roleId: string) {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      return { success: false, error: "No school associated with profile" };
    }

    const allowed = await hasPermission("roles.manage", profile.school_id);
    if (!allowed) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await createSupabaseServerClient();
    const canDelete = await assertCanDeleteRoleRecord(supabase, roleId, profile.school_id);
    if (!canDelete.allowed) {
      return { success: false, error: canDelete.error };
    }

    const { error } = await supabase.from("roles").delete().eq("id", roleId);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "deleteRoleAction", roleId });
    return formatActionErrorResult(sanitized);
  }
}
