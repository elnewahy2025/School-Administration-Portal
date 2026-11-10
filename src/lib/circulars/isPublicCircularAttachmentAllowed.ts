import type { SupabaseClient } from "@supabase/supabase-js";

export async function isPublicCircularAttachmentAllowed(
  admin: SupabaseClient,
  circularId: string,
  schoolId: string,
): Promise<boolean> {
  const { data: circular, error: circularError } = await admin
    .from("circulars")
    .select("status, visibility")
    .eq("id", circularId)
    .maybeSingle();

  if (circularError || !circular) {
    return false;
  }

  const isPublicStatus = ["published", "in_progress", "completed", "overdue"].includes(
    circular.status,
  );
  if (!isPublicStatus || circular.visibility !== "public") {
    return false;
  }

  const { data: school, error: schoolError } = await admin
    .from("schools")
    .select("is_active")
    .eq("id", schoolId)
    .maybeSingle();

  return !schoolError && Boolean(school?.is_active);
}

