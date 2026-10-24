"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseSchoolFormData } from "@/lib/validation/parseSchoolFormData";
import { uploadSchoolLogo } from "@/lib/school/uploadSchoolLogo";
import { persistSchoolProfile } from "@/lib/school/persistSchoolProfile";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { ValidationError } from "@/lib/errors/ValidationError";
import { AppError } from "@/lib/errors/AppError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function updateSchoolAction(formData: FormData): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile?.school_id) {
      throw new AuthenticationError("No school associated with profile");
    }

    const allowed = await hasPermission("settings.school.update", profile.school_id);
    if (!allowed) {
      throw new ForbiddenError("Unauthorized");
    }

    const parsed = parseSchoolFormData(formData);
    if (!parsed.nameAr || !parsed.nameEn) {
      throw new ValidationError("Both Arabic and English school names are required");
    }

    const supabase = await createSupabaseServerClient();
    const logoFile = formData.get("logo") as File | null;
    const uploadRes = await uploadSchoolLogo(supabase, profile.school_id, logoFile);
    if (uploadRes.error) {
      throw new AppError(uploadRes.error);
    }

    const persistResult = await persistSchoolProfile(
      supabase,
      profile.school_id,
      parsed,
      uploadRes.path,
    );
    if (!persistResult.success) {
      throw new AppError(persistResult.error || "Failed to save school profile");
    }

    revalidatePath("/[locale]/settings/school", "page");
    revalidatePath("/[locale]/dashboard", "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
