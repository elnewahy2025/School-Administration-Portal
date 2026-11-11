import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase";
import { mapDatabaseError } from "@/lib/errors/mapDatabaseError";
import { getFirstActiveSchoolId } from "./getFirstActiveSchoolId";
import { fetchSchoolAcademicYear } from "./fetchSchoolAcademicYear";

export type SchoolRow = {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  timezone: string;
  logo_path: string | null;
  is_active: boolean;
  phone?: string | null;
  email?: string | null;
  manager_name_ar?: string | null;
  manager_name_en?: string | null;
  assistant_manager_ar?: string | null;
  assistant_manager_en?: string | null;
  assistant_manager_2_ar?: string | null;
  assistant_manager_2_en?: string | null;
  assistant_manager_3_ar?: string | null;
  assistant_manager_3_en?: string | null;
  address_ar?: string | null;
  address_en?: string | null;
  academic_year?: string | null;
  updated_at?: string | null;
};

const SCHOOL_FIELDS =
  "id, name_ar, name_en, slug, timezone, logo_path, is_active, phone, email, manager_name_ar, manager_name_en, assistant_manager_ar, assistant_manager_en, assistant_manager_2_ar, assistant_manager_2_en, assistant_manager_3_ar, assistant_manager_3_en, address_ar, address_en, updated_at";

const LEGACY_SCHOOL_FIELDS =
  "id, name_ar, name_en, slug, timezone, logo_path, is_active, phone, email, manager_name_ar, manager_name_en, assistant_manager_ar, assistant_manager_en, assistant_manager_2_ar, assistant_manager_2_en, address_ar, address_en, updated_at";

export const getCurrentSchool = cache(async function getCurrentSchool(
  schoolId?: string | null,
): Promise<SchoolRow | null> {
  const supabase = await createSupabaseServerClient();
  let targetId = schoolId;

  if (targetId === undefined) {
    targetId = await getFirstActiveSchoolId();
  }
  if (!targetId) {
    return null;
  }

  let { data, error } = await supabase
    .from("schools")
    .select(SCHOOL_FIELDS)
    .eq("id", targetId)
    .maybeSingle();

  if (error) {
    const fallback = await supabase
      .from("schools")
      .select(LEGACY_SCHOOL_FIELDS)
      .eq("id", targetId)
      .maybeSingle();
    if (!fallback.error && fallback.data) {
      data = {
        ...fallback.data,
        assistant_manager_3_ar: null,
        assistant_manager_3_en: null,
      };
      error = null;
    }
  }

  if (error) {
    throw mapDatabaseError(error);
  }

  const school = (data as SchoolRow | null) ?? null;

  if (school) {
    const academicYear = await fetchSchoolAcademicYear(supabase, school.id);
    if (academicYear) {
      school.academic_year = academicYear;
    }
  }

  return school;
});
