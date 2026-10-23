"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseLocationFormData } from "@/lib/validation/parseLocationFormData";

export async function createLocationAction(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("settings.school.update", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const { building, floor, room, kind } = parseLocationFormData(formData);
  if (!building) {
    return { success: false, error: "Building is required" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("locations").insert({
    school_id: profile.school_id,
    building,
    floor,
    room,
    kind,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/settings/locations", "page");
  return { success: true };
}
