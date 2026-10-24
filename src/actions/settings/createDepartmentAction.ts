"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { ValidationError } from "@/lib/errors/ValidationError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function createDepartmentAction(formData: FormData): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      throw new AuthenticationError("No school associated with profile");
    }

    const allowed = await hasPermission("settings.school.update", profile.school_id);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const nameAr = (formData.get("name_ar") as string)?.trim();
    const nameEn = (formData.get("name_en") as string)?.trim();

    if (!nameAr || !nameEn) {
      throw new ValidationError("Both Arabic and English names are required");
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("departments").insert({
      school_id: profile.school_id,
      name_ar: nameAr,
      name_en: nameEn,
    });

    if (error) {
      throw mapDatabaseError(error);
    }

    revalidatePath("/[locale]/settings/departments", "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
