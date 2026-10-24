"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { sanitizeError, formatActionErrorResult } from "@/lib/errors";
import { insertRoleRow } from "./insertRoleRow";

export async function createRoleAction(name: string, key: string, permissionKeys: string[]) {
  try {
    const profile = await getCurrentProfile();
    const schoolId = profile?.school_id;
    if (!schoolId) {
      return { success: false, error: "No school associated with profile" };
    }

    const allowed = await hasPermission("roles.manage", schoolId);
    if (!allowed) {
      return { success: false, error: "Unauthorized" };
    }

    const trimmedName = name.trim();
    const trimmedKey = key
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");
    if (!trimmedName || !trimmedKey) {
      return { success: false, error: "Role name and key are required" };
    }

    const supabase = await createSupabaseServerClient();
    const res = await insertRoleRow(supabase, {
      name: trimmedName,
      key: trimmedKey,
      schoolId,
      permissionKeys,
    });

    if (res.success) {
      revalidatePath("/[locale]/settings/users", "page");
    }
    return res;
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "createRoleAction", roleKey: key });
    return formatActionErrorResult(sanitized);
  }
}
