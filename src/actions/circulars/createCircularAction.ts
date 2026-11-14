"use server";

import { revalidatePath } from "next/cache";
import { parseCircularFormData } from "@/lib/validation/parseCircularFormData";
import { resolveCircularSupabaseClient } from "@/lib/circulars/resolveCircularSupabaseClient";
import { insertCircularTargetsWithRollback } from "@/lib/circulars/insertCircularTargetsWithRollback";
import { createCircularRecord } from "@/lib/circulars/createCircularRecord";
import { handleCircularDocumentsUpload } from "@/lib/circulars/handleCircularDocumentsUpload";
import { assertValidCircularDocuments } from "@/lib/circulars/assertValidCircularDocuments";
import { assertCanManageCirculars } from "@/lib/circulars/assertCanManageCirculars";
import { dispatchCircularNotification } from "@/lib/circulars/dispatchCircularNotification";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { ValidationError } from "@/lib/errors/ValidationError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function createCircularAction(
  formData: FormData,
): Promise<ActionResult<{ circularId: string; schoolId: string }>> {
  try {
    const auth = await assertCanManageCirculars();
    if (!auth.authorized) {
      throw new ForbiddenError(auth.error);
    }

    const input = parseCircularFormData(formData);
    if (!input.title || !input.body) {
      throw new ValidationError("Title and content are required");
    }

    await assertValidCircularDocuments(formData);

    const supabase = await resolveCircularSupabaseClient(auth);
    const status = input.publishImmediately ? "published" : "draft";
    const publishAt = input.publishImmediately ? new Date().toISOString() : null;

    const res = await createCircularRecord(supabase, {
      schoolId: auth.schoolId,
      title: input.title,
      body: input.body,
      priority: input.priority,
      visibility: input.visibility,
      status,
      publishAt,
      responseType: input.responseType,
      dueAt: input.dueAt,
      createdBy: auth.profileId,
    });

    if (!res.circularId) {
      throw mapDatabaseError(res.error, "Failed to create circular");
    }

    await insertCircularTargetsWithRollback(
      supabase,
      res.circularId,
      auth.schoolId,
      input.departmentIds,
    );

    const uploadRes = await handleCircularDocumentsUpload(supabase, {
      formData,
      schoolId: auth.schoolId,
      circularId: res.circularId,
      uploadedBy: auth.profileId,
    });
    if (uploadRes.error) {
      throw mapDatabaseError(uploadRes.error, "Failed to upload circular documents");
    }

    if (input.publishImmediately) {
      void dispatchCircularNotification(supabase, {
        schoolId: auth.schoolId,
        circularId: res.circularId,
        publisherId: auth.profileId,
      });
    }

    revalidatePath("/[locale]/circulars", "page");
    return { success: true, circularId: res.circularId, schoolId: auth.schoolId };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
