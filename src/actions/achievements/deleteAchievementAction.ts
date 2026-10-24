"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { assertCanManageCalendar } from "@/lib/calendar/assertCanManageCalendar";
import { deleteAchievementRecord } from "@/lib/achievements/deleteAchievementRecord";
import { AppError } from "@/lib/errors/AppError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function deleteAchievementAction(achievementId: string): Promise<ActionResult> {
  try {
    const auth = await assertCanManageCalendar();
    const supabase = await createSupabaseServerClient();
    const res = await deleteAchievementRecord(supabase, achievementId, auth.schoolId);

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
