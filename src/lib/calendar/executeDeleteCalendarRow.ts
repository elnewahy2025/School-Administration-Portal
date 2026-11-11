import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function executeDeleteCalendarRow(
  supabase: SupabaseClient,
  params: { eventId: string; schoolId: string; actorId: string; isOwner?: boolean },
): Promise<{ success: boolean; error?: string }> {
  let query = supabase.from("calendar_events").delete().eq("id", params.eventId);
  if (!params.isOwner) {
    query = query.eq("school_id", params.schoolId);
  }

  const { data: deleted, error: deleteError } = await query.select("id");
  if (!deleteError && deleted && deleted.length > 0) {
    return { success: true };
  }

  const admin = createSupabaseAdminClient({
    actorId: params.actorId,
    actorLabel: "delete-calendar-event-fallback",
  });
  let adminDelete = admin.from("calendar_events").delete().eq("id", params.eventId);
  if (!params.isOwner) {
    adminDelete = adminDelete.eq("school_id", params.schoolId);
  }

  const { data: adminDeleted, error: adminErr } = await adminDelete.select("id");
  if (adminErr) {
    return { success: false, error: adminErr.message };
  }
  if (!adminDeleted || adminDeleted.length === 0) {
    return { success: false, error: "Event not found or access denied" };
  }

  return { success: true };
}
