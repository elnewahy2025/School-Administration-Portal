import { createSupabaseServerClient } from "@/lib/supabase";

export async function getEffectivePermissions(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("effective_permission_keys");
  if (error) throw new Error(`Failed to load permissions: ${error.message}`);
  return (data ?? []) as string[];
}
