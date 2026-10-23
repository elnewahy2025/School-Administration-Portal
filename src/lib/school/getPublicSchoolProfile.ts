import { createSupabaseServerClient } from "@/lib/supabase";

export interface PublicSchoolProfileRow {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  logo_path: string | null;
  timezone: string;
  public_description: string | null;
  vision: string | null;
  mission: string | null;
  objectives: string | null;
}

export async function getPublicSchoolProfile(
  schoolId?: string | null,
): Promise<PublicSchoolProfileRow | null> {
  const supabase = await createSupabaseServerClient();
  const query = supabase
    .from("public_school_profiles")
    .select(
      "id, name_ar, name_en, slug, logo_path, timezone, public_description, vision, mission, objectives",
    );

  const { data } = schoolId
    ? await query.eq("id", schoolId).maybeSingle()
    : await query.limit(1).maybeSingle();

  return (data as PublicSchoolProfileRow | null) ?? null;
}
