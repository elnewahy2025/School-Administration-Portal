"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { sanitizeError, formatActionErrorResult } from "@/lib/errors";

export async function updateRoleAction(roleId: string, name: string, permissionKeys: string[]) {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      return { success: false, error: "No school associated with profile" };
    }

    const allowed = await hasPermission("roles.manage", profile.school_id);
    if (!allowed) {
      return { success: false, error: "Unauthorized" };
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return { success: false, error: "Role name is required" };
    }

    const supabase = await createSupabaseServerClient();
    const { data: role } = await supabase
      .from("roles")
      .select("id, is_system, school_id")
      .eq("id", roleId)
      .single();

    if (!role || role.is_system || role.school_id !== profile.school_id) {
      return { success: false, error: "Cannot modify system or unauthorized roles" };
    }

    await supabase.from("roles").update({ name: trimmedName }).eq("id", roleId);
    await supabase.from("role_permissions").delete().eq("role_id", roleId);

    if (permissionKeys.length > 0) {
      const rows = permissionKeys.map((p) => ({
        role_id: roleId,
        permission_key: p,
      }));
      await supabase.from("role_permissions").insert(rows);
    }

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "updateRoleAction", roleId });
    return formatActionErrorResult(sanitized);
  }
}
