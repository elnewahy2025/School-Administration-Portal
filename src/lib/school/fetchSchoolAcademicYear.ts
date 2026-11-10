import type { SupabaseClient } from "@supabase/supabase-js";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";

export async function fetchSchoolAcademicYear(
  supabase: SupabaseClient,
  schoolId: string,
): Promise<string | null> {
  const { data: settings, error: settingsError } = await supabase
    .from("school_settings")
    .select("academic_year")
    .eq("school_id", schoolId)
    .maybeSingle();

  if (settingsError) {
    throw mapDatabaseError(settingsError);
  }

  return settings?.academic_year ?? null;
}
