import type { ReactNode } from "react";

export function PublicAboutCard({
  icon,
  iconColorClass,
  title,
  content,
}: {
  icon: ReactNode;
  iconColorClass: string;
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
      <div className={`flex size-10 items-center justify-center rounded-lg ${iconColorClass}`}>
        {icon}
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}
