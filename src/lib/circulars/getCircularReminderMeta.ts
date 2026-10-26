import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCircularReminderMeta(
  supabase: SupabaseClient,
  circularId?: string | null,
): Promise<{ title: string; ref: string }> {
  if (!circularId) {
    return { title: "", ref: "" };
  }

  const { data: circ } = await supabase
    .from("circulars")
    .select("title, ref_number")
    .eq("id", circularId)
    .maybeSingle();

  return {
    title: circ?.title ?? "",
    ref: circ?.ref_number ?? "",
  };
}
