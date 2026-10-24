"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { parseCircularFormData } from "@/lib/validation/parseCircularFormData";
import { updateCircularRecord } from "@/lib/circulars/updateCircularRecord";
import { handleCircularDocumentsUpload } from "@/lib/circulars/handleCircularDocumentsUpload";
import { assertCanManageCirculars } from "@/lib/circulars/assertCanManageCirculars";
import type { CircularStatus } from "@/lib/circulars/types";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { ValidationError } from "@/lib/errors/ValidationError";
import { AppError } from "@/lib/errors/AppError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function updateCircularAction(
  circularId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const auth = await assertCanManageCirculars();
    if (!auth.authorized) {
      throw new ForbiddenError(auth.error || "Unauthorized");
    }

    const { title, body, priority, responseType, dueAt, publishAt, status, departmentIds } =
      parseCircularFormData(formData);

    if (!title || !body) {
      throw new ValidationError("Title and content are required");
    }

    const supabase = await createSupabaseServerClient();
    const res = await updateCircularRecord(supabase, {
      circularId,
      schoolId: auth.schoolId,
      title,
      body,
      priority,
      status: status as CircularStatus | undefined,
      responseType,
      publishAt,
      dueAt,
      departmentIds,
    });

    if (!res.success) {
      throw new AppError(res.error || "Failed to update circular");
    }

    await handleCircularDocumentsUpload(supabase, {
      formData,
      schoolId: auth.schoolId,
      circularId,
      uploadedBy: auth.profileId,
    });

    revalidatePath("/[locale]/circulars", "page");
    revalidatePath(`/[locale]/circulars/${circularId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
