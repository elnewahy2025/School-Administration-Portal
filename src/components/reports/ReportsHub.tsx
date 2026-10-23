"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ExportCsvButton } from "./ExportCsvButton";
import { CircularsReportSummary } from "./CircularsReportSummary";
import { DepartmentComplianceTable } from "./DepartmentComplianceTable";
import { CircularsReportTable } from "./CircularsReportTable";
import { MaintenanceReportSummary } from "./MaintenanceReportSummary";
import { MaintenanceReportTable } from "./MaintenanceReportTable";
import type { CircularsReportSummaryData, MaintenanceReportSummaryData } from "@/lib/reports/types";

export function ReportsHub({
  circularsData,
  maintenanceData,
}: {
  circularsData: CircularsReportSummaryData;
  maintenanceData: MaintenanceReportSummaryData;
}) {
  const t = useTranslations("reports");
  const [activeTab, setActiveTab] = useState<"circulars" | "maintenance">("circulars");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "circulars" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("circulars")}
          >
            {t("circularsTab")}
          </Button>
          <Button
            variant={activeTab === "maintenance" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("maintenance")}
          >
            {t("maintenanceTab")}
          </Button>
        </div>
        <ExportCsvButton type={activeTab} />
      </div>

      {activeTab === "circulars" ? (
        <div className="space-y-6">
          <CircularsReportSummary data={circularsData} />
          <DepartmentComplianceTable items={circularsData.departmentBreakdown} />
          <CircularsReportTable rows={circularsData.rows} />
        </div>
      ) : (
        <div className="space-y-6">
          <MaintenanceReportSummary data={maintenanceData} />
          <MaintenanceReportTable rows={maintenanceData.rows} />
        </div>
      )}
    </div>
  );
}
