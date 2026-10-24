"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { parseLocationInput } from "@/lib/school/parseLocationInput";

export async function updateLocationAction(
  locationId: string,
  building: string,
  floor: string | null,
  room: string | null,
  kind: string,
) {
  const profile = await getCurrentProfile();
  if (!profile?.school_id) {
    return { success: false, error: "No school associated with profile" };
  }

  const allowed = await hasPermission("settings.school.update", profile.school_id);
  if (!allowed) {
    return { success: false, error: "Unauthorized" };
  }

  const payload = parseLocationInput(building, floor, room, kind);
  if (!payload.building) {
    return { success: false, error: "Building is required" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("locations")
    .update(payload)
    .eq("id", locationId)
    .eq("school_id", profile.school_id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/settings/locations", "page");
  return { success: true };
}
