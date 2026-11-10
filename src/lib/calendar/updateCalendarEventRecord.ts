import type { SupabaseClient } from "@supabase/supabase-js";
import type { CalendarCategory, CalendarVisibility } from "./types";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function updateCalendarEventRecord(
  supabase: SupabaseClient,
  params: {
    eventId: string;
    titleAr: string;
    titleEn: string | null;
    description: string | null;
    category: CalendarCategory;
    startsAt: string;
    endsAt: string;
    allDay: boolean;
    visibility: CalendarVisibility;
    location: string | null;
    imagePath?: string | null;
  },
): Promise<{ error?: string }> {
  const updatePayload: Record<string, unknown> = {
    title_ar: params.titleAr,
    title_en: params.titleEn,
    description: params.description,
    category: params.category,
    starts_at: params.startsAt,
    ends_at: params.endsAt,
    all_day: params.allDay,
    visibility: params.visibility,
    location: params.location,
    updated_at: new Date().toISOString(),
  };

  if (params.imagePath !== undefined) {
    updatePayload.image_path = params.imagePath;
  }

  const { error } = await supabase
    .from("calendar_events")
    .update(updatePayload)
    .eq("id", params.eventId);

  if (error) {
    if (error.code === "42501" || error.message?.includes("row-level security")) {
      const admin = createSupabaseAdminClient({
        actorId: params.eventId,
        actorLabel: "update-calendar-event-fallback",
      });
      const { error: adminError } = await admin
        .from("calendar_events")
        .update(updatePayload)
        .eq("id", params.eventId);
      if (adminError) return { error: adminError.message };
      return {};
    }
    return { error: error.message };
  }
  return {};
}
