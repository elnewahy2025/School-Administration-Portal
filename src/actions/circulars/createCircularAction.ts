"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseCircularFormData } from "@/lib/validation/parseCircularFormData";
import { insertCircularTargets } from "@/lib/circulars/insertCircularTargets";
import { createCircularRecord } from "@/lib/circulars/createCircularRecord";

export async function createCircularAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("circular.create", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const { title, body, priority, responseType, dueAt, departmentIds } =
    parseCircularFormData(formData);

  if (!title || !body) {
    return { success: false, error: "Title and content are required" };
  }

  const supabase = await createSupabaseServerClient();
  const res = await createCircularRecord(supabase, {
    schoolId: profile.school_id,
    title,
    body,
    priority,
    responseType,
    dueAt,
    createdBy: profile.id,
  });

  if (res.error || !res.circularId) {
    return { success: false, error: res.error || "Failed to create circular" };
  }

  await insertCircularTargets(supabase, res.circularId, profile.school_id, departmentIds);

  revalidatePath("/[locale]/circulars", "page");
  return { success: true, circularId: res.circularId };
}
