import type { SupabaseClient } from "@supabase/supabase-js";
import { shouldThrottleNotification } from "./shouldThrottleNotification";
import type { CreateNotificationInput } from "./types";

export async function createNotificationRecord(
  supabase: SupabaseClient,
  input: CreateNotificationInput,
) {
  if (input.entityType && input.entityId) {
    const { data: existing } = await supabase
      .from("notifications")
      .select("created_at")
      .eq("user_id", input.userId)
      .eq("type", input.type)
      .eq("entity_type", input.entityType)
      .eq("entity_id", input.entityId)
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing && shouldThrottleNotification(existing.created_at)) {
      return { skipped: true, id: null };
    }
  }

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.userId,
      school_id: input.schoolId ?? null,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message, id: null };
  }

  return { success: true, id: data.id };
}
