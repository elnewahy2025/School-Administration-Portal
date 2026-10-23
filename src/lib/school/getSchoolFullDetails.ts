import { createSupabaseServerClient } from "@/lib/supabase";
import type { SchoolRow } from "./getCurrentSchool";

export type SchoolFullDetails = SchoolRow & {
  academic_year?: string | null;
  vision?: string | null;
  mission?: string | null;
  public_description?: string | null;
};

export async function getSchoolFullDetails(
  schoolId?: string | null,
): Promise<SchoolFullDetails | null> {
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
  if (!resolvedId) return null;

  const [{ data: school }, { data: settings }] = await Promise.all([
    supabase
      .from("schools")
      .select("id, name_ar, name_en, slug, timezone, logo_path, is_active")
      .eq("id", resolvedId)
      .maybeSingle(),
    supabase
      .from("school_settings")
      .select("academic_year, vision, mission, public_description")
      .eq("school_id", resolvedId)
      .maybeSingle(),
  ]);

  if (!school) return null;

  return {
    ...(school as SchoolRow),
    academic_year: settings ? settings.academic_year : null,
    vision: settings ? settings.vision : null,
    mission: settings ? settings.mission : null,
    public_description: settings ? settings.public_description : null,
  };
}
