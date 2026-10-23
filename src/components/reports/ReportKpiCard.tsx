import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function ReportKpiCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: "good" | "warning" | "neutral";
}) {
  const trendColor =
    trend === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : trend === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : "text-muted-foreground";

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          {Icon && (
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
          {description && <span className={`text-xs ${trendColor}`}>{description}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
