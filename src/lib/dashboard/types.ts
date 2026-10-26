export interface DashboardComplianceDeptBadge {
  id: string;
  name: string;
}

export interface DashboardComplianceCircularItem {
  id: string;
  refNumber: string;
  title: string;
  totalTargets: number;
  totalResponses: number;
  compliancePercent: number;
  respondedDepartments: DashboardComplianceDeptBadge[];
  pendingDepartments: DashboardComplianceDeptBadge[];
}

export interface DashboardDepartmentComplianceSlice {
  id: string;
  name: string;
  targetedCount: number;
  respondedCount: number;
  pendingCount: number;
  complianceRate: number;
  color: string;
}

export interface DashboardComplianceData {
  overallCompliancePercent: number;
  totalTargets: number;
  totalResponses: number;
  overallRespondedDepartments: Array<{ id: string; name: string }>;
  overallPendingDepartments: Array<{ id: string; name: string }>;
  departmentSlices: DashboardDepartmentComplianceSlice[];
  circulars: DashboardComplianceCircularItem[];
}
