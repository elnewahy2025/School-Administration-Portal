"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { parseCircularFormData } from "@/lib/validation/parseCircularFormData";
import { updateCircularRecord } from "@/lib/circulars/updateCircularRecord";
import { handleCircularDocumentsUpload } from "@/lib/circulars/handleCircularDocumentsUpload";
import { assertCanManageCirculars } from "@/lib/circulars/assertCanManageCirculars";
import type { CircularStatus } from "@/lib/circulars/types";

export async function updateCircularAction(circularId: string, formData: FormData) {
  const auth = await assertCanManageCirculars();
  if (!auth.authorized) return { success: false, error: auth.error };

  const { title, body, priority, responseType, dueAt, publishAt, status, departmentIds } =
    parseCircularFormData(formData);

  if (!title || !body) {
    return { success: false, error: "Title and content are required" };
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
    return { success: false, error: res.error || "Failed to update circular" };
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
}
