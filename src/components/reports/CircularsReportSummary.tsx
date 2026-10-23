import { useTranslations } from "next-intl";
import { FileTextIcon, SendIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import { ReportKpiCard } from "./ReportKpiCard";
import type { CircularsReportSummaryData } from "@/lib/reports/types";

export function CircularsReportSummary({ data }: { data: CircularsReportSummaryData }) {
  const t = useTranslations("reports.kpis");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ReportKpiCard title={t("totalCirculars")} value={data.totalCirculars} icon={FileTextIcon} />
      <ReportKpiCard title={t("publishedCirculars")} value={data.publishedCount} icon={SendIcon} />
      <ReportKpiCard
        title={t("responseRate")}
        value={`${data.responseRatePercent}%`}
        description={`${data.totalResponsesReceived} / ${data.totalResponsesRequired}`}
        icon={CheckCircle2Icon}
        trend={data.responseRatePercent >= 80 ? "good" : "warning"}
      />
      <ReportKpiCard
        title={t("overdueResponses")}
        value={data.overdueCount}
        icon={AlertCircleIcon}
        trend={data.overdueCount > 0 ? "warning" : "good"}
      />
    </div>
  );
}
