import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n";
import { assertCanViewReports } from "@/lib/reports/assertCanViewReports";
import { getCircularsReportData } from "@/lib/reports/getCircularsReportData";
import { getMaintenanceReportData } from "@/lib/reports/getMaintenanceReportData";
import { getSchoolDepartments } from "@/lib/school/getSchoolDepartments";
import { ReportsHub } from "@/components/reports";

export default async function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const authCheck = await assertCanViewReports();
  if (!authCheck.authorized) {
    redirect({ href: "/dashboard", locale });
    return null;
  }

  const t = await getTranslations("reports");
  const [circularsData, maintenanceData, departments] = await Promise.all([
    getCircularsReportData(authCheck.schoolId, {}, authCheck.scopedDepartmentId),
    getMaintenanceReportData(authCheck.schoolId, {}),
    getSchoolDepartments(authCheck.schoolId),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <ReportsHub
        circularsData={circularsData}
        maintenanceData={maintenanceData}
        departments={departments}
      />
    </div>
  );
}
