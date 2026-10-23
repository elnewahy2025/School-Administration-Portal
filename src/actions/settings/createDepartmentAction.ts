"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function createDepartmentAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("settings.school.update", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const nameAr = (formData.get("name_ar") as string)?.trim();
  const nameEn = (formData.get("name_en") as string)?.trim();

  if (!nameAr || !nameEn) {
    return { success: false, error: "Both Arabic and English names are required" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("departments").insert({
    school_id: profile.school_id,
    name_ar: nameAr,
    name_en: nameEn,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/settings/departments", "page");
  return { success: true };
}
