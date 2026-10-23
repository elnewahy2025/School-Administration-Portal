"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseSchoolFormData } from "@/lib/validation/parseSchoolFormData";

export async function updateSchoolAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("settings.school.update", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const { nameAr, nameEn, timezone, academicYear, vision, mission } = parseSchoolFormData(formData);

  if (!nameAr || !nameEn) {
    return {
      success: false,
      error: "Both Arabic and English school names are required",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error: schoolError } = await supabase
    .from("schools")
    .update({ name_ar: nameAr, name_en: nameEn, timezone })
    .eq("id", profile.school_id);

  if (schoolError) {
    return { success: false, error: schoolError.message };
  }

  const { error: settingsError } = await supabase.from("school_settings").upsert({
    school_id: profile.school_id,
    academic_year: academicYear,
    vision,
    mission,
  });

  if (settingsError) {
    return { success: false, error: settingsError.message };
  }

  revalidatePath("/[locale]/settings/school", "page");
  return { success: true };
}
