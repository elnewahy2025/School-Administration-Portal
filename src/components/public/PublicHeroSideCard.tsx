import type { ReactNode } from "react";

export function PublicHeroSideCard({
  icon,
  iconClass,
  title,
  content,
}: {
  icon: ReactNode;
  iconClass: string;
  title: string;
  content: string;
}) {
  return (
    <div className="group relative flex h-full flex-col justify-start rounded-3xl border border-border/80 bg-card/75 p-6 sm:p-8 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg space-y-4">
      <div
        className={`flex size-12 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 ${iconClass}`}
      >
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
