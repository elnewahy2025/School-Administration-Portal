import { createSupabaseServerClient } from "@/lib/supabase";

export type SchoolUserRow = {
  id: string;
  full_name: string;
  email: string | null;
  job_title: string | null;
  department_id: string | null;
  department_name: string | null;
  is_active: boolean;
  role_key: string | null;
};

type ProfileQueryResult = {
  id: string;
  full_name: string;
  email: string | null;
  job_title: string | null;
  department_id: string | null;
  is_active: boolean;
  departments: { name_ar: string; name_en: string } | null;
  user_role_assignments: Array<{
    roles: { key: string; name: string } | null;
  }> | null;
};

export async function getSchoolUsers(schoolId?: string | null): Promise<SchoolUserRow[]> {
  const supabase = await createSupabaseServerClient();
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

  const rawRows = (data as unknown as ProfileQueryResult[]) ?? [];
  return rawRows.map((row) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    job_title: row.job_title,
    department_id: row.department_id,
    department_name: row.departments?.name_ar || row.departments?.name_en || null,
    is_active: row.is_active,
    role_key: row.user_role_assignments?.[0]?.roles?.key ?? null,
  }));
}
