import type { parseSchoolFormData } from "@/lib/validation/parseSchoolFormData";

export function buildSchoolUpdatePayload(
  parsed: ReturnType<typeof parseSchoolFormData>,
  logoPath: string | null,
  now: string,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name_ar: parsed.nameAr,
    name_en: parsed.nameEn,
    phone: parsed.phone,
    email: parsed.email,
    manager_name_ar: parsed.managerNameAr,
    manager_name_en: parsed.managerNameEn,
    assistant_manager_ar: parsed.assistantManagerAr,
    assistant_manager_en: parsed.assistantManagerEn,
    assistant_manager_2_ar: parsed.assistantManager2Ar,
    assistant_manager_2_en: parsed.assistantManager2En,
    assistant_manager_3_ar: parsed.assistantManager3Ar,
    assistant_manager_3_en: parsed.assistantManager3En,
    address_ar: parsed.addressAr,
    address_en: parsed.addressEn,
    updated_at: now,
  };

  if (parsed.slug) {
    payload.slug = parsed.slug;
  }
  if (logoPath) {
    payload.logo_path = logoPath;
  }

  return payload;
}
