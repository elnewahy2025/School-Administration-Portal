import { createSupabaseAdminClient } from "@/lib/supabase";
import { NotFoundError } from "@/lib/errors/NotFoundError";

export async function downloadAttachmentFromStorage(storagePath: string): Promise<{
  bytes: ArrayBuffer;
  type: string;
}> {
  const admin = createSupabaseAdminClient();
  const { data: file, error } = await admin.storage
    .from("circular-attachments")
    .download(storagePath);

  if (error || !file) {
    throw new NotFoundError("Stored attachment file could not be retrieved");
  }

  return {
    bytes: await file.arrayBuffer(),
    type: file.type,
  };
}

