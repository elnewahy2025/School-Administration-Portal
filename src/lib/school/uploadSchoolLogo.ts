import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadSchoolLogo(
  supabase: SupabaseClient,
  schoolId: string,
  file: File | null | undefined,
): Promise<{ path: string | null; error?: string }> {
  if (!file || file.size === 0 || !file.name) {
    return { path: null };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { path: null, error: "Image file size exceeds 2MB" };
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${schoolId}/logo/${Date.now()}-${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from("public-assets")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { path: null, error: uploadError.message };
  }

  return { path: filePath };
}
