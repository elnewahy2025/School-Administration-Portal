import { getCircularsReportData } from "@/lib/reports/getCircularsReportData";
import { DONUT_PALETTE } from "./donutPalette";
import type {
  DashboardComplianceData,
  DashboardComplianceCircularItem,
  DashboardDepartmentComplianceSlice,
} from "./types";

export async function getDashboardComplianceData(
  schoolId: string,
): Promise<DashboardComplianceData> {
  const reportData = await getCircularsReportData(schoolId);

  const circulars: DashboardComplianceCircularItem[] = reportData.rows
    .filter((r) => r.totalTargets > 0)
    .slice(0, 10)
    .map((r) => ({
      id: r.id,
      refNumber: r.refNumber,
      title: r.title,
      totalTargets: r.totalTargets,
      totalResponses: r.totalResponses,
      compliancePercent: r.compliancePercent,
      respondedDepartments: r.respondedDepartments,
      pendingDepartments: r.pendingDepartments,
    }));

  const departmentSlices: DashboardDepartmentComplianceSlice[] = reportData.departmentBreakdown.map(
    (dept, index) => ({
      id: dept.departmentId,
      name: dept.departmentName,
      targetedCount: dept.targetedCount,
      respondedCount: dept.respondedCount,
      pendingCount: dept.pendingCount,
      complianceRate: dept.complianceRatePercent,
      color: DONUT_PALETTE[index % DONUT_PALETTE.length],
    }),
  );

  const overallRespondedDepartments = reportData.departmentBreakdown
    .filter((d) => d.respondedCount > 0)
    .map((d) => ({
      id: d.departmentId,
      name:
        d.complianceRatePercent < 100
          ? `${d.departmentName} (${d.complianceRatePercent}%)`
          : d.departmentName,
    }));

  const overallPendingDepartments = reportData.departmentBreakdown
    .filter((d) => d.pendingCount > 0 && d.respondedCount === 0)
    .map((d) => ({ id: d.departmentId, name: d.departmentName }));

  return {
    overallCompliancePercent: reportData.responseRatePercent,
    totalTargets: reportData.totalResponsesRequired,
    totalResponses: reportData.totalResponsesReceived,
    overallRespondedDepartments,
    overallPendingDepartments,
    departmentSlices,
    circulars,
  };
}
