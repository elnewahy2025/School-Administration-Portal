import type { SchoolRow } from "./getCurrentSchool";

export type SchoolSettingsRow = {
  academic_year?: string | null;
  vision?: string | null;
  mission?: string | null;
  vision_ar?: string | null;
  vision_en?: string | null;
  mission_ar?: string | null;
  mission_en?: string | null;
  public_description?: string | null;
};

export function mergeSchoolSettings(school: SchoolRow, settings: SchoolSettingsRow | null) {
  if (!settings) {
    return {
      ...school,
      academic_year: null,
      vision: null,
      mission: null,
      vision_ar: null,
      vision_en: null,
      mission_ar: null,
      mission_en: null,
      public_description: null,
    };
  }

  return {
    ...school,
    academic_year: settings.academic_year,
    vision: settings.vision_ar || settings.vision || null,
    mission: settings.mission_ar || settings.mission || null,
    vision_ar: settings.vision_ar,
    vision_en: settings.vision_en,
    mission_ar: settings.mission_ar,
    mission_en: settings.mission_en,
    public_description: settings.public_description,
  };
}
