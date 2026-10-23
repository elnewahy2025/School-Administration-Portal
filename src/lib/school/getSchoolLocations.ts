import { createSupabaseServerClient } from "@/lib/supabase";

export type LocationRow = {
  id: string;
  school_id: string;
  building: string;
  floor: string | null;
  room: string | null;
  kind: string;
  is_active: boolean;
  created_at: string;
};

export async function getSchoolLocations(schoolId?: string | null): Promise<LocationRow[]> {
  if (!schoolId) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("locations")
    .select("id, school_id, building, floor, room, kind, is_active, created_at")
    .eq("school_id", schoolId)
    .order("building", { ascending: true })
    .order("room", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch locations: ${error.message}`);
  }

  return (data as LocationRow[]) ?? [];
}
