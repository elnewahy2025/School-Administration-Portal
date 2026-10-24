import { matchesDateFilter } from "./matchesDateFilter";
import type { CircularsReportSummaryData, ReportFilterState } from "./types";

export function filterAndSortCirculars(
  data: CircularsReportSummaryData,
  filters: ReportFilterState,
): CircularsReportSummaryData {
  let filteredRows = data.rows.filter((row) => {
    const dateOk = matchesDateFilter(
      row.publishAt,
      filters.dateMode,
      filters.month,
      filters.fromDate,
      filters.toDate,
    );
    if (!dateOk) return false;
    if (filters.departmentId !== "all") {
      const matchResp = row.respondedDepartments.some((d) => d.id === filters.departmentId);
      const matchPend = row.pendingDepartments.some((d) => d.id === filters.departmentId);
      if (!matchResp && !matchPend) return false;
    }
    return true;
  });

  if (filters.dateSort === "asc") {
    filteredRows = [...filteredRows].sort((a, b) =>
      (a.publishAt || "").localeCompare(b.publishAt || ""),
    );
  } else if (filters.dateSort === "desc") {
    filteredRows = [...filteredRows].sort((a, b) =>
      (b.publishAt || "").localeCompare(a.publishAt || ""),
    );
  }

  let complianceItems = data.departmentBreakdown;
  if (filters.departmentId !== "all") {
    complianceItems = complianceItems.filter((d) => d.departmentId === filters.departmentId);
  }
  if (filters.departmentSort === "asc") {
    complianceItems = [...complianceItems].sort((a, b) =>
      a.departmentName.localeCompare(b.departmentName),
    );
  } else if (filters.departmentSort === "desc") {
    complianceItems = [...complianceItems].sort((a, b) =>
      b.departmentName.localeCompare(a.departmentName),
    );
  }

  const req = complianceItems.reduce((acc, d) => acc + d.targetedCount, 0);
  const rec = complianceItems.reduce((acc, d) => acc + d.respondedCount, 0);
  const rate = req > 0 ? Math.min(100, Math.round((rec / req) * 100)) : 100;

  return {
    totalCirculars: filteredRows.length,
    publishedCount: filteredRows.filter(
      (c) => c.status === "published" || c.status === "in_progress",
    ).length,
    totalResponsesRequired: req,
    totalResponsesReceived: rec,
    responseRatePercent: rate,
    overdueCount: filteredRows.filter((c) => c.status === "overdue").length,
    departmentBreakdown: complianceItems,
    rows: filteredRows,
  };
}
