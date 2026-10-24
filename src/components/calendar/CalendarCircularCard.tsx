"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FileTextIcon, ClockIcon, CheckCircle2Icon, ExternalLinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircularPriorityBadge } from "@/components/circulars/CircularPriorityBadge";
import type { CircularRow } from "@/lib/circulars/types";

export function CalendarCircularCard({
  circular,
  onSelect,
}: {
  circular: CircularRow;
  onSelect?: () => void;
}) {
  const locale = useLocale();
  const tCirc = useTranslations("circulars");

  const deadline = circular.due_at ? new Date(circular.due_at) : null;
  const formattedDeadline = deadline
    ? deadline.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-3 rounded-lg border border-indigo-500/20 bg-indigo-50/30 p-5 shadow-xs transition hover:border-indigo-500/40 hover:shadow-sm dark:bg-indigo-950/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
          >
            <FileTextIcon className="me-1 size-3" />
            {tCirc("title")}
          </Badge>
          <CircularPriorityBadge priority={circular.priority} />
          <Badge variant="outline" className="font-mono text-xs">
            {circular.ref_number}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          {onSelect && (
            <Button variant="ghost" size="sm" onClick={onSelect} className="h-7 text-xs">
              View Details
            </Button>
          )}
          <Link href={`/${locale}/circulars/${circular.id}`}>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
              <ExternalLinkIcon className="size-3" />
              <span>Respond</span>
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={onSelect}
          className="text-start font-semibold text-foreground hover:underline"
        >
          <h3 className="text-base font-semibold text-foreground">{circular.title}</h3>
        </button>
        {circular.body && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{circular.body}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
        {formattedDeadline && (
          <div className="flex items-center gap-1.5 font-medium text-rose-500">
            <ClockIcon className="size-3.5" />
            <span>Due: {formattedDeadline}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <CheckCircle2Icon className="size-3.5 text-indigo-500" />
          <span>Requires: {circular.response_type}</span>
        </div>
      </div>
    </div>
  );
}
