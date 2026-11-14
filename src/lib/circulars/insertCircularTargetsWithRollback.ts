import type { SupabaseClient } from "@supabase/supabase-js";
import { insertCircularTargets } from "./insertCircularTargets";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";

export async function insertCircularTargetsWithRollback(
  supabase: SupabaseClient,
  circularId: string,
  schoolId: string,
  departmentIds: string[],
): Promise<void> {
  const targetResult = await insertCircularTargets(supabase, circularId, schoolId, departmentIds);

  if (targetResult.error) {
    await supabase.from("circulars").delete().eq("id", circularId);
    throw mapDatabaseError(targetResult.error, "Could not save circular targets");
  }
}
