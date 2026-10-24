import { createSupabaseServerClient } from "@/lib/supabase";

export type SchoolRow = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  timezone: string;
  logo_path: string | null;
  is_active: boolean;
  phone?: string | null;
  manager_name_ar?: string | null;
  manager_name_en?: string | null;
  assistant_manager_ar?: string | null;
  assistant_manager_en?: string | null;
  assistant_manager_2_ar?: string | null;
  assistant_manager_2_en?: string | null;
  address_ar?: string | null;
  address_en?: string | null;
};

const SCHOOL_FIELDS =
  "id, name_ar, name_en, slug, timezone, logo_path, is_active, phone, manager_name_ar, manager_name_en, assistant_manager_ar, assistant_manager_en, assistant_manager_2_ar, assistant_manager_2_en, address_ar, address_en";

export async function getCurrentSchool(schoolId?: string | null): Promise<SchoolRow | null> {
  const supabase = await createSupabaseServerClient();
  if (schoolId) {
    const { data } = await supabase
      .from("schools")
      .select(SCHOOL_FIELDS)
      .eq("id", schoolId)
      .maybeSingle();
    if (data) return data as SchoolRow;
  }

  const { data: fallback } = await supabase
    .from("schools")
    .select(SCHOOL_FIELDS)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  return (fallback as SchoolRow | null) ?? null;
}
