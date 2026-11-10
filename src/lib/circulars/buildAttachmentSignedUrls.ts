import { createSupabaseAdminClient } from "@/lib/supabase";
import { logError } from "@/lib/logger";

export async function buildAttachmentSignedUrls(
  circularId: string,
  paths: string[],
): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();
  if (paths.length === 0) {
    return urlMap;
  }

  const adminClient = createSupabaseAdminClient();
  const { data: signedList, error: signError } = await adminClient.storage
    .from("circular-attachments")
    .createSignedUrls(paths, 3600);

  if (signError) {
    logError(signError, { circularId, pathsCount: paths.length });
  }

  if (signedList) {
    for (const item of signedList) {
      if (item.signedUrl && item.path) {
        urlMap.set(item.path, item.signedUrl);
      }
    }
  }

  return urlMap;
}

