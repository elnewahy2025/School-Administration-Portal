import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";

export function SchoolIdentityFields({
  school,
  canManage,
}: {
  school: SchoolFullDetails;
  canManage: boolean;
}) {
  const t = useTranslations("settings");

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name_ar">{t("nameAr")}</Label>
        <Input
          id="name_ar"
          name="name_ar"
          defaultValue={school.name_ar}
          required
          disabled={!canManage}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name_en">{t("nameEn")}</Label>
        <Input
          id="name_en"
          name="name_en"
          defaultValue={school.name_en}
          required
          disabled={!canManage}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">{t("slug")}</Label>
        <Input id="slug" value={school.slug} disabled className="bg-muted font-mono" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="academic_year">{t("academicYear")}</Label>
        <Input
          id="academic_year"
          name="academic_year"
          defaultValue={school.academic_year ?? ""}
          placeholder="مثال: 2026/2027"
          disabled={!canManage}
        />
      </div>
    </>
  );
}
