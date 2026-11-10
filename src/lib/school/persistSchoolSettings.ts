import type { SupabaseClient } from "@supabase/supabase-js";
import type { parseSchoolFormData } from "@/lib/validation/parseSchoolFormData";

export async function persistSchoolSettings(
  supabase: SupabaseClient,
  schoolId: string,
  parsed: ReturnType<typeof parseSchoolFormData>,
  updatedAt: string,
): Promise<{ success: boolean; error?: string }> {
  const { error: settingsError } = await supabase.from("school_settings").upsert({
    school_id: schoolId,
    academic_year: parsed.academicYear,
    vision: parsed.visionAr ?? parsed.visionEn,
    mission: parsed.missionAr ?? parsed.missionEn,
    vision_ar: parsed.visionAr,
    vision_en: parsed.visionEn,
    mission_ar: parsed.missionAr,
    mission_en: parsed.missionEn,
    working_days: parsed.workingDays.length > 0 ? parsed.workingDays : [0, 1, 2, 3, 4],
    date_format: parsed.dateFormat,
    updated_at: updatedAt,
  });

  if (settingsError) {
    return { success: false, error: settingsError.message };
  }

  return { success: true };
}
