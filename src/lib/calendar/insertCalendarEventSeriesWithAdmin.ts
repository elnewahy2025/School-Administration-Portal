import { createSupabaseAdminClient } from "@/lib/supabase";

export async function insertCalendarEventSeriesWithAdmin(
  rows: Record<string, unknown>[],
  actorId: string,
): Promise<{ eventIds?: string[]; firstEventId?: string; error?: string }> {
  const admin = createSupabaseAdminClient({
    actorId,
    actorLabel: "create-calendar-event-series-fallback",
  });
  const { data, error } = await admin.from("calendar_events").insert(rows).select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Failed to create calendar event series" };
  }

  const eventIds = data.map((row) => row.id as string);
  return { eventIds, firstEventId: eventIds[0] };
}
