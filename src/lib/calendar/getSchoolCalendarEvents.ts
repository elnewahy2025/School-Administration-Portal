import { createSupabaseServerClient } from "@/lib/supabase";
import type { CalendarEventRow } from "./types";

export async function getSchoolCalendarEvents(
  schoolId?: string | null,
): Promise<CalendarEventRow[]> {
  if (!schoolId) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .select(
      `
      id, school_id, title_ar, title_en, description, category,
      starts_at, ends_at, all_day, visibility, status, location,
      image_path, created_by, published_at, cancelled_at, created_at, updated_at,
      creator:profiles!calendar_events_created_by_fkey(id, full_name)
    `,
    )
    .eq("school_id", schoolId)
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch calendar events: ${error.message}`);
  }

  return (data as unknown as CalendarEventRow[]) ?? [];
}
