import type { SupabaseClient } from "@supabase/supabase-js";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";

export async function getSchoolWideCircularRecipients(
  supabase: SupabaseClient,
  schoolId: string,
): Promise<string[]> {
  const { data: allProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id")
    .eq("school_id", schoolId)
    .eq("is_active", true);

  if (profilesError) {
    throw mapDatabaseError(profilesError);
  }

  return (allProfiles ?? []).map((p) => p.id as string);
}
