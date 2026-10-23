import type { SupabaseClient } from "@supabase/supabase-js";
import type { CalendarCategory, CalendarVisibility } from "./types";

export async function createCalendarEventRecord(
  supabase: SupabaseClient,
  params: {
    schoolId: string;
    titleAr: string;
    titleEn: string | null;
    description: string | null;
    category: CalendarCategory;
    startsAt: string;
    endsAt: string;
    allDay: boolean;
    visibility: CalendarVisibility;
    location: string | null;
    imagePath: string | null;
    createdBy: string;
  },
): Promise<{ eventId?: string; error?: string }> {
  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      school_id: params.schoolId,
      title_ar: params.titleAr,
      title_en: params.titleEn,
      description: params.description,
      category: params.category,
      starts_at: params.startsAt,
      ends_at: params.endsAt,
      all_day: params.allDay,
      visibility: params.visibility,
      status: "draft",
      location: params.location,
      image_path: params.imagePath,
      created_by: params.createdBy,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  if (!data) return { error: "Failed to create calendar event" };

  return { eventId: data.id };
}
