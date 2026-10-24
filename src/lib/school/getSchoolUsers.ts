import { createSupabaseServerClient } from "@/lib/supabase";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import {
  mapSchoolUserRows,
  type RawProfileQueryResult,
  type MappedSchoolUser,
} from "./mapSchoolUserRows";

export type SchoolUserRow = MappedSchoolUser;

export async function getSchoolUsers(
  schoolId?: string | null,
  viewerUserId?: string | null,
): Promise<SchoolUserRow[]> {
  const [supabase, viewerIsOwner] = await Promise.all([
    createSupabaseServerClient(),
    isPlatformOwner(viewerUserId),
  ]);

  let resolvedId = schoolId;
  if (!resolvedId) {
    const { data: firstSchool } = await supabase
      .from("schools")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    resolvedId = firstSchool?.id ?? null;
  }
  if (!resolvedId) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, job_title, department_id, is_active, departments:departments!profiles_department_id_fkey(name_ar, name_en), user_role_assignments:user_role_assignments!user_role_assignments_user_id_fkey(roles(key, name))",
    )
    .eq("school_id", resolvedId)
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  const rawRows = (data as unknown as RawProfileQueryResult[]) ?? [];
  return mapSchoolUserRows(rawRows, viewerIsOwner);
}
