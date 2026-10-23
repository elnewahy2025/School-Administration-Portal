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
    roles: { key: string; name_ar: string; name_en: string } | null;
  }> | null;
};

export async function getSchoolUsers(schoolId?: string | null): Promise<SchoolUserRow[]> {
  if (!schoolId) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, job_title, department_id, is_active, departments(name_ar, name_en), user_role_assignments(roles(key, name_ar, name_en))",
    )
    .eq("school_id", schoolId)
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
