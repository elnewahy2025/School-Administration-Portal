import { resolveCircularSlices } from "./resolveCircularSlices";
import type {
  DashboardComplianceData,
  DashboardComplianceDeptBadge,
  DashboardComplianceCircularItem,
  DashboardDepartmentComplianceSlice,
} from "./types";

export interface SelectedComplianceView {
  selectedCircular: DashboardComplianceCircularItem | null;
  displayedResponded: DashboardComplianceDeptBadge[];
  displayedPending: DashboardComplianceDeptBadge[];
  displayedSlices: DashboardDepartmentComplianceSlice[];
  currentPercent: number;
}

export function resolveSelectedComplianceView(
  data: DashboardComplianceData,
  selectedCircularId: string,
): SelectedComplianceView {
  const selectedCircular =
    selectedCircularId === "all"
      ? null
      : (data.circulars.find((c) => c.id === selectedCircularId) ?? null);

  if (selectedCircular) {
    return {
      selectedCircular,
      displayedResponded: selectedCircular.respondedDepartments,
      displayedPending: selectedCircular.pendingDepartments,
      displayedSlices: resolveCircularSlices(data.departmentSlices, selectedCircular),
      currentPercent: selectedCircular.compliancePercent,
    };
  }

  return {
    selectedCircular: null,
    displayedResponded: data.overallRespondedDepartments,
    displayedPending: data.overallPendingDepartments,
    displayedSlices: data.departmentSlices,
    currentPercent: data.overallCompliancePercent,
  };
}
