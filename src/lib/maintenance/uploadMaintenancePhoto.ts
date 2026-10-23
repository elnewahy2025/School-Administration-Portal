import type { SupabaseClient } from "@supabase/supabase-js";
import { insertMaintenanceAttachment } from "./insertMaintenanceAttachment";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadMaintenancePhoto(
  supabase: SupabaseClient,
  params: {
    photo: File;
    schoolId: string;
    requestId: string;
    uploadedBy: string;
    kind: "report" | "evidence";
  },
): Promise<{ error?: string }> {
  if (!ALLOWED_MIME.includes(params.photo.type)) {
    return { error: "Invalid photo format. Only JPG, PNG, and WebP allowed." };
  }
  if (params.photo.size > MAX_BYTES) {
    return { error: "Photo exceeds 10MB limit." };
  }

  const cleanName = params.photo.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const prefix = params.kind === "evidence" ? "evidence_" : "";
  const storagePath = `${params.schoolId}/${params.requestId}/${prefix}${Date.now()}_${cleanName}`;
  const fileBuffer = await params.photo.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("maintenance-photos")
    .upload(storagePath, fileBuffer, {
      contentType: params.photo.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  return insertMaintenanceAttachment(supabase, {
    requestId: params.requestId,
    schoolId: params.schoolId,
    kind: params.kind,
    path: storagePath,
    mime: params.photo.type,
    sizeBytes: params.photo.size,
    uploadedBy: params.uploadedBy,
  });
}
