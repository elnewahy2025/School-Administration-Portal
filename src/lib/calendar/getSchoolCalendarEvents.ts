import { createSupabaseServerClient } from "@/lib/supabase";
import type { CalendarEventRow } from "./types";

export async function getSchoolCalendarEvents(
  schoolId?: string | null,
): Promise<CalendarEventRow[]> {
  const supabase = await createSupabaseServerClient();
  let resolvedId = schoolId;
  if (!resolvedId) {
    const { data: firstSchool } = await supabase
      .from("schools")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    resolvedId = firstSchool?.id ?? null;
  }
  if (!resolvedId) return [];

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
    .eq("school_id", resolvedId)
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch calendar events: ${error.message}`);
  }

  return (data as unknown as CalendarEventRow[]) ?? [];
}
