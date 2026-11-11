import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase";

export const getSessionUser = cache(async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
});
