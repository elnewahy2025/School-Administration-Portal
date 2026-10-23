"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseMaintenanceFormData } from "@/lib/validation/parseMaintenanceFormData";
import { createMaintenanceRecord } from "@/lib/maintenance/createMaintenanceRecord";
import { insertMaintenanceUpdate } from "@/lib/maintenance/insertMaintenanceUpdate";
import { handleOptionalPhoto } from "@/lib/maintenance/handleOptionalPhoto";

export async function createMaintenanceAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("maintenance.create", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const { title, description, category, priority, locationId, area, assetRef, photo } =
    parseMaintenanceFormData(formData);

  if (!title || !description) {
    return { success: false, error: "Title and description are required" };
  }

  const supabase = await createSupabaseServerClient();
  const res = await createMaintenanceRecord(supabase, {
    schoolId: profile.school_id,
    title,
    description,
    category,
    locationId,
    area,
    assetRef,
    priority,
    reporterId: profile.id,
    reporterDepartmentId: profile.department_id,
  });

  if (res.error || !res.requestId) {
    return { success: false, error: res.error || "Failed to create maintenance ticket" };
  }

  const requestId = res.requestId;
  await handleOptionalPhoto(supabase, photo, {
    schoolId: profile.school_id,
    requestId,
    uploadedBy: profile.id,
    kind: "report",
  });

  await insertMaintenanceUpdate(supabase, {
    requestId,
    schoolId: profile.school_id,
    authorId: profile.id,
    kind: "status_change",
    oldValue: null,
    newValue: "submitted",
    reason: priority === "emergency" ? "Emergency ticket submitted" : "Ticket submitted",
  });

  revalidatePath("/[locale]/maintenance", "page");
  return { success: true, requestId };
}
