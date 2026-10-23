import { createSupabaseServerClient } from "@/lib/supabase";
import type { MaintenanceUpdateRow } from "./types";

export async function getMaintenanceUpdates(requestId: string): Promise<MaintenanceUpdateRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("maintenance_updates")
    .select(
      `
      id, request_id, school_id, author_id, kind, old_value, new_value, reason, created_at,
      author:profiles!maintenance_updates_author_id_fkey(id, full_name)
    `,
    )
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch maintenance updates: ${error.message}`);
  }

  return (data as unknown as MaintenanceUpdateRow[]) ?? [];
}
