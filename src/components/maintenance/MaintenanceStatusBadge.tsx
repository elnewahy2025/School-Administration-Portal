"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { MaintenanceStatus } from "@/lib/maintenance/types";

const STATUS_VARIANTS: Record<
  MaintenanceStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  submitted: {
    variant: "secondary",
    className: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  },
  triaged: {
    variant: "secondary",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
  },
  assigned: {
    variant: "secondary",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200",
  },
  in_progress: {
    variant: "default",
    className: "bg-amber-500 text-white dark:bg-amber-600",
  },
  waiting_for_parts: {
    variant: "outline",
    className: "border-amber-500 text-amber-700 dark:text-amber-300",
  },
  resolved: {
    variant: "default",
    className: "bg-emerald-600 text-white dark:bg-emerald-700",
  },
  closed: {
    variant: "outline",
    className: "bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border-border",
  },
  reopened: {
    variant: "destructive",
    className: "bg-rose-500 text-white dark:bg-rose-600",
  },
  rejected: {
    variant: "destructive",
    className: "bg-red-700 text-white",
  },
};

export function MaintenanceStatusBadge({ status }: { status: MaintenanceStatus }) {
  const t = useTranslations("maintenance.statuses");
  const config = STATUS_VARIANTS[status] ?? STATUS_VARIANTS.submitted;

  return (
    <Badge variant={config.variant} className={config.className}>
      {t(status)}
    </Badge>
  );
}
