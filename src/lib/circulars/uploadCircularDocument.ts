import type { SupabaseClient } from "@supabase/supabase-js";
import { insertCircularAttachment } from "./insertCircularAttachment";

const MAX_BYTES = 25 * 1024 * 1024; // 25MB limit

export async function uploadCircularDocument(
  supabase: SupabaseClient,
  params: {
    file: File;
    schoolId: string;
    circularId: string;
    uploadedBy: string;
  },
): Promise<{ error?: string }> {
  if (params.file.size > MAX_BYTES) {
    return { error: "File exceeds 25MB limit." };
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
