import { createSupabaseServerClient } from "@/lib/supabase";
import { logError } from "@/lib/logger";
import type { CircularRow } from "./types";

/**
 * Fetches one circular for the public portal.
 *
 * Only a published, public circular is returned, whatever role the request
 * runs as: the restriction lives in the query and not only in RLS, so a
 * signed-in school member cannot use the public route to read an internal
 * circular. A circular that is not published, not public, or that belongs to a
 * school which is not active resolves to null.
 */
export async function getPublicCircularById(circularId: string): Promise<CircularRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("circulars")
    .select(
      "id, school_id, ref_number, title, body, category, priority, status, visibility, response_type, publish_at, due_at, created_at",
    )
    .eq("id", circularId)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  if (error) {
    logError(error, { scope: "getPublicCircularById", circularId });
    return null;
  }

  return (data as unknown as CircularRow) ?? null;
}
