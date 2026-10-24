import type { SupabaseClient } from "@supabase/supabase-js";
import { syncAuthUserUpdates } from "./syncAuthUserUpdates";

export type UpdateUserPersistInput = {
  userId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  password?: string | null;
  jobTitle?: string | null;
  departmentId?: string | null;
  isActive?: boolean;
};

export async function persistUserUpdates(
  adminClient: SupabaseClient,
  schoolId: string,
  input: UpdateUserPersistInput,
): Promise<{ success: boolean; error?: string }> {
  const authSync = await syncAuthUserUpdates(
    adminClient,
    input.userId,
    input.email,
    input.password,
  );
  if (!authSync.success) {
    return { success: false, error: authSync.error };
  }

  const { error } = await adminClient
    .from("profiles")
    .update({
      full_name: input.fullName.trim(),
      email: input.email ? input.email.trim().toLowerCase() : null,
      phone: input.phone ? input.phone.trim() : null,
      job_title: input.jobTitle ? input.jobTitle.trim() : null,
      department_id: input.departmentId || null,
      is_active: input.isActive ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.userId)
    .eq("school_id", schoolId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
