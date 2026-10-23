"use server";

import { hasAnyPlatformOwner } from "@/lib/auth/hasAnyPlatformOwner";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase";

export async function claimPlatformOwnerAction(): Promise<{
  ok: boolean;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "unauthenticated" };

  const admin = createSupabaseAdminClient();
  try {
    // The broken query this replaces always reported `false`, letting any
    // authenticated user self-provision a profile after bootstrap (finding C1).
    if (await hasAnyPlatformOwner()) return { ok: false, error: "owner-exists" };
  } catch {
    return { ok: false, error: "check" };
  }

  const email = userData.user.email ?? "";
  const fallbackName = email.split("@")[0] || "Owner";
  const fullName = (userData.user.user_metadata?.full_name as string | undefined) ?? fallbackName;

  const { error: profileError } = await admin
    .from("profiles")
    .upsert({ id: userData.user.id, full_name: fullName, email }, { onConflict: "id" });
  if (profileError) return { ok: false, error: "profile" };

  // Runs through the caller's session so the audit trail records the claimant.
  const { error: bootstrapError } = await supabase.rpc("bootstrap_platform_owner", {
    p_user_id: userData.user.id,
  });
  if (bootstrapError) return { ok: false, error: "bootstrap" };
  return { ok: true, error: null };
}
