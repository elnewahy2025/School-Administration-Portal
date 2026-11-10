"use client";

import { useTranslations } from "next-intl";
import { ArrowLeftIcon, FileTextIcon, PaperclipIcon } from "lucide-react";
import { Link } from "@/i18n";
import { formatCircularDate } from "@/lib/circulars/formatCircularDate";
import type { CircularRow, CircularPriority } from "@/lib/circulars/types";

const PRIORITY_BADGE_STYLES: Record<CircularPriority, string> = {
  urgent: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  normal: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  low: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30",
};

const PRIORITY_LABELS: Record<CircularPriority, string> = {
  urgent: "priorityUrgent",
  high: "priorityHigh",
  normal: "priorityNormal",
  low: "priorityLow",
};

export function PublicCircularCard({
  circular,
  locale,
}: {
  circular: CircularRow;
  locale: string;
}) {
  const tHome = useTranslations("home");
  const tCirc = useTranslations("circulars");

  const publishedAt = circular.publish_at ?? circular.created_at;
  const attachmentsCount = circular.attachments?.length ?? 0;
  const priorityStyle = PRIORITY_BADGE_STYLES[circular.priority] ?? PRIORITY_BADGE_STYLES.normal;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#0c1f44] px-2.5 py-0.5 text-xs font-bold text-white dark:bg-primary">
              {circular.ref_number}
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityStyle}`}
            >
              {tCirc(PRIORITY_LABELS[circular.priority] as never)}
            </span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {formatCircularDate(publishedAt, locale)}
          </span>
        </div>

        <Link href={`/public/circulars/${circular.id}`} className="block">
          <h3 className="line-clamp-2 font-heading text-base sm:text-lg font-bold text-[#0c1f44] transition-colors group-hover:text-primary dark:text-foreground">
            {circular.title}
          </h3>
        </Link>

        <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {circular.body}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
        {attachmentsCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
            <PaperclipIcon className="size-3.5 text-primary" />
            <span>{tHome("hasAttachments")}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <FileTextIcon className="size-3.5" />
            <span>{circular.ref_number}</span>
          </span>
        )}

        <Link
          href={`/public/circulars/${circular.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <span>{tHome("viewCircularAction")}</span>
          <ArrowLeftIcon className="size-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </article>
  );
}
