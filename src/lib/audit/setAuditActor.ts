import type { SupabaseClient } from "@supabase/supabase-js";

export async function setAuditActor(
  supabase: SupabaseClient,
  actorId: string,
  actorLabel?: string | null,
): Promise<void> {
  const { error } = await supabase.rpc("set_audit_actor", {
    p_actor_id: actorId,
    p_actor_label: actorLabel ?? null,
  });

  if (error) {
    console.warn("[Audit] Failed to set audit actor context:", error.message);
  }
}
