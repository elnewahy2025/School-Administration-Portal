import type { SupabaseClient } from "@supabase/supabase-js";
import type { CircularInsertParams } from "./types";
import { generateDocumentReferenceNumber } from "@/lib/school/generateDocumentReferenceNumber";
import { insertCircularRecord } from "./insertCircularRecord";

export async function createCircularRecord(
  supabase: SupabaseClient,
  params: CircularInsertParams,
): Promise<{ circularId?: string; error?: string }> {
  const { refNum, error: refError } = await generateDocumentReferenceNumber(
    supabase,
    params.schoolId,
    "circular",
  );

  if (refError || !refNum) {
    return { error: refError ?? "Failed to generate reference number" };
  }

  return insertCircularRecord(supabase, params, refNum);
}
