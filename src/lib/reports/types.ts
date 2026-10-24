export interface ReportFilterParams {
  from?: string;
  to?: string;
  departmentId?: string;
  status?: string;
  category?: string;
}

export interface DepartmentComplianceItem {
  departmentId: string;
  departmentName: string;
  targetedCount: number;
  respondedCount: number;
  pendingCount: number;
  complianceRatePercent: number;
}

export interface DepartmentCompactItem {
  id: string;
  name: string;
}

export interface CircularReportRow {
  id: string;
  refNumber: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  publishAt: string | null;
  dueAt: string | null;
  totalTargets: number;
  totalResponses: number;
  compliancePercent: number;
  respondedDepartments: DepartmentCompactItem[];
  pendingDepartments: DepartmentCompactItem[];
}

export interface CircularsReportSummaryData {
  totalCirculars: number;
  publishedCount: number;
  totalResponsesRequired: number;
  totalResponsesReceived: number;
  responseRatePercent: number;
  overdueCount: number;
  departmentBreakdown: DepartmentComplianceItem[];
  rows: CircularReportRow[];
}

export interface MaintenanceReportRow {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  locationName: string;
  reporterName: string;
  operatorName: string | null;
  createdAt: string;
  resolvedAt: string | null;
  resolutionTimeHours: number | null;
}

export interface MaintenanceReportSummaryData {
  totalTickets: number;
  openCount: number;
  resolvedCount: number;
  avgResolutionTimeHours: number | null;
  priorityBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  rows: MaintenanceReportRow[];
}
