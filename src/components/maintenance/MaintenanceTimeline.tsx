"use client";

import { useLocale, useTranslations } from "next-intl";
import { MessageSquareIcon, ArrowRightIcon, UserIcon } from "lucide-react";
import type { MaintenanceUpdateRow } from "@/lib/maintenance/types";

export function MaintenanceTimeline({ updates }: { updates: MaintenanceUpdateRow[] }) {
  const t = useTranslations("maintenance");
  const locale = useLocale();

  if (updates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-xs">
      <h3 className="border-b border-border pb-3 font-semibold text-foreground">{t("timeline")}</h3>

      <div className="space-y-4">
        {updates.map((up) => (
          <div key={up.id} className="relative flex items-start gap-3 ps-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {up.kind === "note" ? (
                <MessageSquareIcon className="size-3.5" />
              ) : (
                <UserIcon className="size-3.5" />
              )}
            </div>

            <div className="flex-1 rounded-md border border-border bg-background p-3 text-sm">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-foreground">
                  {up.author?.full_name ?? "System"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(up.created_at).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
                </span>
              </div>

              {up.kind === "status_change" && up.old_value && up.new_value && (
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                  <span>{up.old_value}</span>
                  <ArrowRightIcon className="size-3 rtl:rotate-180" />
                  <span>{up.new_value}</span>
                </div>
              )}

              {up.reason && (
                <p className="whitespace-pre-wrap text-muted-foreground">{up.reason}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
