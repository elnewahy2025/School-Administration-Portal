"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PieChartIcon } from "lucide-react";
import { GoldDots } from "@/components/ui/gold-dots";
import { PANEL } from "@/components/ui/diamond-card-styles";
import { DashboardComplianceDonut } from "./DashboardComplianceDonut";
import { DashboardComplianceDeptsCard } from "./DashboardComplianceDeptsCard";
import { CircularRemindButton } from "@/components/circulars/CircularRemindButton";
import { resolveSelectedComplianceView } from "@/lib/dashboard/resolveSelectedComplianceView";
import type { DashboardComplianceData } from "@/lib/dashboard/types";

export function DashboardComplianceWidget({ data }: { data: DashboardComplianceData }) {
  const t = useTranslations("dashboard");
  const [selectedCircularId, setSelectedCircularId] = useState<string>(
    () => data.circulars[0]?.id ?? "all",
  );

  const {
    selectedCircular,
    displayedResponded,
    displayedPending,
    displayedSlices,
    currentPercent,
  } = resolveSelectedComplianceView(data, selectedCircularId);

  const remindCircularId = selectedCircular?.id ?? data.circulars[0]?.id ?? null;
  const remindCircularTitle = selectedCircular?.title;

  return (
    <div className={`${PANEL} flex flex-col gap-5 p-5 sm:p-6`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PieChartIcon className="size-4" />
            </div>
            <h2 className="font-heading text-base font-extrabold tracking-tight text-primary sm:text-lg">
              {t("circularCompliance")}
            </h2>
            <GoldDots />
          </div>
          <p className="text-xs text-muted-foreground">{t("circularComplianceDesc")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.circulars.length > 0 && (
            <select
              value={selectedCircularId}
              onChange={(e) => setSelectedCircularId(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors outline-none focus:border-primary sm:w-auto"
              aria-label={t("selectCircular")}
            >
              <option value="all">{t("allCircularsSummary")}</option>
              {data.circulars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.refNumber} - {c.title}
                </option>
              ))}
            </select>
          )}

          {displayedPending.length > 0 ? (
            <CircularRemindButton
              circularId={remindCircularId}
              circularTitle={remindCircularTitle}
            />
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <DashboardComplianceDonut
            slices={displayedSlices}
            centerPercent={currentPercent}
            centerLabel={selectedCircular ? selectedCircular.refNumber : t("overallCompliance")}
          />
        </div>

        <div className="flex flex-col justify-center lg:col-span-7">
          <DashboardComplianceDeptsCard responded={displayedResponded} pending={displayedPending} />
        </div>
      </div>
    </div>
  );
}
