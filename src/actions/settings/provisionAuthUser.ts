import { createSupabaseAdminClient } from "@/lib/supabase";
import { assignUserRole } from "@/lib/school/assignUserRole";

export type ProvisionUserParams = {
  fullName: string;
  email: string;
  password: string;
  jobTitle?: string | null;
  departmentId?: string | null;
  roleKey: string;
  schoolId: string;
  callerId: string;
};

export async function provisionAuthUser(params: ProvisionUserParams) {
  const admin = createSupabaseAdminClient();
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true,
    user_metadata: { full_name: params.fullName },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message ?? "Failed to create user account",
    };
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: authData.user.id,
    full_name: params.fullName,
    email: params.email,
    job_title: params.jobTitle?.trim() || null,
    department_id: params.departmentId || null,
    school_id: params.schoolId,
    is_active: true,
    invited_by: params.callerId,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { success: false, error: profileError.message };
  }

  await assignUserRole(admin, authData.user.id, params.schoolId, params.callerId, params.roleKey);
  return { success: true };
}
