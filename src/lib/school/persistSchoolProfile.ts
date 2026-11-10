import type { SupabaseClient } from "@supabase/supabase-js";
import type { parseSchoolFormData } from "@/lib/validation/parseSchoolFormData";
import { persistSchoolSettings } from "./persistSchoolSettings";
import { buildSchoolUpdatePayload } from "./buildSchoolUpdatePayload";
import { resolveSchoolUpdateError } from "./resolveSchoolUpdateError";

export async function persistSchoolProfile(
  supabase: SupabaseClient,
  schoolId: string,
  parsed: ReturnType<typeof parseSchoolFormData>,
  logoPath: string | null,
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();
  const schoolUpdates = buildSchoolUpdatePayload(parsed, logoPath, now);

  let { data: updatedSchool, error: schoolError } = await supabase
    .from("schools")
    .update(schoolUpdates)
    .eq("id", schoolId)
    .select("id");

  const hasAssistant3 = Boolean(parsed.assistantManager3Ar || parsed.assistantManager3En);

  if (schoolError && !hasAssistant3) {
    delete schoolUpdates.assistant_manager_3_ar;
    delete schoolUpdates.assistant_manager_3_en;
    const retry = await supabase.from("schools").update(schoolUpdates).eq("id", schoolId).select("id");
    if (!retry.error) {
      updatedSchool = retry.data;
      schoolError = null;
    }
  }

  if (schoolError) {
    return { success: false, error: resolveSchoolUpdateError(schoolError) };
  }

  if (!updatedSchool || updatedSchool.length === 0) {
    return {
      success: false,
      error: "Failed to update school: record not found or insufficient permissions",
    };
  }

  return persistSchoolSettings(supabase, schoolId, parsed, now);
}
