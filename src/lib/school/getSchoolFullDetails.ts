import { createSupabaseServerClient } from "@/lib/supabase";
import type { SchoolRow } from "./getCurrentSchool";
import { mergeSchoolSettings, type SchoolSettingsRow } from "./mergeSchoolSettings";

export type SchoolFullDetails = SchoolRow & SchoolSettingsRow;

const SCHOOL_FIELDS =
  "id, name_ar, name_en, slug, timezone, logo_path, is_active, phone, email, manager_name_ar, manager_name_en, assistant_manager_ar, assistant_manager_en, assistant_manager_2_ar, assistant_manager_2_en, address_ar, address_en, updated_at";

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
    supabase.from("schools").select(SCHOOL_FIELDS).eq("id", resolvedId).maybeSingle(),
    supabase
      .from("school_settings")
      .select(
        "academic_year, vision, mission, vision_ar, vision_en, mission_ar, mission_en, public_description, working_days, date_format, updated_at",
      )
      .eq("school_id", resolvedId)
      .maybeSingle(),
  ]);

  if (!school) return null;

  return mergeSchoolSettings(school as SchoolRow, settings as SchoolSettingsRow | null);
}
