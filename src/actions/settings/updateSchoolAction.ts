"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseSchoolFormData } from "@/lib/validation/parseSchoolFormData";
import { uploadSchoolLogo } from "@/lib/school/uploadSchoolLogo";
import { persistSchoolProfile } from "@/lib/school/persistSchoolProfile";

export async function updateSchoolAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("settings.school.update", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = parseSchoolFormData(formData);
  if (!parsed.nameAr || !parsed.nameEn) {
    return {
      success: false,
      error: "Both Arabic and English school names are required",
    };
  }

  const supabase = await createSupabaseServerClient();
  const logoFile = formData.get("logo") as File | null;
  const uploadRes = await uploadSchoolLogo(supabase, profile.school_id, logoFile);
  if (uploadRes.error) {
    return { success: false, error: uploadRes.error };
  }

  const persistResult = await persistSchoolProfile(
    supabase,
    profile.school_id,
    parsed,
    uploadRes.path,
  );
  if (!persistResult.success) {
    return persistResult;
  }

  revalidatePath("/[locale]/settings/school", "page");
  revalidatePath("/[locale]/dashboard", "page");
  return { success: true };
}
