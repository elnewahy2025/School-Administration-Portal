"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { parseAchievementFormData } from "@/lib/validation/parseAchievementFormData";
import { createAchievementRecord } from "@/lib/achievements/createAchievementRecord";
import { uploadCalendarImage } from "@/lib/calendar/uploadCalendarImage";
import { canRegisterAchievement } from "./canRegisterAchievement";

export async function createAchievementAction(formData: FormData) {
  const profile = await getCurrentProfile();
  const schoolId = profile?.school_id;
  const data = parseAchievementFormData(formData);

  const isAuthorized = await canRegisterAchievement(
    schoolId,
    profile?.department_id,
    data.departmentId,
  );
  if (!isAuthorized || !schoolId) {
    return { success: false, error: "Unauthorized" };
  }

  if (!data.titleAr) {
    return { success: false, error: "Achievement title in Arabic is required" };
  }

  const supabase = await createSupabaseServerClient();
  let imagePath: string | null = null;
  if (data.image) {
    const uploadRes = await uploadCalendarImage(supabase, data.image, schoolId);
    if (uploadRes.error) return { success: false, error: uploadRes.error };
    imagePath = uploadRes.path ?? null;
  }

  const res = await createAchievementRecord(supabase, {
    schoolId,
    departmentId: data.departmentId,
    titleAr: data.titleAr,
    titleEn: data.titleEn,
    description: data.description,
    category: data.category,
    dateAchieved: data.dateAchieved,
    visibility: data.visibility,
    imagePath,
    createdBy: profile.id,
  });

  if (res.error) {
    return { success: false, error: res.error };
  }

  revalidatePath("/[locale]/calendar", "page");
  revalidatePath("/[locale]", "page");
  return { success: true, achievementId: res.id };
}
