"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function updateDepartmentAction(departmentId: string, nameAr: string, nameEn: string) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("settings.school.update", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const trimmedAr = nameAr.trim();
  const trimmedEn = nameEn.trim();
  if (!trimmedAr || !trimmedEn) {
    return { success: false, error: "Both Arabic and English names are required" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("departments")
    .update({ name_ar: trimmedAr, name_en: trimmedEn })
    .eq("id", departmentId)
    .eq("school_id", profile.school_id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/settings/departments", "page");
  revalidatePath("/[locale]/circulars/new", "page");
  return { success: true };
}
