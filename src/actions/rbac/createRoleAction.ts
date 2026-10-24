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
  ValidationError,
  AppError,
  type ActionResult,
} from "@/lib/errors";
import { insertRoleRow } from "./insertRoleRow";

export async function createRoleAction(
  name: string,
  key: string,
  permissionKeys: string[],
): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    const schoolId = profile?.school_id;
    if (!schoolId) {
      throw new AuthenticationError("No school associated with profile");
    }

    const allowed = await hasPermission("roles.manage", schoolId);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const trimmedName = name.trim();
    const trimmedKey = key
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");
    if (!trimmedName || !trimmedKey) {
      throw new ValidationError("Role name and key are required");
    }

    const supabase = await createSupabaseServerClient();
    const res = await insertRoleRow(supabase, {
      name: trimmedName,
      key: trimmedKey,
      schoolId,
      permissionKeys,
    });

    if (!res.success) {
      throw new AppError(res.error || "Failed to create role");
    }

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "createRoleAction", roleKey: key });
    return formatActionErrorResult(sanitized);
  }
}
