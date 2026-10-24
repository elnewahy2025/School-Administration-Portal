"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase";
import { assignUserRole } from "@/lib/school/assignUserRole";
import { validateUserUpdateInput } from "@/lib/school/validateUserUpdateInput";
import { assertCanManageUser } from "@/lib/school/assertCanManageUser";
import { persistUserUpdates } from "@/lib/school/persistUserUpdates";

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

export async function updateUserAction(input: UpdateUserInput) {
  const check = await assertCanManageUser(input.userId, input.roleKey);
  if (!check.allowed || !check.schoolId || !check.currentUserId) {
    return { success: false, error: check.error };
  }

  const val = validateUserUpdateInput(
    input.fullName,
    input.userId,
    check.currentUserId,
    input.isActive,
  );
  if (!val.valid) {
    return { success: false, error: val.error };
  }

  const adminClient = createSupabaseAdminClient();
  const res = await persistUserUpdates(adminClient, check.schoolId, input);
  if (!res.success) {
    return { success: false, error: res.error };
  }

  if (input.roleKey) {
    const supabase = await createSupabaseServerClient();
    await assignUserRole(
      supabase,
      input.userId,
      check.schoolId,
      check.currentUserId,
      input.roleKey,
    );
  }

  revalidatePath("/[locale]/settings/users", "page");
  return { success: true };
}
