"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { loginSchema } from "@/lib/validation/loginSchema";

export async function loginAction(
  _prev: { ok: boolean; error: string | null },
  formData: FormData,
): Promise<{ ok: boolean; error: string | null }> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: "invalid" };
  return { ok: true, error: null };
}
