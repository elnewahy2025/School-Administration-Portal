import { createSupabaseServerClient } from "@/lib/supabase";

export type ProfileRow = {
  id: string;
  full_name: string;
  email: string | null;
  job_title: string | null;
  school_id: string | null;
  department_id: string | null;
  is_active: boolean;
};

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, job_title, school_id, department_id, is_active")
    .eq("id", userData.user.id)
    .maybeSingle();
  return (data as ProfileRow | null) ?? null;
}
