"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function deleteDepartmentAction(departmentId: string) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("settings.school.update", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", departmentId)
    .eq("school_id", profile.school_id);

  if (error) {
    if (error.code === "23503") {
      return {
        success: false,
        error:
          "Cannot delete department while users or circulars are assigned to it. Deactivate it instead.",
      };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/settings/departments", "page");
  revalidatePath("/[locale]/circulars/new", "page");
  return { success: true };
}
