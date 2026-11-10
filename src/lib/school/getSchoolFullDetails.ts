import { createSupabaseServerClient } from "@/lib/supabase";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import type { SchoolRow } from "./getCurrentSchool";
import { mergeSchoolSettings, type SchoolSettingsRow } from "./mergeSchoolSettings";
import { getFirstActiveSchoolId } from "./getFirstActiveSchoolId";

export type SchoolFullDetails = SchoolRow & SchoolSettingsRow;

const SCHOOL_FIELDS =
  "id, name_ar, name_en, slug, timezone, logo_path, is_active, phone, email, manager_name_ar, manager_name_en, assistant_manager_ar, assistant_manager_en, assistant_manager_2_ar, assistant_manager_2_en, assistant_manager_3_ar, assistant_manager_3_en, address_ar, address_en, updated_at";

const LEGACY_SCHOOL_FIELDS =
  "id, name_ar, name_en, slug, timezone, logo_path, is_active, phone, email, manager_name_ar, manager_name_en, assistant_manager_ar, assistant_manager_en, assistant_manager_2_ar, assistant_manager_2_en, address_ar, address_en, updated_at";

export async function getSchoolFullDetails(
  schoolId?: string | null,
): Promise<SchoolFullDetails | null> {
  const resolvedId = schoolId || (await getFirstActiveSchoolId());
  if (!resolvedId) return null;

  const supabase = await createSupabaseServerClient();
  const [schoolResult, { data: settings, error: settingsError }] = await Promise.all([
    supabase.from("schools").select(SCHOOL_FIELDS).eq("id", resolvedId).maybeSingle(),
    supabase
      .from("school_settings")
      .select(
        "academic_year, vision, mission, vision_ar, vision_en, mission_ar, mission_en, public_description, working_days, date_format, updated_at",
      )
      .eq("school_id", resolvedId)
      .maybeSingle(),
  ]);

  let school = schoolResult.data;
  let schoolError = schoolResult.error;

  if (schoolError) {
    const fallback = await supabase
      .from("schools")
      .select(LEGACY_SCHOOL_FIELDS)
      .eq("id", resolvedId)
      .maybeSingle();
    if (!fallback.error && fallback.data) {
      school = {
        ...fallback.data,
        assistant_manager_3_ar: null,
        assistant_manager_3_en: null,
      };
      schoolError = null;
    }
  }

  if (schoolError) {
    throw mapDatabaseError(schoolError);
  }
  if (settingsError) {
    throw mapDatabaseError(settingsError);
  }

  if (!school) return null;

  return mergeSchoolSettings(school as SchoolRow, settings as SchoolSettingsRow | null);
}
