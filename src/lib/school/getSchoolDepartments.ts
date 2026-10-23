import { createSupabaseServerClient } from "@/lib/supabase";

export type DepartmentRow = {
  id: string;
  school_id: string;
  name_ar: string;
  name_en: string;
  is_active: boolean;
  created_at: string;
};

export async function getSchoolDepartments(schoolId?: string | null): Promise<DepartmentRow[]> {
  if (!schoolId) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, school_id, name_ar, name_en, is_active, created_at")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch departments: ${error.message}`);
  }

  return (data as DepartmentRow[]) ?? [];
}
