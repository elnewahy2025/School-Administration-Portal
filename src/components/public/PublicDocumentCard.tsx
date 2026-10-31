import type { LucideIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";

export function PublicDocumentCard({
  icon: Icon,
  badge = "PDF",
  title,
  description,
  actionLabel,
}: {
  icon: LucideIcon;
  badge?: string;
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="group relative flex flex-col items-center rounded-2xl border border-blue-100/90 bg-card p-6 pt-12 pb-6 text-center shadow-[0_8px_30px_rgba(20,37,74,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(20,37,74,0.12)] dark:border-border/80">
      <span className="absolute top-4 left-4 inline-flex items-center rounded-md border border-blue-200/90 bg-blue-50/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 shadow-2xs dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
        {badge}
      </span>

      <div className="absolute -top-7 left-1/2 -translate-x-1/2 grid size-14 place-items-center rounded-2xl rotate-45 bg-[linear-gradient(135deg,var(--action-from,#0b63d6),var(--action-to,#0a2f7a))] shadow-[0_8px_20px_rgba(11,99,214,0.4)] transition-transform duration-300 group-hover:scale-105">
        <Icon className="size-6 -rotate-45 text-gold" strokeWidth={2.2} />
      </div>

      <h3 className="text-base sm:text-lg font-extrabold text-[#0a2f7a] dark:text-foreground">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      <button
        type="button"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b5cce] px-6 py-2.5 text-xs sm:text-sm font-bold text-amber-300 shadow-[0_4px_14px_rgba(11,92,206,0.35),0_2px_0_#ffcd35] transition-all duration-200 hover:brightness-110 hover:shadow-[0_6px_20px_rgba(11,92,206,0.45),0_2px_0_#ffcd35] active:scale-95 cursor-pointer"
      >
        <span>{actionLabel}</span>
        <ArrowRightIcon className="size-4 text-amber-300" />
      </button>
    </div>
  );
}
