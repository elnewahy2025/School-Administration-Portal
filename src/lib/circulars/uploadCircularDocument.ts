import type { SupabaseClient } from "@supabase/supabase-js";
import { insertCircularAttachment } from "./insertCircularAttachment";

const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10MB limit (matches Supabase Storage policy)

export async function uploadCircularDocument(
  supabase: SupabaseClient,
  params: {
    file: File;
    schoolId: string;
    circularId: string;
    uploadedBy: string;
  },
): Promise<{ error?: string }> {
  if (!ALLOWED_MIME.includes(params.file.type)) {
    return { error: "Invalid document format. Only PDF, JPG, PNG, and WebP are allowed." };
  }
  if (params.file.size > MAX_BYTES) {
    return { error: "File exceeds 10MB limit." };
  }

  const cleanName = params.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${params.schoolId}/${params.circularId}/${Date.now()}_${cleanName}`;
  const fileBuffer = await params.file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("circular-attachments")
    .upload(storagePath, fileBuffer, {
      contentType: params.file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  return insertCircularAttachment(supabase, {
    circularId: params.circularId,
    schoolId: params.schoolId,
    path: storagePath,
    mime: params.file.type || null,
    sizeBytes: params.file.size,
    uploadedBy: params.uploadedBy,
  });
}
