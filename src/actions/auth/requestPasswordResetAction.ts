"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase";
import { cleanFormField } from "@/lib/validation/cleanFormField";
import { sanitizeError } from "@/lib/errors/sanitizeError";

export async function requestPasswordResetAction(
  _prev: { success: boolean; error?: string | null },
  formData: FormData,
): Promise<{ success: boolean; error?: string | null }> {
  try {
    const email = cleanFormField(formData.get("email"));
    if (!email || !email.includes("@")) {
      return { success: false, error: "invalid" };
    }

    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
    const protocol =
      headersList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
    const origin = `${protocol}://${host}`;
    const redirectTo = `${origin}/api/auth/callback?next=/reset-password`;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      sanitizeError(error, { action: "requestPasswordResetAction", email });
      return { success: false, error: "failed" };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    sanitizeError(err, { action: "requestPasswordResetAction" });
    return { success: false, error: "failed" };
  }
}
