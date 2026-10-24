"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { parseCircularFormData } from "@/lib/validation/parseCircularFormData";
import { insertCircularTargets } from "@/lib/circulars/insertCircularTargets";
import { createCircularRecord } from "@/lib/circulars/createCircularRecord";
import { handleCircularDocumentsUpload } from "@/lib/circulars/handleCircularDocumentsUpload";
import { assertCanManageCirculars } from "@/lib/circulars/assertCanManageCirculars";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { ValidationError } from "@/lib/errors/ValidationError";
import { AppError } from "@/lib/errors/AppError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function createCircularAction(
  formData: FormData,
): Promise<ActionResult<{ circularId: string }>> {
  try {
    const auth = await assertCanManageCirculars();
    if (!auth.authorized) {
      throw new ForbiddenError(auth.error || "Unauthorized");
    }

    const { title, body, priority, responseType, dueAt, departmentIds } =
      parseCircularFormData(formData);

    if (!title || !body) {
      throw new ValidationError("Title and content are required");
    }

    const supabase = await createSupabaseServerClient();
    const res = await createCircularRecord(supabase, {
      schoolId: auth.schoolId,
      title,
      body,
      priority,
      responseType,
      dueAt,
      createdBy: auth.profileId,
    });

    if (res.error || !res.circularId) {
      throw new AppError(res.error || "Failed to create circular");
    }

    await insertCircularTargets(supabase, res.circularId, auth.schoolId, departmentIds);
    await handleCircularDocumentsUpload(supabase, {
      formData,
      schoolId: auth.schoolId,
      circularId: res.circularId,
      uploadedBy: auth.profileId,
    });

    revalidatePath("/[locale]/circulars", "page");
    return { success: true, circularId: res.circularId };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
