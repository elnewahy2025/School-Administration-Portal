import { createSupabaseServerClient } from "@/lib/supabase";
import type { SchoolAchievementRow } from "./types";

export async function getSchoolAchievements(
  schoolId?: string | null,
): Promise<SchoolAchievementRow[]> {
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
    .from("school_achievements")
    .select(
      `
      id,
      school_id,
      department_id,
      title_ar,
      title_en,
      description,
      category,
      date_achieved,
      visibility,
      image_path,
      created_by,
      created_at,
      updated_at,
      department:departments(id, name_ar, name_en),
      creator:profiles!created_by(id, full_name)
    `,
    )
    .eq("school_id", resolvedId)
    .order("date_achieved", { ascending: false });

  if (error || !data) return [];
  return data as unknown as SchoolAchievementRow[];
}
