"use server";

import { hasAnyPlatformOwner } from "@/lib/auth/hasAnyPlatformOwner";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase";
import { sanitizeError } from "@/lib/errors/sanitizeError";
import { bootstrapPlatformOwnerClaim } from "./bootstrapPlatformOwnerClaim";
import { validateBootstrapGuard } from "./validateBootstrapGuard";

export async function claimPlatformOwnerAction(bootstrapSecret?: string): Promise<{
  ok: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return { ok: false, error: "unauthenticated" };

    const guardError = validateBootstrapGuard(userData.user.email, bootstrapSecret);
    if (guardError) return { ok: false, error: guardError };

    const admin = createSupabaseAdminClient({
      actorId: userData.user.id,
      actorLabel: userData.user.email,
    });
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
