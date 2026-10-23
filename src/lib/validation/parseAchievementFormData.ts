import type { AchievementCategory, AchievementVisibility } from "@/lib/achievements/types";

export function parseAchievementFormData(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const imageEntry = formData.get("image");
  const image = imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;

  return {
    titleAr: get("title_ar"),
    titleEn: get("title_en") || null,
    description: get("description") || null,
    departmentId: get("department_id") || null,
    category: (get("category") || "academic") as AchievementCategory,
    dateAchieved: get("date_achieved") || new Date().toISOString().split("T")[0],
    visibility: (get("visibility") || "internal") as AchievementVisibility,
    image,
  };
}
