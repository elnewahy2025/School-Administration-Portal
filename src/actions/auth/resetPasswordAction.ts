"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { cleanFormField } from "@/lib/validation/cleanFormField";
import { sanitizeError } from "@/lib/errors/sanitizeError";

export async function resetPasswordAction(
  _prev: { success: boolean; error?: string | null },
  formData: FormData,
): Promise<{ success: boolean; error?: string | null }> {
  try {
    const password = cleanFormField(formData.get("password"));
    const confirmPassword = cleanFormField(formData.get("confirm_password"));

    if (!password || password.length < 6) {
      return { success: false, error: "tooShort" };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "mismatch" };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      sanitizeError(error, { action: "resetPasswordAction" });
      return { success: false, error: "failed" };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    sanitizeError(err, { action: "resetPasswordAction" });
    return { success: false, error: "failed" };
  }
}
