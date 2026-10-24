"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { parseAchievementFormData } from "@/lib/validation/parseAchievementFormData";
import { updateAchievementRecord } from "@/lib/achievements/updateAchievementRecord";
import { uploadCalendarImage } from "@/lib/calendar/uploadCalendarImage";
import { assertCanRegisterAchievement } from "./assertCanRegisterAchievement";
import { ValidationError } from "@/lib/errors/ValidationError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";
import { AppError } from "@/lib/errors/AppError";

export async function updateAchievementAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    const data = parseAchievementFormData(formData);
    const auth = await assertCanRegisterAchievement(profile, data.departmentId);

    if (!data.titleAr) {
      throw new ValidationError("Achievement title in Arabic is required");
    }

    const supabase = await createSupabaseServerClient();
    let imagePath: string | null | undefined = undefined;
    if (data.image) {
      const uploadRes = await uploadCalendarImage(supabase, data.image, auth.schoolId);
      if (uploadRes.error) {
        throw new AppError(uploadRes.error);
      }
      imagePath = uploadRes.path ?? null;
    }

    const res = await updateAchievementRecord(supabase, {
      id,
      departmentId: data.departmentId,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      description: data.description,
      category: data.category,
      dateAchieved: data.dateAchieved,
      visibility: data.visibility,
      imagePath,
    });

    if (res.error) {
      throw new AppError(res.error);
    }

    revalidatePath("/[locale]/calendar", "page");
    revalidatePath("/[locale]", "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
