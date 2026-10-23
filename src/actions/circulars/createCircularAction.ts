"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { parseCircularFormData } from "@/lib/validation/parseCircularFormData";
import { insertCircularTargets } from "@/lib/circulars/insertCircularTargets";
import { createCircularRecord } from "@/lib/circulars/createCircularRecord";
import { handleCircularDocumentsUpload } from "@/lib/circulars/handleCircularDocumentsUpload";
import { assertCanManageCirculars } from "@/lib/circulars/assertCanManageCirculars";

export async function createCircularAction(formData: FormData) {
  const auth = await assertCanManageCirculars();
  if (!auth.authorized) return { success: false, error: auth.error };

  const { title, body, priority, responseType, dueAt, departmentIds } =
    parseCircularFormData(formData);

  if (!title || !body) {
    return { success: false, error: "Title and content are required" };
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
    return { success: false, error: res.error || "Failed to create circular" };
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
}
