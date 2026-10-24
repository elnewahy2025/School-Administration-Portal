import { createSupabaseAdminClient } from "@/lib/supabase";
import {
  mapSchoolUserRows,
  type RawProfileQueryResult,
  type MappedSchoolUser,
} from "./mapSchoolUserRows";

export type SchoolUserRow = MappedSchoolUser;

export async function getSchoolUsers(schoolId?: string | null): Promise<SchoolUserRow[]> {
  const admin = createSupabaseAdminClient();

  let resolvedId = schoolId;
  if (!resolvedId) {
    const { data: firstSchool } = await admin
      .from("schools")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    resolvedId = firstSchool?.id ?? null;
  }
  if (!resolvedId) return [];

  const [{ data, error }, { data: ownerAssignments }] = await Promise.all([
    admin
      .from("profiles")
      .select(
        "id, full_name, email, phone, job_title, department_id, is_active, departments:departments!profiles_department_id_fkey(name_ar, name_en), user_role_assignments:user_role_assignments!user_role_assignments_user_id_fkey(roles(key, name))",
      )
      .eq("school_id", resolvedId)
      .order("full_name", { ascending: true }),
    admin
      .from("user_role_assignments")
      .select("user_id, roles!inner(key)")
      .eq("roles.key", "owner"),
  ]);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  const ownerUserIds = new Set((ownerAssignments ?? []).map((a) => a.user_id));
  const rawRows = (data as unknown as RawProfileQueryResult[]) ?? [];
  return mapSchoolUserRows(rawRows, false, ownerUserIds);
}
