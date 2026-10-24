"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { formatActionErrorResult, type ActionResult } from "@/lib/errors/formatActionErrorResult";

export async function deleteCircularAttachmentAction(
  attachmentId: string,
  circularId: string,
): Promise<ActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      throw new AuthenticationError("Unauthorized");
    }

    const perms = await getEffectivePermissions().catch((): string[] => []);
    const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
    const canEdit =
      isOwner || perms.includes("circular.create") || perms.includes("circular.publish");
    if (!canEdit) {
      throw new ForbiddenError("Unauthorized");
    }

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
    if (error) {
      throw mapDatabaseError(error);
    }

    revalidatePath(`/[locale]/circulars/${circularId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
