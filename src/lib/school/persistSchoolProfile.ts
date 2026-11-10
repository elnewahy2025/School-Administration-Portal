import type { SupabaseClient } from "@supabase/supabase-js";
import type { parseSchoolFormData } from "@/lib/validation/parseSchoolFormData";
import { persistSchoolSettings } from "./persistSchoolSettings";

export async function persistSchoolProfile(
  supabase: SupabaseClient,
  schoolId: string,
  parsed: ReturnType<typeof parseSchoolFormData>,
  logoPath: string | null,
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();
  const schoolUpdates: Record<string, unknown> = {
    name_ar: parsed.nameAr,
    name_en: parsed.nameEn,
    phone: parsed.phone,
    email: parsed.email,
    manager_name_ar: parsed.managerNameAr,
    manager_name_en: parsed.managerNameEn,
    assistant_manager_ar: parsed.assistantManagerAr,
    assistant_manager_en: parsed.assistantManagerEn,
    assistant_manager_2_ar: parsed.assistantManager2Ar,
    assistant_manager_2_en: parsed.assistantManager2En,
    assistant_manager_3_ar: parsed.assistantManager3Ar,
    assistant_manager_3_en: parsed.assistantManager3En,
    address_ar: parsed.addressAr,
    address_en: parsed.addressEn,
    updated_at: now,
    ...(parsed.slug ? { slug: parsed.slug } : {}),
  };

  if (logoPath) {
    schoolUpdates.logo_path = logoPath;
  }

  let { data: updatedSchool, error: schoolError } = await supabase
    .from("schools")
    .update(schoolUpdates)
    .eq("id", schoolId)
    .select("id");

  if (schoolError && schoolUpdates.assistant_manager_3_ar !== undefined) {
    delete schoolUpdates.assistant_manager_3_ar;
    delete schoolUpdates.assistant_manager_3_en;
    const retry = await supabase.from("schools").update(schoolUpdates).eq("id", schoolId).select("id");
    if (!retry.error) {
      updatedSchool = retry.data;
      schoolError = null;
    }
  }

  if (schoolError) {
    return { success: false, error: schoolError.message };
  }

  if (!updatedSchool || updatedSchool.length === 0) {
    return {
      success: false,
      error: "Failed to update school: record not found or insufficient permissions",
    };
  }

  return persistSchoolSettings(supabase, schoolId, parsed, now);
}
