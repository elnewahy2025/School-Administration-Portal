import { createSupabaseServerClient } from "@/lib/supabase";

export type SchoolRow = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  timezone: string;
  logo_path: string | null;
  is_active: boolean;
};

export async function getCurrentSchool(schoolId?: string | null): Promise<SchoolRow | null> {
  if (!schoolId) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("schools")
    .select("id, name_ar, name_en, slug, timezone, logo_path, is_active")
    .eq("id", schoolId)
    .maybeSingle();
  return (data as SchoolRow | null) ?? null;
}
