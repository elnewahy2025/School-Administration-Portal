"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";

export async function publishCircularAction(circularId: string) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("circular.publish", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("circulars")
    .update({
      status: "published",
      publish_at: new Date().toISOString(),
    })
    .eq("id", circularId)
    .eq("school_id", profile.school_id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/circulars", "page");
  revalidatePath(`/[locale]/circulars/${circularId}`, "page");
  return { success: true };
}
