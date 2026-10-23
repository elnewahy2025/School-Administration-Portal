import type { SupabaseClient } from "@supabase/supabase-js";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadCalendarImage(
  supabase: SupabaseClient,
  file: File,
  schoolId: string,
): Promise<{ path?: string; error?: string }> {
  if (!ALLOWED_MIME.includes(file.type)) {
    return { error: "Invalid image format. Allowed: JPG, PNG, WebP, SVG." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image exceeds 5MB limit." };
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${schoolId}/calendar/${Date.now()}_${cleanName}`;
  const fileBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("public-assets")
    .upload(path, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  return { path };
}
