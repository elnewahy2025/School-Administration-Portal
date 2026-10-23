"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { hasPermission } from "@/lib/rbac/hasPermission";
import { dispatchModuleNotification } from "@/lib/notifications/dispatchModuleNotification";

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

  const { data: targets } = await supabase
    .from("circular_targets")
    .select("department:departments(head_profile_id)")
    .eq("circular_id", circularId);

  type TargetHead = { department: { head_profile_id: string | null } | null };
  const headIds = ((targets ?? []) as unknown as TargetHead[])
    .map((t) => t.department?.head_profile_id)
    .filter((id): id is string => Boolean(id) && id !== profile.id);

  if (headIds.length > 0) {
    void dispatchModuleNotification({
      recipientUserIds: headIds,
      schoolId: profile.school_id,
      type: "circular",
      title: "تعميم إداري جديد",
      body: "تم نشر تعميم إداري جديد يتطلب مراجعة واستجابة قسمكم",
      entityType: "circular",
      entityId: circularId,
    });
  }

  revalidatePath("/[locale]/circulars", "page");
  revalidatePath(`/[locale]/circulars/${circularId}`, "page");
  return { success: true };
}
