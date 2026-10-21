"use server";

import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase";

export async function claimPlatformOwnerAction(): Promise<{
  ok: boolean;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "unauthenticated" };

  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("user_role_assignments")
    .select("id", { count: "exact", head: true })
    .eq("roles.key", "owner")
    .is("school_id", null);
  if ((count ?? 0) > 0) return { ok: false, error: "owner-exists" };

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
