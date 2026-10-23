"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function markAllNotificationsReadAction() {
  const supabase = await createSupabaseServerClient();
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userRes.user.id)
    .is("read_at", null);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/notifications", "page");
  return { success: true };
}
