import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export type ResponseFilterTab = "all" | "responded" | "pending";

export function CircularResponseFilterBar({
  filter,
  setFilter,
  totalCount,
  respondedCount,
  pendingCount,
}: {
  filter: ResponseFilterTab;
  setFilter: (f: ResponseFilterTab) => void;
  totalCount: number;
  respondedCount: number;
  pendingCount: number;
}) {
  const t = useTranslations("circulars");

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs"
          onClick={() => setFilter("all")}
        >
          {t("allFilter")} ({totalCount})
        </Button>
        <Button
          variant={filter === "responded" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs text-emerald-600 dark:text-emerald-400"
          onClick={() => setFilter("responded")}
        >
          {t("respondedFilter")} ({respondedCount})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs text-rose-600 dark:text-rose-400"
          onClick={() => setFilter("pending")}
        >
          {t("notRespondedFilter")} ({pendingCount})
        </Button>
      </div>
      <span className="text-xs text-muted-foreground">
        {t("respondedProgress", { responded: respondedCount, total: totalCount })}
      </span>
    </div>
  );
}
