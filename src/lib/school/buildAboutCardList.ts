import type { PublicSchoolProfileRow } from "./getPublicSchoolProfile";
import { resolveLocalizedText } from "./resolveLocalizedText";

export type AboutCardItem = {
  key: string;
  iconType: "vision" | "mission" | "leadership" | "objectives";
  title: string;
  content: string;
};

export function buildAboutCardList(
  school: PublicSchoolProfileRow | null,
  locale: string,
  t: (key: string) => string,
  tSettings: (key: string) => string,
): AboutCardItem[] {
  if (!school) return [];

  const items: AboutCardItem[] = [];

  const vision = resolveLocalizedText(locale, school.vision_ar, school.vision_en, school.vision);
  if (vision) {
    items.push({
      key: "vision",
      iconType: "vision",
      title: t("vision"),
      content: vision,
    });
  }

  const mission = resolveLocalizedText(
    locale,
    school.mission_ar,
    school.mission_en,
    school.mission,
  );
  if (mission) {
    items.push({
      key: "mission",
      iconType: "mission",
      title: t("mission"),
      content: mission,
    });
  }

  const manager = resolveLocalizedText(locale, school.manager_name_ar, school.manager_name_en);
  if (manager) {
    items.push({
      key: "leadership",
      iconType: "leadership",
      title: tSettings("leadership"),
      content: manager,
    });
  }

  if (school.objectives) {
    items.push({
      key: "objectives",
      iconType: "objectives",
      title: t("achievements"),
      content: school.objectives,
    });
  }

  return items;
}
