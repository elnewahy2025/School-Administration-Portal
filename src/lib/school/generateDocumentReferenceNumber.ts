import type { SupabaseClient } from "@supabase/supabase-js";
import { queryAdminSchoolNumber } from "./queryAdminSchoolNumber";

export async function generateDocumentReferenceNumber(
  supabase: SupabaseClient,
  schoolId: string,
  kind: "circular" | "maintenance",
): Promise<{ refNum?: string; error?: string }> {
  const { data: refNum, error: refError } = await supabase.rpc("next_school_number", {
    p_school: schoolId,
    p_kind: kind,
  });

  if (!refError && refNum) {
    return { refNum };
  }

  if (refError && (refError.code === "PGRST202" || refError.code === "42883")) {
    const fallbackRef = await queryAdminSchoolNumber(schoolId, kind);
    return { refNum: fallbackRef };
  }

  return { error: refError?.message ?? "Failed to generate reference number" };
}
