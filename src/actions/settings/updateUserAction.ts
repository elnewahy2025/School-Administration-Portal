"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { validateUserUpdateInput } from "@/lib/school/validateUserUpdateInput";
import { assertCanManageUser } from "@/lib/school/assertCanManageUser";
import { persistUserUpdates } from "@/lib/school/persistUserUpdates";
import { applyUserRoleUpdate } from "@/lib/school/applyUserRoleUpdate";
import {
  sanitizeError,
  formatActionErrorResult,
  ForbiddenError,
  ValidationError,
  AppError,
  type ActionResult,
} from "@/lib/errors";

export type UpdateUserInput = {
  userId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  password?: string | null;
  jobTitle?: string | null;
  departmentId?: string | null;
  roleKey?: string | null;
  isActive?: boolean;
};

export async function updateUserAction(input: UpdateUserInput): Promise<ActionResult> {
  try {
    const check = await assertCanManageUser(input.userId, input.roleKey);
    if (!check.allowed || !check.schoolId || !check.currentUserId) {
      throw new ForbiddenError(check.error || "Unauthorized");
    }

    const val = validateUserUpdateInput(
      input.fullName,
      input.userId,
      check.currentUserId,
      input.isActive,
    );
    if (!val.valid) {
      throw new ValidationError(val.error || "Invalid user input");
    }

    const adminClient = createSupabaseAdminClient();
    const res = await persistUserUpdates(adminClient, check.schoolId, input);
    if (!res.success) {
      throw new AppError(res.error || "Failed to update user");
    }

    await applyUserRoleUpdate(input.userId, check.schoolId, check.currentUserId, input.roleKey);

    revalidatePath("/[locale]/settings/users", "page");
    return { success: true };
  } catch (err: unknown) {
    const sanitized = sanitizeError(err, { action: "updateUserAction", userId: input.userId });
    return formatActionErrorResult(sanitized);
  }
}
