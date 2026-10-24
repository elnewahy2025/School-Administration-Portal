"use server";

import { hasAnyPlatformOwner } from "@/lib/auth/hasAnyPlatformOwner";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { bootstrapPlatformOwnerClaim } from "./bootstrapPlatformOwnerClaim";

export async function claimPlatformOwnerAction(): Promise<{
  ok: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { ok: false, error: "unauthenticated" };

    const admin = createSupabaseAdminClient();
    try {
      if (await hasAnyPlatformOwner()) return { ok: false, error: "owner-exists" };
    } catch {
      return { ok: false, error: "check" };
    }

    return await bootstrapPlatformOwnerClaim(supabase, admin, userData.user);
  } catch (err: unknown) {
    sanitizeError(err, { action: "claimPlatformOwnerAction" });
    return { ok: false, error: "unexpected" };
  }
}
