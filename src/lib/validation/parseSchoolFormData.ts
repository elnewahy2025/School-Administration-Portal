export function parseSchoolFormData(formData: FormData) {
  const get = (key: string) => {
    const val = formData.get(key);
    return typeof val === "string" ? val.trim() : "";
  };

  return {
    nameAr: get("name_ar"),
    nameEn: get("name_en"),
    timezone: get("timezone") || "UTC",
    academicYear: get("academic_year") || null,
    vision: get("vision") || null,
    mission: get("mission") || null,
  };
}
