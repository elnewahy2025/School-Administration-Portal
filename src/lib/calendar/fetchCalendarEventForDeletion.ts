import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase";

export interface CalendarEventDeletionTarget {
  id: string;
  school_id: string;
  image_path: string | null;
}

export async function fetchCalendarEventForDeletion(
  supabase: SupabaseClient,
  params: { eventId: string; schoolId: string; actorId: string; isOwner?: boolean },
): Promise<CalendarEventDeletionTarget | null> {
  let fetchQuery = supabase
    .from("calendar_events")
    .select("id, school_id, image_path")
    .eq("id", params.eventId);

  if (!params.isOwner) {
    fetchQuery = fetchQuery.eq("school_id", params.schoolId);
  }

  const { data: event } = await fetchQuery.maybeSingle();
  if (event) return event;

  const admin = createSupabaseAdminClient({
    actorId: params.actorId,
    actorLabel: "read-calendar-event-for-delete",
  });
  let adminFetch = admin
    .from("calendar_events")
    .select("id, school_id, image_path")
    .eq("id", params.eventId);

  if (!params.isOwner) {
    adminFetch = adminFetch.eq("school_id", params.schoolId);
  }

  const { data: adminEvent } = await adminFetch.maybeSingle();
  return adminEvent || null;
}
