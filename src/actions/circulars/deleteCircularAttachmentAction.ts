"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";

export async function deleteCircularAttachmentAction(attachmentId: string, circularId: string) {
  const profile = await getCurrentProfile();
  if (!profile) return { success: false, error: "Unauthorized" };

  const perms = await getEffectivePermissions().catch((): string[] => []);
  const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
  const canEdit =
    isOwner || perms.includes("circular.create") || perms.includes("circular.publish");
  if (!canEdit) return { success: false, error: "Unauthorized" };

  const supabase = await createSupabaseServerClient();
  const { data: attachment } = await supabase
    .from("circular_attachments")
    .select("path")
    .eq("id", attachmentId)
    .maybeSingle();

  if (attachment) {
    await supabase.storage.from("circular-attachments").remove([attachment.path]);
  }

  const { error } = await supabase.from("circular_attachments").delete().eq("id", attachmentId);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/[locale]/circulars/${circularId}`, "page");
  return { success: true };
}
