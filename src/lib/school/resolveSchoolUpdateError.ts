import type { PostgrestError } from "@supabase/supabase-js";

export function resolveSchoolUpdateError(error: PostgrestError): string {
  const isMissing =
    error.message?.includes("assistant_manager_3") || error.code === "PGRST204";

  if (isMissing) {
    return "Database schema is missing assistant_manager_3 columns. Please execute migration 0067 in Supabase SQL Editor.";
  }

  return error.message;
}

