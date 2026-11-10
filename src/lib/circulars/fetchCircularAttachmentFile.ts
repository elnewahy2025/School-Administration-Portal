import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { AuthenticationError } from "@/lib/errors/AuthenticationError";
import { ForbiddenError } from "@/lib/errors/ForbiddenError";
import { NotFoundError } from "@/lib/errors/NotFoundError";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { downloadAttachmentFromStorage } from "./downloadAttachmentFromStorage";
import { isPublicCircularAttachmentAllowed } from "./isPublicCircularAttachmentAllowed";

export interface AttachmentFileResult {
  bytes: ArrayBuffer;
  mime: string;
  fileName: string;
}

export async function fetchCircularAttachmentFile(
  attachmentId: string,
): Promise<AttachmentFileResult> {
  const admin = createSupabaseAdminClient();
  const { data: attachment, error } = await admin
    .from("circular_attachments")
    .select("id, circular_id, school_id, path, mime")
    .eq("id", attachmentId)
    .maybeSingle();

  if (error) {
    throw mapDatabaseError(error);
  }
  if (!attachment) {
    throw new NotFoundError("Attachment not found");
  }

  const isPublicAllowed = await isPublicCircularAttachmentAllowed(
    admin,
    attachment.circular_id,
    attachment.school_id,
  );

  if (!isPublicAllowed) {
    const profile = await getCurrentProfile();
    if (!profile) {
      throw new AuthenticationError("Unauthorized");
    }

    const isOwner = await isPlatformOwner(profile.id);
    if (!isOwner && attachment.school_id !== profile.school_id) {
      throw new ForbiddenError("Access denied to attachment outside school");
    }
  }

  const storedFile = await downloadAttachmentFromStorage(attachment.path);
  const rawName = attachment.path.split("/").pop() || "document";
  const fileName = rawName.replace(/^\d+_/, "");

  return {
    bytes: storedFile.bytes,
    mime: storedFile.type || attachment.mime || "application/octet-stream",
    fileName,
  };
}
