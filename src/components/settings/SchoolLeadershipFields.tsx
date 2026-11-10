import { useTranslations } from "next-intl";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";
import { LeadershipFieldPair } from "./LeadershipFieldPair";

export function SchoolLeadershipFields({
  school,
  canManage,
}: {
  school: SchoolFullDetails;
  canManage: boolean;
}) {
  const t = useTranslations("settings");

  return (
    <>
      <div className="border-t border-border pt-2 sm:col-span-2">
        <h3 className="text-sm font-semibold text-foreground">{t("leadership")}</h3>
      </div>
      <LeadershipFieldPair
        idAr="manager_name_ar"
        idEn="manager_name_en"
        labelAr={t("managerNameAr")}
        labelEn={t("managerNameEn")}
        defaultValueAr={school.manager_name_ar ?? ""}
        defaultValueEn={school.manager_name_en ?? ""}
        disabled={!canManage}
      />
      <LeadershipFieldPair
        idAr="assistant_manager_ar"
        idEn="assistant_manager_en"
        labelAr={t("assistantManagerAr")}
        labelEn={t("assistantManagerEn")}
        defaultValueAr={school.assistant_manager_ar ?? ""}
        defaultValueEn={school.assistant_manager_en ?? ""}
        disabled={!canManage}
      />
      <LeadershipFieldPair
        idAr="assistant_manager_2_ar"
        idEn="assistant_manager_2_en"
        labelAr={t("assistantManager2Ar")}
        labelEn={t("assistantManager2En")}
        defaultValueAr={school.assistant_manager_2_ar ?? ""}
        defaultValueEn={school.assistant_manager_2_en ?? ""}
        disabled={!canManage}
      />
      <LeadershipFieldPair
        idAr="assistant_manager_3_ar"
        idEn="assistant_manager_3_en"
        labelAr={t("assistantManager3Ar")}
        labelEn={t("assistantManager3En")}
        defaultValueAr={school.assistant_manager_3_ar ?? ""}
        defaultValueEn={school.assistant_manager_3_en ?? ""}
        disabled={!canManage}
      />
    </>
  );
}
