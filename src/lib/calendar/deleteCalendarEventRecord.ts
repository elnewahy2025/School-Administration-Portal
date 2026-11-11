import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchCalendarEventForDeletion } from "./fetchCalendarEventForDeletion";
import { removeCalendarEventImage } from "./removeCalendarEventImage";
import { executeDeleteCalendarRow } from "./executeDeleteCalendarRow";

export interface DeleteCalendarEventParams {
  eventId: string;
  schoolId: string;
  actorId: string;
  isOwner?: boolean;
}

export async function deleteCalendarEventRecord(
  supabase: SupabaseClient,
  params: DeleteCalendarEventParams,
): Promise<{ success: boolean; error?: string }> {
  const event = await fetchCalendarEventForDeletion(supabase, params);
  if (!event) {
    return { success: false, error: "Event not found or access denied" };
  }

  if (event.image_path) {
    await removeCalendarEventImage(supabase, event.image_path, params.actorId);
  }

  return executeDeleteCalendarRow(supabase, params);
}
