"use client";

import { useTranslations } from "next-intl";
import { AlertCircleIcon } from "lucide-react";
import { MaintenancePriorityBadge } from "./MaintenancePriorityBadge";
import { MaintenanceStatusBadge } from "./MaintenanceStatusBadge";
import { MaintenanceDetailMetaGrid } from "./MaintenanceDetailMetaGrid";
import type { MaintenanceRequestRow } from "@/lib/maintenance/types";

export function MaintenanceDetailCard({ ticket }: { ticket: MaintenanceRequestRow }) {
  const t = useTranslations("maintenance");

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 font-mono text-sm font-semibold text-primary">
            {ticket.ticket_number}
          </div>
          <h2 className="text-xl font-bold text-foreground">{ticket.title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MaintenancePriorityBadge priority={ticket.priority} />
          <MaintenanceStatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {t("ticketDescription")}
        </h3>
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
          {ticket.description}
        </p>
      </div>

      {ticket.rejection_reason && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="mb-1 flex items-center gap-2 font-medium">
            <AlertCircleIcon className="size-4" />
            <span>{t("rejectionReason")}</span>
          </div>
          <p>{ticket.rejection_reason}</p>
        </div>
      )}

      {ticket.reopen_reason && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
          <div className="mb-1 flex items-center gap-2 font-medium">
            <AlertCircleIcon className="size-4" />
            <span>{t("reopenReason")}</span>
          </div>
          <p>{ticket.reopen_reason}</p>
        </div>
      )}

      <MaintenanceDetailMetaGrid ticket={ticket} />
    </div>
  );
}
