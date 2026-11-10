import { createSupabaseBrowserClient } from "@/lib/supabase/createSupabaseBrowserClient";
import { recordCircularAttachmentAction } from "@/actions/circulars/recordCircularAttachmentAction";

export interface UploadCircularAttachmentsOptions {
  files: File[];
  circularId: string;
  schoolId: string;
  onProgress?: (completed: number, total: number) => void;
}

export async function uploadCircularAttachmentsClient({
  files,
  circularId,
  schoolId,
  onProgress,
}: UploadCircularAttachmentsOptions): Promise<{ success: boolean; error?: string }> {
  if (files.length === 0) {
    return { success: true };
  }

  const supabase = createSupabaseBrowserClient();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${schoolId}/${circularId}/${Date.now()}_${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from("circular-attachments")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `${file.name}: ${uploadError.message}` };
    }

    const recordResult = await recordCircularAttachmentAction({
      circularId,
      path: storagePath,
      mime: file.type || null,
      sizeBytes: file.size,
    });

    if (!recordResult.success) {
      return { success: false, error: `${file.name}: ${recordResult.error}` };
    }

    onProgress?.(i + 1, files.length);
  }

  return { success: true };
}
