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
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: "invalid" };

  // Supabase does not invalidate an issued token when a profile is deactivated,
  // so a disabled account would otherwise keep a working session. Refuse the
  // sign-in and discard the session we just created. (RLS additionally blocks
  // the session from reading or writing anything via `is_active_user`.)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", data.user.id)
    .maybeSingle();
  if (profile && profile.is_active === false) {
    await supabase.auth.signOut();
    return { ok: false, error: "disabled" };
  }

  return { ok: true, error: null };
}
