"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { getEffectivePermissions } from "@/lib/rbac/getEffectivePermissions";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { DatabaseError } from "@/lib/errors/DatabaseError";
import { NotFoundError } from "@/lib/errors/NotFoundError";
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

    const perms = await getEffectivePermissions(profile.school_id);
    const isOwner = await isPlatformOwner(profile.id);
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
      // The bucket now has a DELETE policy (0045). Surface a failure instead of
      // removing the row and leaving the private object behind (H-16).
      const { error: removeError } = await supabase.storage
        .from("circular-attachments")
        .remove([attachment.path]);
      if (removeError) {
        throw new DatabaseError("Could not delete the stored file. Please try again.");
      }
    }

    const { data: deleted, error } = await supabase
      .from("circular_attachments")
      .delete()
      .eq("id", attachmentId)
      .select("id")
      .maybeSingle();
    if (error) {
      throw mapDatabaseError(error);
    }
    if (!deleted) {
      throw new NotFoundError("Attachment not found");
    }

    revalidatePath(`/[locale]/circulars/${circularId}`, "page");
    return { success: true };
  } catch (err: unknown) {
    const appError = sanitizeError(err);
    return formatActionErrorResult(appError);
  }
}
